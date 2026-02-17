var mijuego = {
canvas: {
ctx: "",
desplazamientox: 0,
desplazamientoy: 0
},
nave: {
x: 300,
y: 200,
moverx: 0,
movery: 0,
velocidad: 1
},
iniciar: function() {
var elemento = document.getElementById("canvas");
mijuego.canvas.ctx = elemento.getContext("2d");
mijuego.canvas.desplazamientox = elemento.offsetLeft;
mijuego.canvas.desplazamientoy = elemento.offsetTop;
document.addEventListener("click", function(evento) {
mijuego.control(evento);
});
mijuego.bucle();
},
bucle: function() {
if (mijuego.nave.velocidad) {
mijuego.procesar();
mijuego.detectar();
mijuego.dibujar();
requestAnimationFrame(function() {
mijuego.bucle();
});
} else {
mijuego.canvas.ctx.font = "bold 36px verdana, sans-serif";
mijuego.canvas.ctx.fillText("GAME OVER", 182, 210);
}
},
control: function(evento) {
var distanciax = evento.clientX - (mijuego.canvas.desplazamientox +
mijuego.nave.x);
var distanciay = evento.clientY - (mijuego.canvas.desplazamientoy +
mijuego.nave.y);
var ang = Math.atan2(distanciax, distanciay);
mijuego.nave.moverx = Math.sin(ang);
mijuego.nave.movery = Math.cos(ang);
mijuego.nave.velocidad += 1;
},
dibujar: function() {
mijuego.canvas.ctx.clearRect(0, 0, 600, 400);
mijuego.canvas.ctx.beginPath();
mijuego.canvas.ctx.arc(mijuego.nave.x, mijuego.nave.y, 20, 0,
Math.PI / 180 * 360, false);
mijuego.canvas.ctx.fill();
},
procesar: function() {
mijuego.nave.x += mijuego.nave.moverx * mijuego.nave.velocidad;
mijuego.nave.y += mijuego.nave.movery * mijuego.nave.velocidad;
},
detectar: function() {
if (mijuego.nave.x < 0 || mijuego.nave.x > 600 || mijuego.nave.y <
0 || mijuego.nave.y > 400) {
mijuego.nave.velocidad = 0;
}
}
};
window.addEventListener("load", function() {
mijuego.iniciar();
});