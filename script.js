const baseUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score";
let modal = null;

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
    let body = document.body;
    let newSection = document.createElement("section");
    newSection.setAttribute("class", "section_cat");
    body.appendChild(newSection);
    let title = document.createElement("h1");
    title.setAttribute("class", gender);
    title.style.fontFamily = gender;
    title.textContent = gender;
    newSection.appendChild(title);
    moviesUrls.forEach(movieUrl => {
        newImg = document.createElement("img");
        newImg.setAttribute("src", movieUrl.image_url);
        newImg.setAttribute("class", "cover");
        newImg.setAttribute("width", 210);
        newImg.setAttribute("onclick", "openModal(" + movieUrl.id + ")");
        newSection.appendChild(newImg);
    });
};

async function createMovieObjModal(movieId) {
    return fetch(`http://localhost:8000/api/v1/titles/${movieId}`)
        .then(response => response.json())
        .then((movieImdb_UrlJson) => {
            let movieObj = new Object();
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

    movieModal = await createMovieObjModal(movieId);
    
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

    modal.style.display = null;
}

function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

window.addEventListener('load', () => {
    extractDataBestMovie();
    extractDataMovies("Thriller");
    extractDataMovies("Horror");
    extractDataMovies("Comedy");
});
