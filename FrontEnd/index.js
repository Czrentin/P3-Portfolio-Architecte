let projets = window.localStorage.getItem("projets");
projets = JSON.parse(projets)

async function chargerAPI() {
    try {
        const reponse = await fetch('http://localhost:5678/api/works');
        const projets = await reponse.json();
        const valeurProjets = JSON.stringify(projets);
        // Stockage des informations dans le localStorage
        window.localStorage.setItem("projets", valeurProjets);
        // Appeler la fonction pour générer les projets avec les données récupérées
        genererProjets(projets)
        genererGallery(projets)
    } catch (error) {
        console.error("Une erreur est survenue lors de la récupération des données des projets :", error);
    }
}

function genererProjets(projets) {
    for (let i = 0; i < projets.length; i++) {

        const article = projets[i];
        // Récupération de l'élément du DOM qui accueillera les projets
        const sectionProjets = document.querySelector(".gallery");
        // Création d’une balise dédiée pour un projet
        const projetElement = document.createElement("figure");
        projetElement.dataset.id = projets[i].id
        // Création des balises à l'intérieur
        const imageElement = document.createElement("img");
        imageElement.src = article.imageUrl;
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = article.title;
        // On rattache la balise article a la section Projets
        projetElement.appendChild(imageElement);
        projetElement.appendChild(titleElement);
        sectionProjets.appendChild(projetElement);
    }
}

chargerAPI()

//
// Partie pour le filtre
//

const boutonsTri = document.querySelectorAll(".btn-tri")
// Fonction qui tri en fonction du data-category 
boutonsTri.forEach(function (boutonTri) {
    boutonTri.addEventListener("click", function () {
        const categoryId = parseInt(boutonTri.dataset.category)
        let projetsFiltres
        if (categoryId === 0) {
            projetsFiltres = projets
        } else {
            projetsFiltres = projets.filter(function (projet) {
                return projet.categoryId === categoryId
            })
        }
        document.querySelector(".gallery").innerHTML = ""
        genererProjets(projetsFiltres)
    })
})

// Permet d'afficher le bouton du filtre sélectionné en "actif" en changeant sa couleur etc
const filtres = document.querySelector('.filtre')
const buttonsFiltres = filtres.querySelectorAll('button')

for (let i = 0; i < buttonsFiltres.length; i++) {
    buttonsFiltres[i].addEventListener("click", function () {
        let active = document.getElementsByClassName("active")

        // si pas de class active
        if (active.length > 0) {
            active[0].className = active[0].className.replace(" active", "")
        }
        // Ajoute la class active au btn cliqué
        this.className += " active"
    });
}

//
// Partie connectée
//

// Masque le filtre
function hideFiltre() {
    const filtres = document.querySelector('.filtre')
    filtres.style.display = "none"
}
// Change le login en logout
function logout() {
    // Récupérez l'élément <a> dans la liste
    const a = document.querySelector('nav ul li:nth-child(3) a')
    a.innerText = 'logout'
}
// Affiche les boutons modifier pour afficher la modale
function modifierButton() {
    const divButton = Array.from(document.querySelectorAll('.div-modifier'))
    divButton.forEach(divButton => {
        divButton.style.display = "flex"
    });
}

// Ajout barre au mode édition 
function barreModifier() {
    const bodyElement = document.querySelector('body')

    const barreModifier = document.createElement('div')
    barreModifier.classList.add('barre-modifier')
    const i = document.createElement('i')
    i.classList.add("fa-sharp", "fa-regular", "fa-pen-to-square")

    const p = document.createElement('p')
    p.innerText = 'Mode édition'

    const publish = document.createElement('button')
    publish.innerText = 'publier les changements'

    bodyElement.parentNode.insertBefore(barreModifier, bodyElement)
    barreModifier.appendChild(i)
    barreModifier.appendChild(p)
    barreModifier.appendChild(publish)
}

let connected = sessionStorage.getItem("token") !== null

if (connected) { // vérifie si la paire clé-valeur dans le sessionStorage
    const logout = document.querySelector('nav ul li:nth-child(3) a')
    logout.addEventListener("click", function () {
        window.sessionStorage.removeItem("token");
    })
}

if (connected) { // vérifie si la paire clé-valeur dans le sessionStorage
    hideFiltre()
    logout()
    modifierButton()
    barreModifier()
}

//
// Partie pour la gestion de la modale
//

// Créer l'élément <aside>
const aside = document.createElement("aside");
aside.id = "modal";
aside.classList.add("modal");
aside.setAttribute("aria-hidden", "true");
aside.setAttribute("role", "dialog");
aside.setAttribute("aria-labelledby", "titlemodal");

// Créer la structure de l'élément <aside>
const modalWrapper = document.createElement("div");
modalWrapper.classList.add("modal-wrapper");

const divCloseModal = document.createElement("div");
divCloseModal.classList.add("div-close-modal");

const buttonCloseModal = document.createElement("button");
buttonCloseModal.classList.add("close-modal");

const spanCloseModal = document.createElement("span");
spanCloseModal.textContent = "Fermer la boite modale";

const iconCloseModal = document.createElement("i");
iconCloseModal.classList.add("fa-solid", "fa-x");

buttonCloseModal.appendChild(spanCloseModal);
buttonCloseModal.appendChild(iconCloseModal);
divCloseModal.appendChild(buttonCloseModal);

const titleModal = document.createElement("h2");
titleModal.id = "titlemodal";
titleModal.textContent = "Galerie photo";

const galleryModal = document.createElement("div");
galleryModal.classList.add("gallery-modal");

const hr = document.createElement("hr");

const buttonAddPicture = document.createElement("button");
buttonAddPicture.classList.add("add-picture");
buttonAddPicture.textContent = "Ajouter une photo";

const pDeleteGallery = document.createElement("p");
pDeleteGallery.textContent = "Supprimer la galerie";

modalWrapper.appendChild(divCloseModal);
modalWrapper.appendChild(titleModal);
modalWrapper.appendChild(galleryModal);
modalWrapper.appendChild(hr);
modalWrapper.appendChild(buttonAddPicture);
modalWrapper.appendChild(pDeleteGallery);

aside.appendChild(modalWrapper);

// Insérer l'élément <aside> après la section avec l'ID "introduction"
const introductionSection = document.getElementById("introduction");
introductionSection.parentNode.insertBefore(aside, introductionSection.nextSibling);

function genererGallery(projets) {
    for (let i = 0; i < projets.length; i++) {

        const article = projets[i];
        // Récupération de l'élément du DOM qui accueillera les projets
        const sectionProjets = document.querySelector(".gallery-modal");
        // Création d’une balise dédiée pour un projet
        const projetElement = document.createElement("figure");
        projetElement.dataset.id = projets[i].id
        // Création des balises à l'intérieur
        const imageElement = document.createElement("img");
        imageElement.src = article.imageUrl;
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = 'éditer'
        // On rattache la balise article a la section Projets
        projetElement.appendChild(imageElement);
        projetElement.appendChild(titleElement);
        sectionProjets.appendChild(projetElement);
    }
}

let modal = null

// Bloquer le clic pour fermer la modale 
const stopPropagation = function (e) {
    e.stopPropagation()
}

// Ouverture de la modale
const openModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.target.getAttribute('href'))
    target.style.display = 'flex'
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal', 'true')
    modal = target
    modal.addEventListener('click', closeModal)
    modal.querySelector('.close-modal').addEventListener('click', closeModal)
    modal.querySelector('.modal-wrapper').addEventListener('click', stopPropagation)
}

// Fermeture de la modale
const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = 'none'
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.close-modal').removeEventListener('click', closeModal)
    modal.querySelector('.modal-wrapper').removeEventListener('click', stopPropagation)
    modal = null
}

// Ouverture de la modale au click
document.querySelectorAll('.modifier').forEach(a => {
    a.addEventListener('click', openModal)
})

// Fermeture de la modale avec le clavier
window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
        closeModal(e)
    }
})
