const baseUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
const coverWidth = 210;
const coverMaxScrollLeft = 700;
const coverMinScrollLeft = 250;

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
        bestMovieImg.setAttribute("title", bestMovie.title + " (cliquez moi pour infos)")
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
    if (gender == "Best") {
        reqUrl = baseUrl + "&page_size=8"
    } else {
        reqUrl = baseUrl + "&genre_contains=" + gender + "&page_size=7";
    }
    let moviesImgUrls = new Array();
    const movies = await fetch(reqUrl)
        .then(response => response.json())
        if (gender == "Best") {
            for (let i=1; i<8; i++) {
                movieImgUrl = await createMovieObject(movies["results"][i]);
                moviesImgUrls.push(movieImgUrl);
            }
        } else {
            for (let i=0; i<7; i++) {
                movieImgUrl = await createMovieObject(movies["results"][i]);
                moviesImgUrls.push(movieImgUrl);
            }
        }

        createDivImg(moviesImgUrls, gender);
}

function createNewSection(moviesUrls, gender) {

    /* creation des images */
    moviesUrls.forEach((movieUrl, index) => {
        let newImg = document.getElementById("img-" + gender + "-" + (index + 1));
        newImg.setAttribute("src", movieUrl.image_url);
        newImg.setAttribute("onclick", "openModal(" + movieUrl.id + ")");
        newImg.setAttribute("title", movieUrl.title + " (cliquez moi pour infos)");
    });

    let rightArrow = document.getElementById(gender + "-right");
    let leftArrow = document.getElementById(gender + "-left");

    /* modification du positionnement des boutons en fonctions de la taille de la section */
    let heightContainer = container.clientHeight;
    let heightArrow = rightArrow.clientHeight;
    leftArrow.style.marginTop = (((heightContainer - (heightArrow / 2)) / 2) + "px");
    rightArrow.style.marginTop = (((heightContainer - (heightArrow / 2)) / 2) + "px");
};

function createDivImg(moviesUrls, gender) {

    let containerDiv = document.getElementById("container-" + gender);

    /* creation des img */
    moviesUrls.forEach((movieUrl, index) => {
        newImg = document.createElement("img");
        newImg.setAttribute("src", movieUrl.image_url);
        newImg.setAttribute("class", "cover");
        newImg.setAttribute("onclick", "openModal(" + movieUrl.id + ")");
        newImg.setAttribute("id", "img-" + gender + "-" + (index + 1));
        newImg.setAttribute("style", "display: null;");
        newImg.setAttribute("title", movieUrl.title + " (cliquez moi pour infos)");
        containerDiv.appendChild(newImg);
    });

    let rightArrow = document.getElementById(gender + "-right");
    let leftArrow = document.getElementById(gender + "-left");

    /* modification du positionnement des boutons en fonctions de la taille de la section */
    let heightContainer = container.clientHeight;
    let heightArrow = rightArrow.clientHeight;
    leftArrow.style.marginTop = (((heightContainer - (heightArrow / 2)) / 2) + "px");
    rightArrow.style.marginTop = (((heightContainer - (heightArrow / 2)) / 2) + "px");
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

function carouselRight(gender) {
    let imgContainer = document.getElementById("container-" + gender);
    let leftArrow = document.getElementById(gender + "-left");
    let rightArrow = document.getElementById(gender + "-right");
    leftArrow.style.pointerEvents = "auto";
    leftArrow.style.opacity = "0.4";

    imgContainer.scrollLeft += (coverWidth + 40);

    /* desactivation du bouton fleche droite quand arrivé a la derniere image */
    if (imgContainer.scrollLeft >= coverMaxScrollLeft) {
        console.log("imgContainer.scrollLeft : ", imgContainer.scrollLeft);
        rightArrow.style.pointerEvents = "none";
        rightArrow.style.opacity = "0.1";
    }
}

function carouselLeft(gender) {
    let imgContainer = document.getElementById("container-" + gender);
    let leftArrow = document.getElementById(gender + "-left");
    let rightArrow = document.getElementById(gender + "-right");
    rightArrow.style.pointerEvents = "auto";
    rightArrow.style.opacity = "0.4";

    imgContainer.scrollLeft -= (coverWidth + 40);

    /* desactivation du bouton fleche gauche quand arrivé au a la premiere image */
    if (imgContainer.scrollLeft <= coverMinScrollLeft) {
        console.log("imgContainer.scrollLeft : ", imgContainer.scrollLeft);
        leftArrow.style.pointerEvents = "none";
        leftArrow.style.opacity = "0.1";
    }
}

window.addEventListener('load', () => {
    
    /* execution à l'ouverture ou rafraichissement de la page index */
    extractDataBestMovie();
    extractDataMovies("Best");
    extractDataMovies("Horror");
    extractDataMovies("Thriller");
    extractDataMovies("Comedy");
});
