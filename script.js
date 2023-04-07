const baseUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score"

function extractDataBestMovie() {

    let bestMovieTitle = document.getElementById('best-movie-title');
    let bestMovieImg = document.getElementsByClassName('best-cover')[0].getElementsByTagName("img")[0];
    let bestMovieDescription = document.getElementsByClassName('best-movie-summary')[0].getElementsByTagName("p")[0];

    fetch(baseUrl)
        .then(response => response.json())
        .then((bestMovies) => {
            bestMovie = createMovieObject(bestMovies["results"][0]);
            bestMovieTitle.innerHTML = bestMovie.title;
            bestMovieImg.src = bestMovie.image_url;
            bestMovieDescription.innerHTML = bestMovie.description; // pourquoi retourne "undefined"?!?!!!!
        })
}

function createMovieObject(movie) {
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
    fetch(movie["url"])
        .then(response => response.json())
        .then((movieImdb_Url) => {
            movieObj.duration = movieImdb_Url["duration"];
            movieObj.countries = movieImdb_Url["countries"];
            movieObj.worldwide_gross_income = movieImdb_Url["worldwide_gross_income"];
            movieObj.description = movieImdb_Url["description"];
            console.log(movieObj);
        })
    return movieObj;
}

function extractDataMovies(gender) {
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
    extractDataBestMovie();
    extractDataMovies("Thriller");
    extractDataMovies("Horror");
    extractDataMovies("Comedy");
});
