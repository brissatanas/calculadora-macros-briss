#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Analiza el CSV de resumen diario exportado por Mi Calculadora de Macros.

Genera un CSV semanal, dos gráficas PNG y un pequeño informe de texto.
No modifica el CSV original ni sustituye los datos de la aplicación.
"""
from __future__ import annotations

import argparse
import sys
from datetime import datetime
from pathlib import Path

try:
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt
    import pandas as pd
except ImportError as exc:
    missing = getattr(exc, "name", "una dependencia")
    print(
        f"Falta instalar una dependencia ({missing}). Ejecuta: py -m pip install -r requirements.txt",
        file=sys.stderr,
    )
    raise SystemExit(2) from exc

REQUIRED_COLUMNS = {
    "fecha",
    "cantidad_alimentos",
    "calorias_kcal",
    "proteina_g",
    "carbohidratos_g",
    "grasas_g",
}
NUMERIC_COLUMNS = [
    "cantidad_alimentos",
    "calorias_kcal",
    "proteina_g",
    "carbohidratos_g",
    "grasas_g",
]


def choose_csv() -> Path | None:
    """Abre un selector de archivos si no se pasó una ruta por consola."""
    try:
        import tkinter as tk
        from tkinter import filedialog

        root = tk.Tk()
        root.withdraw()
        try:
            root.attributes("-topmost", True)
        except tk.TclError:
            pass
        chosen = filedialog.askopenfilename(
            title="Selecciona el resumen diario CSV de tu calculadora",
            filetypes=[("Archivos CSV", "*.csv"), ("Todos los archivos", "*.*")],
        )
        root.destroy()
        return Path(chosen) if chosen else None
    except Exception:
        return None


def load_daily_csv(path: Path) -> pd.DataFrame:
    """Lee y valida el formato del CSV exportado por la app."""
    if not path.exists() or not path.is_file():
        raise FileNotFoundError(f"No se encontró el archivo: {path}")

    # El CSV de la app se exporta como UTF-8 con BOM y separador coma.
    try:
        df = pd.read_csv(path, encoding="utf-8-sig", sep=None, engine="python")
    except UnicodeDecodeError:
        df = pd.read_csv(path, encoding="cp1252", sep=None, engine="python")

    df.columns = [str(col).strip().lstrip("\ufeff") for col in df.columns]
    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        expected = ", ".join(sorted(REQUIRED_COLUMNS))
        raise ValueError(
            "El archivo no parece ser el 'Exportar resumen diario CSV' de la app.\n"
            f"Faltan columnas: {', '.join(sorted(missing))}.\n"
            f"Columnas esperadas: {expected}"
        )

    original_count = len(df)
    df["fecha"] = pd.to_datetime(df["fecha"], errors="coerce", format="mixed")
    invalid_dates = int(df["fecha"].isna().sum())
    df = df.dropna(subset=["fecha"]).copy()
    if df.empty:
        raise ValueError("El CSV no contiene ninguna fecha válida.")

    for col in NUMERIC_COLUMNS:
        df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)
        # Evita valores negativos o infinitos introducidos accidentalmente.
        df[col] = df[col].where(df[col].map(lambda x: pd.notna(x) and abs(float(x)) != float("inf")), 0)

    df["cantidad_alimentos"] = df["cantidad_alimentos"].clip(lower=0).round().astype(int)
    for col in NUMERIC_COLUMNS[1:]:
        df[col] = df[col].clip(lower=0)

    # Normalizar la fecha y, si hay filas repetidas, combinarlas en un solo día.
    df["fecha"] = df["fecha"].dt.normalize()
    df = df.groupby("fecha", as_index=False)[NUMERIC_COLUMNS].sum()
    df = df.sort_values("fecha").reset_index(drop=True)
    df["dia_con_registros"] = df["cantidad_alimentos"] > 0
    df.attrs["invalid_dates"] = invalid_dates
    df.attrs["original_count"] = original_count
    return df


def build_weekly_summary(df: pd.DataFrame) -> pd.DataFrame:
    """Agrupa semanas de lunes a domingo; promedios solo en días registrados."""
    data = df.copy().set_index("fecha").sort_index()
    rows: list[dict[str, object]] = []

    for week_end, group in data.resample("W-SUN"):
        registered = group[group["dia_con_registros"]]
        if group.empty:
            continue
        week_start = (week_end - pd.Timedelta(days=6)).normalize()
        row: dict[str, object] = {
            "fecha_inicio_semana": week_start.date().isoformat(),
            "fecha_fin_semana": week_end.date().isoformat(),
            "dias_con_registros": int(registered.shape[0]),
            "cantidad_alimentos": int(group["cantidad_alimentos"].sum()),
        }
        for col, label in [
            ("calorias_kcal", "calorias_kcal"),
            ("proteina_g", "proteina_g"),
            ("carbohidratos_g", "carbohidratos_g"),
            ("grasas_g", "grasas_g"),
        ]:
            total = float(registered[col].sum())
            average = float(registered[col].mean()) if not registered.empty else 0.0
            row[f"{label}_total"] = round(total, 2)
            row[f"{label}_promedio_dias_registrados"] = round(average, 2)
        rows.append(row)

    result = pd.DataFrame(rows)
    if not result.empty:
        result = result.sort_values("fecha_inicio_semana").reset_index(drop=True)
    return result


def format_num(value: float, decimals: int = 1) -> str:
    return f"{value:,.{decimals}f}".replace(",", "X").replace(".", ",").replace("X", ".")


def create_charts(df: pd.DataFrame, weekly: pd.DataFrame, out_dir: Path) -> list[Path]:
    outputs: list[Path] = []

    # Gráfica diaria de calorías.
    fig, ax = plt.subplots(figsize=(11, 5.5))
    plotted = df.copy()
    x_labels = plotted["fecha"].dt.strftime("%d %b")
    bars = ax.bar(x_labels, plotted["calorias_kcal"], label="Calorías diarias")
    ax.set_title("Calorías registradas por día")
    ax.set_xlabel("Fecha")
    ax.set_ylabel("kcal")
    ax.grid(axis="y", alpha=0.25)
    ax.set_axisbelow(True)
    ax.tick_params(axis="x", rotation=45)
    if len(plotted) > 18:
        for index, label in enumerate(ax.get_xticklabels()):
            label.set_visible(index % max(1, len(plotted) // 12) == 0)
    ax.legend(frameon=False)
    fig.tight_layout()
    path = out_dir / "calorias_por_dia.png"
    fig.savefig(path, dpi=160, bbox_inches="tight")
    plt.close(fig)
    outputs.append(path)

    # Gráfica semanal de promedios de macronutrientes.
    if not weekly.empty:
        fig, ax = plt.subplots(figsize=(11, 5.5))
        x_labels = [f"{row.fecha_inicio_semana[5:]}–{row.fecha_fin_semana[5:]}" for row in weekly.itertuples()]
        for col, label in [
            ("proteina_g_promedio_dias_registrados", "Proteína (g/día)"),
            ("carbohidratos_g_promedio_dias_registrados", "Carbohidratos (g/día)"),
            ("grasas_g_promedio_dias_registrados", "Grasas (g/día)"),
        ]:
            ax.plot(x_labels, weekly[col], marker="o", linewidth=2, label=label)
        ax.set_title("Promedios diarios de macros por semana")
        ax.set_xlabel("Semana (fecha de inicio–fin)")
        ax.set_ylabel("Gramos por día registrado")
        ax.grid(alpha=0.25)
        ax.set_axisbelow(True)
        ax.tick_params(axis="x", rotation=35)
        ax.legend(frameon=False)
        fig.tight_layout()
        path = out_dir / "promedios_macros_por_semana.png"
        fig.savefig(path, dpi=160, bbox_inches="tight")
        plt.close(fig)
        outputs.append(path)

    return outputs


def write_report(df: pd.DataFrame, weekly: pd.DataFrame, out_dir: Path) -> Path:
    days_registered = df[df["dia_con_registros"]]
    lines = [
        "INFORME DE ANÁLISIS NUTRICIONAL",
        "================================",
        f"Archivo analizado: resumen diario CSV exportado desde la app",
        f"Fechas cubiertas: {df['fecha'].min().date()} a {df['fecha'].max().date()}",
        f"Días con registro de alimentos: {int(days_registered.shape[0])}",
        f"Entradas de alimentos registradas: {int(df['cantidad_alimentos'].sum())}",
        "",
        "Promedios entre días con registros:",
    ]
    if days_registered.empty:
        lines.append("No hay días con alimentos registrados para calcular promedios.")
    else:
        for col, label, unit in [
            ("calorias_kcal", "Calorías", "kcal/día"),
            ("proteina_g", "Proteína", "g/día"),
            ("carbohidratos_g", "Carbohidratos", "g/día"),
            ("grasas_g", "Grasas", "g/día"),
        ]:
            lines.append(f"- {label}: {format_num(float(days_registered[col].mean()))} {unit}")

    lines.extend(["", "Resumen por semana (lunes a domingo):"])
    if weekly.empty:
        lines.append("No hay semanas suficientes para resumir.")
    else:
        for row in weekly.itertuples(index=False):
            lines.append(
                f"- {row.fecha_inicio_semana} a {row.fecha_fin_semana}: "
                f"{row.dias_con_registros} días registrados, "
                f"{format_num(row.calorias_kcal_promedio_dias_registrados)} kcal/día promedio, "
                f"{format_num(row.proteina_g_promedio_dias_registrados)} g proteína/día promedio."
            )

    lines.extend([
        "",
        "Notas:",
        "- Los promedios excluyen fechas con cantidad_alimentos = 0.",
        "- Los resultados describen los datos registrados; no son una evaluación médica.",
        "- La ausencia de registros no significa necesariamente consumo cero.",
    ])
    path = out_dir / "informe_analisis.txt"
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return path


def analyse(path: Path) -> Path:
    df = load_daily_csv(path)
    weekly = build_weekly_summary(df)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    out_dir = path.parent / f"analisis_macros_{timestamp}"
    out_dir.mkdir(parents=True, exist_ok=False)

    weekly_csv = out_dir / "resumen_semanal.csv"
    weekly.to_csv(weekly_csv, index=False, encoding="utf-8-sig")
    charts = create_charts(df, weekly, out_dir)
    report = write_report(df, weekly, out_dir)

    print("\n¡Análisis terminado! 🖤💙")
    print(f"Días cubiertos: {df['fecha'].min().date()} a {df['fecha'].max().date()}")
    print(f"Días con registros: {int(df['dia_con_registros'].sum())}")
    print(f"Resultados guardados en: {out_dir}")
    print("Archivos generados:")
    print(f"  - {weekly_csv.name}")
    for chart in charts:
        print(f"  - {chart.name}")
    print(f"  - {report.name}")
    invalid_dates = int(df.attrs.get("invalid_dates", 0))
    if invalid_dates:
        print(f"Aviso: se descartaron {invalid_dates} filas con fecha no válida.")
    return out_dir


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Analiza el resumen diario CSV de Mi Calculadora de Macros."
    )
    parser.add_argument(
        "csv",
        nargs="?",
        help="Ruta al archivo resumen-diario-macros-*.csv. Si se omite, se abre un selector.",
    )
    args = parser.parse_args()

    csv_path = Path(args.csv).expanduser() if args.csv else choose_csv()
    if not csv_path:
        print("No se seleccionó ningún archivo. No se hicieron cambios.")
        return 1

    try:
        analyse(csv_path.resolve())
        return 0
    except (OSError, ValueError, pd.errors.ParserError) as error:
        print(f"No se pudo completar el análisis: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
