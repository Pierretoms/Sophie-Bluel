const api = "http://localhost:5678/api/users/login";

document.getElementById("connection").addEventListener("submit", pfSubmit);

/* REQUETE POST FETCH */
async function pfSubmit(event) {
  event.preventDefault();
  
  let user = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };
  
  let response = await fetch(api, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  if (response.status != 200) {
    if (!document.querySelector('.error-login')){
    const errorCard = document.createElement("div");
    errorCard.className = "error-login";
    errorCard.innerHTML = "E-mail ou mot de passe incorrect !";
    document.querySelector("form").prepend(errorCard);
    }
  } else {
    let result = await response.json();
    const token = result.token;
    sessionStorage.setItem("authToken", token);
    window.location.href = "index.html";
  }
}