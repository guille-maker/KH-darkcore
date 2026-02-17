/* Ejercicio 1: Guardar y leer un mensaje
Enunciado:
Guarda un string en LocalStorage con clave "saludo" y luego recupéralo
para mostrarlo por consola. */

localStorage.setItem("saludo", "¡Hola, mundo!");
console.log(localStorage.getItem("saludo"));