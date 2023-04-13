const baseUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
// let modal = null;

async function extractDataBestMovie() {

    let bestMovieTitle = document.getElementById('best-movie-title');
    let bestMovieImg = document.getElementsByClassName('best-cover')[0].getElementsByTagName("img")[0];
    let bestMovieDescription = document.getElementsByClassName('best-movie-summary')[0].getElementsByTagName("p")[0];
    let bestMovieButton = document.getElementById("bestMovieButton");

    const bestMovies = await fetch(baseUrl)
        .then(response => response.json())
        bestMovie = await createMovieObjModal(bestMovies["results"][0]["id"]);
        bestMovieTitle.innerHTML = bestMovie.title;
        bestMovieImg.src = bestMovie.image_url;
        bestMovieDescription.innerHTML = bestMovie.description;
        bestMovieImg.setAttribute("onclick", "openModal(" + bestMovie.id + ")");
        bestMovieButton.setAttribute("onclick", "openModal(" + bestMovie.id + ")");
}

async function createMovieObject(movie) {
    let movieObj = new Object();
    movieObj.id = movie["id"];
    movieObj.image_url = movie["image_url"];
    movieObj.title = movie["title"];
    return movieObj;
}

async function extractDataMovies(gender) {
    reqUrl = baseUrl + "&genre_contains=" + gender + "&page_size=7";
    let moviesImgUrls = new Array();
    const movies = await fetch(reqUrl)
        .then(response => response.json())
        .catch(function(error) {
            console.log("Fetch_Error : " + error + "/ (i=" + i + ")")
        })
        for (let i=0; i<7; i++) {
            movieImgUrl = await createMovieObject(movies["results"][i]);
            moviesImgUrls.push(movieImgUrl);
        }
        createNewSection(moviesImgUrls, gender);
}

function createNewSection(moviesUrls, gender) {
    
    /* creation des sections avec carousel */
    
    let body = document.body;

    /* creation d'une nouvelle section */
    let newSection = document.createElement("section");
    newSection.setAttribute("class", "section_cat");
    newSection.setAttribute("id", gender);
    body.appendChild(newSection);
    
    /* creation du titre */
    let title = document.createElement("h1");
    title.setAttribute("class", gender);
    // title.setAttribute("id", gender);
    title.style.fontFamily = gender;
    title.textContent = gender;
    newSection.appendChild(title);
    
    /* creation du div carousel dans la nouvelle section */
    let carouselDiv = document.createElement("div");
    carouselDiv.setAttribute("id", "carousel");
    newSection.appendChild(carouselDiv);

    /* creation du div container dans le div carousel */
    let container = document.createElement("div");
    container.setAttribute("id", "container");
    carouselDiv.appendChild(container);

    /* creation des 2 boutons du carousel */
    let leftArrow = document.createElement("img");
    leftArrow.setAttribute("src", "./images/fleche-gauche.png");
    leftArrow.setAttribute("class", "carousel-button");
    leftArrow.setAttribute("id", gender + "-left");
    leftArrow.style.float = "left";
    leftArrow.setAttribute("onclick", 'carouselLeft("' + gender + '")');
    container.appendChild(leftArrow);
    let rightArrow = document.createElement("img");
    rightArrow.setAttribute("src", "./images/fleche-droite.png");
    rightArrow.setAttribute("class", "carousel-button");
    rightArrow.setAttribute("id", gender + "-right");
    rightArrow.style.float= "right";
    rightArrow.setAttribute("onclick", 'carouselRight("' + gender + '")');
    rightArrow.style.pointerEvents = "none";
    rightArrow.style.opacity = "0.15";
    container.appendChild(rightArrow);

    /* creation des images */
    moviesUrls.forEach((movieUrl, index) => {
        newImg = document.createElement("img");
        newImg.setAttribute("src", movieUrl.image_url);
        newImg.setAttribute("class", "cover");
        newImg.setAttribute("onclick", "openModal(" + movieUrl.id + ")");
        newImg.setAttribute("id", "img-" + gender + "-" + (index + 1));
        newImg.setAttribute("style", "display: null;");
        if ((index + 1) > 5) {
            newImg.style.display = "none";
        }
        container.appendChild(newImg);
    });
    
    /* modification du positionnement des boutons en fonctions de la taille de la section */
    let heightContainer = container.clientHeight;
    let heightArrow = rightArrow.clientHeight;
    leftArrow.style.marginTop = (((heightContainer - heightArrow) / 2) + "px");
    rightArrow.style.marginTop = (((heightContainer - heightArrow) / 2) + "px");

    /* relevé de l'état des flèches */
    leftArrowState = document.getElementById("left");
    rightArrowState = document.getElementById("right");

};

async function createMovieObjModal(movieId) {
    return fetch(`http://localhost:8000/api/v1/titles/${movieId}`)
        .then(response => response.json())
        .then((movieImdb_UrlJson) => {
            let movieObj = new Object();

            /* récupération de tous les attributs */
            movieObj.id = movieImdb_UrlJson["id"];
            movieObj.image_url = movieImdb_UrlJson["image_url"];
            movieObj.title = movieImdb_UrlJson["title"];
            movieObj.genres = movieImdb_UrlJson["genres"];
            movieObj.date_published = movieImdb_UrlJson["date_published"];
            movieObj.rated = movieImdb_UrlJson["rated"];
            movieObj.imdb_score = movieImdb_UrlJson["imdb_score"];
            movieObj.directors = movieImdb_UrlJson["directors"];
            movieObj.actors = movieImdb_UrlJson["actors"];
            movieObj.duration = movieImdb_UrlJson["duration"];
            movieObj.countries = movieImdb_UrlJson["countries"];
            movieObj.worldwide_gross_income = movieImdb_UrlJson["worldwide_gross_income"];
            movieObj.description = movieImdb_UrlJson["description"];
            return movieObj;
        })
}

async function openModal(movieId) {
    const modal = document.getElementById("modal");

    /* recuperation de chaque elements du DOM */
    let movieTitleModal = document.getElementById("modal-title");
    let movieImgModal = document.getElementById("modal-cover");
    let movieGenre = document.getElementById("modal-genre");
    let movieDatePublished = document.getElementById("modal-date-published");
    let movieRated = document.getElementById("modal-rated");
    let movieImdbScore = document.getElementById("modal-imdb-score");
    let movieDirectors = document.getElementById("modal-directors");
    let movieActors = document.getElementById("modal-actors");
    let movieDuration = document.getElementById("modal-duration");
    let movieCountries = document.getElementById("modal-countries");
    let movieWorldwideGrossIncome = document.getElementById("modal-worldwide-gross-income");
    let movieDescription = document.getElementById("modal-description");

    /* creation de l'objet film */
    movieModal = await createMovieObjModal(movieId);
    
    /* 'remplissage des champs du modal */
    movieImgModal.src = movieModal.image_url;
    movieTitleModal.innerHTML = movieModal.title;
    movieGenre.innerHTML = movieModal.genres;
    movieDatePublished.innerHTML = movieModal.date_published;
    movieRated.innetHTML = movieModal.rated;
    movieImdbScore.innerHTML = movieModal.imdb_score;
    movieDirectors.innerHTML = movieModal.directors;
    movieActors.innerHTML = movieModal.actors;
    movieDuration.innerHTML = movieModal.duration;
    movieCountries.innerHTML = movieModal.countries;
    movieWorldwideGrossIncome.innerHTML = movieModal.worldwide_gross_income;
    movieDescription.innerHTML = movieModal.description;

    /* affichage du modal */
    modal.style.display = null;
}

function closeModal() {

    /* faire disparaitre le modal */
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

function carouselLeft(gender) {
    let images = document.getElementById(gender).querySelectorAll(`[id^="img-"]`);
    let leftArrow = document.getElementById(gender + "-left");
    let rightArrow = document.getElementById(gender + "-right");
    if (!images[0].style.display) {
        images[0].style.display = "none";
        images[5].style.display = "";
        rightArrow.style.pointerEvents = "";
        rightArrow.style.opacity = "0.4";

    } else {
        if (!images[1].style.display) {
            images[1].style.display = "none";
            images[6].style.display = "";
            leftArrow.style.pointerEvents = "none";
            leftArrow.style.opacity = "0.1";
        }
    }
}

function carouselRight(gender) {
    let images = document.getElementById(gender).querySelectorAll(`[id^="img-"]`);
    let leftArrow = document.getElementById(gender + "-left");
    let rightArrow = document.getElementById(gender + "-right");
    if (!images[6].style.display) {
        images[6].style.display = "none";
        images[1].style.display = "";
        leftArrow.style.pointerEvents = "";
        leftArrow.style.opacity = "0.4";
    } else {
        if (!images[5].style.display) {
            images[5].style.display = "none";
            images[0].style.display = "";
            rightArrow.style.pointerEvents = "none";
            rightArrow.style.opacity = "0.1";
        }
    }
}


window.addEventListener('load', () => {
    /* execution à l'ouverture ou rafraichissement de la page index */
    extractDataBestMovie();
    extractDataMovies("Thriller");
    extractDataMovies("Horror");
    extractDataMovies("Comedy");
});
