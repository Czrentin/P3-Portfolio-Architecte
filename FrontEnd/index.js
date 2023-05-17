let projets = []

async function chargerAPI() {
    try {
        // stocke la réponse de l'API dans des variable et modifie son type
        const reponse = await fetch('http://localhost:5678/api/works')
        const projetsReponse = await reponse.json()
        // Stocke dans projets pour y avoir accès même en dehors de la fonction
        projets = projetsReponse

        // Appelle la fonction pour générer les projets avec les données récupérées
        genererProjets(projets)
        genererGalleryModaleSuppression(projets)
    } catch (error) {
        console.error("Une erreur est survenue lors de la récupération des données des projets :", error)
    }
}

function genererProjets(projets) {
    // Récupération de l'élément du DOM qui accueillera les projets
    const sectionProjets = document.querySelector(".gallery")
    sectionProjets.innerHTML = ''
    for (let i = 0; i < projets.length; i++) {
        // Création d’une balise dédiée pour un projet
        const projetElement = document.createElement("figure")
        projetElement.dataset.id = projets[i].id
        // Création des balises à l'intérieur
        const imageElement = document.createElement("img")
        imageElement.src = projets[i].imageUrl
        imageElement.alt = projets[i].title
        const titleElement = document.createElement("figcaption")
        titleElement.innerText = projets[i].title
        // On rattache la balise article a la section Projets
        projetElement.appendChild(imageElement)
        projetElement.appendChild(titleElement)
        sectionProjets.appendChild(projetElement)
    }
}

function genererGalleryModaleSuppression(projets) {
    // Récupération de l'élément du DOM qui accueillera les projets et raffraichissement automatique pour éviter les doublons
    const sectionProjets = document.querySelector('.gallery-modal')
    sectionProjets.innerHTML = ''

    for (let i = 0; i < projets.length; i++) {
        // Création d’une balise dédiée pour un projet
        const projetElement = document.createElement('figure')
        projetElement.dataset.id = projets[i].id

        // Création des balises à l'intérieur et de leurs attributs
        const imageElement = document.createElement('img')
        imageElement.src = projets[i].imageUrl
        imageElement.alt = projets[i].title
        const iconElement = document.createElement('i')
        iconElement.classList.add('fa-solid', 'fa-trash-can')
        // Suppresion au clique sur l'icone trash-can du projet grace à la récupération de l'id parent
        iconElement.addEventListener('click', function (event) {
            const id = event.target.parentNode.dataset.id // récupère l'id de l'élément parent de l'icone qu'on clique
            const token = JSON.parse(sessionStorage.getItem('token')) // récupère le token
            fetch(`http://localhost:5678/api/works/${id}`, { // id directement dans l'en-tête
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + token,
                },
            })
                .then(res => {
                    chargerAPI() // Permet de voir le changement sans recharger la page
                })
                .catch(error => {
                    console.error('Error:', error)
                })

        })
        const titleElement = document.createElement('figcaption')
        titleElement.innerText = 'éditer'

        // On rattache les balises au DOM pour les afficher
        projetElement.appendChild(imageElement)
        projetElement.appendChild(iconElement)
        projetElement.appendChild(titleElement)
        sectionProjets.appendChild(projetElement)
    }
}

chargerAPI()

// Fonction regroupant toute la génération des filtres
async function genererFiltre() {
    // Récupération de la liste des catégories depuis l'API
    await fetch('http://localhost:5678/api/categories')
        .then(response => response.json())
        .then(categories => {
            // Récupération de la nav et création du ul
            const nav = document.querySelector('.filtre')
            const ul = document.createElement('ul')

            // Création du bouton "Tous"
            const btnTous = document.createElement('button')
            btnTous.classList.add('btn', 'btn-transparent', 'btn-green')
            btnTous.dataset.category = 0 // Catégorie défini à 0 car les catégories id commence à 1 dans l'API
            btnTous.textContent = 'Tous'
            const liTous = document.createElement('li')
            liTous.appendChild(btnTous)
            ul.appendChild(liTous)

            // Création d'un bouton pour chaque catégorie
            categories.forEach(category => {
                const btnCategory = document.createElement('button')
                btnCategory.classList.add('btn', 'btn-transparent') // Ajoute le style
                btnCategory.dataset.category = category.id // Ajoute sa catégorie id qui permettra de trier
                btnCategory.textContent = category.name // Ajoute son nom
                const liCategory = document.createElement('li')
                liCategory.appendChild(btnCategory)
                ul.appendChild(liCategory)
            })
            // Ajout du ul à la page pour tout afficher
            nav.appendChild(ul)
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des catégories', error)
        })

    // Récupère tous les boutons dans le filtre 
    const nav = document.querySelector('.filtre')
    const buttonsFiltres = nav.querySelectorAll('button')

    // Fonction qui tri en fonction du data-category 
    buttonsFiltres.forEach(function (buttonsFiltres) {
        buttonsFiltres.addEventListener("click", function () {
            // Récupère la catégorie de chaque bouton à son clic
            const categoryId = parseInt(buttonsFiltres.dataset.category)
            let projetsFiltres
            // Condition en fonction de la catégorie
            if (categoryId === 0) {
                projetsFiltres = projets // 0 = tous les projets donc on affiche la version de base
            } else {
                projetsFiltres = projets.filter(function (projet) {
                    return projet.categoryId === categoryId // Chaque nombre équivaut à une catégorie donc on filtre en fonction
                })
            }
            document.querySelector(".gallery").innerHTML = "" // "Refresh"
            genererProjets(projetsFiltres) // On génére en fonction de la condition précédente
        })
    })

    // Permet d'afficher le bouton du filtre sélectionné en "actif"
    for (let i = 0; i < buttonsFiltres.length; i++) {
        buttonsFiltres[i].addEventListener("click", function () {
            const filtreContainer = document.querySelector('.filtre')
            let green = filtreContainer.getElementsByClassName('btn-green')
            // si déjà class btn-green on le supprime (que ce soit le bouton cliqué ou non)
            if (green.length > 0) {
                green[0].className = green[0].className.replace(" btn-green", "")
            }
            // Ajoute la class btn-green au btn cliqué qui donne le style voulu
            this.className += " btn-green"
        })
    }
}

genererFiltre()

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
    a.addEventListener("click", () => {
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

    const btnPublish = document.createElement('button')
    btnPublish.classList.add('btn')
    btnPublish.innerText = 'publier les changements'

    headerElement.parentNode.insertBefore(barreModifier, headerElement)
    barreModifier.appendChild(i)
    barreModifier.appendChild(p)
    barreModifier.appendChild(btnPublish)
}

// Gestion de la modale
let modal = null

// Bloquer le clic pour fermer la modale uniquement dedans
const stopPropagation = (e) => {
    e.stopPropagation()
}

// Ouverture de la modale
const openModal = (e) => {
    e.preventDefault()
    const target = document.querySelector(e.currentTarget.getAttribute('href'))
    // Change les propriété si on clique sur un btn qui à un lien vers une modale
    target.style.display = 'flex'
    target.removeAttribute('aria-hidden')
    target.setAttribute('aria-modal', 'true')
    modal = target
    modal.addEventListener('click', closeModal)
    // Permet d'avoir un click pour sortir de la modale
    modal.querySelectorAll('.close-modal').forEach(a => {
        a.addEventListener('click', closeModal)
    })
    // Stop la propagation du click qui limite aux éléments qu'on veut
    modal.querySelectorAll('.container-modal').forEach(a => {
        a.addEventListener('click', stopPropagation)
    })
}

// Fermeture de la modale
const closeModal = (e) => {
    if (modal === null) return // Permet de ne rien faire si aucune modale n'est ouverte
    if (e) {
        e.preventDefault() // Bloque un soucis de rechargement de page
    }
    // Fait l'inverse de la fonction openModal
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
    // Redéfini la modal comme null 
    modal = null
    // Supprime ce qu'il y a dans le formulaire et remet tout de base
    formulaireAjout.reset()
    preview.style.display = 'none'
    label.style.display = 'inline'
    p.style.display = 'block'
    i.style.display = 'inline'
}

// Ouverture de la modale au click sur les boutons avec .open-modal
document.querySelectorAll('.open-modal').forEach(a => {
    a.addEventListener('click', (e) => {
        // Avant d'ouvrir une modale on ferme au cas où il y en aurait déjà une d'ouverte
        closeModal(e)
        openModal(e)
    })
})

// Fermeture de la modale avec le clavier
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
        closeModal(e)
    }
})

// Récupération du formulaire d'ajout
const formulaireAjout = document.querySelector('.form-modal')

// Changement couleur bouton submit modale
formulaireAjout.addEventListener('input', () => {
    const submitBtn = formulaireAjout.querySelector('button')
    // récupère tous les éléments du formulaire
    const image = document.querySelector('#image_uploads').value
    const title = document.querySelector('#title').value
    const category = document.querySelector('#category').value
    // Si les 3 éléments sont rempli alors on attribue une couleur différente et on accepte le clic
    if (image !== '' && title !== '' && category !== '') {
        submitBtn.style.backgroundColor = '#1d6154'
    } else { // dès l'instant où les conditions ne sont plus remplis on remet comme avant
        submitBtn.style.backgroundColor = '#a7a7a7'
    }
})

// Affichage de la photo en preview dans le formulaire
const imagePreview = document.querySelector('#image_uploads')
const preview = document.getElementById('img-preview')
const label = document.querySelector('label[for="image_uploads"]')
const p = document.querySelector('.preview p')
const i = document.querySelector('.preview i')
// En cas de changement dans l'image upload
imagePreview.addEventListener('change', (event) => {
    let src = URL.createObjectURL(event.target.files[0]) // récupère le fichier
    preview.src = src // donne l'image à l'élément image vide
    preview.style.display = 'flex' // affiche l'élémént image mtn rempli

    // cache les éléments qu'on ne veut plus voir
    label.style.display = 'none'
    p.style.display = 'none'
    i.style.display = 'none'
})

// Permet de cliquer sur l'image comme si c'était le label
preview.addEventListener('click', () => {
    document.getElementById('image_uploads').click()
})

// Ajout d'un projet via formulaire modal2
formulaireAjout.addEventListener("submit", (event) => {
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
        .then(res => {
            closeModal()
            chargerAPI()
        })
        .catch(error => console.error(error))
})
