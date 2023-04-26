const BASE_URL = "http://localhost:8000/api/v1/titles";
const BASE_URL_BY_SCORE = BASE_URL + "/?sort_by=-imdb_score";
const COVER_WIDTH = 210;

setInterval(extractDataBestMovie, 10000);
setInterval(extractDataMovies, 10000, "Best");
setInterval(extractDataMovies, 10000, "Horror");
setInterval(extractDataMovies, 10000, "Thriller");
setInterval(extractDataMovies, 10000, "Comedy");

async function extractDataBestMovie() {

    let bestMovieTitle = document.getElementById("best-movie-title");
    let bestMovieImg = document.getElementsByClassName("best-cover")[0].getElementsByTagName("img")[0];
    let bestMovieDescription = document.getElementsByClassName("best-movie-summary")[0].getElementsByTagName("p")[0];
    let bestMovieButton = document.getElementById("bestMovieButton");

    let bestMovies = await fetch(BASE_URL_BY_SCORE)
        .then(response => response.json())
        bestMovie = await getMovieInfos(bestMovies["results"][0]["id"]);
        bestMovieTitle.innerHTML = bestMovie.title;
        bestMovieImg.src = bestMovie.image_url;
        bestMovieImg.setAttribute("onDragStart", "return false");
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
        reqUrl = BASE_URL_BY_SCORE + "&page_size=8"
    } else {
        reqUrl = BASE_URL_BY_SCORE + "&genre_contains=" + gender + "&page_size=7";
    }
    let moviesImgUrls = new Array();
    let movies = await fetch(reqUrl)
        .then(response => response.json())
        var minImg = 0;
        var maxImg = 7;
        if (gender == "Best") {
            var minImg = 1;
            var maxImg = 8;
        }
        for (let i=minImg; i<maxImg; i++) {
            movieImgUrl = await createMovieObject(movies["results"][i]);
            moviesImgUrls.push(movieImgUrl);
        }

        createDivImg(moviesImgUrls, gender);
}

function createDivImg(moviesUrls, gender) {

    let containerDiv = document.getElementById("container-" + gender);
    containerDiv.innerHTML = "";

    // console.log("Declenchement setInterval : " + gender);

    /* creation des img */
    moviesUrls.forEach((movieUrl, index) => {
        newImg = document.createElement("img");
        newImg.setAttribute("src", movieUrl.image_url);
        newImg.setAttribute("class", "cover");
        newImg.setAttribute("onclick", "openModal(" + movieUrl.id + ")");
        newImg.setAttribute("id", "img-" + gender + "-" + (index + 1));
        newImg.setAttribute("style", "display: null;");
        newImg.setAttribute("title", movieUrl.title + " (cliquez pour infos)");
        newImg.setAttribute("onDragStart", "return false");
        containerDiv.appendChild(newImg);
    });

    let rightArrow = document.getElementById(gender + "-right");
    let leftArrow = document.getElementById(gender + "-left");

    /* positionnement auto des boutons en fonctions de taille de la section */
    let heightContainer = containerDiv.clientHeight;
    let heightArrow = rightArrow.clientHeight;
    leftArrow.style.marginTop = (((heightContainer - heightArrow) / 2) + "px");
    rightArrow.style.marginTop = (((heightContainer - heightArrow) / 2) + "px");
};


async function getMovieInfos(movieId) {
    return fetch(`${BASE_URL}/${movieId}`)
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
    let modal = document.getElementById("modal");

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
    movieModal = await getMovieInfos(movieId);

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
    let modal = document.getElementById("modal");
    modal.style.display = "none";
}

function carouselRight(gender) {
    let imgContainer = document.getElementById("container-" + gender);
    let leftArrow = document.getElementById(gender + "-left");
    // let rightArrow = document.getElementById(gender + "-right");
    leftArrow.style.pointerEvents = "auto";
    leftArrow.style.opacity = "0.4";
    imgContainer.scrollLeft += (COVER_WIDTH + 40);
}

function carouselLeft(gender) {
    let imgContainer = document.getElementById("container-" + gender);
    // let leftArrow = document.getElementById(gender + "-left");
    let rightArrow = document.getElementById(gender + "-right");
    rightArrow.style.pointerEvents = "auto";
    rightArrow.style.opacity = "0.4";
    imgContainer.scrollLeft -= (COVER_WIDTH + 40);
}

window.addEventListener("load", () => {

    /* execution à l'ouverture ou rafraichissement de la page index */
    extractDataBestMovie();
    extractDataMovies("Best");
    extractDataMovies("Horror");
    extractDataMovies("Thriller");
    extractDataMovies("Comedy");
});
