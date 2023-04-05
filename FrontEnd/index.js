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

// Filtre pour catégorie objet
const boutonAll = document.querySelector(".btn-all");

boutonAll.addEventListener("click", function () {
	document.querySelector(".gallery").innerHTML = "";
	genererProjets(projets);
});

// Filtre pour catégorie objet
const boutonObjets = document.querySelector(".btn-objets");

boutonObjets.addEventListener("click", function () {
	const projetsFiltres = projets.filter(function (projets) {
		return projets.categoryId === 1;
	});
	document.querySelector(".gallery").innerHTML = "";
	genererProjets(projetsFiltres);
});

// Filtre pour catégorie appartements
const boutonAppartements = document.querySelector(".btn-appartements");

boutonAppartements.addEventListener("click", function () {
	const projetsFiltres = projets.filter(function (projets) {
		return projets.categoryId === 2;
	});
	document.querySelector(".gallery").innerHTML = "";
	genererProjets(projetsFiltres);
});

// Filtre pour catégorie Hotels & restaurants
const boutonHotelsRestaurants = document.querySelector(".btn-hotel-restau");

boutonHotelsRestaurants.addEventListener("click", function () {
	const projetsFiltres = projets.filter(function (projets) {
		return projets.categoryId === 3;
	});
	document.querySelector(".gallery").innerHTML = "";
	genererProjets(projetsFiltres);
});

// Permet d'afficher le bouton du filtre sélectionné en "actif" en changeant sa couleur etc
const buttons = document.querySelectorAll("button");

for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
        let active = document.getElementsByClassName("active");

        // si pas de class active
        if (active.length > 0) {
            active[0].className = active[0].className.replace(" active", "");
        }
        // Ajoute la class active au btn cliqué
        this.className += " active";
    });
}