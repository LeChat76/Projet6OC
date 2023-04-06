const baseUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score"

function extractBestMovie() {

    let bestMovieTitle = document.getElementById('best-movie-title');
    let bestMovieImg = document.getElementsByClassName('best-cover')[0].getElementsByTagName("img")[0];
    let bestMovieDescription = document.getElementsByClassName('best-movie-summary')[0].getElementsByTagName("p")[0];

    fetch(baseUrl)
        .then(response => response.json())
        .then((bestMovies) => {
            bestMovie = createBestMovieObject(bestMovies);
            bestMovieTitle.innerHTML = bestMovie.title;
            bestMovieImg.src = bestMovie.image_url;
            bestMovieDescription.innerHTML = bestMovie.description;
        })
}

function createBestMovieObject(bestMovies) {
    let bestMovieObj = new Object();
    bestMovieObj.title = bestMovies["results"][0]["title"];
    bestMovieObj.image_url = bestMovies["results"][0]["image_url"];
    fetch(bestMovies["results"][0]["url"])
    .then(response => response.json())
    .then(bestMovieDesc => {
        bestMovieDescription = bestMovieDesc["description"];
    })
    return bestMovieObj;
}

function extractDatadMovies(gender) {
    reqUrl = baseUrl + "&genre_contains=" + gender;
    let moviesImgUrls = new Array();
    fetch(reqUrl)
        .then(response => response.json())
        .then((movies) => {
            for (let i=0; i<5; i++) {  // pourquoi pas plus de 4 resultats?!?
                movieImgUrl = createMovieObject(movies["results"][i]);
                // console.log("movieImgUrl : ", movieImgUrl);
                moviesImgUrls.push(movieImgUrl);
            }
            createNewSection(moviesImgUrls, gender);
        })
        .catch(function(error) {
            console.log("Fetch_Error : " + error + "/ (i=" + i + ")")
        })
}

function createMovieObject(movie) {
    let movieObj = new Object();
    movieObj.image_url = movie["image_url"];
    return movieObj;
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
        newSection.appendChild(newImg);
    });
};

window.addEventListener('load', () => {
    extractBestMovie();
    extractDatadMovies("Thriller");
    extractDatadMovies("Horror");
    extractDatadMovies("Comedy");
});
