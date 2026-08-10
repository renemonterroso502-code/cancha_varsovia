/*
=========================================
 CANCHA SINTÉTICA VARSOVIA
 SISTEMA CARRITO CLIENTE
=========================================
*/


let carrito = 
JSON.parse(
localStorage.getItem("carrito")
) || [];




// =================================
// AGREGAR PRODUCTO AL CARRITO
// =================================

export function agregarCarrito(id){


let existe =
carrito.find(
(p)=>p.id === id
);



if(existe){


existe.cantidad++;


}else{


carrito.push({

id:id,

cantidad:1

});


}



guardarCarrito();


alert(
"Producto agregado al carrito"
);


}






// =================================
// OBTENER CARRITO
// =================================

export function obtenerCarrito(){

return carrito;

}






// =================================
// GUARDAR CARRITO
// =================================

export function guardarCarrito(){


localStorage.setItem(
"carrito",
JSON.stringify(carrito)
);


}






// =================================
// MOSTRAR CANTIDAD
// =================================

export function cantidadCarrito(){


return carrito.reduce(

(total,p)=> total + p.cantidad,

0

);


}






// =================================
// LIMPIAR CARRITO
// =================================

export function vaciarCarrito(){


carrito=[];


guardarCarrito();


}




// Para botones onclick del HTML

window.agregarCarrito = agregarCarrito;