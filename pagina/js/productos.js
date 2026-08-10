/*
=========================================
 CANCHA SINTÉTICA VARSOVIA
 PRODUCTOS CLIENTES
=========================================
*/


import { db } from "../firebase/config.js";

import { agregarCarrito } from "./carrito.js";


import {
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



const lista =
document.getElementById("listaProductos");





async function cargarProductos(){


try{


const querySnapshot =
await getDocs(
collection(db,"productos")
);



lista.innerHTML="";



if(querySnapshot.empty){


lista.innerHTML = `

<div class="alert alert-warning">

No hay productos disponibles

</div>

`;

return;

}




querySnapshot.forEach((documento)=>{


let producto = documento.data();



lista.innerHTML += `


<div class="col-md-3">


<div class="card shadow">



<img src="${producto.imagen}"

class="card-img-top"

style="height:220px;object-fit:cover">



<div class="card-body">



<h5>

${producto.nombre}

</h5>




<p>

${producto.descripcion}

</p>




<h4 class="text-success">

Q${producto.precio}

</h4>




<p>

Stock: ${producto.stock}

</p>




<button 

class="btn btn-success w-100"

onclick="agregarCarrito('${documento.id}')">


<i class="fa fa-cart-plus"></i>

Agregar al carrito


</button>



</div>


</div>


</div>


`;



});



}

catch(error){


console.error(
"Error cargando productos:",
error
);



lista.innerHTML = `


<div class="alert alert-danger">

Error al cargar productos

</div>


`;



}



}



window.addEventListener(
"DOMContentLoaded",
cargarProductos
);