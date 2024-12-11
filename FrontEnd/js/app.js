async function getWorks() {
    const url = "http://localhost:5678/api/works";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        const json = await response.json();
        console.log(json);
        for(let i = 0; i < json.length; i++) {
            setFigure(json[i])
        }
    } catch (error) {
        console.error(error.message);
    }
}
getWorks();

function setFigure(data) {
    const figure = document.createElement("figure")
    figure.innerHTML = `<img src=${data.imageUrl} alt=${data.title}>
				<figcaption>${data.title}</figcaption>`;
    
    document.querySelector(".gallery").append (figure);
}

// http://localhost:5678/api/categories

async function getCategories() {
    const url = "http://localhost:5678/api/categories";
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        
        const json = await response.json();
        console.log(json);
        for(let i = 0; i < json.length; i++) {
            setFiltres(json[i])
        }
    } catch (error) {
        console.error(error.message);
    }
}
getCategories();

function setFiltres(data) { 
    const div = document.createElement("div");
    div.innerHTML = `${data.name}`;
    document.querySelector(".div-filtres").append (div);
}