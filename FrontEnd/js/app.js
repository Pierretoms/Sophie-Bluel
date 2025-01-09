// Fonction pour charger toutes les œuvres au démarrage
async function loadAllWorks() {
    const url = "http://localhost:5678/api/works";
    const response = await fetch(url);
    const works = await response.json();
    const gallery = document.querySelector(".gallery");
    const galleryModal = document.querySelector(".gallery-modal");
    
    // Parcourt chaque œuvre récupérée depuis l'API
    works.forEach(work => {
        // Crée un élément <figure> pour chaque œuvre dans la galerie principale
        const figure = document.createElement("figure");
        figure.dataset.categoryId = work.categoryId;
        figure.dataset.projetId = work.id;
        figure.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}"> <!-- Image de l'œuvre -->
                <figcaption>${work.title}</figcaption> <!-- Titre de l'œuvre -->
            `;
        gallery.appendChild(figure);
        
        // Crée un élément <figure> similaire pour la modal
        const figureModal = document.createElement("figure");
        figureModal.dataset.categoryId = work.categoryId;
        figureModal.dataset.projetId = work.id;
        figureModal.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}"> <!-- Image de l'œuvre -->
                <figcaption>${work.title}</figcaption> <!-- Titre de l'œuvre -->
                <button id="${work.id}" class="supp-projet">
                    <i class="fa-solid fa-trash-can"></i> <!-- Icône de suppression -->
                </button>
            `;
        galleryModal.appendChild(figureModal);
        
        // Ajoute d'un addEventListener pour chaque bouton de suppression
        const trashIcon = figureModal.querySelectorAll('.supp-projet');
        trashIcon.forEach((button) => 
            button.addEventListener('click', (event) => deleteWorks(event, button.id))
    );
});
}

// fonction permetant de supprimer une œuvre à la fois sur le serveur et dans l'interface utilisateur
async function deleteWorks(event, id) {
    event.preventDefault();
    
    const deleteApi = "http://localhost:5678/api/works/";

    // Envoie une requête DELETE à l'API pour supprimer une œuvre spécifique
    const response = await fetch(deleteApi + id, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`
        },
    });

    if (response.ok) {
        // Supprime chaque élément correspondant du DOM.
        document.querySelectorAll(`[data-projet-id="${id}"]`).forEach((aSupprimer) => {
            aSupprimer.remove();
        });
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


function modeEdition() {
    const loginButton = document.querySelector('a[href="login.html"]');
    const logoutButton = document.querySelector('a[href="index.html"]');
    const editIcon = document.querySelector('.fa-pen-to-square');
    const editLink = document.querySelector('.js-modal');
    const modalAside = document.querySelector('#modal1');
    const filtres = document.querySelectorAll('.div-filtres > *');
    
    if (sessionStorage.authToken) {
        // Affichage de la bannière d'édition
        const banniereEdit = document.createElement("div");
        banniereEdit.className = "mode-edit";
        banniereEdit.innerHTML = '<p><i class="fa-regular fa-pen-to-square"></i>Mode édition</p>';
        document.body.prepend(banniereEdit);
        
        // Affiche "Logout" et cache "Login"
        loginButton.style.display = "none";
        loginButton.style.position = "absolute";
        logoutButton.style.display = "inline";
        
        // Cache les filtres
        filtres.forEach(element => {
            element.style.visibility = 'hidden';
        });
        
        // Affiche les éléments d'édition
        editIcon.style.display = "inline";
        editLink.style.display = "inline";
        
        // Ajoute un gestionnaire d'événement au bouton "Logout"
        logoutButton.addEventListener("click", () => {
            sessionStorage.clear(); // Supprimer le token
            location.reload(); // Rafraîchir la page
        });
    } else {
        // Affiche "Login" et cache "Logout"
        logoutButton.style.display = "none";
        logoutButton.style.position = "absolute";
        loginButton.style.display = "inline";
        
        // Masque les éléments d'édition
        editIcon.style.display = "none";
        editLink.style.display = "none";
        modalAside.style.display = "none";
    }
}

// Appele la fonction au chargement de la page
document.addEventListener("DOMContentLoaded", modeEdition);


// Initialisation
async function init() {
    await loadAllWorks();
    await createFilterButtons();
    modeEdition();
}

init();

let modal = null;
const focusableSelector = 'button, a, input, textarea';
let focusables = []

const openModal = function (e) {
    e.preventDefault();

    modal = document.querySelector(e.target.getAttribute('href'));

    focusables = Array.from(modal.querySelectorAll(focusableSelector));

    focusables[0].focus();

    modal.style.display = null;

    // Ajoute des gestionnaires d'événements pour fermer la modale ou empêcher la propagation
    modal.addEventListener('click', closeModal); 
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelectorAll('.js-modal-close').forEach(e => e.addEventListener('click', closeModal));
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);
};

const closeModal = function (e) {
    // Si aucune modale n'est ouverte, ne fait rien
    if (modal === null) return;

    e.preventDefault(); // Empêche le comportement par défaut de l'événement

    // Masque la modale en rétablissant `display: none`
    modal.style.display = "none";

    // Supprime les gestionnaires d'événements liés à la modale
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);

    // Réinitialise la variable `modal` à null
    modal = null;
};

// Empêche l'événement de remonter dans la chaîne des événements
const stopPropagation = function (e) {
    e.stopPropagation(); // Empêche l'événement de remonter dans la chaîne des événements
};

const focusInModal = function (e) {
    e.preventDefault();

    // Trouve l'index de l'élément actuellement focalisé dans la liste des éléments focusables
    let index = focusables.findIndex(f => f === modal.querySelector(':focus'));

    // Navigation entre les éléments focusables
    if (e.shiftKey === true) {
        index--;
    } else {
        index++;
    }

    // Navigation circulaire : si l'index dépasse les limites, revient au début ou à la fin
    if (index >= focusables.length) {
        index = 0;
    }
    if (index < 0) {
        index = focusables.length - 1;
    }

    // Donne le focus à l'élément suivant ou précédent dans la liste
    focusables[index].focus();
};

/**
 * - Ferme la modale avec "Échap".
 * - navigation entre les éléments focusables avec la touche Tab.
 */
window.addEventListener('keydown', function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e); // Ferme la modale avec Échap
    }
    if (e.key === 'Tab' && modal !== null) {
        focusInModal(e); // Navigation entre les éléments focusables avec Tab
    }
});

document.querySelectorAll('.js-modal').forEach((a) => {
    a.addEventListener('click', openModal); 
});

// transition modal 1 --> modal 2

const btnAddPhoto = document.querySelector('.btn-add-photo');
const backBtn = document.querySelector('.js-modal-back');
const closeBtns = document.querySelectorAll('.js-modal-close');

// changement de modal grace a btnAddPhoto (1 --> 2)
btnAddPhoto.addEventListener('click', switchModal);

// changement de modal backBtn (2 --> 1)
backBtn.addEventListener('click', switchModal);

// Réinisialisations des modales à leur état initial lorsqu'on les fermes
closeBtns.forEach(btn => btn.addEventListener('click', resetModals));

// Fonction pour basculer entre les deux modales
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

// Fonction pour réinitialiser les modales
function resetModals() {
    const modalSupp = document.querySelector('.modal-supp-gallery');
    const modalAdd = document.querySelector('.modal-add-gallery');

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
            img.style.height = "214px";
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

// add gallery

document.getElementById("add-photo").addEventListener("submit", ticketSubmit);

const titleInput = document.getElementById("title");
let titleValue = "";


titleInput.addEventListener("input", function () {
    titleValue = titleInput.value;
});

let selectedValue = "1";

document.getElementById("category").addEventListener("change", function () {
    selectedValue = this.value;
});

// Fonction principale pour gérer l'envoie d'une oeuvre
async function ticketSubmit(event) {
    event.preventDefault();

    const ticketPhoto = document.getElementById("file").files[0];

    // Création d'un objet `FormData` pour envoyer les données au serveur
    const ticketData = new FormData();
    ticketData.append("image", ticketPhoto);
    ticketData.append("title", titleValue);
    ticketData.append("category", selectedValue);

    // Requête POST pour envoyer les données au serveur
    let response = await fetch("http://localhost:5678/api/works", {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
        },
        body: ticketData,
    });

    if (!response.ok) {
        // Si la réponse n'est pas valide, afficher un message d'erreur
        if (!document.querySelector('.error-login')) {
            const errorCard = document.createElement("div");
            errorCard.className = "error-login";
            errorCard.innerHTML = "Veuillez remplir les champs";
            document.querySelector("form").prepend(errorCard);
        }
    } else {
        // Si la réponse est valide, traiter les données reçues
        let result = await response.json();

        // Mise à jour de la galerie principale avec la nouvelle œuvre
        const gallery = document.querySelector(".gallery");
        const galleryModal = document.querySelector(".gallery-modal");
        const figure = document.createElement("figure");
        figure.dataset.categoryId = result.categoryId;
        figure.dataset.projetId = result.id;
        figure.innerHTML = `
            <img src="${result.imageUrl}" alt="${result.title}">
            <figcaption>${result.title}</figcaption>
        `;
        gallery.appendChild(figure);

        // Mise à jour de la galerie modale avec la nouvelle œuvre
        const figureModal = document.createElement("figure");
        figureModal.dataset.categoryId = result.categoryId;
        figureModal.dataset.projetId = result.id;
        figureModal.innerHTML = `
                <img src="${result.imageUrl}" alt="${result.title}">
                <figcaption>${result.title}</figcaption>
                <button id="${result.id}" class="supp-projet"><i class="fa-solid fa-trash-can"></i></button>
            `;
        galleryModal.appendChild(figureModal);

        const trashIcon = figureModal.querySelectorAll('.supp-projet');
        trashIcon.forEach((button) => button.addEventListener('click', (event) => deleteWorks(event, button.id)));

        // Réinitialisation du formulaire après l'ajout
        document.querySelector("#add-photo").reset();

        // Vide l'aperçu de la photo
        document.querySelector("#container-photo").innerHTML = "";

        // Restaure l'affichage des filtres
        document.querySelectorAll(".container-add-photo > div:not(#container-photo), .container-add-photo > label, .container-add-photo > p").forEach(element => {
            element.style.display = "inherit";
        });
    }
}