/*
=========================================
 CANCHA SINTÉTICA VARSOVIA
 GESTIÓN DE RESERVAS (ADMIN)
=========================================
*/


import { db, auth } from "../../firebase/config.js";


import {
collection,
getDocs,
doc,
updateDoc,
deleteDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";



function esperarSesion(){


return new Promise(
(resolve)=>{


onAuthStateChanged(
auth,
(user)=>resolve(user)
);


}
);


}



document.addEventListener(
"DOMContentLoaded",
async ()=>{


// comprobar sesión

let usuario =
await esperarSesion();



if(!usuario){


window.location.href="login.html";


return;


}



const salir =
document.querySelector(
'a[href="../index.html"]'
);


if(salir){


salir.addEventListener(
"click",
async (e)=>{


e.preventDefault();



await signOut(auth);



window.location.href =
"../index.html";


});


}





const tabla =
document.getElementById(
"tablaReservas"
);


const buscador =
document.getElementById(
"buscarReserva"
);


const filtroEstado =
document.getElementById(
"filtroEstado"
);


const filtroFecha =
document.getElementById(
"filtroFecha"
);


const totalPendientesEl =
document.getElementById(
"totalPendientes"
);


const totalConfirmadasEl =
document.getElementById(
"totalConfirmadas"
);


const totalHoyEl =
document.getElementById(
"totalHoy"
);



let reservas = [];




// ===============================
// CARGAR RESERVAS
// ===============================


async function cargarReservas(){


const datos =
await getDocs(
collection(db,"reservas")
);



reservas=[];



datos.forEach(
(documento)=>{


let r =
documento.data();


r.id =
documento.id;


reservas.push(r);


});




// ordenar por fecha y hora


reservas.sort(
(a,b)=>{


let claveA =
(a.fecha||"")+" "+(a.hora||"");


let claveB =
(b.fecha||"")+" "+(b.hora||"");


return claveA.localeCompare(claveB);


}
);



actualizarResumen();


aplicarFiltros();


}





// ===============================
// RESUMEN
// ===============================


function actualizarResumen(){


let hoy =
new Date()
.toISOString()
.split("T")[0];



let pendientes =
reservas.filter(
(r)=>r.estado==="Pendiente"
).length;


let confirmadas =
reservas.filter(
(r)=>r.estado==="Confirmada"
).length;


let deHoy =
reservas.filter(
(r)=>r.fecha===hoy && r.estado!=="Cancelada"
).length;



totalPendientesEl.textContent =
pendientes;


totalConfirmadasEl.textContent =
confirmadas;


totalHoyEl.textContent =
deHoy;


}





// ===============================
// COLOR SEGÚN ESTADO
// ===============================


function colorEstado(estado){


if(estado==="Confirmada"){

return "success";

}


if(estado==="Cancelada"){

return "danger";

}


return "warning";


}





// ===============================
// MOSTRAR RESERVA
// ===============================


function mostrarReserva(r){


tabla.innerHTML += `


<tr>


<td>

<b>${r.nombre || "-"}</b>

</td>




<td>

${r.telefono || "-"}

</td>




<td>

${r.fecha || "-"}

</td>




<td>

${r.horaInicio || "-"} - ${r.horaFin || "-"}

</td>




<td>

Q${r.total || 0}

</td>




<td>

<span class="badge bg-${colorEstado(r.estado)}">

${r.estado || "Pendiente"}

</span>

</td>




<td>


<div class="d-flex gap-1 flex-wrap">


<button

class="btn btn-success btn-sm"

${r.estado==="Confirmada" ? "disabled" : ""}

onclick="confirmarReserva('${r.id}')">


<i class="fa fa-check"></i>

Confirmar

</button>




<button

class="btn btn-outline-danger btn-sm"

${r.estado==="Cancelada" ? "disabled" : ""}

onclick="cancelarReserva('${r.id}')">


<i class="fa fa-xmark"></i>

Cancelar

</button>




<button

class="btn btn-danger btn-sm"

onclick="eliminarReserva('${r.id}')">


<i class="fa fa-trash"></i>

</button>


</div>


</td>



</tr>


`;



}





// ===============================
// APLICAR FILTROS
// ===============================


function aplicarFiltros(){


tabla.innerHTML="";



let texto =
buscador.value.toLowerCase();


let estado =
filtroEstado.value;


let fecha =
filtroFecha.value;



let resultado =
reservas.filter(
(r)=>{


let coincideTexto =
(r.nombre || "")
.toLowerCase()
.includes(texto);



let coincideEstado =
estado==="todos"
||
r.estado===estado;



let coincideFecha =
!fecha
||
r.fecha===fecha;



return coincideTexto && coincideEstado && coincideFecha;


}
);




if(resultado.length===0){


tabla.innerHTML = `

<tr>

<td colspan="7" class="text-center text-muted py-4">

No hay reservas que coincidan

</td>

</tr>

`;


return;

}




resultado.forEach(
(r)=>{


mostrarReserva(r);


}
);


}





// ===============================
// CONFIRMAR RESERVA
// ===============================


window.confirmarReserva =
async function(id){


await updateDoc(

doc(
db,
"reservas",
id
),

{

estado:"Confirmada"

}

);



cargarReservas();


};





// ===============================
// CANCELAR RESERVA
// ===============================


window.cancelarReserva =
async function(id){


if(!confirm(
"¿Cancelar esta reserva?"
)){


return;


}



await updateDoc(

doc(
db,
"reservas",
id
),

{

estado:"Cancelada"

}

);



cargarReservas();


};





// ===============================
// ELIMINAR RESERVA
// ===============================


window.eliminarReserva =
async function(id){


if(!confirm(
"¿Eliminar esta reserva? Esta acción no se puede deshacer."
)){


return;


}



await deleteDoc(

doc(
db,
"reservas",
id
)

);



cargarReservas();


};





// ===============================
// EVENTOS DE FILTRO
// ===============================


buscador.addEventListener(
"input",
aplicarFiltros
);


filtroEstado.addEventListener(
"change",
aplicarFiltros
);


filtroFecha.addEventListener(
"change",
aplicarFiltros
);





// iniciar

cargarReservas();



});