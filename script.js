const baseUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score"
let modal = null;

async function extractDataBestMovie() {

    let bestMovieTitle = document.getElementById('best-movie-title');
    let bestMovieImg = document.getElementsByClassName('best-cover')[0].getElementsByTagName("img")[0];
    let bestMovieDescription = document.getElementsByClassName('best-movie-summary')[0].getElementsByTagName("p")[0];
    // let bestMovie;

    const bestMovies = await fetch(baseUrl)
        .then(response => response.json())
        bestMovie = await createMovieObjModal(bestMovies["results"][0]["id"]);
        bestMovieTitle.innerHTML = bestMovie.title;
        bestMovieImg.src = bestMovie.image_url;
        bestMovieDescription.innerHTML = bestMovie.description;
        bestMovieImg.setAttribute("onclick", "openModal(" + bestMovie.id + ")");
}

async function createMovieObject(movie) {
    let movieObj = new Object();
    movieObj.id = movie["id"];
    movieObj.image_url = movie["image_url"];
    movieObj.title = movie["title"];
    movieObj.genres = movie["genres"];
    movieObj.year = movie["year"];
    movieObj.votes = movie["votes"];
    movieObj.imdb_score = movie["imdb_score"];
    movieObj.directors = movie["directors"];
    movieObj.actors = movie["actors"];
    await fetch(movie["url"])
        .then(response => response.json())
        .then((movieImdb_UrlJson) => {
            movieObj.duration = movieImdb_UrlJson["duration"];
            movieObj.countries = movieImdb_UrlJson["countries"];
            movieObj.worldwide_gross_income = movieImdb_UrlJson["worldwide_gross_income"];
            movieObj.description = movieImdb_UrlJson["description"];
        })
    return movieObj;
}

async function createMovieObjModal(movieId) {
    return fetch(`http://localhost:8000/api/v1/titles/${movieId}`)
        .then(response => response.json())
        .then((movieImdb_UrlJson) => {
            let movieObj = new Object();
            movieObj.id = movieImdb_UrlJson["id"];
            movieObj.image_url = movieImdb_UrlJson["image_url"];
            movieObj.title = movieImdb_UrlJson["title"];
            movieObj.genres = movieImdb_UrlJson["genres"];
            movieObj.year = movieImdb_UrlJson["year"];
            movieObj.votes = movieImdb_UrlJson["votes"];
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
    title.textContent = gender;
    newSection.appendChild(title);
    moviesUrls.forEach(movieUrl => {
        newImg = document.createElement("img");
        newImg.setAttribute("src", movieUrl.image_url);
        newImg.setAttribute("class", "cover");
        newImg.setAttribute("width", 210);
        newImg.setAttribute("onclick", "openModal(" + movieUrl.id + ")")
        newSection.appendChild(newImg);
    });
};

async function openModal(movieId) {
    const modal = document.getElementById("modal");
    let movieTitleModal = document.getElementById("modal-title");
    let movieImgModal = document.getElementById("modal-cover");

    // const modalClose = document.getElementById("modal-close");
    movieModal = await createMovieObjModal(movieId);
    
    movieTitleModal.innerHTML = movieModal.title;
    movieImgModal.src = movieModal.image_url;

    modal.style.display = null;

    activeModal = modal;

    activeModal.addEventListener("click", closeModal());
    movieImgModal.addEventListener("click", closeModal());
}

function closeModal() {
    if (modal === null) return;
    modal.style.display = "none";
    modal.removeEventListener("click", closeModal());
    movieImgModal.removeEventListener("click", closeModal());
    modal = null
    console.log(modal.style.display);
}

window.addEventListener('load', () => {
    extractDataBestMovie();
    extractDataMovies("Thriller");
    extractDataMovies("Horror");
    extractDataMovies("Comedy");
});
