/* Ejercicio 3: Lista de ejercicios simple
Enunciado:
Crea un array de objetos de ejercicios, guárdalo en LocalStorage y
luego recupéralo y muéstralo en consola. */


let ejercicios = [
  { id: 1, nombre: "Sentadillas", duracion: "30 seg" },
  { id: 2, nombre: "Flexiones", duracion: "15 reps" },
  { id: 3, nombre: "Plancha", duracion: "45 seg" }
];

localStorage.setItem("listaEjercicios", JSON.stringify(ejercicios));

let ejerciciosfinales = JSON.parse(localStorage.getItem("listaejercicios"));

console.log(ejerciciosfinales);
