let comida = [];
let fechaSeleccionada = obtenerFechaHoy();
let historialComidas = {};

function obtenerFechaHoy() {
    const hoy = new Date();

    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, "0");
    const dia = String(hoy.getDate()).padStart(2, "0");

    return `${anio}-${mes}-${dia}`;
}
// ==========================================
// REFERENCIAS DEL HTML
// ==========================================

const categoriaSelect =
    document.getElementById("categoria");

const alimentoSelect =
    document.getElementById("alimento");
const buscarAlimentoInput =
    document.getElementById("buscarAlimento");

const cantidadInput =
    document.getElementById("cantidad");

const unidadSpan =
    document.getElementById("unidad");

const tipoComidaSelect =
    document.getElementById("tipoComida");


// ==========================================
// DATOS PERSONALES Y METAS
// ==========================================

const metaCalorias =
    document.getElementById("metaCalorias");

const pesoInput =
    document.getElementById("peso");

const alturaInput =
    document.getElementById("altura");
    const edadInput =
    document.getElementById("edad");

const gramosProteinaKg =
    document.getElementById("gramosProteinaKg");

const gramosGrasaKg =
    document.getElementById("gramosGrasaKg");

const carbohidratosCalculados =
    document.getElementById("carbohidratosCalculados");

const btnCalcularMacros =
    document.getElementById("btnCalcularMacros");


// ==========================================
// PROGRESO
// ==========================================

const progresoCaloriasTexto =
    document.getElementById("progresoCaloriasTexto");

const progresoProteinaTexto =
    document.getElementById("progresoProteinaTexto");

const progresoCarbohidratosTexto =
    document.getElementById("progresoCarbohidratosTexto");

const progresoGrasasTexto =
    document.getElementById("progresoGrasasTexto");


const barraCalorias =
    document.getElementById("barraCalorias");

const barraProteina =
    document.getElementById("barraProteina");

const barraCarbohidratos =
    document.getElementById("barraCarbohidratos");

const barraGrasas =
    document.getElementById("barraGrasas");


const restanteCalorias =
    document.getElementById("restanteCalorias");

const restanteProteina =
    document.getElementById("restanteProteina");

const restanteCarbohidratos =
    document.getElementById("restanteCarbohidratos");

const restanteGrasas =
    document.getElementById("restanteGrasas");


// ==========================================
// METAS ACTUALES
// ==========================================

let metas = {
    calorias: 0,
    proteina: 0,
    carbohidratos: 0,
    grasas: 0
};


// ==========================================
// CALCULAR MACROS AUTOMÁTICAMENTE
// ==========================================

function calcularMacrosAutomaticamente() {

    const peso =
        Number(pesoInput.value);

    const calorias =
        Number(metaCalorias.value);

    const proteinaPorKg =
        Number(gramosProteinaKg.value);

    const grasaPorKg =
        Number(gramosGrasaKg.value);


    if (peso <= 0) {

        alert(
            "Ingresa un peso válido."
        );

        return;
    }


    if (calorias <= 0) {

        alert(
            "Ingresa las calorías estimadas para hoy."
        );

        return;
    }


    if (proteinaPorKg < 0) {

        alert(
            "La proteína por kg no puede ser negativa."
        );

        return;
    }


    if (grasaPorKg < 0) {

        alert(
            "La grasa por kg no puede ser negativa."
        );

        return;
    }


    const proteina =
        peso * proteinaPorKg;


    const grasas =
        peso * grasaPorKg;


    const caloriasProteina =
        proteina * 4;


    const caloriasGrasas =
        grasas * 9;


    const caloriasRestantes =
        calorias -
        caloriasProteina -
        caloriasGrasas;


    if (caloriasRestantes < 0) {

        alert(
            "Las calorías asignadas a proteína y grasas " +
            "superan las calorías del día."
        );

        return;
    }
 const carbohidratos =
        caloriasRestantes / 4;


    metas.calorias =
        calorias;

    metas.proteina =
        proteina;

    metas.carbohidratos =
        carbohidratos;

    metas.grasas =
        grasas;


    carbohidratosCalculados.textContent =
         `${carbohidratos.toFixed(2)} g `;


    localStorage.setItem(
        "metasMacros",
        JSON.stringify(metas)
    );


    actualizarProgreso();


    alert(
        "¡Macros calculados correctamente! 🔥"
    );
}


// ==========================================
// CARGAR METAS GUARDADAS
// ==========================================

function cargarMetasGuardadas() {

    const metasGuardadas =
        localStorage.getItem("metasMacros");


    if (!metasGuardadas) {

        actualizarProgreso();

        return;
    }


    try {

        metas =
            JSON.parse(
                metasGuardadas
            );


        metaCalorias.value =
            metas.calorias;


        carbohidratosCalculados.textContent =
             `${Number(metas.carbohidratos).toFixed(2)} g `;

    }

    catch (error) {

        console.error(
            "No se pudieron cargar las metas.",
            error
        );

    }


    actualizarProgreso();
}


// ==========================================
// ACTUALIZAR PROGRESO
// ==========================================

function actualizarProgreso() {

    const elementoCalorias =
        document.getElementById("totalCalorias");

    const elementoProteina =
        document.getElementById("totalProteina");

    const elementoCarbohidratos =
        document.getElementById("totalCarbohidratos");

    const elementoGrasas =
        document.getElementById("totalGrasas");


    if (
        !elementoCalorias ||
        !elementoProteina ||
        !elementoCarbohidratos ||
        !elementoGrasas
    ) {

        return;
    }


    const calorias =
        Number(
            elementoCalorias.textContent
        );

    const proteina =
        Number(
            elementoProteina.textContent
        );

    const carbohidratos =
        Number(
            elementoCarbohidratos.textContent
        );

    const grasas =
        Number(
            elementoGrasas.textContent
        );


    const porcentajeCalorias =
        metas.calorias > 0
            ? (calorias / metas.calorias) * 100
            : 0;


    const porcentajeProteina =
        metas.proteina > 0
            ? (proteina / metas.proteina) * 100
            : 0;


    const porcentajeCarbohidratos =
        metas.carbohidratos > 0
            ? (carbohidratos / metas.carbohidratos) * 100
            : 0;


    const porcentajeGrasas =
        metas.grasas > 0
            ? (grasas / metas.grasas) * 100
            : 0;


    const diferenciaCalorias =
        metas.calorias - calorias;

    const diferenciaProteina =
        metas.proteina - proteina;

    const diferenciaCarbohidratos =
        metas.carbohidratos - carbohidratos;

    const diferenciaGrasas =
        metas.grasas - grasas;


    if (diferenciaCalorias >= 0) {
 restanteCalorias.textContent =
             `Te faltan ${diferenciaCalorias.toFixed(2)} kcal `;

    } else {

        restanteCalorias.textContent =
             `Meta superada por ${Math.abs(diferenciaCalorias).toFixed(2)} kcal 🔥 `;
    }


    if (diferenciaProteina >= 0) {

        restanteProteina.textContent =
             `Te faltan ${diferenciaProteina.toFixed(2)} g `;

    } else {

        restanteProteina.textContent =
             `Meta superada por ${Math.abs(diferenciaProteina).toFixed(2)} g 💪 `;
    }


    if (diferenciaCarbohidratos >= 0) {

        restanteCarbohidratos.textContent =
             `Te faltan ${diferenciaCarbohidratos.toFixed(2)} g `;

    } else {

        restanteCarbohidratos.textContent =
             `Meta superada por ${Math.abs(diferenciaCarbohidratos).toFixed(2)} g 🍚 `;
    }


    if (diferenciaGrasas >= 0) {

        restanteGrasas.textContent =
             `Te faltan ${diferenciaGrasas.toFixed(2)} g `;

    } else {

        restanteGrasas.textContent =
             `Meta superada por ${Math.abs(diferenciaGrasas).toFixed(2)} g 🥑 `;
    }


    progresoCaloriasTexto.textContent =
         `${calorias.toFixed(2)} / ${metas.calorias} kcal `;


    progresoProteinaTexto.textContent =
         `${proteina.toFixed(2)} / ${metas.proteina.toFixed(2)} g `;


    progresoCarbohidratosTexto.textContent =
         `${carbohidratos.toFixed(2)} / ${metas.carbohidratos.toFixed(2)} g `;


    progresoGrasasTexto.textContent =
         `${grasas.toFixed(2)} / ${metas.grasas.toFixed(2)} g `;


    barraCalorias.style.width =
         `${Math.min(porcentajeCalorias, 100)}% `;


    barraProteina.style.width =
         `${Math.min(porcentajeProteina, 100)}% `;


    barraCarbohidratos.style.width =
         `${Math.min(porcentajeCarbohidratos, 100)}% `;


    barraGrasas.style.width =
         `${Math.min(porcentajeGrasas, 100)}% `;


    actualizarEstadoProgreso(
        "barraCalorias",
        porcentajeCalorias
    );

    actualizarEstadoProgreso(
        "barraProteina",
        porcentajeProteina
    );

    actualizarEstadoProgreso(
        "barraCarbohidratos",
        porcentajeCarbohidratos
    );

    actualizarEstadoProgreso(
        "barraGrasas",
        porcentajeGrasas
    );
    actualizarDashboard();
}


// ==========================================
// ESTADO DEL PROGRESO
// ==========================================

function actualizarEstadoProgreso(
    idBarra,
    porcentaje
) {

    const barra =
        document.getElementById(idBarra);


    if (!barra) {
        return;
    }


    const elemento =
        barra.closest(".progreso-item");


    if (!elemento) {
        return;
    }


    elemento.classList.remove("cerca");

    elemento.classList.remove("superado");


    if (porcentaje >= 100) {

        elemento.classList.add("superado");

    }

    else if (porcentaje >= 80) {

        elemento.classList.add("cerca");
    }
}


/* =====================================
   DASHBOARD NUTRICIONAL
===================================== */

function actualizarEstadoDashboard(tarjeta, consumo, objetivo) {
    if (!tarjeta) return;

    tarjeta.classList.remove(
        "estado-sin-meta",
        "estado-pendiente",
        "estado-cerca",
        "estado-alcanzada",
        "estado-superada"
    );

    let estado;

    if (objetivo <= 0) {
        estado = "sin-meta";
    } else if (consumo > objetivo * 1.005) {
        estado = "superada";
    } else if (consumo >= objetivo * 0.995) {
        estado = "alcanzada";
    } else if (consumo / objetivo >= 0.8) {
        estado = "cerca";
    } else {
        estado = "pendiente";
    }

    tarjeta.classList.add(`estado-${estado}`);
    tarjeta.dataset.estado = estado;
}

function actualizarDashboard() {

    const obtenerNumero = (id) => {
        const elemento = document.getElementById(id);

        if (!elemento) return 0;

        const valor = Number(elemento.textContent);

        return Number.isFinite(valor) ? valor : 0;
    };

    const mostrar = (id, valor) => {
        const elemento = document.getElementById(id);

        if (elemento) {
            elemento.textContent = valor;
        }
    };

    const actualizarTarjeta = ({
        consumo,
        objetivo,
        idConsumo,
        idObjetivo,
        idBarra,
        idProgreso,
        idRestante,
        unidad,
        nombre
    }) => {

        mostrar(idConsumo, consumo.toFixed(2));
        mostrar(
            idObjetivo,
            objetivo > 0 ? `${objetivo.toFixed(2)} ${unidad}` : "Sin meta"
        );

        const porcentaje = objetivo > 0
            ? (consumo / objetivo) * 100
            : 0;

        const porcentajeVisible = Math.min(porcentaje, 100);

        const barra = document.getElementById(idBarra);
        const progreso = document.getElementById(idProgreso);
        const tarjeta = barra?.closest(".dashboard-macro");

        actualizarEstadoDashboard(tarjeta, consumo, objetivo);

        if (barra) {
            barra.style.width = `${porcentajeVisible}%`;
        }

        if (progreso) {
            progreso.setAttribute(
                "aria-valuenow",
                String(Math.round(porcentajeVisible))
            );
        }

        if (objetivo <= 0) {
    mostrar(idRestante, "Configura tus metas");
    return;
}

if (consumo > objetivo * 1.005) {
    mostrar(
        idRestante,
        `Superaste la meta por ${(consumo - objetivo).toFixed(2)} ${unidad}`
    );
} else if (consumo >= objetivo * 0.995) {
    mostrar(idRestante, "¡Meta alcanzada!");
} else {
    mostrar(
        idRestante,
        `Faltan ${(objetivo - consumo).toFixed(2)} ${unidad}`
    );
}
    };

    const calorias = obtenerNumero("totalCalorias");
    const proteina = obtenerNumero("totalProteina");
    const carbohidratos = obtenerNumero("totalCarbohidratos");
    const grasas = obtenerNumero("totalGrasas");

    const metaCaloriasActual = Number(metas.calorias) || 0;
    const metaProteina = Number(metas.proteina) || 0;
    const metaCarbohidratos = Number(metas.carbohidratos) || 0;
    const metaGrasas = Number(metas.grasas) || 0;

    mostrar("dashboardCalorias", calorias.toFixed(2));
    mostrar(
        "dashboardMetaCalorias",
        metaCaloriasActual > 0
            ? `${metaCaloriasActual.toFixed(2)} kcal`
            : "Sin meta"
    );

    const porcentajeCalorias = metaCaloriasActual > 0
        ? (calorias / metaCaloriasActual) * 100
        : 0;

    const barraCalorias = document.getElementById(
        "dashboardBarraCalorias"
    );
    const tarjetaCalorias = barraCalorias?.closest(
    ".dashboard-calorias"
);

actualizarEstadoDashboard(
    tarjetaCalorias,
    calorias,
    metaCaloriasActual
);

    const progresoCalorias = document.getElementById(
        "dashboardProgresoCalorias"
    );

    if (barraCalorias) {
        barraCalorias.style.width =
            `${Math.min(porcentajeCalorias, 100)}%`;
    }

    if (progresoCalorias) {
        progresoCalorias.setAttribute(
            "aria-valuenow",
            String(Math.round(Math.min(porcentajeCalorias, 100)))
        );
    }

    mostrar(
        "dashboardPorcentajeCalorias",
        metaCaloriasActual > 0
            ? `${Math.round(porcentajeCalorias)}% de tu meta`
            : "Configura tu meta"
    );

    let textoRestanteCalorias;

if (metaCaloriasActual <= 0) {
    textoRestanteCalorias = "Establece tu objetivo diario";
} else if (calorias > metaCaloriasActual * 1.005) {
    textoRestanteCalorias =
        `Superaste la meta por ${(calorias - metaCaloriasActual).toFixed(2)} kcal`;
} else if (calorias >= metaCaloriasActual * 0.995) {
    textoRestanteCalorias = "¡Meta alcanzada!";
} else {
    textoRestanteCalorias =
        `Te faltan ${(metaCaloriasActual - calorias).toFixed(2)} kcal`;
}

mostrar("dashboardRestanteCalorias", textoRestanteCalorias);

    actualizarTarjeta({
        consumo: proteina,
        objetivo: metaProteina,
        idConsumo: "dashboardProteina",
        idObjetivo: "dashboardMetaProteina",
        idBarra: "dashboardBarraProteina",
        idProgreso: "dashboardProgresoProteina",
        idRestante: "dashboardRestanteProteina",
        unidad: "g",
        nombre: "proteína"
    });

    actualizarTarjeta({
        consumo: carbohidratos,
        objetivo: metaCarbohidratos,
        idConsumo: "dashboardCarbohidratos",
        idObjetivo: "dashboardMetaCarbohidratos",
        idBarra: "dashboardBarraCarbohidratos",
        idProgreso: "dashboardProgresoCarbohidratos",
        idRestante: "dashboardRestanteCarbohidratos",
        unidad: "g",
        nombre: "carbohidratos"
    });

    actualizarTarjeta({
        consumo: grasas,
        objetivo: metaGrasas,
        idConsumo: "dashboardGrasas",
        idObjetivo: "dashboardMetaGrasas",
        idBarra: "dashboardBarraGrasas",
        idProgreso: "dashboardProgresoGrasas",
        idRestante: "dashboardRestanteGrasas",
        unidad: "g",
        nombre: "grasas"
    });

    const fecha = document.getElementById("dashboardFecha");

    if (fecha && typeof fechaSeleccionada === "string") {
        const [anio, mes, dia] = fechaSeleccionada.split("-");
        fecha.textContent = `Resumen del ${dia}/${mes}/${anio}`;
    }
    actualizarMensajeInteligente({
    calorias,
    proteina,
    carbohidratos,
    grasas,
    metaCalorias: metaCaloriasActual,
    metaProteina,
    metaCarbohidratos,
    metaGrasas
});
actualizarResumenHistorico();
}



// ==========================================
// GUARDAR COMIDA
// ==========================================



function guardarComida() {
    // Guardar una copia de la lista del día seleccionado.
    historialComidas[fechaSeleccionada] =
        comida.map(item => ({ ...item }));

    // Guardar todo el historial.
    localStorage.setItem(
        "miHistorial",
        JSON.stringify(historialComidas)
    );

    // Mantener compatibilidad con el sistema anterior.
    localStorage.setItem(
        "miComida",
        JSON.stringify(comida)
    );
}

function escaparHTML(valor) {
    const caracteres = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };

    return String(valor ?? "").replace(
        /[&<>"']/g,
        caracter => caracteres[caracter]
    );
}

function mostrarComida() {

    document.getElementById(
        "listaDesayuno"
    ).innerHTML = "";

    document.getElementById(
        "listaComida"
    ).innerHTML = "";

    document.getElementById(
        "listaCena"
    ).innerHTML = "";

    document.getElementById(
        "listaColacion"
    ).innerHTML = "";


    let totalCalorias = 0;

    let totalProteina = 0;

    let totalCarbohidratos = 0;

    let totalGrasas = 0;


    let desayuno = {

        calorias: 0,

        proteina: 0,

        carbohidratos: 0,

        grasas: 0
    };


    let comidaSubtotal = {

        calorias: 0,

        proteina: 0,

        carbohidratos: 0,

        grasas: 0
    };


    let cena = {

        calorias: 0,

        proteina: 0,

        carbohidratos: 0,

        grasas: 0
    };


    let colacion = {

        calorias: 0,

        proteina: 0,

        carbohidratos: 0,

        grasas: 0
    };


    comida.forEach(
        (item, indice) => {

            const lista =
                obtenerListaPorTipo(
                    item.tipoComida
                );


            if (!lista) {
                return;
            }


            const elemento =
                document.createElement(
                    "div"
                );


            elemento.classList.add(
                "alimento-agregado"
            );


            let unidadTexto;


            if (
                item.unidad === "100g"
            ) {

                unidadTexto =
                    "g";

            }

            else {

                unidadTexto =
                    "piezas";
            }


            elemento.innerHTML = `

                <div>

                    <strong>
                     ${escaparHTML(item.nombre)}
                    </strong>
                    <br>

                    <small>
                        ${item.cantidad}
                        ${unidadTexto}
                    </small>

                </div>


                <div class="info-alimento">

                    <span>
                        🔥
                        ${item.calorias.toFixed(2)}
                        kcal
                    </span>

                    <span>
                        🥩
                        ${item.proteina.toFixed(2)}
                        g
                    </span>

                    <span>
                        🍚
                        ${item.carbohidratos.toFixed(2)}
                        g
                    </span>

                    <span>
                        🥑
                        ${item.grasas.toFixed(2)}
                        g
                    </span>


                    <button
                        class="btn-editar"
                        onclick="editarAlimento(${indice})"
                        title="Editar cantidad"
                    >
                        ✏️
                    </button>
                    <button
                        class="btn-editar"
                        onclick="cambiarTipoComida(${indice})"
                        title="Mover de comida"
                    >
                        🔄
                    </button>


                    <button
                        class="btn-eliminar"
                        onclick="eliminarAlimento(${indice})"
                        title="Eliminar alimento"
                    >
                        🗑️
                    </button>

                </div>
            `;


            lista.appendChild(
                elemento
            );


            totalCalorias +=
                item.calorias;


            totalProteina +=
                item.proteina;


            totalCarbohidratos +=
                item.carbohidratos;


            totalGrasas +=
                item.grasas;


            if (
                item.tipoComida ===
                "desayuno"
            ) {

                desayuno.calorias +=
                    item.calorias;

                desayuno.proteina +=
                    item.proteina;

                desayuno.carbohidratos +=
                    item.carbohidratos;

                desayuno.grasas +=
                    item.grasas;
            }


            else if (
                item.tipoComida ===
                "comida"
            ) {

                comidaSubtotal.calorias +=
                    item.calorias;

                comidaSubtotal.proteina +=
                    item.proteina;

                comidaSubtotal.carbohidratos +=
                    item.carbohidratos;

                comidaSubtotal.grasas +=
                    item.grasas;
            }


            else if (
                item.tipoComida ===
                "cena"
            ) {

                cena.calorias +=
                    item.calorias;

                cena.proteina +=
                    item.proteina;

                cena.carbohidratos +=
                    item.carbohidratos;

                cena.grasas +=
                    item.grasas;
            }


            else if (
                item.tipoComida ===
                "colacion"
            ) {

                colacion.calorias +=
                    item.calorias;

                colacion.proteina +=
                    item.proteina;

                colacion.carbohidratos +=
                    item.carbohidratos;

                colacion.grasas +=
                    item.grasas;
            }

        }
    );


    mostrarSubtotal(
        "subtotalDesayuno",
        desayuno
    );


    mostrarSubtotal(
        "subtotalComida",
        comidaSubtotal
    );


    mostrarSubtotal(
        "subtotalCena",
        cena
    );


    mostrarSubtotal(
        "subtotalColacion",
        colacion
    );


    document.getElementById(
        "totalCalorias"
    ).textContent =
        totalCalorias.toFixed(2);


    document.getElementById(
        "totalProteina"
    ).textContent =
        totalProteina.toFixed(2);


    document.getElementById(
        "totalCarbohidratos"
    ).textContent =
        totalCarbohidratos.toFixed(2);
         document.getElementById(
        "totalGrasas"
    ).textContent =
        totalGrasas.toFixed(2);
        if (typeof renderizarCalendario === "function") {
    renderizarCalendario();
}


    actualizarProgreso();
}


function calcularEstadisticasMensuales(anio, mes) {
    // mes utiliza números del 0 al 11:
    // enero = 0, febrero = 1, etc.

    const estadisticas = {
        diasRegistrados: 0,
        caloriasTotales: 0,
        proteinaTotal: 0,
        carbohidratosTotales: 0,
        grasasTotales: 0
    };

    const prefijoMes =
        `${anio}-${String(mes + 1).padStart(2, "0")}-`;

    for (const [fecha, alimentos] of Object.entries(historialComidas)) {
        // Solo contamos las fechas del mes solicitado.
        if (!fecha.startsWith(prefijoMes)) {
            continue;
        }

        if (!Array.isArray(alimentos) || alimentos.length === 0) {
            continue;
        }

        let diaTieneRegistros = false;

        alimentos.forEach(item => {
            const calorias = Number(item.calorias) || 0;
            const proteina = Number(item.proteina) || 0;
            const carbohidratos = Number(item.carbohidratos) || 0;
            const grasas = Number(item.grasas) || 0;

            estadisticas.caloriasTotales += calorias;
            estadisticas.proteinaTotal += proteina;
            estadisticas.carbohidratosTotales += carbohidratos;
            estadisticas.grasasTotales += grasas;

            diaTieneRegistros = true;
        });

        if (diaTieneRegistros) {
            estadisticas.diasRegistrados++;
        }
    }

    estadisticas.promedioCalorias =
        estadisticas.diasRegistrados > 0
            ? estadisticas.caloriasTotales / estadisticas.diasRegistrados
            : 0;

    return estadisticas;
}


function mostrarEstadisticasMensuales() {
    if (!(fechaMesCalendario instanceof Date)) {
        return;
    }

    const anio = fechaMesCalendario.getFullYear();
    const mes = fechaMesCalendario.getMonth();

    const datos = calcularEstadisticasMensuales(anio, mes);

    const actualizarTexto = (id, valor) => {
        const elemento = document.getElementById(id);

        if (elemento) {
            elemento.textContent = valor;
        }
    };

    const formatoNumero = valor =>
        valor.toLocaleString("es-MX", {
            maximumFractionDigits: 2
        });

    actualizarTexto(
        "estadisticasMesTexto",
        fechaMesCalendario.toLocaleDateString("es-MX", {
            month: "long",
            year: "numeric"
        })
    );

    actualizarTexto("estadisticaDias", datos.diasRegistrados);
    actualizarTexto("estadisticaCalorias", formatoNumero(datos.caloriasTotales));
    actualizarTexto("estadisticaPromedio", formatoNumero(datos.promedioCalorias));
    actualizarTexto("estadisticaProteinas", formatoNumero(datos.proteinaTotal));
    actualizarTexto("estadisticaCarbohidratos", formatoNumero(datos.carbohidratosTotales));
    actualizarTexto("estadisticaGrasas", formatoNumero(datos.grasasTotales));
}



function cargarComidasPorFecha(fecha) {
    if (!fecha) {
        return;
    }

    fechaSeleccionada = fecha;

    if (Array.isArray(historialComidas[fecha])) {
        comida = historialComidas[fecha];
    } else {
        comida = [];
    }

    mostrarComida();
}


function inicializarSelectorFecha() {
    const selectorFecha = document.getElementById("selectorFecha");
    const fechaActualTexto = document.getElementById("fechaActualTexto");
    const btnVolverHoy = document.getElementById("btnVolverHoy");

    if (!selectorFecha || !fechaActualTexto || !btnVolverHoy) {
        return;
    }

    selectorFecha.value = fechaSeleccionada;

    function actualizarTextoFecha() {
        const [anio, mes, dia] = fechaSeleccionada.split("-");

        fechaActualTexto.textContent =
            `Estás consultando el ${dia}/${mes}/${anio}`;
    }

    selectorFecha.addEventListener("change", () => {
        if (!selectorFecha.value) {
            return;
        }

        cargarComidasPorFecha(selectorFecha.value);
        actualizarTextoFecha();
    });

    btnVolverHoy.addEventListener("click", () => {
        const hoy = obtenerFechaHoy();

        cargarComidasPorFecha(hoy);
        selectorFecha.value = hoy;
        actualizarTextoFecha();
    });

    actualizarTextoFecha();
}





// ==========================================
// CARGAR COMIDA GUARDADA
// ==========================================


function cargarComidaGuardada() {
    const historialGuardado = localStorage.getItem("miHistorial");
    const comidaGuardada = localStorage.getItem("miComida");

    // Si ya existe un historial, lo cargamos.
    if (historialGuardado !== null) {
        try {
            const historialParseado = JSON.parse(historialGuardado);

            if (
                historialParseado === null ||
                typeof historialParseado !== "object" ||
                Array.isArray(historialParseado)
            ) {
                throw new Error("El historial guardado no tiene un formato válido.");
            }

            historialComidas = historialParseado;

            comida = Array.isArray(historialComidas[fechaSeleccionada])
                ? historialComidas[fechaSeleccionada]
                : [];

        } catch (error) {
            console.error(
                "No se pudo cargar el historial. Los datos guardados se conservarán.",
                error
            );

            mostrarComida();
            return;
        }

    // Si todavía no existe historial, migramos la lista antigua.
    } else if (comidaGuardada !== null) {
        try {
            const comidaAnterior = JSON.parse(comidaGuardada);

            if (!Array.isArray(comidaAnterior)) {
                throw new Error("La lista de comidas no tiene un formato válido.");
            }

            comida = comidaAnterior;

            historialComidas[fechaSeleccionada] = comida;

            localStorage.setItem(
                "miHistorial",
                JSON.stringify(historialComidas)
            );

        } catch (error) {
            console.error(
                "No se pudo migrar la lista antigua. Se conservarán los datos originales.",
                error
            );

            mostrarComida();
            return;
        }

    } else {
        comida = [];
    }

    // Compatibilidad con registros anteriores.
    comida.forEach(item => {
        if (!item.tipoComida) {
            item.tipoComida = "comida";
        }
    });

    mostrarComida();
}



// ==========================================
// OBTENER MACROS
// ==========================================

function obtenerMacros(
    alimento,
    cantidad
) {

    let calorias = 0;
    let proteina = 0;
    let carbohidratos = 0;
    let grasas = 0;


    if (
        alimento.unidad === "100g"
    ) {

        calorias =
            (alimento.calorias / 100) *
            cantidad;

        proteina =
            (alimento.proteina / 100) *
            cantidad;

        carbohidratos =
            (alimento.carbohidratos / 100) *
            cantidad;

        grasas =
            (alimento.grasas / 100) *
            cantidad;
    }


    else if (
        alimento.unidad === "pieza"
    ) {

        calorias =
            alimento.calorias *
            cantidad;

        proteina =
            alimento.proteina *
            cantidad;

        carbohidratos =
            alimento.carbohidratos *
            cantidad;

        grasas =
            alimento.grasas *
            cantidad;
    }


    else if (
        alimento.unidad === "2piezas"
    ) {

        calorias =
            (alimento.calorias / 2) *
            cantidad;

        proteina =
            (alimento.proteina / 2) *
            cantidad;

        carbohidratos =
            (alimento.carbohidratos / 2) *
            cantidad;

        grasas =
            (alimento.grasas / 2) *
            cantidad;
    }


    return {
        calorias,
        proteina,
        carbohidratos,
        grasas
    };
}


// ==========================================
// CARGAR ALIMENTOS PERSONALIZADOS
// ==========================================

function cargarAlimentosGuardados() {

    const alimentosGuardados =
        localStorage.getItem("misAlimentos");


    if (!alimentosGuardados) {
        return;
    }


    try {

        const datos =
            JSON.parse(
                alimentosGuardados
            );


        Object.assign(
            alimentos,
            datos
        );

    }

    catch (error) {

        console.error(
            "No se pudieron cargar los alimentos personalizados.",
            error
        );
    }
}


const CLAVE_CATEGORIAS = "misCategorias";

const CATEGORIAS_INICIALES = [
    "Proteínas",
    "Lácteos",
    "Integrales y cereales",
    "Panes",
    "Verduras",
    "Frutas",
    "Salsas o aderezos",
    "Frutos secos",
    "Por pieza",
    "Postres, snacks y antojos"
];


function obtenerCategoriasGuardadas() {
    let categoriasGuardadas;

    try {
        const datos = localStorage.getItem(CLAVE_CATEGORIAS);

        if (datos !== null) {
            const categoriasParseadas = JSON.parse(datos);

            if (Array.isArray(categoriasParseadas)) {
                categoriasGuardadas = categoriasParseadas;
            }
        }
    } catch (error) {
        console.error("No se pudieron cargar las categorías:", error);
    }

    // Inicializar la lista únicamente cuando todavía no existe.
    if (!categoriasGuardadas) {
        const categoriasAlimentos = Object.values(alimentos)
            .map(alimento => alimento.categoria)
            .filter(
                categoria =>
                    typeof categoria === "string" &&
                    categoria.trim() !== ""
            );

        categoriasGuardadas = [
            ...CATEGORIAS_INICIALES,
            ...categoriasAlimentos
        ];
    }

    // Eliminar nombres vacíos y duplicados.
    categoriasGuardadas = [
        ...new Set(
            categoriasGuardadas.filter(
                categoria =>
                    typeof categoria === "string" &&
                    categoria.trim() !== ""
            )
        )
    ];

    localStorage.setItem(
        CLAVE_CATEGORIAS,
        JSON.stringify(categoriasGuardadas)
    );

    return categoriasGuardadas;
}



// ==========================================
// CARGAR CATEGORÍAS
// ==========================================


function cargarCategorias() {
    const categorias = obtenerCategoriasGuardadas();



const selectores = [
    categoriaSelect,
    document.getElementById("nuevaCategoria"),
    document.getElementById("editarCategoria"),
    document.getElementById("categoriaAEditar"),
    document.getElementById("categoriaDestino")
];



    selectores.forEach(selector => {
        if (!selector) return;

        const valorAnterior = selector.value;

        selector.innerHTML = "";

        const opcionInicial = document.createElement("option");
        opcionInicial.value = "";
        opcionInicial.textContent = "Selecciona una categoría";

        selector.appendChild(opcionInicial);

        categorias.forEach(categoria => {
            const opcion = document.createElement("option");

            opcion.value = categoria;
            opcion.textContent = categoria;

            selector.appendChild(opcion);
        });

        if (categorias.includes(valorAnterior)) {
            selector.value = valorAnterior;
        }
    });
}


function actualizarCategoriaEnAlimentos(
    categoriaAnterior,
    categoriaNueva
) {
    let alimentosGuardados = {};

    try {
        const datos = localStorage.getItem("misAlimentos");

        if (datos !== null) {
            const parseados = JSON.parse(datos);

            if (
                parseados === null ||
                typeof parseados !== "object" ||
                Array.isArray(parseados)
            ) {
                throw new Error(
                    "Los alimentos guardados tienen un formato inválido."
                );
            }

            alimentosGuardados = parseados;
        }
    } catch (error) {
        console.error(
            "No se pudieron leer los alimentos guardados.",
            error
        );

        alert(
            "No se pudieron guardar los cambios de categoría. " +
            "Revisa los datos almacenados antes de continuar."
        );

        return false;
    }

    // Actualizar los alimentos de la categoría.
    Object.keys(alimentos).forEach(id => {
        const alimento = alimentos[id];

        if (alimento.categoria !== categoriaAnterior) {
            return;
        }

        const alimentoActualizado = {
            ...alimento,
            categoria: categoriaNueva
        };

        alimentos[id] = alimentoActualizado;

        /*
         * Guardar tanto los alimentos personalizados como los del
         * catálogo original que hayan cambiado de categoría.
         *
         * Los alimentos originales se guardan como modificaciones
         * persistentes, sin alterar alimentos.js.
         */
        alimentosGuardados[id] = alimentoActualizado;
    });

    try {
        localStorage.setItem(
            "misAlimentos",
            JSON.stringify(alimentosGuardados)
        );

        return true;
    } catch (error) {
        console.error(
            "No se pudieron guardar los cambios de categoría.",
            error
        );

        alert(
            "No se pudieron guardar los cambios. " +
            "Comprueba el espacio disponible en el navegador."
        );

        return false;
    }
}


function editarCategoria() {
    const selector = document.getElementById("categoriaAEditar");
    const input = document.getElementById("nuevoNombreCategoria");
    const mensaje = document.getElementById("mensajeCategorias");

    const categoriaAnterior = selector.value;
    const categoriaNueva = input.value.trim();

    if (!categoriaAnterior) {
        mensaje.textContent = "Selecciona la categoría que quieres renombrar.";
        return;
    }

    if (!categoriaNueva) {
        mensaje.textContent = "Escribe el nuevo nombre.";
        input.focus();
        return;
    }

    const categorias = obtenerCategoriasGuardadas();

    if (
        categorias.some(
            categoria =>
                categoria.toLowerCase() === categoriaNueva.toLowerCase()
        )
    ) {
        mensaje.textContent = "Ya existe una categoría con ese nombre.";
        return;
    }

    if (
    !actualizarCategoriaEnAlimentos(
        categoriaAnterior,
        categoriaNueva
    )
) {
    return;
}
    const categoriasActualizadas = categorias.map(categoria =>
        categoria === categoriaAnterior ? categoriaNueva : categoria
    );

    localStorage.setItem(
        CLAVE_CATEGORIAS,
        JSON.stringify(categoriasActualizadas)
    );

    cargarCategorias();

    selector.value = categoriaNueva;
    input.value = "";

    if (typeof cargarAlimentosParaEliminar === "function") {
        cargarAlimentosParaEliminar();
    }

    if (typeof cargarAlimentosParaEditar === "function") {
        cargarAlimentosParaEditar();
    }

    mensaje.textContent = `Categoría renombrada a "${categoriaNueva}".`;
}

function eliminarCategoria() {
    const selector = document.getElementById("categoriaAEditar");
    const mensaje = document.getElementById("mensajeCategorias");

    const categoria = selector.value;

    if (!categoria) {
        mensaje.textContent = "Selecciona la categoría que quieres eliminar.";
        return;
    }

    const tieneAlimentos = Object.values(alimentos).some(
        alimento => alimento.categoria === categoria
    );

    if (tieneAlimentos) {
        mensaje.textContent =
            "No puedes eliminar esta categoría porque tiene alimentos. " +
            "Primero cambia esos alimentos a otra categoría.";
        return;
    }

    const confirmar = confirm(
        `¿Seguro que quieres eliminar la categoría "${categoria}"?`
    );

    if (!confirmar) return;

    const categoriasActualizadas = obtenerCategoriasGuardadas().filter(
        nombre => nombre !== categoria
    );

    localStorage.setItem(
        CLAVE_CATEGORIAS,
        JSON.stringify(categoriasActualizadas)
    );

    cargarCategorias();

    selector.value = "";
    mensaje.textContent = `Categoría "${categoria}" eliminada correctamente.`;
}

function moverAlimentosYEliminarCategoria() {
    const selectorOrigen = document.getElementById("categoriaAEditar");
    const selectorDestino = document.getElementById("categoriaDestino");
    const mensaje = document.getElementById("mensajeCategorias");

    const categoriaOrigen = selectorOrigen.value;
    const categoriaDestino = selectorDestino.value;

    if (!categoriaOrigen) {
        mensaje.textContent = "Selecciona la categoría que quieres eliminar.";
        return;
    }

    if (!categoriaDestino) {
        mensaje.textContent = "Selecciona una categoría de destino.";
        return;
    }

    if (categoriaOrigen === categoriaDestino) {
        mensaje.textContent = "Elige una categoría de destino diferente.";
        return;
    }

    const categorias = obtenerCategoriasGuardadas();

    if (!categorias.includes(categoriaDestino)) {
        mensaje.textContent = "La categoría de destino no existe.";
        return;
    }

    const tieneAlimentos = Object.values(alimentos).some(
        alimento => alimento.categoria === categoriaOrigen
    );

    if (!tieneAlimentos) {
        mensaje.textContent =
            "Esta categoría no tiene alimentos. Puedes eliminarla con el botón anterior.";
        return;
    }

    const confirmar = confirm(
        `Se moverán los alimentos de "${categoriaOrigen}" a ` +
        `"${categoriaDestino}" y se eliminará la categoría original. ¿Continuar?`
    );

    if (!confirmar) return;

    // Actualizar los alimentos en memoria y en el almacenamiento.
    if (
    !actualizarCategoriaEnAlimentos(
        categoriaOrigen,
        categoriaDestino
    )
) {
    return;
}

    // Retirar la categoría de la lista guardada.
    const categoriasActualizadas = categorias.filter(
        categoria => categoria !== categoriaOrigen
    );

    localStorage.setItem(
        CLAVE_CATEGORIAS,
        JSON.stringify(categoriasActualizadas)
    );

    // Refrescar los selectores y los listados de alimentos.
    cargarCategorias();
    cargarAlimentosParaEliminar();
    cargarAlimentosParaEditar();

    selectorOrigen.value = "";
    selectorDestino.value = "";

    mensaje.textContent =
        `Los alimentos se movieron a "${categoriaDestino}" y ` +
        `se eliminó "${categoriaOrigen}".`;
}



function crearCategoria() {
    const input = document.getElementById("nombreNuevaCategoria");
    const mensaje = document.getElementById("mensajeCategorias");

    const nombre = input.value.trim();

    if (!nombre) {
        mensaje.textContent = "Escribe un nombre para la categoría.";
        input.focus();
        return;
    }

    if (nombre.length > 50) {
        mensaje.textContent = "El nombre no puede superar los 50 caracteres.";
        return;
    }

    const categorias = obtenerCategoriasGuardadas();

    const yaExiste = categorias.some(
        categoria => categoria.toLowerCase() === nombre.toLowerCase()
    );

    if (yaExiste) {
        mensaje.textContent = "Esa categoría ya existe.";
        return;
    }

    categorias.push(nombre);

    localStorage.setItem(
        CLAVE_CATEGORIAS,
        JSON.stringify(categorias)
    );

    cargarCategorias();

    // Seleccionar la nueva categoría en el formulario de alimentos.
    const selectorNuevoAlimento = document.getElementById("nuevaCategoria");

    if (selectorNuevoAlimento) {
        selectorNuevoAlimento.value = nombre;
    }

    input.value = "";
    mensaje.textContent = `¡Categoría "${nombre}" creada correctamente!`;
}



// ==========================================
// CARGAR ALIMENTOS SEGÚN CATEGORÍA
// ==========================================




function cargarAlimentos() {
    const categoriaSeleccionada = categoriaSelect.value;

    const textoBusqueda = buscarAlimentoInput
        ? buscarAlimentoInput.value.trim().toLowerCase()
        : "";

    alimentoSelect.innerHTML =
        '<option value="">Selecciona un alimento</option>';

    Object.keys(alimentos).forEach(id => {
        const alimentoActual = alimentos[id];

        const perteneceCategoria =
            alimentoActual.categoria === categoriaSeleccionada;

        const nombreAlimento = alimentoActual.nombre || "";

        const coincideBusqueda =
            nombreAlimento.toLowerCase().includes(textoBusqueda);

        if (perteneceCategoria && coincideBusqueda) {
            const option = document.createElement("option");

            option.value = id;
            option.textContent = nombreAlimento;

            alimentoSelect.appendChild(option);
        }
    });

    actualizarUnidad();
}

// ==========================================
// ACTUALIZAR UNIDAD
// ==========================================


function actualizarUnidad() {
    const id = alimentoSelect.value;

    if (!id) {
        unidadSpan.textContent = "g";
        return;
    }

    const alimentoSeleccionado = alimentos[id];

    if (!alimentoSeleccionado) {
        unidadSpan.textContent = "g";
        return;
    }

    unidadSpan.textContent =
        alimentoSeleccionado.unidad === "100g"
            ? "g"
            : "piezas";
}

// ==========================================
// CALCULAR MACROS DEL ALIMENTO
// ==========================================

function calcularMacros() {

    const id =
        alimentoSelect.value;


    const cantidad =
        parseFloat(
            cantidadInput.value
        );


    if (!id) {

        alert(
            "Selecciona un alimento."
        );

        return;
    }


    if (
        isNaN(cantidad) ||
        cantidad <= 0
    ) {

        alert(
            "Ingresa una cantidad válida."
        );

        return;
    }


    const alimento =
        alimentos[id];


    const macros =
        obtenerMacros(
            alimento,
            cantidad
        );


    document.getElementById(
        "calorias"
    ).textContent =
        macros.calorias.toFixed(2);
          document.getElementById(
        "proteina"
    ).textContent =
        macros.proteina.toFixed(2);


    document.getElementById(
        "carbohidratos"
    ).textContent =
        macros.carbohidratos.toFixed(2);


    document.getElementById(
        "grasas"
    ).textContent =
        macros.grasas.toFixed(2);
}


// ==========================================
// AGREGAR ALIMENTO A LA COMIDA
// ==========================================

function agregarAlimento() {

    const id =
        alimentoSelect.value;


    const cantidad =
        parseFloat(
            cantidadInput.value
        );


    const tipoComida =
        tipoComidaSelect.value;


    if (!id) {

        alert(
            "Selecciona un alimento."
        );

        return;
    }


    if (
        isNaN(cantidad) ||
        cantidad <= 0
    ) {

        alert(
            "Ingresa una cantidad válida."
        );

        return;
    }


    const alimento =
        alimentos[id];
        if (!alimento) {
    alert("No se encontró el alimento seleccionado.");
    return;
}


    const macros =
        obtenerMacros(
            alimento,
            cantidad
        );


comida.push({
    id: id,
    nombre: alimento.nombre,
    cantidad: cantidad,
    unidad: alimento.unidad,
    tipoComida: tipoComida,
    calorias: macros.calorias,
    proteina: macros.proteina,
    carbohidratos: macros.carbohidratos,
    grasas: macros.grasas
});



    guardarComida();

    mostrarComida();


    cantidadInput.value =
        "";


    document.getElementById(
        "calorias"
    ).textContent =
        "0";


    document.getElementById(
        "proteina"
    ).textContent =
        "0";


    document.getElementById(
        "carbohidratos"
    ).textContent =
        "0";


    document.getElementById(
        "grasas"
    ).textContent =
        "0";
}


// ==========================================
// EDITAR CANTIDAD
// ==========================================

function editarAlimento(indice) {

    const item =
        comida[indice];


    const nuevaCantidad =
        prompt(
             `Nueva cantidad para ${item.nombre}: `,
            item.cantidad
        );


    if (
        nuevaCantidad === null
    ) {

        return;
    }


    const cantidad =
        parseFloat(
            nuevaCantidad
        );


    if (
        isNaN(cantidad) ||
        cantidad <= 0
    ) {

        alert(
            "Ingresa una cantidad válida."
        );

        return;
    }


    const alimento =
        alimentos[item.id];


    if (!alimento) {

        alert(
            "No se encontró el alimento original."
        );

        return;
    }


    const macros =
        obtenerMacros(
            alimento,
            cantidad
        );


    item.cantidad =
        cantidad;

    item.calorias =
        macros.calorias;

    item.proteina =
        macros.proteina;

    item.carbohidratos =
        macros.carbohidratos;

    item.grasas =
        macros.grasas;


    guardarComida();

    mostrarComida();
}
// ==========================================
// CAMBIAR TIPO DE COMIDA
// ==========================================

function cambiarTipoComida(indice) {

    const item =
        comida[indice];


    const nuevaComida =
        prompt(

             `Mover ${item.nombre} a:\n\n ` +
             `desayuno\n ` +
             `comida\n ` +
             `cena\n ` +
             `colacion\n\n ` +
             `Escribe una opción: `,

            item.tipoComida
        );


    if (
        nuevaComida === null
    ) {

        return;
    }


    const seleccion =
        nuevaComida
            .toLowerCase()
            .trim();


    const opciones = {

        desayuno: true,

        comida: true,

        cena: true,

        colacion: true
    };


    if (
        !opciones[seleccion]
    ) {

        alert(
            "Opción no válida.\n\n" +
            "Usa: desayuno, comida, cena o colacion."
        );

        return;
    }


    item.tipoComida =
        seleccion;


    guardarComida();

    mostrarComida();
}


// ==========================================
// ELIMINAR ELEMENTO DE LA COMIDA
// ==========================================

function eliminarAlimento(indice) {

    comida.splice(
        indice,
        1
    );


    guardarComida();

    mostrarComida();
}


// ==========================================
// OBTENER LISTA SEGÚN TIPO
// ==========================================

function obtenerListaPorTipo(tipo) {

    if (
        tipo === "desayuno"
    ) {

        return document.getElementById(
            "listaDesayuno"
        );
    }


    if (
        tipo === "comida"
    ) {

        return document.getElementById(
            "listaComida"
        );
    }


    if (
        tipo === "cena"
    ) {

        return document.getElementById(
            "listaCena"
        );
    }


    if (
        tipo === "colacion"
    ) {

        return document.getElementById(
            "listaColacion"
        );
    }


    return null;
}


// ==========================================
// MOSTRAR SUBTOTAL
// ==========================================

function mostrarSubtotal(
    id,
    datos
) {

    const elemento =
        document.getElementById(id);


    if (!elemento) {
        return;
    }


    elemento.innerHTML = `

        <div class="subtotal-titulo">
            Subtotal
        </div>

        <div class="subtotal-datos">

            <span>
                🔥
                ${datos.calorias.toFixed(2)}
                kcal
            </span>

            <span>
                💪
                ${datos.proteina.toFixed(2)}
                g
            </span>

            <span>
                🍚
                ${datos.carbohidratos.toFixed(2)}
                g
            </span>

            <span>
                🥑
                ${datos.grasas.toFixed(2)}
                g
            </span>

        </div>
    `;
}

function leerAlimentosPersonalizadosGuardados() {
    const contenido = localStorage.getItem("misAlimentos");

    if (contenido === null) {
        return {};
    }

    const datos = JSON.parse(contenido);

    if (
        datos === null ||
        typeof datos !== "object" ||
        Array.isArray(datos)
    ) {
        throw new Error(
            "Los alimentos guardados tienen un formato inválido."
        );
    }

    // Comprobamos el contenedor sin rechazar registros anteriores
    // que puedan usar una estructura diferente.
    return datos;
}
// ==========================================
// AGREGAR NUEVO ALIMENTO
// ==========================================

function guardarNuevoAlimento() {
    const obtenerTexto = id =>
        document.getElementById(id).value.trim();

    const nombre = obtenerTexto("nuevoNombre");
    const categoria = obtenerTexto("nuevaCategoria");
    const unidad = obtenerTexto("nuevaUnidad");

    const camposNumericos = [
        { id: "nuevasCalorias", nombre: "calorías" },
        { id: "nuevaProteina", nombre: "proteína" },
        { id: "nuevosCarbohidratos", nombre: "carbohidratos" },
        { id: "nuevasGrasas", nombre: "grasas" }
    ];

    if (!nombre || !categoria || !unidad) {
        alert("Completa el nombre, la categoría y la unidad.");
        return;
    }

    if (nombre.length > 100) {
        alert("El nombre no puede superar los 100 caracteres.");
        return;
    }

    if (!["100g", "pieza", "2piezas"].includes(unidad)) {
        alert("Selecciona una unidad válida.");
        return;
    }

    if (!obtenerCategoriasGuardadas().includes(categoria)) {
        alert("Selecciona una categoría existente.");
        return;
    }

    const valores = {};

    for (const campo of camposNumericos) {
        const texto = document.getElementById(campo.id).value.trim();

        if (texto === "") {
            alert(`Completa el campo de ${campo.nombre}.`);
            return;
        }

        const numero = Number(texto);

        if (!Number.isFinite(numero) || numero < 0) {
            alert(
                `El valor de ${campo.nombre} debe ser un número válido no negativo.`
            );
            return;
        }

        valores[campo.nombre] = numero;
    }

    let alimentosGuardados;

    try {
        alimentosGuardados =
            leerAlimentosPersonalizadosGuardados();
    } catch (error) {
        console.error("No se pudieron leer los alimentos:", error);
        alert(
            "No se pudieron leer los alimentos guardados. " +
            "No se modificaron los datos."
        );
        return;
    }

    let id = `personalizado_${Date.now()}`;
    let consecutivo = 1;

    while (
        Object.prototype.hasOwnProperty.call(alimentos, id) ||
        Object.prototype.hasOwnProperty.call(alimentosGuardados, id)
    ) {
        id = `personalizado_${Date.now()}_${consecutivo++}`;
    }

    const nuevoAlimento = {
        nombre,
        categoria,
        unidad,
        calorias: valores.calorías,
        proteina: valores.proteína,
        carbohidratos: valores.carbohidratos,
        grasas: valores.grasas
    };

    alimentosGuardados[id] = nuevoAlimento;

    try {
        localStorage.setItem(
            "misAlimentos",
            JSON.stringify(alimentosGuardados)
        );
    } catch (error) {
        console.error("No se pudo guardar el alimento:", error);
        alert(
            "No se pudo guardar el alimento. " +
            "Comprueba el espacio disponible en el navegador."
        );
        return;
    }

    // Actualizar la aplicación únicamente después de guardar.
    alimentos[id] = nuevoAlimento;

    document.getElementById("nuevoNombre").value = "";
    document.getElementById("nuevaCategoria").value = "";
    document.getElementById("nuevaUnidad").value = "100g";

    camposNumericos.forEach(campo => {
        document.getElementById(campo.id).value = "";
    });

    cargarCategorias();
    cargarAlimentosParaEliminar();
    cargarAlimentosParaEditar();

    categoriaSelect.value = categoria;
    cargarAlimentos();

    alert("¡Alimento guardado correctamente! 🔥");
}


// ==========================================S
// CARGAR LISTA DE PERSONALIZADOS
// ==========================================

function cargarAlimentosParaEliminar() {

    const select =
        document.getElementById(
            "alimentoEliminar"
        );


    if (!select) {
        return;
    }


    select.innerHTML =
        '<option value="">Selecciona un alimento</option>';


    const alimentosGuardados =
        localStorage.getItem(
            "misAlimentos"
        );


    if (!alimentosGuardados) {
        return;
    }


    try {

        const datos =
            JSON.parse(
                alimentosGuardados
            );


        Object.keys(datos)
    .filter(id => id.startsWith("personalizado_"))
    .forEach(id => {

                const alimento =
                    datos[id];


                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    id;


                option.textContent =
                    alimento.nombre;


                select.appendChild(
                    option
                );
            }
        );

    }

    catch (error) {

        console.error(
            "No se pudieron cargar los alimentos personalizados.",
            error
        );
    }
}
function cargarAlimentosParaEditar() {
    const select = document.getElementById("alimentoEditar");

    if (!select) return;

    select.innerHTML =
        '<option value="">Selecciona un alimento</option>';

    const alimentosGuardados =
        localStorage.getItem("misAlimentos");

    if (!alimentosGuardados) return;

    try {
        const datos = JSON.parse(alimentosGuardados);
        Object.keys(datos)
    .filter(id => id.startsWith("personalizado_"))
    .forEach(id => {
            const alimento = datos[id];

            const option =
                document.createElement("option");

            option.value = id;
            option.textContent = alimento.nombre;

            select.appendChild(option);
        });

    } catch (error) {
        console.error(
            "No se pudieron cargar los alimentos para editar.",
            error
        );
    }
}

function editarAlimentoPersonalizado() {


    const select =
        document.getElementById("alimentoEditar");

    const id = select.value;


    if (!id) {
        alert("Selecciona un alimento para editar.");
        return;
    }

    const alimentosGuardados =
        JSON.parse(
            localStorage.getItem("misAlimentos")
        ) || {};

    const alimento =
    alimentosGuardados[id];


    if (!alimento) {
        alert("No se encontró el alimento.");
        return;
    }

    document.getElementById("editarNombre").value =
        alimento.nombre;

    document.getElementById("editarCategoria").value =
        alimento.categoria;

    document.getElementById("editarUnidad").value =
        alimento.unidad;

    document.getElementById("editarCalorias").value =
        alimento.calorias;

    document.getElementById("editarProteina").value =
        alimento.proteina;

    document.getElementById("editarCarbohidratos").value =
        alimento.carbohidratos;

    document.getElementById("editarGrasas").value =
        alimento.grasas;

    document.getElementById("formularioEdicion").style.display =
        "block";

}


function guardarEdicionAlimento() {
    const id = document.getElementById("alimentoEditar").value;

    if (!id || !id.startsWith("personalizado_")) {
        alert("Selecciona un alimento personalizado para editar.");
        return;
    }

    const nombre =
        document.getElementById("editarNombre").value.trim();

    const categoria =
        document.getElementById("editarCategoria").value;

    const unidad =
        document.getElementById("editarUnidad").value;

    const camposNumericos = [
        { id: "editarCalorias", nombre: "calorías" },
        { id: "editarProteina", nombre: "proteína" },
        { id: "editarCarbohidratos", nombre: "carbohidratos" },
        { id: "editarGrasas", nombre: "grasas" }
    ];

    if (!nombre || !categoria || !unidad) {
        alert("Completa el nombre, la categoría y la unidad.");
        return;
    }

    if (nombre.length > 100) {
        alert("El nombre no puede superar los 100 caracteres.");
        return;
    }

    if (!["100g", "pieza", "2piezas"].includes(unidad)) {
        alert("Selecciona una unidad válida.");
        return;
    }

    if (!obtenerCategoriasGuardadas().includes(categoria)) {
        alert("Selecciona una categoría existente.");
        return;
    }

    const valores = {};

    for (const campo of camposNumericos) {
        const texto =
            document.getElementById(campo.id).value.trim();

        if (texto === "") {
            alert(`Completa el campo de ${campo.nombre}.`);
            return;
        }

        const numero = Number(texto);

        if (!Number.isFinite(numero) || numero < 0) {
            alert(
                `El valor de ${campo.nombre} debe ser un número válido no negativo.`
            );
            return;
        }

        valores[campo.nombre] = numero;
    }

    let alimentosGuardados;

    try {
        alimentosGuardados =
            leerAlimentosPersonalizadosGuardados();
    } catch (error) {
        console.error("No se pudieron leer los alimentos:", error);
        alert(
            "No se pudieron leer los alimentos guardados. " +
            "No se modificaron los datos."
        );
        return;
    }

    if (!alimentosGuardados[id]) {
        alert(
            "No se encontró el alimento personalizado guardado. " +
            "Recarga la aplicación y vuelve a intentarlo."
        );
        return;
    }

    const alimentoActualizado = {
        nombre,
        categoria,
        unidad,
        calorias: valores.calorías,
        proteina: valores.proteína,
        carbohidratos: valores.carbohidratos,
        grasas: valores.grasas
    };

    alimentosGuardados[id] = alimentoActualizado;

    try {
        localStorage.setItem(
            "misAlimentos",
            JSON.stringify(alimentosGuardados)
        );
    } catch (error) {
        console.error("No se pudo guardar la edición:", error);
        alert(
            "No se pudo guardar la edición. " +
            "Comprueba el espacio disponible en el navegador."
        );
        return;
    }

    // Actualizar el objeto activo después de confirmar el guardado.
    alimentos[id] = alimentoActualizado;

    cargarAlimentosParaEliminar();
    cargarAlimentosParaEditar();

    document.getElementById("formularioEdicion").style.display = "none";

    if (categoriaSelect.value === categoria) {
        cargarAlimentos();
    }

    alert("¡Alimento actualizado correctamente! 🔥");
}

// ==========================================
// ELIMINAR ALIMENTO PERSONALIZADO
// ==========================================

function eliminarAlimentoPersonalizado() {

    const select =
        document.getElementById(
            "alimentoEliminar"
        );


    if (!select) {
        return;
    }


    const id =
        select.value;


    if (!id) {

        alert(
            "Selecciona un alimento para eliminar."
        );

        return;
    }


    const alimentosGuardados =
        JSON.parse(
            localStorage.getItem(
                "misAlimentos"
            )
        ) || {};


    const alimento =
        alimentosGuardados[id];


    if (!alimento) {

        alert(
            "No se encontró el alimento."
        );

        return;
    }


    const confirmar =
        confirm(
            `¿Seguro que quieres eliminar "${alimento.nombre}"?`
        );


    if (!confirmar) {
        return;
    }


    delete alimentosGuardados[id];


    localStorage.setItem(
        "misAlimentos",
        JSON.stringify(
            alimentosGuardados
        )
    );


    delete alimentos[id];


    cargarCategorias();

    cargarAlimentosParaEliminar();


    alimentoSelect.innerHTML =
        '<option value="">Selecciona un alimento</option>';


    unidadSpan.textContent =
        "g";
alert(
        "Alimento eliminado correctamente. 🗑️"
    );
}


// ==========================================
// INICIAR APLICACIÓN
// ==========================================

cargarAlimentosGuardados();

cargarCategorias();



cargarMetasGuardadas();

cargarComidaGuardada();

cargarAlimentosParaEliminar();

cargarAlimentosParaEditar();

inicializarSelectorFecha();
inicializarCalendarioMensual();



// ==========================================
// EVENTOS
// ==========================================

if (categoriaSelect) {

    categoriaSelect.addEventListener(
        "change",
        cargarAlimentos
    );
}
if (buscarAlimentoInput) {
    buscarAlimentoInput.addEventListener(
        "input",
        cargarAlimentos
    );
}


if (alimentoSelect) {

    alimentoSelect.addEventListener(
        "change",
        actualizarUnidad
    );
}


if (btnCalcularMacros) {

    btnCalcularMacros.addEventListener(
        "click",
        calcularMacrosAutomaticamente
    );
}


const btnCalcular =
    document.getElementById(
        "btnCalcular"
    );


if (btnCalcular) {

    btnCalcular.addEventListener(
        "click",
        calcularMacros
    );
}


const btnAgregar =
    document.getElementById(
        "btnAgregar"
    );


if (btnAgregar) {

    btnAgregar.addEventListener(
        "click",
        agregarAlimento
    );
}


const btnGuardarAlimento =
    document.getElementById(
        "btnGuardarAlimento"
    );


if (btnGuardarAlimento) {

    btnGuardarAlimento.addEventListener(
        "click",
        guardarNuevoAlimento
    );
}


const btnEliminarAlimento =
    document.getElementById(
        "btnEliminarAlimento"
    );


if (btnEliminarAlimento) {

    btnEliminarAlimento.addEventListener(
        "click",
        eliminarAlimentoPersonalizado
    );
}
const btnEditarAlimento =
    document.getElementById("btnEditarAlimento");

if (btnEditarAlimento) {
    btnEditarAlimento.addEventListener(
        "click",
        editarAlimentoPersonalizado
    );
}

const btnGuardarEdicion =
    document.getElementById("btnGuardarEdicion");

if (btnGuardarEdicion) {
    btnGuardarEdicion.addEventListener(
        "click",
        guardarEdicionAlimento
    );
}

const btnCrearCategoria = document.getElementById("btnCrearCategoria");

if (btnCrearCategoria) {
    btnCrearCategoria.addEventListener("click", crearCategoria);
}

const btnEditarCategoria = document.getElementById("btnEditarCategoria");

if (btnEditarCategoria) {
    btnEditarCategoria.addEventListener("click", editarCategoria);
}

const btnEliminarCategoria = document.getElementById("btnEliminarCategoria");

if (btnEliminarCategoria) {
    btnEliminarCategoria.addEventListener("click", eliminarCategoria);
}



const btnMoverAlimentos = document.getElementById("btnMoverAlimentos");

if (btnMoverAlimentos) {
    btnMoverAlimentos.addEventListener(
        "click",
        moverAlimentosYEliminarCategoria
    );
}

/* =====================================
   NAVEGACIÓN ENTRE LAS CINCO VISTAS
===================================== */

function mostrarVista(vistaSeleccionada) {
    const contenidos = document.querySelectorAll(
        "[data-vista-contenido]"
    );

    contenidos.forEach(elemento => {
        elemento.hidden =
            elemento.dataset.vistaContenido !== vistaSeleccionada;
    });

    const enlaces = document.querySelectorAll(
        ".navegacion-rapida a[data-vista]"
    );

    enlaces.forEach(enlace => {
        const activa =
            enlace.dataset.vista === vistaSeleccionada;

        if (activa) {
            enlace.setAttribute("aria-current", "page");
        } else {
            enlace.removeAttribute("aria-current");
        }
    });

    if (vistaSeleccionada === "historial") {
        if (typeof renderizarCalendario === "function") {
            renderizarCalendario();
        }

        if (typeof actualizarResumenHistorico === "function") {
            actualizarResumenHistorico();
        }
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

document.querySelectorAll(
    ".navegacion-rapida a[data-vista]"
).forEach(enlace => {
    enlace.addEventListener("click", evento => {
        evento.preventDefault();
        mostrarVista(enlace.dataset.vista);
    });
});

// Vista inicial de la aplicación.
mostrarVista("inicio");

/* =====================================
   BOTÓN FLOTANTE: VOLVER AL INICIO
===================================== */

(() => {
    const boton = document.getElementById("btnVolverArriba");

    if (!boton) return;

    function actualizarBoton() {
        boton.classList.toggle("visible", window.scrollY > 350);
    }

    window.addEventListener("scroll", actualizarBoton, {
        passive: true
    });

    boton.addEventListener("click", () => {
        mostrarVista("inicio");
    });

    actualizarBoton();
})();

function alternarComida(idContenido, boton) {
    const contenido = document.getElementById(idContenido);

    if (!contenido || !boton) return;

    const estaAbierto = boton.getAttribute("aria-expanded") === "true";

    boton.setAttribute("aria-expanded", String(!estaAbierto));
    contenido.hidden = estaAbierto;
}



function actualizarMensajeInteligente({
    calorias,
    proteina,
    carbohidratos,
    grasas,
    metaCalorias,
    metaProteina,
    metaCarbohidratos,
    metaGrasas
}) {
    const tarjeta = document.getElementById("mensajeInteligente");
    const icono = document.getElementById("mensajeIcono");
    const titulo = document.getElementById("mensajeTitulo");
    const texto = document.getElementById("mensajeTexto");

    if (!tarjeta || !icono || !titulo || !texto) return;

    const alimentosRegistrados = Array.isArray(comida)
        ? comida.filter(item => {
            const fechaItem = item.fecha || fechaSeleccionada;
            return fechaItem === fechaSeleccionada;
        }).length
        : 0;

    let nuevoIcono = "💙";
    let nuevoTitulo = "¡Vamos paso a paso!";
    let nuevoTexto = "Registra tus alimentos para comenzar a ver tu progreso.";
    let estado = "";

    if (alimentosRegistrados === 0) {
        nuevoIcono = "🍽️";
        nuevoTitulo = "¡Tu día comienza aquí!";
        nuevoTexto = "Agrega tus alimentos para consultar tu consumo y compararlo con tus metas.";
    } else {
        const metasConfiguradas = [
            metaCalorias,
            metaProteina,
            metaCarbohidratos,
            metaGrasas
        ].filter(meta => meta > 0).length;

        if (metasConfiguradas === 0) {
            nuevoIcono = "🎯";
            nuevoTitulo = "¡Ya tienes alimentos registrados!";
            nuevoTexto = `Llevas ${alimentosRegistrados} alimento(s). Configura tus metas para consultar tu progreso.`;
        } else {
            const metas = [
                { nombre: "calorías", consumo: calorias, meta: metaCalorias },
                { nombre: "proteína", consumo: proteina, meta: metaProteina },
                { nombre: "carbohidratos", consumo: carbohidratos, meta: metaCarbohidratos },
                { nombre: "grasas", consumo: grasas, meta: metaGrasas }
            ].filter(item => item.meta > 0);

const macros = metas.filter(item =>
    ["proteína", "carbohidratos", "grasas"].includes(item.nombre)
);

const macrosOrdenados = [...macros].sort((a, b) => {
    const progresoA = a.consumo / a.meta;
    const progresoB = b.consumo / b.meta;

    return progresoA - progresoB;
});

const macroMasAlejado = macrosOrdenados[0];

const porcentajeMacroMasAlejado = macroMasAlejado
    ? (macroMasAlejado.consumo / macroMasAlejado.meta) * 100
    : 0;


            const superadas = metas.filter(item =>
                item.consumo > item.meta * 1.005
            );

            const alcanzadas = metas.filter(item =>
                item.consumo >= item.meta * 0.995 &&
                item.consumo <= item.meta * 1.005
            );

            const cercanas = metas.filter(item =>
                item.consumo >= item.meta * 0.8 &&
                item.consumo < item.meta * 0.995
            );

            if (superadas.length > 0) {
                nuevoIcono = "📊";
                nuevoTitulo = "Revisa tu progreso";
                nuevoTexto = `Has superado al menos una de tus metas: ${superadas.map(item => item.nombre).join(", ")}. Puedes revisar el detalle en tu dashboard.`;
                estado = "estado-atencion";
            } else if (alcanzadas.length === metas.length) {
                nuevoIcono = "🏆";
                nuevoTitulo = "¡Todas tus metas están alcanzadas!";
                nuevoTexto = "Tus consumos están dentro del margen de tus objetivos diarios configurados.";
                estado = "estado-logrado";
            } else if (cercanas.length > 0) {
                nuevoIcono = "🔥";
                nuevoTitulo = "¡Vas avanzando muy bien!";
                nuevoTexto = `Estás cerca de tu meta de ${cercanas[0].nombre}. Sigue consultando tu progreso durante el día.`;

} else {
    nuevoIcono = "💙";
    nuevoTitulo = "¡Cada registro cuenta!";

    if (macroMasAlejado) {
        const porcentajeVisible = Math.round(
            porcentajeMacroMasAlejado
        );

        const nombreMacro = macroMasAlejado.nombre;
        const restante = Math.max(
            0,
            macroMasAlejado.meta - macroMasAlejado.consumo
        );

        nuevoTexto =
            `Llevas ${alimentosRegistrados} alimento(s) registrado(s). ` +
            `Tu macro más alejado de su meta es ${nombreMacro}: ` +
            `${porcentajeVisible}% completado. ` +
            `La diferencia con tu objetivo es de ${restante.toFixed(2)} g.`;
    } else {
        nuevoTexto =
            `Llevas ${alimentosRegistrados} alimento(s) registrado(s). ` +
            `Consulta las barras para ver cuánto te falta para tus metas.`;
    }
}

        }
    }

    icono.textContent = nuevoIcono;
    titulo.textContent = nuevoTitulo;
    texto.textContent = nuevoTexto;

    tarjeta.classList.remove("estado-logrado", "estado-atencion");

    if (estado) {
        tarjeta.classList.add(estado);
    }
}

function inicializarNavegacionHistorial() {
    const selector = document.getElementById("selectorFecha");
    const textoFecha = document.getElementById("fechaActualTexto");
    const botonHoy = document.getElementById("btnVolverHoy");
    const botonAnterior = document.getElementById("btnDiaAnterior");
    const botonSiguiente = document.getElementById("btnDiaSiguiente");

    if (!selector) return;

    const hoy = () => {
        const fecha = new Date();
        const anio = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const dia = String(fecha.getDate()).padStart(2, "0");

        return `${anio}-${mes}-${dia}`;
    };

    const actualizarTextoFecha = () => {
        if (!textoFecha) return;

        const fecha = selector.value || fechaSeleccionada;
        const [anio, mes, dia] = fecha.split("-").map(Number);
        const fechaLocal = new Date(anio, mes - 1, dia);

        const fechaBonita = fechaLocal.toLocaleDateString("es-MX", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        const registros = Array.isArray(historialComidas[fecha])
            ? historialComidas[fecha].length
            : 0;

        textoFecha.textContent =
            `${fechaBonita.charAt(0).toUpperCase()}${fechaBonita.slice(1)} · ` +
            `${registros} alimento(s) registrado(s)`;
    };

    const seleccionarFecha = (fecha) => {
        if (!fecha) return;

        selector.value = fecha;
        cargarComidasPorFecha(fecha);
        actualizarTextoFecha();
    };

    selector.addEventListener("change", () => {
        seleccionarFecha(selector.value);
    });

    botonHoy?.addEventListener("click", () => {
        seleccionarFecha(hoy());
    });

    botonAnterior?.addEventListener("click", () => {
        const fechaActual = selector.value || fechaSeleccionada;
        const [anio, mes, dia] = fechaActual.split("-").map(Number);
        const fecha = new Date(anio, mes - 1, dia);

        fecha.setDate(fecha.getDate() - 1);

        const nuevaFecha = [
            fecha.getFullYear(),
            String(fecha.getMonth() + 1).padStart(2, "0"),
            String(fecha.getDate()).padStart(2, "0")
        ].join("-");

        seleccionarFecha(nuevaFecha);
    });

    botonSiguiente?.addEventListener("click", () => {
        const fechaActual = selector.value || fechaSeleccionada;
        const [anio, mes, dia] = fechaActual.split("-").map(Number);
        const fecha = new Date(anio, mes - 1, dia);

        fecha.setDate(fecha.getDate() + 1);

        const nuevaFecha = [
            fecha.getFullYear(),
            String(fecha.getMonth() + 1).padStart(2, "0"),
            String(fecha.getDate()).padStart(2, "0")
        ].join("-");

        seleccionarFecha(nuevaFecha);
    });

    selector.value = fechaSeleccionada || hoy();
    actualizarTextoFecha();
}

function actualizarResumenHistorico() {
    const obtenerNumero = (id) => {
        const elemento = document.getElementById(id);
        if (!elemento) return 0;

        const numero = Number(elemento.textContent);
        return Number.isFinite(numero) ? numero : 0;
    };

    const mostrar = (id, valor) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = valor;
    };

    const fecha = fechaSeleccionada || "";
    const [anio, mes, dia] = fecha.split("-");

    const fechaBonita = anio && mes && dia
        ? new Date(Number(anio), Number(mes) - 1, Number(dia))
            .toLocaleDateString("es-MX", {
                day: "numeric",
                month: "long",
                year: "numeric"
            })
        : "Fecha no disponible";

    const cantidad = Array.isArray(comida) ? comida.length : 0;

    mostrar("resumenHistoricoFecha", fechaBonita);
    mostrar("resumenHistoricoCantidad", String(cantidad));

    const datos = [
        {
            id: "Calorias",
            total: obtenerNumero("totalCalorias"),
            meta: Number(metas.calorias) || 0,
            unidad: "kcal"
        },
        {
            id: "Proteina",
            total: obtenerNumero("totalProteina"),
            meta: Number(metas.proteina) || 0,
            unidad: "g"
        },
        {
            id: "Carbohidratos",
            total: obtenerNumero("totalCarbohidratos"),
            meta: Number(metas.carbohidratos) || 0,
            unidad: "g"
        },
        {
            id: "Grasas",
            total: obtenerNumero("totalGrasas"),
            meta: Number(metas.grasas) || 0,
            unidad: "g"
        }
    ];

    datos.forEach(dato => {
        mostrar(
            `resumenHistorico${dato.id}`,
            `${dato.total.toFixed(2)} ${dato.unidad}`
        );

        mostrar(
            `resumenHistoricoMeta${dato.id}`,
            dato.meta > 0
                ? `Meta: ${dato.meta.toFixed(2)} ${dato.unidad}`
                : "Sin meta configurada"
        );
    });
}

/* ========================================
   CALENDARIO MENSUAL INTERACTIVO
======================================== */


// Formato de fecha: YYYY-MM-DD
function fechaCalendarioISO(anio, mes, dia) {
    return [
        anio,
        String(mes).padStart(2, "0"),
        String(dia).padStart(2, "0")
    ].join("-");
}

var fechaMesCalendario = null;


// Genera los días del mes y los conecta con el historial.
function renderizarCalendario() {
    const contenedor = document.getElementById("calendarioDias");
    const titulo = document.getElementById("calendarioMesAnio");

    if (!contenedor || !titulo) return;

    if (!(fechaMesCalendario instanceof Date) ||
    Number.isNaN(fechaMesCalendario.getTime())) {

    const fecha = fechaSeleccionada || obtenerFechaHoy();
    const [anioInicial, mesInicial] = fecha.split("-").map(Number);

    fechaMesCalendario = new Date(
        anioInicial,
        mesInicial - 1,
        1
    );
}

const anio = fechaMesCalendario.getFullYear();
const mes = fechaMesCalendario.getMonth();

    titulo.textContent = fechaMesCalendario.toLocaleDateString(
        "es-MX",
        { month: "long", year: "numeric" }
    );

    contenedor.replaceChildren();

    const primerDia = new Date(anio, mes, 1).getDay();
    const espaciosIniciales = (primerDia + 6) % 7;
    const diasDelMes = new Date(anio, mes + 1, 0).getDate();

    // Espacios vacíos antes del primer día del mes.
    for (let i = 0; i < espaciosIniciales; i++) {
        const espacio = document.createElement("span");
        espacio.className = "calendario-dia-vacio";
        espacio.setAttribute("aria-hidden", "true");
        contenedor.appendChild(espacio);
    }

    const hoy = obtenerFechaHoy();

    for (let dia = 1; dia <= diasDelMes; dia++) {
        const fecha = fechaCalendarioISO(anio, mes + 1, dia);
        const boton = document.createElement("button");

        boton.type = "button";
        boton.className = "calendario-dia";

        const numero = document.createElement("span");
        numero.className = "calendario-dia-numero";
        numero.textContent = dia;
        boton.appendChild(numero);

        // Un día cuenta como registrado si tiene alimentos.
        const tieneRegistros =
            Array.isArray(historialComidas[fecha]) &&
            historialComidas[fecha].length > 0;

        if (tieneRegistros) {
            boton.classList.add("registro-dia");
            boton.setAttribute("aria-label", `${dia}, con registros`);
        } else {
            boton.setAttribute("aria-label", String(dia));
        }

        if (fecha === hoy) {
            boton.classList.add("calendario-dia-hoy");
        }

        if (fecha === fechaSeleccionada) {
            boton.classList.add("seleccionado");
            boton.setAttribute("aria-pressed", "true");
        } else {
            boton.setAttribute("aria-pressed", "false");
        }

        boton.addEventListener("click", () => {
            // Usa la función existente para cargar el día.
            cargarComidasPorFecha(fecha);

            // Sincroniza el selector de fecha que ya tienes.
            const selector = document.getElementById("selectorFecha");
            if (selector) selector.value = fecha;

            // Actualiza el texto del historial.
            const textoFecha = document.getElementById("fechaActualTexto");
            if (textoFecha) {
                textoFecha.textContent = new Date(
                    anio, mes, dia
                ).toLocaleDateString("es-MX", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                });
            }

            // Refresca la selección y los registros visibles.
            renderizarCalendario();
        });

        contenedor.appendChild(boton);
    }
    mostrarEstadisticasMensuales();
    mostrarGraficaCalorias();
}


// Cambia el mes mostrado.
function cambiarMesCalendario(cantidad) {
    // Asegura que la fecha esté inicializada.
    if (!(fechaMesCalendario instanceof Date) ||
        Number.isNaN(fechaMesCalendario.getTime())) {

        renderizarCalendario();
    }

    // Si sigue sin ser una fecha válida, no continúa.
    if (!(fechaMesCalendario instanceof Date) ||
        Number.isNaN(fechaMesCalendario.getTime())) {
        console.error("No se pudo inicializar la fecha del calendario.");
        return;
    }

    fechaMesCalendario = new Date(
        fechaMesCalendario.getFullYear(),
        fechaMesCalendario.getMonth() + cantidad,
        1
    );

    renderizarCalendario();
}

// Conecta las flechas e inicia el calendario.
function inicializarCalendarioMensual() {
    const anterior = document.getElementById("btnMesAnterior");
    const siguiente = document.getElementById("btnMesSiguiente");

    if (anterior && anterior.dataset.calendarioConectado !== "true") {
        anterior.addEventListener("click", () => {
            cambiarMesCalendario(-1);
        });
        anterior.dataset.calendarioConectado = "true";
    }

    if (siguiente && siguiente.dataset.calendarioConectado !== "true") {
        siguiente.addEventListener("click", () => {
            cambiarMesCalendario(1);
        });
        siguiente.dataset.calendarioConectado = "true";
    }

    renderizarCalendario();
}

function mostrarGraficaCalorias() {
    // Comprobar que el mes del calendario esté inicializado.
    if (
        !(fechaMesCalendario instanceof Date) ||
        Number.isNaN(fechaMesCalendario.getTime())
    ) {
        return;
    }

    const anio = fechaMesCalendario.getFullYear();
    const mes = fechaMesCalendario.getMonth();

    const contenedor = document.getElementById("graficaCalorias");
    const textoMes = document.getElementById("graficaMesTexto");

    if (!contenedor || !textoMes) return;

    // Mostrar el mes seleccionado.
    textoMes.textContent = fechaMesCalendario.toLocaleDateString("es-MX", {
        month: "long",
        year: "numeric"
    });

    // Limpiar las barras anteriores.
    contenedor.replaceChildren();

    // Obtener la cantidad de días del mes.
    const diasDelMes = new Date(anio, mes + 1, 0).getDate();

    // Calcular las calorías registradas para cada día.
    const caloriasPorDia = [];

    for (let dia = 1; dia <= diasDelMes; dia++) {
        const fecha = [
            anio,
            String(mes + 1).padStart(2, "0"),
            String(dia).padStart(2, "0")
        ].join("-");

        const alimentosDelDia = historialComidas[fecha];

        let totalCalorias = 0;

        if (Array.isArray(alimentosDelDia)) {
            alimentosDelDia.forEach(item => {
                totalCalorias += Number(item.calorias) || 0;
            });
        }

        caloriasPorDia.push({
            dia,
            calorias: totalCalorias
        });
    }

    // Escala de las barras: la más alta representa el máximo del mes.
    const maxCalorias = Math.max(
        ...caloriasPorDia.map(item => item.calorias),
        1
    );

    const formatoNumero = valor =>
        valor.toLocaleString("es-MX", {
            maximumFractionDigits: 2
        });

    // Crear una barra por cada día del mes.
    caloriasPorDia.forEach(item => {
        const fila = document.createElement("div");
        fila.className = "grafica-fila";

        const etiquetaDia = document.createElement("span");
        etiquetaDia.className = "grafica-dia";
        etiquetaDia.textContent = item.dia;

        const fondoBarra = document.createElement("div");
        fondoBarra.className = "grafica-barra-fondo";

        const barra = document.createElement("div");
        barra.className = "grafica-barra";

        const porcentaje =
            item.calorias > 0
                ? (item.calorias / maxCalorias) * 100
                : 0;

        barra.style.width = `${porcentaje}%`;

        // Accesibilidad: describir el valor de la barra.
        barra.setAttribute(
            "aria-label",
            `${item.dia}: ${formatoNumero(item.calorias)} kcal`
        );

        fondoBarra.appendChild(barra);

        const valor = document.createElement("span");
        valor.className = "grafica-valor";
        valor.textContent = formatoNumero(item.calorias);

        fila.appendChild(etiquetaDia);
        fila.appendChild(fondoBarra);
        fila.appendChild(valor);

        contenedor.appendChild(fila);
    });
}
