// =========================================
// CLIENTES - PANEL ADMINISTRADOR
// CANCHA SINTÉTICA VARSOVIA
// =========================================


// Firebase
import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";


// Configuración Firebase
import { db } from "./firebase.js";


// =========================================
// VARIABLES
// =========================================

let clientes = [];


// =========================================
// ELEMENTOS HTML
// =========================================

const tablaClientes =
    document.getElementById("tablaClientes");

const totalClientes =
    document.getElementById("totalClientes");

const buscarCliente =
    document.getElementById("buscarCliente");


// =========================================
// CARGAR CLIENTES
// =========================================

async function cargarClientes() {

    try {

        console.log("Cargando clientes...");


        const clientesRef =
            collection(db, "clientes");


        // Intentar ordenar por fecha
        let snapshot;

        try {

            const consulta =
                query(
                    clientesRef,
                    orderBy("fechaRegistro", "desc")
                );

            snapshot = await getDocs(consulta);

        } catch (error) {

            console.warn(
                "No se pudo ordenar por fecha. Cargando normalmente..."
            );

            snapshot =
                await getDocs(clientesRef);
        }


        clientes = [];


        snapshot.forEach((documento) => {

            const datos =
                documento.data();


            clientes.push({

                id: documento.id,

                ...datos

            });

        });


        console.log(
            "Clientes encontrados:",
            clientes.length
        );


        totalClientes.textContent =
            clientes.length;


        mostrarClientes(clientes);


    } catch (error) {

        console.error(
            "Error cargando clientes:",
            error
        );


        tablaClientes.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="text-center text-danger"
                >

                    <i class="fa-solid fa-triangle-exclamation"></i>

                    <br>

                    No se pudieron cargar los clientes.

                    <br>

                    <small>
                        ${error.message}
                    </small>

                </td>

            </tr>

        `;

    }

}


// =========================================
// MOSTRAR CLIENTES
// =========================================

function mostrarClientes(lista) {

    tablaClientes.innerHTML = "";


    // No hay clientes
    if (lista.length === 0) {

        tablaClientes.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="text-center text-muted"
                >

                    <i
                        class="fa-solid fa-users-slash fa-2x mb-2"
                    ></i>

                    <br>

                    No hay clientes registrados.

                </td>

            </tr>

        `;

        return;

    }


    lista.forEach((cliente, indice) => {

        const fila =
            document.createElement("tr");


        // Nombre
        const nombre =
            cliente.nombre ||
            cliente.name ||
            "Sin nombre";


        // Correo
        const correo =
            cliente.correo ||
            cliente.email ||
            "Sin correo";


        // Teléfono
        const telefono =
            cliente.telefono ||
            cliente.phone ||
            "Sin teléfono";


        // Fecha
        const fecha =
            formatearFecha(
                cliente.fechaRegistro
            );


        fila.innerHTML = `

            <td>
                ${indice + 1}
            </td>

            <td>

                <strong>
                    ${escaparHTML(nombre)}
                </strong>

            </td>

            <td>

                <a
                    href="mailto:${escaparHTML(correo)}"
                >
                    ${escaparHTML(correo)}
                </a>

            </td>

            <td>

                ${escaparHTML(telefono)}

            </td>

            <td>

                ${fecha}

            </td>

        `;


        tablaClientes.appendChild(fila);

    });

}


// =========================================
// BUSCAR CLIENTES
// =========================================

buscarCliente.addEventListener(
    "input",
    () => {

        const texto =
            buscarCliente.value
                .toLowerCase()
                .trim();


        if (texto === "") {

            mostrarClientes(clientes);

            return;

        }


        const resultados =
            clientes.filter((cliente) => {

                const nombre =
                    String(
                        cliente.nombre ||
                        cliente.name ||
                        ""
                    ).toLowerCase();


                const correo =
                    String(
                        cliente.correo ||
                        cliente.email ||
                        ""
                    ).toLowerCase();


                const telefono =
                    String(
                        cliente.telefono ||
                        cliente.phone ||
                        ""
                    ).toLowerCase();


                return (

                    nombre.includes(texto) ||

                    correo.includes(texto) ||

                    telefono.includes(texto)

                );

            });


        mostrarClientes(resultados);

    }
);


// =========================================
// FORMATEAR FECHA
// =========================================

function formatearFecha(fecha) {

    if (!fecha) {

        return "Sin fecha";

    }


    try {

        // Timestamp de Firebase
        if (
            typeof fecha.toDate === "function"
        ) {

            fecha =
                fecha.toDate();

        }


        const fechaConvertida =
            new Date(fecha);


        if (
            isNaN(
                fechaConvertida.getTime()
            )
        ) {

            return "Sin fecha";

        }


        return fechaConvertida.toLocaleDateString(
            "es-GT",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

    } catch (error) {

        return "Sin fecha";

    }

}


// =========================================
// EVITAR HTML INYECTADO
// =========================================

function escaparHTML(texto) {

    return String(texto)

        .replace(/&/g, "&amp;")

        .replace(/</g, "&lt;")

        .replace(/>/g, "&gt;")

        .replace(/"/g, "&quot;")

        .replace(/'/g, "&#039;");

}


// =========================================
// INICIAR
// =========================================

cargarClientes();
