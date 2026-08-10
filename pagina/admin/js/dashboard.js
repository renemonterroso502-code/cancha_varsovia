/*
=========================================
 CANCHA SINTÉTICA VARSOVIA
 DASHBOARD JS
=========================================
*/


import { auth } from "../../firebase/config.js";


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


console.log(
"Dashboard administrador cargado"
);



/*
=========================================
 VERIFICAR SESIÓN ADMIN (Firebase Auth)
=========================================
*/


let usuario =
await esperarSesion();



if(!usuario){


window.location.href =
"login.html";


return;


}






/*
=========================================
 DATOS TEMPORALES
 DESPUÉS VIENEN DE FIREBASE
=========================================
*/


let datos = {


reservas:15,

ventas:2500,

productos:120,

clientes:350


};





/*
=========================================
 ACTUALIZAR TARJETAS
=========================================
*/


let tarjetas =
document.querySelectorAll(
".dashboard-card h2"
);



if(tarjetas.length >= 4){


tarjetas[0].textContent =
datos.reservas;



tarjetas[1].textContent =
"Q "+datos.ventas;



tarjetas[2].textContent =
datos.productos;



tarjetas[3].textContent =
datos.clientes;



}






/*
=========================================
 ANIMACIÓN DE NÚMEROS
=========================================
*/


function animarNumero(
elemento,
valor
){


let inicio=0;


let tiempo =
setInterval(
()=>{


inicio += Math.ceil(valor/50);



if(inicio >= valor){


inicio = valor;


clearInterval(tiempo);


}



elemento.textContent =
inicio;



},
30
);



}





/*
=========================================
 BOTONES DE ACCIÓN
=========================================
*/


const botones =
document.querySelectorAll(
".btn"
);



botones.forEach(
(boton)=>{


boton.addEventListener(
"click",
()=>{


console.log(
"Acción:",
boton.textContent.trim()
);



});


});






/*
=========================================
 CERRAR SESIÓN
=========================================
*/


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





});