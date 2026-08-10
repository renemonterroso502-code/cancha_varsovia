/*
=========================================
 CANCHA SINTÉTICA VARSOVIA
 RESERVAS CLIENTE
=========================================
*/


import { db } from "../firebase/config.js";

import { avisarAdmin } from "../js/notificar_whatsapp.js";

import { iniciarSesionYRegistrarCliente } from "../js/auth-cliente.js";


import {
collection,
addDoc,
serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



// Precio único, una sola cancha

const PRECIO_HORA = 250;



const formulario =
document.getElementById("reservaForm");


const inputFecha =
document.getElementById("fecha");


const selectInicio =
document.getElementById("horaInicio");


const selectFin =
document.getElementById("horaFin");


const precioTexto =
document.getElementById("precioTotal");




// ===============================
// FECHA MÍNIMA = HOY
// ===============================


const hoy =
new Date()
.toISOString()
.split("T")[0];


inputFecha.min = hoy;





// ===============================
// GENERAR HORARIOS (7:00 a 23:00)
// Horario del negocio: 7:00 am - 11:00 pm
// ===============================


for(let h=7; h<=23; h++){


let etiqueta =
String(h).padStart(2,"0")+":00";



let opcion1 =
document.createElement("option");


opcion1.value = h;

opcion1.textContent = etiqueta;


selectInicio.appendChild(opcion1);




let opcion2 =
document.createElement("option");


opcion2.value = h;

opcion2.textContent = etiqueta;


selectFin.appendChild(opcion2);


}





// ===============================
// CALCULAR TOTAL SEGÚN HORAS
// ===============================


function actualizarPrecio(){


let inicio =
Number(selectInicio.value);


let fin =
Number(selectFin.value);



if(!inicio || !fin || fin<=inicio){


precioTexto.textContent = 0;


return;


}



let horas =
fin - inicio;


precioTexto.textContent =
horas * PRECIO_HORA;


}



selectInicio.addEventListener(
"change",
actualizarPrecio
);


selectFin.addEventListener(
"change",
actualizarPrecio
);





// ===============================
// ENVIAR RESERVA
// ===============================


formulario.addEventListener(
"submit",
async (e)=>{


e.preventDefault();



// Exigimos login con Google (y registramos/actualizamos al
// cliente en Firestore) antes de guardar la reserva. Si el
// usuario ya tenía sesión iniciada, esto no vuelve a abrir
// el popup.

let usuario;


try{

usuario =
await iniciarSesionYRegistrarCliente();

}

catch(error){


if(error.code === "auth/popup-closed-by-user"){


// El usuario cerró el popup sin iniciar sesión:
// no creamos la reserva y salimos.

return;


}



console.error(

"Error al iniciar sesión / registrar cliente:",

error

);



alert(

"No se pudo iniciar sesión. Intenta de nuevo."

);



return;


}




let inicio =
Number(selectInicio.value);


let fin =
Number(selectFin.value);



if(!inicio || !fin){


alert(
"Selecciona la hora de inicio y de fin"
);


return;


}



if(fin<=inicio){


alert(
"La hora de fin debe ser después de la hora de inicio"
);


return;


}




let horas =
fin - inicio;


let total =
horas * PRECIO_HORA;




let reserva = {


clienteId:
usuario.uid,


fecha:
inputFecha.value,


horaInicio:
String(inicio).padStart(2,"0")+":00",


horaFin:
String(fin).padStart(2,"0")+":00",


horas:
horas,


precioHora:
PRECIO_HORA,


total:
total,


nombre:
document.getElementById("nombre").value.trim(),


telefono:
document.getElementById("telefono").value.trim(),


estado:
"Pendiente",


creado:
serverTimestamp()


};




let boton =
formulario.querySelector(
"button[type=submit]"
);


boton.disabled = true;


boton.textContent =
"Enviando...";




try{


await addDoc(

collection(db,"reservas"),

reserva

);




// avisar al admin por WhatsApp (no bloquea la reserva si falla)

avisarAdmin(

"🏟️ Nueva reserva\n"+
`Cliente: ${reserva.nombre}\n`+
`Tel: ${reserva.telefono}\n`+
`Fecha: ${reserva.fecha}\n`+
`Horario: ${reserva.horaInicio} - ${reserva.horaFin}\n`+
`Total: Q${reserva.total}`

);




alert(

"¡Reserva enviada! Queda pendiente de confirmación. " +

"Recuerda pagar directamente en la cancha."

);



window.location.href =
"../index.html";



}

catch(error){


console.error(

"Error creando reserva:",

error

);



alert(

"No se pudo enviar la reserva. Intenta de nuevo."

);



boton.disabled = false;


boton.innerHTML =
'<i class="fa-solid fa-check"></i> Confirmar reserva';



}



});
