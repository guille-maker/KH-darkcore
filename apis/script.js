// API de MangaDex (no necesita API key para consultas básicas)
class MangaDexAPI {
    constructor() {
        this.baseURL = 'https://api.mangadex.org';
    }

    // Buscar mangas
    async searchManga(title, limit = 100) {
        try {
            const response = await fetch(
                `${this.baseURL}/manga?title=${encodeURIComponent(title)}&limit=${limit}&includes[]=cover_art&contentRating[]=safe`
            );
            return await response.json();
        } catch (error) {
            console.error('Error buscando mangas:', error);
            throw error;
        }
    }

    // Mangas populares
    async getPopularManga(limit = 100) {
        try {
            const response = await fetch(
                `${this.baseURL}/manga?limit=${limit}&includes[]=cover_art&order[followedCount]=desc&contentRating[]=safe`
            );
            return await response.json();
        } catch (error) {
            console.error('Error obteniendo mangas populares:', error);
            throw error;
        }
    }

    // Últimos mangas
    async getLatestManga(limit = 100) {
        try {
            const response = await fetch(
                `${this.baseURL}/manga?limit=${limit}&includes[]=cover_art&order[latestUploadedChapter]=desc&contentRating[]=safe`
            );
            return await response.json();
        } catch (error) {
            console.error('Error obteniendo últimos mangas:', error);
            throw error;
        }
    }

    // Mangas aleatorios
    async getRandomManga(limit = 100) {
        try {
            const response = await fetch(
                `${this.baseURL}/manga?limit=${limit}&includes[]=cover_art&contentRating[]=safe`
            );
            return await response.json();
        } catch (error) {
            console.error('Error obteniendo mangas aleatorios:', error);
            throw error;
        }
    }

    // Obtener capítulos de un manga
    async getChapters(mangaId, limit = 400) {
        try {
            const response = await fetch(
                `${this.baseURL}/manga/${mangaId}/feed?limit=${limit}&translatedLanguage[]=es&order[chapter]=asc`
            );
            return await response.json();
        } catch (error) {
            console.error('Error obteniendo capítulos:', error);
            throw error;
        }
    }

    // Construir URL de imagen
    getCoverUrl(mangaId, fileName) {
        return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`;
    }
}

// UI Manager - CLASE ÚNICA Y CORREGIDA
class MangaUI {
    constructor() {
        this.api = new MangaDexAPI();
        this.container = document.getElementById('manga-container');
        this.searchInput = document.getElementById('searchManga');
        this.searchBtn = document.getElementById('searchBtn');
        this.modal = new bootstrap.Modal(document.getElementById('mangaModal'));
        this.reader = new ChapterReader(); // ✅ AÑADIDO: Instancia del lector
    }

    // Renderizar mangas
    renderMangas(mangas) {
        if (!mangas || mangas.length === 0) {
            this.container.innerHTML = '<div class="loading">No se encontraron mangas</div>';
            return;
        }

        this.container.innerHTML = mangas.data.map(manga => {
            const attributes = manga.attributes;
            const title = attributes.title.en || 
                         Object.values(attributes.title)[0] || 
                         'Sin título';
            
            // Buscar la imagen de portada
            const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');
            const coverFileName = coverArt ? coverArt.attributes.fileName : null;
            const coverUrl = coverFileName ? 
                this.api.getCoverUrl(manga.id, coverFileName) : 
                'https://via.placeholder.com/200x300/333/fff?text=No+Image';

            return `
                <div class="manga-card" data-manga-id="${manga.id}">
                    <img src="${coverUrl}" alt="${title}" class="manga-cover"
                         onerror="this.src='https://via.placeholder.com/200x300/333/fff?text=No+Image'">
                    <div class="manga-info">
                        <div class="manga-name">${this.truncateText(title, 50)}</div>
                        <div class="manga-status">${attributes.status || 'Unknown'}</div>
                    </div>
                </div>
            `;
        }).join('');

        // Añadir event listeners a las tarjetas
        this.addCardEventListeners();
    }

    // Truncar texto
    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    // Añadir event listeners
    addCardEventListeners() {
        document.querySelectorAll('.manga-card').forEach(card => {
            card.addEventListener('click', () => {
                const mangaId = card.getAttribute('data-manga-id');
                this.showMangaDetails(mangaId);
            });
        });
    }

    // Mostrar detalles del manga
    async showMangaDetails(mangaId) {
        try {
            // Obtener información del manga
            const mangaResponse = await fetch(`${this.api.baseURL}/manga/${mangaId}?includes[]=cover_art`);
            const mangaData = await mangaResponse.json();
            const manga = mangaData.data;

            // Obtener capítulos
            const chapters = await this.api.getChapters(mangaId);

            const attributes = manga.attributes;
            const title = attributes.title.en || Object.values(attributes.title)[0];
            const description = attributes.description?.en || 'No description available';
            
            const coverArt = manga.relationships.find(rel => rel.type === 'cover_art');
            const coverUrl = coverArt ? 
                this.api.getCoverUrl(manga.id, coverArt.attributes.fileName) : 
                'https://via.placeholder.com/200x300/333/fff?text=No+Image';

            // Construir modal content MEJORADO
            const modalBody = `
                <div class="row">
                    <div class="col-md-4">
                        <img src="${coverUrl}" alt="${title}" class="img-fluid rounded">
                    </div>
                    <div class="col-md-8">
                        <h4>${title}</h4>
                        <p><strong>Estado:</strong> ${attributes.status || 'Unknown'}</p>
                        <p><strong>Rating:</strong> ${attributes.contentRating || 'Safe'}</p>
                        <p>${description}</p>
                        
                        <h5 class="mt-4">Capítulos (${chapters.data?.length || 0})</h5>
                        <div class="chapter-list">
                            ${chapters.data ? chapters.data.map(chapter => `
                                <div class="chapter-item" data-chapter-id="${chapter.id}">
                                    <span class="chapter-number">Capítulo ${chapter.attributes.chapter || 'N/A'}</span>
                                    <span class="chapter-title">${chapter.attributes.title || ''}</span>
                                    <button class="btn btn-sm btn-outline-light read-chapter-btn" 
                                            data-chapter-id="${chapter.id}">
                                        Leer
                                    </button>
                                </div>
                            `).join('') : '<p>No hay capítulos disponibles</p>'}
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('mangaModalTitle').textContent = title;
            document.getElementById('mangaModalBody').innerHTML = modalBody;
            
            // AÑADIR EVENT LISTENERS A LOS BOTONES "LEER"
            this.addChapterEventListeners();
            
            this.modal.show();

        } catch (error) {
            console.error('Error mostrando detalles:', error);
            alert('Error al cargar los detalles del manga');
        }
    }

    addChapterEventListeners() {
        document.querySelectorAll('.read-chapter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Evita que se cierre el modal
                const chapterId = btn.getAttribute('data-chapter-id');
                this.readChapter(chapterId);
            });
        });
    }

    // ✅ MÉTODO AÑADIDO: Leer capítulo
    async readChapter(chapterId) {
        this.modal.hide(); // Cierra el modal de detalles
        this.reader.showChapter(chapterId); // Abre el lector
    }

    // Cargar mangas por filtro
    async loadMangas(filter = 'popular') {
        this.container.innerHTML = '<div class="loading">Cargando mangas...</div>';

        try {
            let response;
            switch(filter) {
                case 'latest':
                    response = await this.api.getLatestManga();
                    break;
                case 'random':
                    response = await this.api.getRandomManga();
                    break;
                case 'popular':
                default:
                    response = await this.api.getPopularManga();
            }
            
            this.renderMangas(response);
        } catch (error) {
            this.container.innerHTML = '<div class="loading">Error cargando mangas</div>';
            console.error('Error:', error);
        }
    }

    // Buscar mangas
    async searchManga() {
        const query = this.searchInput.value.trim();
        if (!query) return;

        this.container.innerHTML = '<div class="loading">Buscando mangas...</div>';

        try {
            const response = await this.api.searchManga(query);
            this.renderMangas(response);
        } catch (error) {
            this.container.innerHTML = '<div class="loading">Error en la búsqueda</div>';
            console.error('Error buscando:', error);
        }
    }

    // Inicializar
    init() {
        // Cargar mangas populares al inicio
        this.loadMangas('popular');

        // Event listeners
        this.searchBtn.addEventListener('click', () => this.searchManga());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchManga();
        });

        // Filtros
        document.querySelectorAll('.filters .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filters .btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.loadMangas(e.target.dataset.filter);
            });
        });
    }
}

// NUEVA CLASE: ChapterReader
class ChapterReader {
    constructor() {
        this.container = null;
        this.currentChapterId = null;
        this.currentPages = [];
        this.currentPageIndex = 0;
        this.initReader();
    }

    initReader() {
        // Crear el contenedor del lector
        this.container = document.createElement('div');
        this.container.className = 'reader-container';
        this.container.innerHTML = `
            <div class="reader-header">
                <h3 class="reader-title" id="readerTitle">Leyendo Capítulo</h3>
                <div class="reader-controls">
                    <button class="btn btn-sm btn-outline-light" id="prevPageBtn">← Anterior</button>
                    <span class="text-light mx-2" id="pageCounter">1/1</span>
                    <button class="btn btn-sm btn-outline-light" id="nextPageBtn">Siguiente →</button>
                    <button class="btn btn-sm btn-danger" id="closeReaderBtn">Cerrar</button>
                </div>
            </div>
            <div class="reader-content" id="readerContent">
                <!-- Las páginas se cargarán aquí -->
            </div>
            <div class="reader-nav">
                <button class="btn btn-outline-light" id="prevChapterBtn">Capítulo Anterior</button>
                <button class="btn btn-outline-light" id="nextChapterBtn">Siguiente Capítulo</button>
            </div>
        `;

        document.body.appendChild(this.container);
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Navegación de páginas
        document.getElementById('prevPageBtn').addEventListener('click', () => this.prevPage());
        document.getElementById('nextPageBtn').addEventListener('click', () => this.nextPage());
        document.getElementById('closeReaderBtn').addEventListener('click', () => this.hide());
        
        // Navegación de capítulos
        document.getElementById('prevChapterBtn').addEventListener('click', () => this.prevChapter());
        document.getElementById('nextChapterBtn').addEventListener('click', () => this.nextChapter());

        // Navegación con teclado
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    // MÉTODO PRINCIPAL: Cargar y mostrar un capítulo
    async showChapter(chapterId) {
        try {
            this.currentChapterId = chapterId;
            this.currentPageIndex = 0;
            
            // Mostrar loading
            document.getElementById('readerContent').innerHTML = '<div class="loading">Cargando páginas...</div>';
            this.container.classList.add('active');

            // Obtener datos del capítulo
            const chapterData = await this.getChapterData(chapterId);
            
            if (chapterData && chapterData.pages.length > 0) {
                this.currentPages = chapterData.pages;
                this.renderCurrentPage();
                this.updatePageCounter();
                document.getElementById('readerTitle').textContent = `Leyendo: ${chapterData.title}`;
            } else {
                document.getElementById('readerContent').innerHTML = '<div class="loading">No se pudieron cargar las páginas</div>';
            }

        } catch (error) {
            console.error('Error cargando capítulo:', error);
            document.getElementById('readerContent').innerHTML = '<div class="loading">Error cargando el capítulo</div>';
        }
    }

    // Obtener datos del capítulo desde MangaDex
    async getChapterData(chapterId) {
        try {
            const response = await fetch(`https://api.mangadex.org/at-home/server/${chapterId}`);
            const serverData = await response.json();

            const chapterResponse = await fetch(`https://api.mangadex.org/chapter/${chapterId}`);
            const chapterInfo = await chapterResponse.json();

            const baseUrl = serverData.baseUrl;
            const chapterHash = serverData.chapter.hash;
            const pages = serverData.chapter.data;

            return {
                title: `Capítulo ${chapterInfo.data.attributes.chapter}`,
                pages: pages.map(page => `${baseUrl}/data/${chapterHash}/${page}`),
                chapterInfo: chapterInfo.data
            };

        } catch (error) {
            console.error('Error obteniendo datos del capítulo:', error);
            throw error;
        }
    }

    // Renderizar página actual
    renderCurrentPage() {
        const readerContent = document.getElementById('readerContent');
        const currentPage = this.currentPages[this.currentPageIndex];
        
        readerContent.innerHTML = `
            <img src="${currentPage}" class="chapter-page" alt="Página ${this.currentPageIndex + 1}">
        `;
    }

    // Navegación entre páginas
    nextPage() {
        if (this.currentPageIndex < this.currentPages.length - 1) {
            this.currentPageIndex++;
            this.renderCurrentPage();
            this.updatePageCounter();
        }
    }

    prevPage() {
        if (this.currentPageIndex > 0) {
            this.currentPageIndex--;
            this.renderCurrentPage();
            this.updatePageCounter();
        }
    }

    // Actualizar contador de páginas
    updatePageCounter() {
        document.getElementById('pageCounter').textContent = 
            `${this.currentPageIndex + 1}/${this.currentPages.length}`;
    }

    // Navegación con teclado
    handleKeyboard(e) {
        if (!this.container.classList.contains('active')) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                this.prevPage();
                break;
            case 'ArrowRight':
                this.nextPage();
                break;
            case 'Escape':
                this.hide();
                break;
        }
    }

    // Ocultar lector
    hide() {
        this.container.classList.remove('active');
    }

    // Métodos para navegación entre capítulos
    prevChapter() {
        console.log('Ir al capítulo anterior');
    }

    nextChapter() {
        console.log('Ir al siguiente capítulo');
    }
}

// ✅ INICIALIZACIÓN CORRECTA (solo una vez)
document.addEventListener('DOMContentLoaded', () => {
    const mangaUI = new MangaUI();
    mangaUI.init();
});