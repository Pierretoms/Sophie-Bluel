// Fonction pour charger toutes les œuvres au démarrage
async function loadAllWorks() {
    const url = "http://localhost:5678/api/works";
    const response = await fetch(url);
    const works = await response.json();
    const gallery = document.querySelector(".gallery");
    const galleryModal = document.querySelector(".gallery-modal");

    works.forEach(work => {
        const figure = document.createElement("figure");
        figure.dataset.categoryId = work.categoryId;
        figure.dataset.projetId = work.id;
        figure.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
        `;
        gallery.appendChild(figure);
        
        const figureModal = document.createElement("figure");
        figureModal.dataset.categoryId = work.categoryId;
        figureModal.dataset.projetId = work.id;
        figureModal.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}">
                <figcaption>${work.title}</figcaption>
                <button id="${work.id}" class="supp-projet"><i class="fa-solid fa-trash-can"></i></button>
            `;
        galleryModal.appendChild(figureModal);
        
        // Delete gallery
        
        const trashIcon = figureModal.querySelectorAll('.supp-projet');
        trashIcon.forEach((button) => button.addEventListener('click', (event) => deleteWorks(event, button.id)));
    });
}

async function deleteWorks(event, id) {
    event.preventDefault();
    const deleteApi = "http://localhost:5678/api/works/";
    
    const response = await fetch(deleteApi + id, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
    });

    if (response.ok){
        document.querySelectorAll(`[data-projet-id="${id}"]`).forEach((aSupprimer)=> {
            aSupprimer.remove();
        })
    }
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
    const loginButton = document.querySelector('a[href="login.html"]');
    const logoutButton = document.querySelector('a[href="index.html"]');
    const editIcon = document.querySelector('.fa-pen-to-square');
    const editLink = document.querySelector('.js-modal');
    const modalAside = document.querySelector('#modal1');
    
    if (sessionStorage.authToken) {
        // Mode édition activé
        console.log("Mode édition activé");
        
        // Affichage de la bannière d'édition
        const banniereEdit = document.createElement("div");
        banniereEdit.className = "mode-edit";
        banniereEdit.innerHTML = '<p><i class="fa-regular fa-pen-to-square"></i>Mode édition</p>';
        document.body.prepend(banniereEdit);
        
        // Afficher "Logout" et cacher "Login"
        loginButton.style.display = "none";
        loginButton.style.position = "absolute";
        logoutButton.style.display = "inline";
        
        // Afficher les éléments d'édition
        editIcon.style.display = "inline";
        editLink.style.display = "inline";
        
        // Ajouter un gestionnaire d'événement au bouton "Logout"
        logoutButton.addEventListener("click", () => {
            sessionStorage.clear(); // Supprimer le token
            location.reload(); // Rafraîchir la page
        });
    } else {
        // Mode normal activé
        console.log("Mode normal activé");
        
        // Afficher "Login" et cacher "Logout"
        logoutButton.style.display = "none";
        logoutButton.style.position = "absolute";
        loginButton.style.display = "inline";
        
        // Masquer les éléments d'édition
        editIcon.style.display = "none";
        editLink.style.display = "none";
        modalAside.style.display = "none";
    }
}

// Appeler la fonction au chargement de la page
document.addEventListener("DOMContentLoaded", modeEdition);

let modal = null;
const focusableSelector = 'button, a, input, textarea';
let focusables = []

const openModal = function (e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute('href'));
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    focusables[0].focus();
    modal.style.display = null;
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelectorAll('.js-modal-close').forEach(e => e.addEventListener('click', closeModal));
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
    
};

const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault();
    modal.style.display = "none";
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    modal = null;
};

const stopPropagation = function (e) {
    e.stopPropagation();
};

const focusInModal = function (e) {
    e.preventDefault();
    let index = focusables.findIndex(f => f === modal.querySelector(':focus'));
    if (e.shiftKey === true) {
        index--;
    } else {
        index++;
    }
    index++;
    if (index >= focusables.length) {
        index = 0;
    }
    if (index < 0) {
        index = focusables.length - 1;
    }
    focusables[index].focus();
}

window.addEventListener('keydown', function (e){
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    }
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e);
    }
})

document.querySelectorAll('.js-modal').forEach((a) => {
    a.addEventListener('click' , openModal);
});

// transition modal 1 --> modal 2

const btnAddPhoto = document.querySelector('.btn-add-photo');
const backBtn = document.querySelector('.js-modal-back');
const closeBtns = document.querySelectorAll('.js-modal-close');

btnAddPhoto.addEventListener('click', switchModal);
backBtn.addEventListener('click', switchModal);
closeBtns.forEach(btn => btn.addEventListener('click', resetModals));

function switchModal() {
    const modalSupp = document.querySelector('.modal-supp-gallery');
    const modalAdd = document.querySelector('.modal-add-gallery');

    if (modalSupp.style.display === "block" || modalSupp.style.display === "") {
        modalSupp.style.display = "none";
        modalAdd.style.display = "block";
    } else {
        modalSupp.style.display = "block";
        modalAdd.style.display = "none";
    }
}

function resetModals() {
    const modalSupp = document.querySelector('.modal-supp-gallery');
    const modalAdd = document.querySelector('.modal-add-gallery');

    // Réinitialise les états des modals
    modalSupp.style.display = "block";
    modalAdd.style.display = "none";
}

// Apparition photo dans la modal

document.getElementById("file").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement("img");
            img.src = e.target.result;
            img.alt = "Uploaded Photo";
            img.style.height = "214px"; // Conserve les proportions
            img.style.margin = "auto";
            img.style.objectFit = "contain";
            document.getElementById("container-photo").appendChild(img);

            // Masquer les éléments spécifiques après le chargement de l'image
            document.querySelectorAll(".container-add-photo > div:not(#container-photo), .container-add-photo > label, .container-add-photo > input, .container-add-photo > p").forEach(element => {
                element.style.display = "none";
            });
        };
        reader.readAsDataURL(file);
    } else {
        alert("Veuillez sélectionner une image au format JPG ou PNG.");
    }
});


