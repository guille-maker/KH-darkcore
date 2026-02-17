/* Ejercicio 5: Borrar tarea por índice
Enunciado:
Pide al usuario un índice y elimina un ejercicio correspondiente del
array en LocalStorage.
Solución: */
 let ejers = JSON.parse(localStorage.getItem("ejercicios")) || [];
let indice = parseInt(prompt("Ingrese el índice del ejercicio a borrar:"));
if(!isNaN(indice) && indice >=0 && indice < ejercicios.length){
ejercicios.splice(indice,1);
localStorage.setItem("ejercicios", JSON.stringify(ejercicios));
}
console.log(ejercicios);

/* Ejercicio 6: Contador de palabras en LocalStorage
Enunciado:
Pide un texto al usuario y guarda en LocalStorage cuántas palabras
tiene.
Solución: */
let texto = prompt("Escribe un texto:");
if(texto){
let palabras = texto.trim().split(/\s+/).length;
localStorage.setItem("contadorPalabras", palabras);
console.log("Número de palabras:", palabras);
}
/* Ejercicio 7: Limpiar LocalStorage
Enunciado:
Borra la clave "ejercicios" de LocalStorage. Luego muestra el contenido
para comprobar.
Solución: */

localStorage.removeItem("ejercicios");
console.log(localStorage.getItem("ejercicios")); // null