const api = "http://localhost:5678/api/users/login";

/* REQUETE POST FETCH */
async function submit() {
let user = {
    email: 'sophie.bluel@test.tld',
    password: 'S0phie',
  };
  
  let response = await fetch(api, {
    method: 'POST',
    headers: {
      'Content-Type': "application/json",
    },
    body: JSON.stringify(user),
  });
  
  let result = await response.json();
  console.log(result)
  alert(result.message);
}

submit();