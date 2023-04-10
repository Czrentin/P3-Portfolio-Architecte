const config = {
    "userId": 1,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4"
}
const authKey = config.token;

function Login() {
    const formulaireLogin = document.querySelector("form");
    formulaireLogin.addEventListener("submit", function (event) {
        event.preventDefault();
        // Création de l’objet avec le mail et password
        let email = event.target.querySelector("[name=email]").value;
        let password = event.target.querySelector("[name=password]").value;
        const log = {
            email: email,
            password: password
        };
        // Création de la charge utile au format JSON
        const chargeUtile = JSON.stringify(log);
        // Appel de la fonction fetch avec toutes les informations nécessaires
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${authKey}`
            },
            body: chargeUtile
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
                alert('Une erreur est survenue lors de la connexion');
            });
    });
}
