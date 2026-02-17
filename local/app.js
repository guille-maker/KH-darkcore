// Seleccionamos elementos
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const taskList = document.getElementById("task-list");

// Cargar tareas desde LocalStorage
// Si no hay 'tareas' guardadas, usa un array vacío: []
let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

// Función para renderizar tareas
function renderTareas() {
  taskList.innerHTML = ""; // Limpia la lista antes de volver a dibujar
  tareas.forEach((tarea, index) => {
    const li = document.createElement("li");
    if (tarea.completada) {
      li.classList.add("done");
    }

    // El HTML para cada tarea con los botones que llaman a las funciones JS
    li.innerHTML = `
      <span>${tarea.texto}</span>
      <div>
        <button onclick="toggleTarea(${index})">✔️</button>
        <button class="delete" onclick="borrarTarea(${index})">🗑️</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  // Guardar SIEMPRE que se modifica el array 'tareas' (es decir, cada vez que se renderiza)
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

// Añadir nueva tarea
form.addEventListener("submit", e => {
  e.preventDefault(); // Evita que la página se recargue
  const texto = input.value.trim();
  if (texto !== "") {
    // Añade el nuevo objeto de tarea al array
    tareas.push({ texto, completada: false });
    input.value = ""; // Limpia el campo de entrada
    renderTareas(); // Vuelve a dibujar la lista y guarda en LocalStorage
  }
});

// Marcar/desmarcar tarea
function toggleTarea(index) {
  tareas[index].completada = !tareas[index].completada;
  renderTareas();
}

// Borrar tarea
function borrarTarea(index) {
  tareas.splice(index, 1);
  renderTareas();
}

// Primera carga: muestra las tareas guardadas al cargar la página
renderTareas();