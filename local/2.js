/* Ejercicio 2: Contador de visitas
Enunciado:
Crea un contador que aumente cada vez que se recarga la página.
Guardarlo en LocalStorage.
 */

let contador = parseInt(localStorage.getItem("contador")) || 0;

contador++;

localStorage.setItem("contador", contador);

document.getElementById("contador").textContent = contador;
console.log(contador);