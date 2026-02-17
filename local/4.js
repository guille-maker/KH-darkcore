/* Ejercicio 4: Añadir ejercicio dinámico
Enunciado:
Pide al usuario una ejercicio con prompt, añádela al array de ejercicios

guardado en LocalStorage y guarda todo de nuevo.
Solución: */
let ejers = JSON.parse(localStorage.getItem("ejercicios")) || [];
let nuevoEjer = prompt("Escribe tu nuevo ejercicio:");
if(nuevoEjer){
ejercicios.push({ejercicio: nuevoEjer});
localStorage.setItem("ejercicios", JSON.stringify(ejercicios));
}
console.log(ejercicios); 