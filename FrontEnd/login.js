const formulaireLogin = document.querySelector("form");

formulaireLogin.addEventListener("submit", async function (event) {
    event.preventDefault();
    // Création de l’objet avec le mail et password
    const user = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=password]").value
    };
    // Appel de la fonction fetch avec toutes les informations nécessaires
    await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    })
        .then(response => {
            if (response.ok) {
                // La requête a réussi, redirection vers la page d'accueil
                window.location.href = 'index.html';
            } else {
                // La requête a échoué, affichage d'un message d'erreur
                throw new Error('Identifiants incorrects');
            }
        })
        .catch(error => {
            console.error(error);
            // Affichage d'un message d'erreur
            alert('Identifiants incorrects');
        });
});
