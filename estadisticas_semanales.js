/* =====================================================
   FASE 15 — ESTADÍSTICAS SEMANALES Y TENDENCIAS
   Archivo independiente. No modifica app.js ni los datos.
   Lee miHistorial, miComida y metasMacros de localStorage.
===================================================== */

(() => {
    "use strict";

    const CLAVE_HISTORIAL = "miHistorial";
    const CLAVE_COMIDA_ACTUAL = "miComida";
    const CLAVE_METAS = "metasMacros";
    const ID_PANEL = "panelEstadisticasSemanales";

    let desplazamientoSemanas = 0;

    function leerJSON(clave, respaldo) {
        try {
            const valor = localStorage.getItem(clave);
            return valor === null ? respaldo : JSON.parse(valor);
        } catch (error) {
            console.warn(`[Estadísticas semanales] No se pudo leer ${clave}.`, error);
            return respaldo;
        }
    }

    function fechaISO(fecha) {
        const anio = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const dia = String(fecha.getDate()).padStart(2, "0");
        return `${anio}-${mes}-${dia}`;
    }

    function fechaDesdeISO(valor) {
        const partes = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(valor || "");
        if (!partes) return null;
        const fecha = new Date(Number(partes[1]), Number(partes[2]) - 1, Number(partes[3]), 12, 0, 0, 0);
        return Number.isNaN(fecha.getTime()) ? null : fecha;
    }

    function sumarDias(fecha, cantidad) {
        const resultado = new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), 12, 0, 0, 0);
        resultado.setDate(resultado.getDate() + cantidad);
        return resultado;
    }

    function numeroSeguro(valor) {
        const numero = Number(valor);
        return Number.isFinite(numero) && numero > 0 ? numero : 0;
    }

    function obtenerDatos() {
        const historialGuardado = leerJSON(CLAVE_HISTORIAL, {});
        const historial = historialGuardado &&
            typeof historialGuardado === "object" &&
            !Array.isArray(historialGuardado)
            ? historialGuardado
            : {};

        // Compatibilidad con la versión antigua que solo guardaba miComida.
        if (Object.keys(historial).length === 0) {
            const comidaAntigua = leerJSON(CLAVE_COMIDA_ACTUAL, []);
            if (Array.isArray(comidaAntigua) && comidaAntigua.length > 0) {
                historial[fechaISO(new Date())] = comidaAntigua;
            }
        }

        const metasGuardadas = leerJSON(CLAVE_METAS, {});
        const metas = metasGuardadas && typeof metasGuardadas === "object" && !Array.isArray(metasGuardadas)
            ? metasGuardadas
            : {};

        return {
            historial,
            metas: {
                calorias: numeroSeguro(metas.calorias),
                proteina: numeroSeguro(metas.proteina),
                carbohidratos: numeroSeguro(metas.carbohidratos),
                grasas: numeroSeguro(metas.grasas)
            },
            metaCalorias: numeroSeguro(metas.calorias)
        };
    }

    function resumirDia(fecha, elementos) {
        const lista = Array.isArray(elementos) ? elementos : [];
        const resumen = {
            fecha,
            alimentos: lista.length,
            calorias: 0,
            proteina: 0,
            carbohidratos: 0,
            grasas: 0
        };

        for (const item of lista) {
            if (!item || typeof item !== "object") continue;
            resumen.calorias += numeroSeguro(item.calorias);
            resumen.proteina += numeroSeguro(item.proteina);
            resumen.carbohidratos += numeroSeguro(item.carbohidratos);
            resumen.grasas += numeroSeguro(item.grasas);
        }

        resumen.registrado = lista.length > 0;
        return resumen;
    }

    function obtenerSemana(finISO, historial) {
        const fin = fechaDesdeISO(finISO);
        if (!fin) return [];

        const dias = [];
        for (let i = 6; i >= 0; i--) {
            const fecha = sumarDias(fin, -i);
            const iso = fechaISO(fecha);
            dias.push(resumirDia(iso, historial[iso]));
        }
        return dias;
    }

    function calcularResumen(dias) {
        const registrados = dias.filter(dia => dia.registrado);
        const resumen = {
            diasRegistrados: registrados.length,
            totalAlimentos: registrados.reduce((suma, dia) => suma + dia.alimentos, 0),
            calorias: 0,
            proteina: 0,
            carbohidratos: 0,
            grasas: 0,
            totalCalorias: 0,
            totalProteina: 0,
            totalCarbohidratos: 0,
            totalGrasas: 0
        };

        for (const dia of registrados) {
            resumen.totalCalorias += dia.calorias;
            resumen.totalProteina += dia.proteina;
            resumen.totalCarbohidratos += dia.carbohidratos;
            resumen.totalGrasas += dia.grasas;
        }

        if (registrados.length > 0) {
            resumen.calorias = resumen.totalCalorias / registrados.length;
            resumen.proteina = resumen.totalProteina / registrados.length;
            resumen.carbohidratos = resumen.totalCarbohidratos / registrados.length;
            resumen.grasas = resumen.totalGrasas / registrados.length;
        }

        return resumen;
    }

    function formatoNumero(valor, decimales = 0) {
        return new Intl.NumberFormat("es-MX", {
            minimumFractionDigits: decimales,
            maximumFractionDigits: decimales
        }).format(Number.isFinite(valor) ? valor : 0);
    }

    function formatoFechaCorta(iso) {
        const fecha = fechaDesdeISO(iso);
        if (!fecha) return iso;
        const diaSemana = new Intl.DateTimeFormat("es-MX", { weekday: "short" }).format(fecha).replace(".", "");
        return `${diaSemana} ${fecha.getDate()}`;
    }

    function formatoRango(dias) {
        if (!dias.length) return "Sin fechas disponibles";
        const inicio = fechaDesdeISO(dias[0].fecha);
        const fin = fechaDesdeISO(dias[dias.length - 1].fecha);
        const fmtInicio = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short" }).format(inicio);
        const fmtFin = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "short", year: "numeric" }).format(fin);
        return `${fmtInicio} – ${fmtFin}`;
    }

    function cambioTexto(actual, anterior, decimales = 0) {
        if (actual.diasRegistrados === 0) {
            return { texto: "Sin datos suficientes en este periodo para comparar", clase: "sin-base" };
        }
        if (anterior.diasRegistrados === 0) {
            return { texto: "Sin semana anterior comparable", clase: "sin-base" };
        }

        const valorAnterior = anterior[actual.clave];
        const valorActual = actual.valor;
        if (!Number.isFinite(valorAnterior) || valorAnterior === 0) {
            if (valorActual === 0) return { texto: "Sin cambio respecto al periodo anterior", clase: "neutral" };
            return { texto: "Sin base anterior para calcular el cambio", clase: "sin-base" };
        }

        const porcentaje = ((valorActual - valorAnterior) / Math.abs(valorAnterior)) * 100;
        const signo = porcentaje > 0 ? "+" : "";
        const flecha = porcentaje > 0 ? "↑" : porcentaje < 0 ? "↓" : "→";
        return {
            texto: `${flecha} ${signo}${formatoNumero(porcentaje, decimales)}% frente a los 7 días anteriores`,
            clase: porcentaje > 0 ? "sube" : porcentaje < 0 ? "baja" : "neutral"
        };
    }

    function crearTarjeta(titulo, valor, detalle, clase = "") {
        const tarjeta = document.createElement("article");
        tarjeta.className = "semanal-tarjeta";

        const nombre = document.createElement("p");
        nombre.className = "semanal-tarjeta__titulo";
        nombre.textContent = titulo;

        const cantidad = document.createElement("strong");
        cantidad.className = "semanal-tarjeta__valor";
        cantidad.textContent = valor;

        const nota = document.createElement("small");
        nota.className = `semanal-tarjeta__detalle ${clase}`.trim();
        nota.textContent = detalle;

        tarjeta.append(nombre, cantidad, nota);
        return tarjeta;
    }

    function crearTendencia(titulo, texto, clase) {
        const elemento = document.createElement("div");
        elemento.className = `semanal-tendencia ${clase || "neutral"}`;
        const nombre = document.createElement("span");
        nombre.className = "semanal-tendencia__titulo";
        nombre.textContent = titulo;
        const valor = document.createElement("strong");
        valor.className = "semanal-tendencia__valor";
        valor.textContent = texto;
        elemento.append(nombre, valor);
        return elemento;
    }

    function crearGrafica(dias, metaCalorias) {
        const lista = document.createElement("div");
        lista.className = "semanal-grafica__lista";
        const mayor = Math.max(0, ...dias.map(dia => dia.calorias));
        const escala = metaCalorias > 0 ? metaCalorias : (mayor > 0 ? mayor : 1);

        for (const dia of dias) {
            const fila = document.createElement("div");
            fila.className = "semanal-grafica__fila";

            const nombre = document.createElement("span");
            nombre.className = "semanal-grafica__dia";
            nombre.textContent = formatoFechaCorta(dia.fecha);

            const pista = document.createElement("div");
            pista.className = "semanal-grafica__pista";
            const barra = document.createElement("div");
            barra.className = "semanal-grafica__barra";
            const ancho = Math.max(0, Math.min(100, (dia.calorias / escala) * 100));
            barra.style.width = `${ancho}%`;
            if (metaCalorias > 0 && dia.calorias > metaCalorias) {
                barra.classList.add("sobre-meta");
            }
            pista.appendChild(barra);

            const valor = document.createElement("span");
            valor.className = "semanal-grafica__valor";
            valor.textContent = dia.registrado ? `${formatoNumero(dia.calorias)} kcal` : "—";
            pista.setAttribute("role", "img");
            pista.setAttribute("aria-label", `${formatoFechaCorta(dia.fecha)}: ${dia.registrado ? `${formatoNumero(dia.calorias)} kilocalorías` : "sin registros"}`);

            fila.append(nombre, pista, valor);
            lista.appendChild(fila);
        }
        return lista;
    }

    function crearComparacionMeta(nombre, promedio, objetivo, unidad, diasRegistrados) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "semanal-meta-card";

        const titulo = document.createElement("h4");
        titulo.className = "semanal-meta-card__titulo";
        titulo.textContent = nombre;

        const promedioTexto = document.createElement("p");
        promedioTexto.className = "semanal-meta-card__promedio";
        promedioTexto.textContent = diasRegistrados > 0
            ? `Promedio registrado: ${formatoNumero(promedio, unidad === "kcal" ? 0 : 1)} ${unidad} por día`
            : "Sin registros esta semana";

        const objetivoTexto = document.createElement("p");
        objetivoTexto.className = "semanal-meta-card__objetivo";

        const pista = document.createElement("div");
        pista.className = "semanal-meta-card__pista";
        pista.setAttribute("role", "img");

        const barra = document.createElement("div");
        barra.className = "semanal-meta-card__barra";

        const estado = document.createElement("p");
        estado.className = "semanal-meta-card__estado";

        if (diasRegistrados === 0) {
            objetivoTexto.textContent = objetivo > 0
                ? `Meta diaria guardada: ${formatoNumero(objetivo, unidad === "kcal" ? 0 : 1)} ${unidad}`
                : "No hay una meta diaria configurada";
            estado.textContent = "Registra alimentos para comparar esta semana.";
            pista.setAttribute("aria-label", "Sin datos semanales para comparar");
            pista.appendChild(barra);
        } else if (objetivo <= 0) {
            objetivoTexto.textContent = "No hay una meta diaria configurada";
            estado.textContent = "Puedes definirla en la sección Mis metas.";
            pista.setAttribute("aria-label", "No hay una meta diaria configurada");
            pista.appendChild(barra);
            pista.classList.add("sin-meta");
        } else {
            const porcentaje = (promedio / objetivo) * 100;
            const ancho = Math.max(0, Math.min(100, porcentaje));
            barra.style.width = `${ancho}%`;
            if (porcentaje > 100) {
                barra.classList.add("sobre-meta");
                tarjeta.classList.add("supera-meta");
            }
            objetivoTexto.textContent = `Meta diaria: ${formatoNumero(objetivo, unidad === "kcal" ? 0 : 1)} ${unidad}`;
            estado.textContent = `${formatoNumero(porcentaje, 0)}% de la meta · ${formatoNumero(Math.abs(promedio - objetivo), unidad === "kcal" ? 0 : 1)} ${unidad} ${promedio > objetivo ? "por encima" : promedio < objetivo ? "por debajo" : "igual a"} la meta`;
            pista.setAttribute("aria-label", `Promedio equivalente al ${formatoNumero(porcentaje, 0)} por ciento de la meta diaria`);
            pista.appendChild(barra);
        }

        tarjeta.append(titulo, promedioTexto, objetivoTexto, pista, estado);
        return tarjeta;
    }

    function crearPanelComparacionMetas(resumen, metas) {
        const seccion = document.createElement("section");
        seccion.className = "semanal-comparacion-metas";
        seccion.setAttribute("aria-labelledby", "tituloComparacionMetasSemanales");

        const titulo = document.createElement("h3");
        titulo.id = "tituloComparacionMetasSemanales";
        titulo.textContent = "Promedios frente a tus metas";

        const descripcion = document.createElement("p");
        descripcion.className = "semanal-comparacion-metas__nota";
        descripcion.textContent = "Compara el promedio de los días con registros con tus metas diarias guardadas. Es una comparación descriptiva, no una recomendación médica ni una valoración de tu alimentación.";

        const grid = document.createElement("div");
        grid.className = "semanal-comparacion-metas__grid";
        grid.append(
            crearComparacionMeta("Calorías", resumen.calorias, metas.calorias, "kcal", resumen.diasRegistrados),
            crearComparacionMeta("Proteína", resumen.proteina, metas.proteina, "g", resumen.diasRegistrados),
            crearComparacionMeta("Carbohidratos", resumen.carbohidratos, metas.carbohidratos, "g", resumen.diasRegistrados),
            crearComparacionMeta("Grasas", resumen.grasas, metas.grasas, "g", resumen.diasRegistrados)
        );

        seccion.append(titulo, descripcion, grid);
        return seccion;
    }

    function encontrarVistaHistorial() {
        // Primero buscar la estructura de vistas que usa esta aplicación.
        const selectores = [
            '[data-vista-contenido="historial"]',
            '[data-vista-contenido="Historial"]',
            '[data-vista-contenido*="historial" i]',
            '#vista-historial',
            '#vistaHistorial',
            '.vista-historial',
            '[data-vista="historial"]',
            '#historial'
        ];

        for (const selector of selectores) {
            const elemento = document.querySelector(selector);
            if (elemento) return elemento;
        }

        // Respaldo: buscar el ancestro de vista que contiene el historial mensual.
        const ancla = document.querySelector(
            '.grafica-mensual, .calendario-mensual, .estadisticas-mensuales, .historial-dia'
        );
        if (ancla) {
            const vistaAncestro = ancla.closest(
                '[data-vista-contenido], [id*="historial" i], .vista-historial'
            );
            if (vistaAncestro) return vistaAncestro;
        }

        return null;
    }

    function colocarPanel(panel) {
        const vistaHistorial = encontrarVistaHistorial();
        const graficaMensual = document.querySelector('.grafica-mensual');
        const panelDiario = document.querySelector('.historial-dia');

        // Prioridad: dentro de la vista Historial; así se oculta junto con ella.
        if (vistaHistorial) {
            if (panel.parentElement !== vistaHistorial) {
                vistaHistorial.appendChild(panel);
            }
            return;
        }

        // Si no hay un contenedor identificable, insertar junto a una sección
        // que sabemos que pertenece al historial, no al final de todo el sitio.
        const ancla = graficaMensual || panelDiario;
        if (ancla && ancla.parentElement) {
            if (panel.previousElementSibling !== ancla || panel.parentElement !== ancla.parentElement) {
                ancla.insertAdjacentElement('afterend', panel);
            }
            return;
        }

        // Último recurso para instalaciones sin vistas ni paneles históricos.
        const contenedor = document.querySelector('.contenedor');
        if (contenedor && panel.parentElement !== contenedor) {
            contenedor.appendChild(panel);
        }
    }

    function crearPanel() {
        let panel = document.getElementById(ID_PANEL);

        if (!panel) {
            panel = document.createElement('section');
            panel.id = ID_PANEL;
            panel.className = 'estadisticas-semanales';
            panel.setAttribute('aria-labelledby', 'tituloEstadisticasSemanales');
        }

        colocarPanel(panel);
        return panel;
    }

    function renderizar() {
        const panel = crearPanel();
        if (!panel) return;

        // Evitar que el panel expanda una columna de grid/flex por su contenido.
        panel.style.width = '100%';
        panel.style.maxWidth = '100%';
        panel.style.minWidth = '0';
        panel.style.boxSizing = 'border-box';

        const { historial, metas, metaCalorias } = obtenerDatos();
        const hoy = sumarDias(new Date(), 0);
        const finalSemana = sumarDias(hoy, -(desplazamientoSemanas * 7));
        const dias = obtenerSemana(fechaISO(finalSemana), historial);
        const diasAnteriores = obtenerSemana(fechaISO(sumarDias(finalSemana, -7)), historial);
        const resumen = calcularResumen(dias);
        const anterior = calcularResumen(diasAnteriores);
        panel.dataset.semanaInicio = dias[0]?.fecha || "";
        panel.dataset.semanaFin = dias[dias.length - 1]?.fecha || "";

        panel.replaceChildren();

        const encabezado = document.createElement("div");
        encabezado.className = "semanal-encabezado";
        const textos = document.createElement("div");
        textos.className = "semanal-encabezado__texto";
        const etiqueta = document.createElement("p");
        etiqueta.className = "semanal-etiqueta";
        etiqueta.textContent = "ANÁLISIS PERSONAL";
        const titulo = document.createElement("h2");
        titulo.id = "tituloEstadisticasSemanales";
        titulo.textContent = "Tu semana en números";
        const descripcion = document.createElement("p");
        descripcion.className = "semanal-descripcion";
        descripcion.textContent = "Promedios calculados sobre los días con alimentos registrados. Las variaciones son descriptivas, no una valoración de si comer más o menos es mejor.";
        textos.append(etiqueta, titulo, descripcion);
        encabezado.appendChild(textos);

        const navegacion = document.createElement("div");
        navegacion.className = "semanal-navegacion";
        const anteriorBtn = document.createElement("button");
        anteriorBtn.type = "button";
        anteriorBtn.className = "semanal-boton";
        anteriorBtn.textContent = "← Semana anterior";
        anteriorBtn.addEventListener("click", () => {
            desplazamientoSemanas += 1;
            renderizar();
        });
        const rango = document.createElement("span");
        rango.className = "semanal-rango";
        rango.textContent = formatoRango(dias);
        const siguienteBtn = document.createElement("button");
        siguienteBtn.type = "button";
        siguienteBtn.className = "semanal-boton";
        siguienteBtn.textContent = "Semana más reciente →";
        siguienteBtn.disabled = desplazamientoSemanas === 0;
        siguienteBtn.addEventListener("click", () => {
            if (desplazamientoSemanas > 0) {
                desplazamientoSemanas -= 1;
                renderizar();
            }
        });
        navegacion.append(anteriorBtn, rango, siguienteBtn);

        const tarjetas = document.createElement("div");
        tarjetas.className = "semanal-tarjetas";
        tarjetas.append(
            crearTarjeta("Días con registros", `${resumen.diasRegistrados}/7`, "Días con al menos un alimento"),
            crearTarjeta("Calorías promedio", `${formatoNumero(resumen.calorias)} kcal`, resumen.diasRegistrados ? `Total: ${formatoNumero(resumen.totalCalorias)} kcal` : "Todavía no hay registros en este periodo"),
            crearTarjeta("Proteína promedio", `${formatoNumero(resumen.proteina, 1)} g`, resumen.diasRegistrados ? `Total: ${formatoNumero(resumen.totalProteina, 1)} g` : "Se calculará cuando haya registros"),
            crearTarjeta("Alimentos registrados", `${formatoNumero(resumen.totalAlimentos)}`, "Entradas de alimentos en los 7 días")
        );

        const macroGrid = document.createElement("div");
        macroGrid.className = "semanal-macros";
        macroGrid.append(
            crearTarjeta("Carbohidratos promedio", `${formatoNumero(resumen.carbohidratos, 1)} g/día`, "Entre días con registros", "macro"),
            crearTarjeta("Grasas promedio", `${formatoNumero(resumen.grasas, 1)} g/día`, "Entre días con registros", "macro")
        );

        const tendencias = document.createElement("div");
        tendencias.className = "semanal-tendencias";
        const cambioCal = cambioTexto({ clave: "calorias", valor: resumen.calorias, diasRegistrados: resumen.diasRegistrados }, anterior);
        const cambioProt = cambioTexto({ clave: "proteina", valor: resumen.proteina, diasRegistrados: resumen.diasRegistrados }, anterior, 1);
        tendencias.append(
            crearTendencia("Promedio de calorías", cambioCal.texto, cambioCal.clase),
            crearTendencia("Promedio de proteína", cambioProt.texto, cambioProt.clase)
        );

        const grafica = document.createElement("div");
        grafica.className = "semanal-grafica";
        const tituloGrafica = document.createElement("h3");
        tituloGrafica.textContent = "Calorías por día";
        const notaGrafica = document.createElement("p");
        notaGrafica.className = "semanal-grafica__nota";
        notaGrafica.textContent = metaCalorias > 0
            ? `Las barras se comparan con tu meta diaria guardada de ${formatoNumero(metaCalorias)} kcal.`
            : "Sin meta calórica guardada: las barras comparan los días entre sí.";
        grafica.append(tituloGrafica, notaGrafica, crearGrafica(dias, metaCalorias));

        const comparacionMetas = crearPanelComparacionMetas(resumen, metas);

        const pie = document.createElement("p");
        pie.className = "semanal-pie";
        pie.textContent = "Los días sin registros se muestran como guiones y no se incluyen en los promedios. Los datos provienen del historial local de esta aplicación.";

        panel.append(encabezado, navegacion, tarjetas, macroGrid, tendencias, comparacionMetas, grafica, pie);
    }

    function iniciar() {
        // Evita duplicar el panel si se vuelve a cargar el script accidentalmente.
        if (!document.querySelector(".contenedor") && !document.body) return;
        renderizar();

        // Actualizar tras las acciones de la app (agregar, editar o eliminar).
        document.addEventListener("click", () => window.setTimeout(renderizar, 0));
        document.addEventListener("change", () => window.setTimeout(renderizar, 0));
        window.addEventListener("storage", renderizar);
        document.addEventListener("visibilitychange", () => {
            if (!document.hidden) renderizar();
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar, { once: true });
    } else {
        iniciar();
    }
})();
