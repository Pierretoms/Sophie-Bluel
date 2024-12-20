// Fonction pour charger toutes les œuvres au démarrage
async function loadAllWorks() {
    const url = "http://localhost:5678/api/works";
    const response = await fetch(url);
    const works = await response.json();
    const gallery = document.querySelector(".gallery");
    
    works.forEach(work => {
        const figure = document.createElement("figure");
        figure.dataset.categoryId = work.categoryId;
        figure.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        `;
        gallery.appendChild(figure);
    });
}

// Fonction pour filtrer les œuvres
function filterWorks(categoryId) {
    const figures = document.querySelectorAll(".gallery figure");
    figures.forEach(figure => {
        if (categoryId === null || figure.dataset.categoryId === categoryId.toString()) {
            figure.style.display = "block";
        } else {
            figure.style.display = "none";
        }
    });
}

// Fonction pour créer les boutons de filtrage
async function createFilterButtons() {
    const url = "http://localhost:5678/api/categories";
    const response = await fetch(url);
    const categories = await response.json();
    const filterContainer = document.querySelector(".div-filtres");
    
    // Bouton "Tous"
    const allButton = document.createElement("div");
    allButton.textContent = "Tous";
    allButton.addEventListener("click", () => filterWorks(null));
    filterContainer.appendChild(allButton);
    
    // Boutons pour chaque catégorie
    categories.forEach(category => {
        const button = document.createElement("div");
        button.textContent = category.name;
        button.addEventListener("click", () => filterWorks(category.id));
        filterContainer.appendChild(button);
    });
}

// Initialisation
async function init() {
    await loadAllWorks();
    await createFilterButtons();
}

init();

function modeEdition() {
    if (sessionStorage.authToken) {
        console.log("ok");
        const banniereEdit = document.createElement("div")
        banniereEdit.className = 'mode-edit'
        banniereEdit.innerHTML = '<p><i class="fa-regular fa-pen-to-square"></i>Mode édition</p>'
        document.body.prepend(banniereEdit)
    } 
}

modeEdition()