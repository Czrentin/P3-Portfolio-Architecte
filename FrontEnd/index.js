let projets = window.localStorage.getItem("projets");
projets = JSON.parse(projets)

async function chargerProjets() {
    try {
        const reponse = await fetch('http://localhost:5678/api/works');
        const projets = await reponse.json();
        const valeurProjets = JSON.stringify(projets);
        // Stockage des informations dans le localStorage
        window.localStorage.setItem("projets", valeurProjets);
        // Appeler la fonction pour générer les projets avec les données récupérées
        genererProjets(projets);
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

chargerProjets()

function galleryReset() {
    document.querySelector(".gallery").innerHTML = ""
}

// Filtre pour catégorie objet
const boutonAll = document.querySelector(".btn-all");

boutonAll.addEventListener("click", function () {
    galleryReset()
    genererProjets(projets)
});

// Filtre pour catégorie objet
const boutonObjets = document.querySelector(".btn-objets");

boutonObjets.addEventListener("click", function () {
    const projetsFiltres = projets.filter(function (projets) {
        return projets.categoryId === 1;
    });
    galleryReset()
    genererProjets(projetsFiltres)
});

// Filtre pour catégorie appartements
const boutonAppartements = document.querySelector(".btn-appartements");

boutonAppartements.addEventListener("click", function () {
    const projetsFiltres = projets.filter(function (projets) {
        return projets.categoryId === 2;
    });
    galleryReset()
    genererProjets(projetsFiltres)
});

// Filtre pour catégorie Hotels & restaurants
const boutonHotelsRestaurants = document.querySelector(".btn-hotel-restau");

boutonHotelsRestaurants.addEventListener("click", function () {
    const projetsFiltres = projets.filter(function (projets) {
        return projets.categoryId === 3;
    });
    galleryReset()
    genererProjets(projetsFiltres)
});

// Permet d'afficher le bouton du filtre sélectionné en "actif" en changeant sa couleur etc
const buttons = document.querySelectorAll("button")

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
        let active = document.getElementsByClassName("active")

        // si pas de class active
        if (active.length > 0) {
            active[0].className = active[0].className.replace(" active", "")
        }
        // Ajoute la class active au btn cliqué
        this.className += " active"
    });
}

// Masque le filtre
function hideFiltre() {
    const filtres = document.querySelector('.filtre')
    filtres.style.display = "none"
}

function logout() {
    // Récupérez l'élément <a> dans la liste
    const a = document.querySelector('nav ul li:nth-child(3) a')
    a.innerText = 'logout'
}

const figure = document.querySelector('figure')
const portfolioSection = document.querySelector('#portfolio')

function modifierButton(parent) {
    const divButton = document.createElement('div')
    divButton.classList.add("bouton-modifier")
    // Créer un élément <i>
    const i = document.createElement("i")
    // Ajouter une classe pour l'icône (par exemple "fa fa-pencil")
    i.classList.add("fa-sharp", "fa-regular", "fa-pen-to-square")

    // Créer un élément <button>
    const bouton = document.createElement('button')
    bouton.innerText = 'modifier'

    // Ajouter l'icône et le bouton à l'élément parent
    divButton.appendChild(i)
    divButton.appendChild(bouton)
    parent.appendChild(divButton)
}

// Ajout barre au top 
function barreModifier() {
    const bodyElement = document.querySelector('body')
    // création des éléments et class css
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

if (sessionStorage.getItem("token") !== null) { // vérifie si la paire clé-valeur dans le sessionStorage
    hideFiltre()
    barreModifier()
    logout()
    modifierButton(figure)
    modifierButton(portfolioSection)
}