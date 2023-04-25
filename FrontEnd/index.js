let projets = window.localStorage.getItem("projets");
projets = JSON.parse(projets)

async function chargerAPI() {
    try {
        const reponse = await fetch('http://localhost:5678/api/works')
        const projets = await reponse.json()
        const valeurProjets = JSON.stringify(projets)
        // Stockage des informations dans le localStorage
        window.localStorage.setItem("projets", valeurProjets)
        // Appeler la fonction pour générer les projets avec les données récupérées
        genererProjets(projets)
        genererGalleryModaleSuppression(projets)
    } catch (error) {
        console.error("Une erreur est survenue lors de la récupération des données des projets :", error)
    }
}

function genererProjets(projets) {
    for (let i = 0; i < projets.length; i++) {

        // Récupération de l'élément du DOM qui accueillera les projets
        const sectionProjets = document.querySelector(".gallery")
        // Création d’une balise dédiée pour un projet
        const projetElement = document.createElement("figure")
        projetElement.dataset.id = projets[i].id
        // Création des balises à l'intérieur
        const imageElement = document.createElement("img")
        imageElement.src = projets[i].imageUrl
        const titleElement = document.createElement("figcaption")
        titleElement.innerText = projets[i].title
        // On rattache la balise article a la section Projets
        projetElement.appendChild(imageElement)
        projetElement.appendChild(titleElement)
        sectionProjets.appendChild(projetElement)
    }
}

function genererGalleryModaleSuppression(projets) {
    for (let i = 0; i < projets.length; i++) {

        // Récupération de l'élément du DOM qui accueillera les projets
        const sectionProjets = document.querySelector('.gallery-modal')
        // Création d’une balise dédiée pour un projet
        const projetElement = document.createElement('figure')
        projetElement.dataset.id = projets[i].id
        // Création des balises à l'intérieur
        const imageElement = document.createElement('img')
        imageElement.src = projets[i].imageUrl
        const iconElement = document.createElement('i')
        iconElement.classList.add('fa-solid', 'fa-trash-can')
        const titleElement = document.createElement('figcaption')
        titleElement.innerText = 'éditer'
        // On rattache la balise article a la section Projets
        projetElement.appendChild(imageElement)
        projetElement.appendChild(iconElement)
        projetElement.appendChild(titleElement)
        sectionProjets.appendChild(projetElement)
    }
}

chargerAPI()

//
// Partie pour le filtre
//

// Récupération de la liste des catégories depuis l'API
async function genererFiltre() {
    await fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(categories => {
            // Récupération de la nav et création du ul
            const nav = document.querySelector('.filtre')
            const ul = document.createElement('ul')

            // Création du bouton "Tous"
            const btnTous = document.createElement('button')
            btnTous.classList.add('btn', 'btn-transparent', 'btn-green')
            btnTous.dataset.category = 0
            btnTous.textContent = 'Tous'
            const liTous = document.createElement('li')
            liTous.appendChild(btnTous)
            ul.appendChild(liTous)

            // Création d'un bouton pour chaque catégorie
            categories.forEach(category => {
                const btnCategory = document.createElement('button')
                btnCategory.classList.add('btn', 'btn-transparent')
                btnCategory.dataset.category = category.id
                btnCategory.textContent = category.name
                const liCategory = document.createElement('li')
                liCategory.appendChild(btnCategory)
                ul.appendChild(liCategory)
            })

            // Ajout du filtre à la page
            nav.appendChild(ul)
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des catégories', error)
        })
    const nav = document.querySelector('.filtre')
    const buttonsFiltres = nav.querySelectorAll('button')

    // Fonction qui tri en fonction du data-category 
    buttonsFiltres.forEach(function (buttonsFiltres) {
        buttonsFiltres.addEventListener("click", function () {
            const categoryId = parseInt(buttonsFiltres.dataset.category)
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
    for (let i = 0; i < buttonsFiltres.length; i++) {
        buttonsFiltres[i].addEventListener("click", function () {
            const filtreContainer = document.querySelector('.filtre')
            let green = filtreContainer.getElementsByClassName('btn-green')

            // si pas de class btn-green
            if (green.length > 0) {
                green[0].className = green[0].className.replace(" btn-green", "")
            }
            // Ajoute la class btn-green au btn cliqué
            this.className += " btn-green"
        })
    }
}

genererFiltre()

//
// Partie connectée
//

// vérifie si la paire clé-valeur dans le sessionStorage
let connected = sessionStorage.getItem("token") !== null

if (connected) {
    // Masque le filtre
    const filtres = document.querySelector('.filtre')
    filtres.style.display = "none"

    // Change le login en logout
    const a = document.querySelector('nav ul li:nth-child(3) a')
    a.setAttribute("href", "./index.html");
    a.innerText = 'logout'
    // Supprime le token quand in appui sur logout
    a.addEventListener("click", function () {
        window.sessionStorage.removeItem("token");
    })

    // Bouge le h2 pour être centré
    const titlePortfolio = document.querySelector('.title-portfolio')
    const h2 = titlePortfolio.querySelector('h2')
    h2.style.marginLeft = "85px"

    // Afficher les boutons modifier pour la modale
    const divButton = Array.from(document.querySelectorAll('.div-button-modal'))
    divButton.forEach(divButton => {
        divButton.style.display = "flex"
    })

    // Ajout barre mode édition
    const headerElement = document.querySelector('header')

    const barreModifier = document.createElement('div')
    barreModifier.classList.add('barre-modifier')
    const i = document.createElement('i')
    i.classList.add("fa-sharp", "fa-regular", "fa-pen-to-square")

    const p = document.createElement('p')
    p.innerText = 'Mode édition'

    const publish = document.createElement('button')
    publish.classList.add('btn')
    publish.innerText = 'publier les changements'

    headerElement.parentNode.insertBefore(barreModifier, headerElement)
    barreModifier.appendChild(i)
    barreModifier.appendChild(p)
    barreModifier.appendChild(publish)
}

//
// Partie pour la gestion de la modale
//

let modal = null

// Bloquer le clic pour fermer la modale uniquement dedans
const stopPropagation = function (e) {
    e.stopPropagation()
}

// Ouverture de la modale
const openModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.currentTarget.getAttribute('href'))
    target.style.display = 'flex'
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal', 'true')
    modal = target
    modal.addEventListener('click', closeModal)
    modal.querySelectorAll('.close-modal').forEach(a => {
        a.addEventListener('click', closeModal)
    })
    modal.querySelectorAll('.container-modal').forEach(a => {
        a.addEventListener('click', stopPropagation)
    })
}

// Fermeture de la modale
const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()
    modal.style.display = 'none'
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelectorAll('.close-modal').forEach(a => {
        a.removeEventListener('click', closeModal)
    })
    modal.querySelectorAll('.container-modal').forEach(a => {
        a.removeEventListener('click', stopPropagation)
    })
    modal = null
}

// Ouverture de la modale au click
document.querySelectorAll('.open-modal').forEach(a => {
    a.addEventListener('click', function (e) {
        closeModal(e)
        openModal(e)
    })
})

// Fermeture de la modale avec le clavier
window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
        closeModal(e)
    }
})

// Récupération du formulaire d'ajout
const formulaireAjout = document.querySelector('.form-modal')

// Changement couleur bouton submit modale
const submitBtn = formulaireAjout.querySelector('button')

formulaireAjout.addEventListener('input', () => {
    const image = document.querySelector('#image_uploads').value
    const title = document.querySelector('#title').value
    const category = document.querySelector('#category').value

    if (image !== '' && title !== '' && category !== '') {
        submitBtn.style.backgroundColor = '#1d6154'
        submitBtn.removeAttribute('disabled')
    } else {
        submitBtn.setAttribute('disabled', '')
        submitBtn.style.backgroundColor = '#a7a7a7'
    }
})

// Affichage de la photo en preview dans le formulaire
const imagePreview = document.querySelector('#image_uploads')

imagePreview.addEventListener('change', function (event) {
    if (event.target.files.length > 0) {
        let src = URL.createObjectURL(event.target.files[0])
        const preview = document.getElementById('img-preview')
        preview.src = src
        preview.style.display = 'flex'
        preview.addEventListener('click', function () {
            document.getElementById('image_uploads').click()
        })
        const label = document.querySelector('label[for="image_uploads"]')
        label.style.display = 'none'
        const p = document.querySelector('.preview p')
        p.style.display = 'none'
        const i = document.querySelector('.preview i')
        i.style.display = 'none'
    }
})

// Ajout d'un projet via formulaire modal2
formulaireAjout.addEventListener("submit", function (event) {
    event.preventDefault()
    // Récupération données du formulaire avec FormData()
    let data = new FormData()
    data.append('title', document.querySelector('#title').value)
    data.append('category', document.querySelector('#category').value)
    data.append('image', document.querySelector('#image_uploads').files[0])

    // Obtenir le token de la session storage
    const token = JSON.parse(sessionStorage.getItem('token'))

    // Appel de la fonction fetch avec toutes les informations nécessaires
    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + token,
        },
        body: data
    })
        .then(res => console.log(res))
        .catch(error => console.error(error))
})

// Suppression du projet quand on appui sur l'icone de l'image correspondante
const galleryModal = document.querySelector('.gallery-modal')

galleryModal.addEventListener('click', function (event) {
    if (event.target.classList.contains('fa-trash-can')) {
        const id = event.target.parentNode.dataset.id
        const token = JSON.parse(sessionStorage.getItem('token'))
        fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        })
            .catch(error => {
                console.error('Error:', error)
            })
    }
})
