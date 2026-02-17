self.addEventListener('install', event => {
console.log('Service Worker instalado');
});
self.addEventListener('fetch', event => {
// Aquí podrías interceptar peticiones y servir caché
console.log('Interceptando fetch:', event.request.url);
});

