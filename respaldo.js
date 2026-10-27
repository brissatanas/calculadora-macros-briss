/* =====================================================
   RESPALDO DE DATOS — MI CALCULADORA DE MACROS
   Archivo independiente: no reemplaza app.js
   Incluye metas, historial, comida del día, alimentos y categorías.
===================================================== */

(() => {
    "use strict";

    const APP_NAME = "Mi Calculadora de Macros";
    const SCHEMA_VERSION = 1;
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    const STORAGE_KEYS = [
        "metasMacros",
        "miHistorial",
        "miComida",
        "misAlimentos",
        "misCategorias"
    ];

    function esObjetoPlano(valor) {
        return valor !== null &&
            typeof valor === "object" &&
            !Array.isArray(valor);
    }

    function leerValorGuardado(clave) {
        const valor = localStorage.getItem(clave);
        return valor === null ? null : JSON.parse(valor);
    }

    function crearContenidoRespaldo() {
        const datos = {};

        for (const clave of STORAGE_KEYS) {
            datos[clave] = leerValorGuardado(clave);
        }

        return {
            app: APP_NAME,
            schemaVersion: SCHEMA_VERSION,
            exportedAt: new Date().toISOString(),
            data: datos
        };
    }

    function validarTipoDeDato(clave, valor) {
        // null representa una clave que no existía al exportar.
        if (valor === null) return true;

        if (clave === "miComida" || clave === "misCategorias") {
            return Array.isArray(valor);
        }

        if (clave === "metasMacros" || clave === "miHistorial" || clave === "misAlimentos") {
            return esObjetoPlano(valor);
        }

        return false;
    }

    function validarRespaldo(respaldo) {
    if (!esObjetoPlano(respaldo)) {
        throw new Error(
            "El archivo no contiene un respaldo válido."
        );
    }

    if (
        respaldo.app !== APP_NAME ||
        respaldo.schemaVersion !== SCHEMA_VERSION
    ) {
        throw new Error(
            "Este archivo no corresponde a una copia compatible de la aplicación."
        );
    }

    if (!esObjetoPlano(respaldo.data)) {
        throw new Error(
            "El archivo no contiene los datos esperados."
        );
    }

    // Comprobar que estén presentes todas las claves necesarias
    // y que tengan su tipo general correcto.
    for (const clave of STORAGE_KEYS) {
        if (
            !Object.prototype.hasOwnProperty.call(
                respaldo.data,
                clave
            )
        ) {
            throw new Error(
                `El respaldo está incompleto: falta ${clave}.`
            );
        }

        if (!validarTipoDeDato(clave, respaldo.data[clave])) {
            throw new Error(
                `El formato de los datos de ${clave} no es válido.`
            );
        }
    }

    // Verificar que los registros de alimentos sean objetos
    // y que los valores numéricos presentes sean válidos.
    function validarRegistroAlimento(registro, contexto) {
        if (!esObjetoPlano(registro)) {
            throw new Error(
                `Se encontró un registro inválido en ${contexto}.`
            );
        }

        const camposNumericos = [
            "cantidad",
            "calorias",
            "proteina",
            "carbohidratos",
            "grasas"
        ];

        for (const campo of camposNumericos) {
            if (
                !Object.prototype.hasOwnProperty.call(
                    registro,
                    campo
                )
            ) {
                continue;
            }

            const valor = registro[campo];

            if (
                valor === null ||
                valor === "" ||
                !Number.isFinite(Number(valor)) ||
                Number(valor) < 0
            ) {
                throw new Error(
                    `El campo "${campo}" de ${contexto} no es válido.`
                );
            }
        }
    }

    // Validar la lista del día actual.
    const comidaActual = respaldo.data.miComida;

    if (comidaActual !== null) {
        comidaActual.forEach((registro, indice) => {
            validarRegistroAlimento(
                registro,
                `miComida, registro ${indice + 1}`
            );
        });
    }

    // Validar el historial: cada fecha debe contener una lista.
    const historial = respaldo.data.miHistorial;

    if (historial !== null) {
        for (const [fecha, registros] of Object.entries(historial)) {
            if (!Array.isArray(registros)) {
                throw new Error(
                    `El historial de "${fecha}" no contiene una lista válida.`
                );
            }

            registros.forEach((registro, indice) => {
                validarRegistroAlimento(
                    registro,
                    `historial ${fecha}, registro ${indice + 1}`
                );
            });
        }
    }

    // Validar el catálogo guardado sin imponer un formato rígido
    // a los alimentos antiguos que ya existen en la aplicación.
    const alimentosGuardados = respaldo.data.misAlimentos;

    if (alimentosGuardados !== null) {
        for (const [id, alimento] of Object.entries(alimentosGuardados)) {
            validarRegistroAlimento(
                alimento,
                `misAlimentos, registro "${id}"`
            );
        }
    }

    // Las categorías deben ser cadenas de texto no vacías.
    const categorias = respaldo.data.misCategorias;

    if (
        categorias !== null &&
        categorias.some(
            categoria =>
                typeof categoria !== "string" ||
                categoria.trim() === ""
        )
    ) {
        throw new Error(
            "El respaldo contiene una categoría vacía o inválida."
        );
    }

    // Las metas guardadas, cuando existen, deben ser no negativas.
    const metasGuardadas = respaldo.data.metasMacros;

    if (metasGuardadas !== null) {
        const camposMetas = [
            "calorias",
            "proteina",
            "carbohidratos",
            "grasas"
        ];

        for (const campo of camposMetas) {
            if (
                !Object.prototype.hasOwnProperty.call(
                    metasGuardadas,
                    campo
                )
            ) {
                continue;
            }

            const valor = metasGuardadas[campo];

            if (
                valor === null ||
                valor === "" ||
                !Number.isFinite(Number(valor)) ||
                Number(valor) < 0
            ) {
                throw new Error(
                    `La meta "${campo}" tiene un valor inválido.`
                );
            }
        }
    }

    return true;
}

    function descargarJson(objeto, nombreArchivo) {
        const blob = new Blob(
            [JSON.stringify(objeto, null, 2)],
            { type: "application/json;charset=utf-8" }
        );

        const url = URL.createObjectURL(blob);
        const enlace = document.createElement("a");
        enlace.href = url;
        enlace.download = nombreArchivo;
        enlace.style.display = "none";
        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function fechaParaNombre() {
        const ahora = new Date();
        const anio = ahora.getFullYear();
        const mes = String(ahora.getMonth() + 1).padStart(2, "0");
        const dia = String(ahora.getDate()).padStart(2, "0");
        return `${anio}-${mes}-${dia}`;
    }


    // Exportaciones CSV: no modifican los datos guardados en la aplicación.
    function fechaHoyLocal() {
        const ahora = new Date();
        const anio = ahora.getFullYear();
        const mes = String(ahora.getMonth() + 1).padStart(2, "0");
        const dia = String(ahora.getDate()).padStart(2, "0");
        return `${anio}-${mes}-${dia}`;
    }

    function obtenerHistorialParaCSV() {
        const textoHistorial = localStorage.getItem("miHistorial");
        let historial = {};

        if (textoHistorial !== null) {
            historial = JSON.parse(textoHistorial);
            if (!esObjetoPlano(historial)) {
                throw new Error("El historial guardado no tiene un formato válido.");
            }
        }

        let fechas = Object.keys(historial)
            .filter(fecha => /^\d{4}-\d{2}-\d{2}$/.test(fecha) && Array.isArray(historial[fecha]))
            .sort();

        // Compatibilidad con instalaciones antiguas que solo guardaban miComida.
        if (fechas.length === 0) {
            const textoComida = localStorage.getItem("miComida");
            if (textoComida !== null) {
                const comidaActual = JSON.parse(textoComida);
                if (!Array.isArray(comidaActual)) {
                    throw new Error("La lista de alimentos guardada no tiene un formato válido.");
                }
                if (comidaActual.length > 0) {
                    historial[fechaHoyLocal()] = comidaActual;
                    fechas = [fechaHoyLocal()];
                }
            }
        }

        return { historial, fechas };
    }

    function numeroSeguro(valor) {
        const numero = Number(valor);
        return Number.isFinite(numero) ? numero : 0;
    }

    function textoSeguroCSV(valor) {
        let texto = valor === null || valor === undefined ? "" : String(valor);
        // Reduce el riesgo de que campos editables se interpreten como fórmulas en hojas de cálculo.
        if (/^[\t\r ]*[=+@]/.test(texto) || /^[\t\r ]*-\d/.test(texto)) {
            texto = `'${texto}`;
        }
        return texto;
    }

    function escaparCampoCSV(valor) {
        const texto = String(valor === null || valor === undefined ? "" : valor);
        return /[",\r\n]/.test(texto) ? `"${texto.replace(/"/g, '""')}"` : texto;
    }

    function generarCSV(filas) {
        // El BOM facilita que Excel reconozca acentos y caracteres españoles.
        return "\uFEFF" + filas.map(fila => fila.map(escaparCampoCSV).join(",")).join("\r\n");
    }

    function descargarCSV(contenido, nombreArchivo) {
        const blob = new Blob([contenido], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const enlace = document.createElement("a");
        enlace.href = url;
        enlace.download = nombreArchivo;
        enlace.style.display = "none";
        document.body.appendChild(enlace);
        enlace.click();
        enlace.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    function etiquetaTipoComida(tipo) {
        const etiquetas = {
            desayuno: "Desayuno",
            comida: "Comida",
            cena: "Cena",
            colacion: "Colación"
        };
        return etiquetas[tipo] || tipo || "Sin especificar";
    }

    function crearCSVDetalle() {
        const { historial, fechas } = obtenerHistorialParaCSV();
        const filas = [[
            "fecha", "tipo_comida", "alimento", "cantidad", "unidad",
            "calorias_kcal", "proteina_g", "carbohidratos_g", "grasas_g"
        ]];
        let cantidadRegistros = 0;

        for (const fecha of fechas) {
            for (const item of historial[fecha]) {
                if (!item || typeof item !== "object") continue;
                const unidadOriginal = item.unidad || "";
                const unidadVisible = unidadOriginal === "100g" ? "g" :
                    (unidadOriginal ? "piezas" : "");
                filas.push([
                    fecha,
                    textoSeguroCSV(etiquetaTipoComida(item.tipoComida)),
                    textoSeguroCSV(item.nombre || item.alimento || item.id || "Alimento sin nombre"),
                    numeroSeguro(item.cantidad),
                    unidadVisible,
                    numeroSeguro(item.calorias).toFixed(2),
                    numeroSeguro(item.proteina).toFixed(2),
                    numeroSeguro(item.carbohidratos).toFixed(2),
                    numeroSeguro(item.grasas).toFixed(2)
                ]);
                cantidadRegistros++;
            }
        }

        if (cantidadRegistros === 0) {
            throw new Error("Todavía no hay alimentos registrados para exportar a CSV.");
        }

        return { csv: generarCSV(filas), cantidadRegistros };
    }

    function crearCSVResumenDiario() {
        const { historial, fechas } = obtenerHistorialParaCSV();
        if (fechas.length === 0) {
            throw new Error("Todavía no hay días guardados para exportar un resumen.");
        }

        const filas = [[
            "fecha", "cantidad_alimentos", "calorias_kcal", "proteina_g",
            "carbohidratos_g", "grasas_g"
        ]];

        for (const fecha of fechas) {
            const items = historial[fecha].filter(item => item && typeof item === "object");
            const total = items.reduce((acumulado, item) => {
                acumulado.calorias += numeroSeguro(item.calorias);
                acumulado.proteina += numeroSeguro(item.proteina);
                acumulado.carbohidratos += numeroSeguro(item.carbohidratos);
                acumulado.grasas += numeroSeguro(item.grasas);
                return acumulado;
            }, { calorias: 0, proteina: 0, carbohidratos: 0, grasas: 0 });

            filas.push([
                fecha,
                items.length,
                total.calorias.toFixed(2),
                total.proteina.toFixed(2),
                total.carbohidratos.toFixed(2),
                total.grasas.toFixed(2)
            ]);
        }

        return { csv: generarCSV(filas), cantidadDias: fechas.length };
    }

    function construirPanel() {
        if (document.getElementById("panelRespaldoDatos")) return;

        const panel = document.createElement("section");
        panel.id = "panelRespaldoDatos";
        panel.className = "panel-respaldo";
        panel.setAttribute("aria-labelledby", "tituloRespaldoDatos");

        panel.innerHTML = `
            <div class="panel-respaldo__encabezado">
                <span class="panel-respaldo__icono" aria-hidden="true">🛡️</span>
                <div>
                    <h2 id="tituloRespaldoDatos">Seguridad de tus datos</h2>
                    <p>Guarda una copia de tus metas, alimentos personalizados, categorías y registros de alimentación.</p>
                </div>
            </div>
            <div class="panel-respaldo__acciones">
                <button type="button" id="btnExportarRespaldo" class="panel-respaldo__boton-principal">
                    Descargar respaldo JSON
                </button>
                <button type="button" id="btnExportarCSVDetalle" class="panel-respaldo__boton-secundario">
                    Exportar registros CSV
                </button>
                <button type="button" id="btnExportarCSVResumen" class="panel-respaldo__boton-secundario">
                    Exportar resumen diario CSV
                </button>
                <button type="button" id="btnElegirRespaldo" class="panel-respaldo__boton-secundario">
                    Restaurar respaldo JSON
                </button>
                <input id="archivoRespaldoDatos" class="panel-respaldo__archivo" type="file" accept=".json,application/json" aria-label="Seleccionar archivo de respaldo">
            </div>
            <p class="panel-respaldo__nota panel-respaldo__csv-nota">Los CSV no modifican tus datos: el archivo de registros contiene una fila por alimento; el resumen diario contiene los totales de cada fecha guardada y se puede analizar en Excel o Python.</p>
            <p class="panel-respaldo__nota">La restauración JSON reemplaza los datos actuales guardados por los del archivo seleccionado. Para conservarlos, descarga primero un respaldo actual.</p>
            <p id="estadoRespaldoDatos" class="panel-respaldo__estado" role="status" aria-live="polite"></p>
        `;

        // Preferir la sección Mis alimentos; si no existe, usar el contenedor principal.
        const destino = document.querySelector(".mis-alimentos") ||
            document.querySelector("#vista-alimentos") ||
            document.querySelector(".contenedor");

        if (!destino) return;
        destino.appendChild(panel);

        const btnExportar = panel.querySelector("#btnExportarRespaldo");
        const btnExportarCSVDetalle = panel.querySelector("#btnExportarCSVDetalle");
        const btnExportarCSVResumen = panel.querySelector("#btnExportarCSVResumen");
        const btnElegir = panel.querySelector("#btnElegirRespaldo");
        const inputArchivo = panel.querySelector("#archivoRespaldoDatos");
        const estado = panel.querySelector("#estadoRespaldoDatos");

        function mostrarEstado(mensaje, tipo) {
            estado.textContent = mensaje;
            estado.className = `panel-respaldo__estado estado-${tipo}`;
        }

        btnExportar.addEventListener("click", () => {
            try {
                const respaldo = crearContenidoRespaldo();
                validarRespaldo(respaldo);
                descargarJson(
                    respaldo,
                    `respaldo-mis-macros-${fechaParaNombre()}.json`
                );
                mostrarEstado("¡Respaldo descargado! Guarda el archivo en un lugar seguro.", "exito");
            } catch (error) {
                console.error("No se pudo crear el respaldo:", error);
                mostrarEstado("No se pudo crear el respaldo. Comprueba que los datos guardados sean válidos.", "error");
            }
        });

        btnExportarCSVDetalle.addEventListener("click", () => {
            try {
                const resultado = crearCSVDetalle();
                descargarCSV(resultado.csv, `registros-alimentacion-${fechaParaNombre()}.csv`);
                mostrarEstado(`¡CSV descargado! Se exportaron ${resultado.cantidadRegistros} registros de alimentos.`, "exito");
            } catch (error) {
                console.error("No se pudieron exportar los registros CSV:", error);
                mostrarEstado(error.message || "No se pudieron exportar los registros CSV.", "error");
            }
        });

        btnExportarCSVResumen.addEventListener("click", () => {
            try {
                const resultado = crearCSVResumenDiario();
                descargarCSV(resultado.csv, `resumen-diario-macros-${fechaParaNombre()}.csv`);
                mostrarEstado(`¡Resumen CSV descargado! Incluye ${resultado.cantidadDias} días guardados.`, "exito");
            } catch (error) {
                console.error("No se pudo exportar el resumen CSV:", error);
                mostrarEstado(error.message || "No se pudo exportar el resumen CSV.", "error");
            }
        });

        btnElegir.addEventListener("click", () => {
            inputArchivo.click();
        });

        inputArchivo.addEventListener("change", async () => {
            const archivo = inputArchivo.files && inputArchivo.files[0];
            if (!archivo) return;

            try {
                if (archivo.size > MAX_FILE_SIZE) {
                    throw new Error("El archivo supera el límite de 5 MB.");
                }

                const contenido = await archivo.text();
                let respaldo;

                try {
                    respaldo = JSON.parse(contenido);
                } catch {
                    throw new Error("El archivo no contiene JSON válido.");
                }

                validarRespaldo(respaldo);

                const confirmar = window.confirm(
                    "¿Restaurar este respaldo? Los datos actuales de la aplicación serán reemplazados por los del archivo. Descarga antes una copia actual si deseas conservarlos."
                );

                if (!confirmar) {
                    mostrarEstado("Restauración cancelada. No se modificaron tus datos.", "info");
                    return;
                }

                for (const clave of STORAGE_KEYS) {
                    const valor = respaldo.data[clave];
                    if (valor === null) {
                        localStorage.removeItem(clave);
                    } else {
                        localStorage.setItem(clave, JSON.stringify(valor));
                    }
                }

                mostrarEstado("Respaldo restaurado. Recargando la aplicación…", "exito");
                window.setTimeout(() => window.location.reload(), 900);
            } catch (error) {
                console.error("No se pudo restaurar el respaldo:", error);
                mostrarEstado(error.message || "No se pudo leer el archivo de respaldo.", "error");
            } finally {
                inputArchivo.value = "";
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", construirPanel, { once: true });
    } else {
        construirPanel();
    }
})();
