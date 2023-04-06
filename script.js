function extractBestMovie() {

    let bestMovieTitle = document.getElementById('best-movie-title');
    let besMovieImg = document.getElementsByClassName('best-movie-image')[0].getElementsByTagName("img")[0];
    let bestMovieDescription = document.getElementsByClassName('best-movie-summary')[0].getElementsByTagName("p")[0];
    // let bestMovieLongDescription = document.getElementsByClassName('best-movie-description')[0].getElementsByTagName("span")[0];

    fetch("http://localhost:8000/api/v1/titles/?sort_by=-imdb_score")
        .then(response => response.json())
        .then((bestMovie) => {
            bestMovieTitle.innerHTML = bestMovie["results"][0]["title"];
            besMovieImg.src = bestMovie["results"][0]["image_url"];
            fetch(bestMovie["results"][0]["url"])
                .then(response => response.json())
                .then(bestMovieDesc => {
                    bestMovieDescription.innerHTML = bestMovieDesc["description"];
                    // bestMovieLongDescription.innerHTML = bestMovieDesc["long_description"];
                })
        })
}

function extractDatadMovies(gender) {
    if (gender != undefined) {
        reqUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre_contains=" + gender;
        var i = 1;
    } else {
        reqUrl = "http://localhost:8000/api/v1/titles/?sort_by=-imdb_score"
        var i = 0;
    }
    let moviesUrls = [];
    // console.log("Link:", reqURL)
    fetch(reqUrl)
        .then(response => response.json())
        .then((movie) => {
            // console.log("Movie:", Movie)
            // console.log("Begin : ", i);
            for (i; i<5; i++) {  // pourquoi pas plus de 4 resultats?!?
                movieUrl = movie["results"][i]["image_url"];
                // console.log("MovieUrl:", movieUrl);
                moviesUrls.push(movieUrl);
                // console.log("MoviesUrls : ", moviesUrls)
            }
        })
        .catch(function(error) {
            console.log("Fetch_Error : " + error + "/ (i=" + i + ")")
        })
    // console.log("List movies URLs : " + moviesUrls)
    createNewSection(moviesUrls, gender);
}

function createNewSection(moviesUrls, gender) {
    // let test = ["https://m.media-amazon.com/images/M/MV5BNjFjNDQyYzYtZjI2NC00NmMwLTg1NjgtNTMxMWJjYTYxZjQ3XkEyXkFqcGdeQXVyMTA5MzgzNDUz._V1_UY268_CR1,0,182,268_AL_.jpg", "https://m.media-amazon.com/images/M/MV5BMTZjZjM3NTQtOTFmOS00ZGI3LWI2MGQtMGE3MWNlZTE2OWM3XkEyXkFqcGdeQXVyMTExNzA5NzE4._V1_UY268_CR9,0,182,268_AL_.jpg", "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UX182_CR0,0,182,268_AL_.jpg", "https://m.media-amazon.com/images/M/MV5BOWI4NGQ1M2YtNDM2Yi00YzAzLWJmZmYtMjkxZWMwNmM5Y2NhXkEyXkFqcGdeQXVyMjQ2OTI2MzU@._V1_UX182_CR0,0,182,268_AL_.jpg"]
    console.log("moviesUrls", moviesUrls)
    let body = document.body;
    let newSection = document.createElement("section");
    newSection.setAttribute("class", "section_cat");
    body.appendChild(newSection);
    let title = document.createElement("h1");
    title.textContent = gender;
    newSection.appendChild(title);
    console.log("TypeMoviesUrls", moviesUrls.length);
    const array = [1, 2, 5];
    console.log("Array : ", array);
    console.log("moviesUrls", moviesUrls);
    console.log("Debut ForEach");
    moviesUrls.forEach(movieUrl => {
        console.log("Element : ", array);
        console.log("Debut ForEach");
        newImg = document.createElement("img");
        newImg.setAttribute("src", movieUrl);
        newImg.setAttribute("class", "cat_img");
        newSection.appendChild(newImg);
        console.log("MovieUrl", movieUrl);
    });
};

window.addEventListener('load', () => {
    extractBestMovie();
    extractDatadMovies("Drama");
    extractDatadMovies("Horror");
    extractDatadMovies("Comedy");
});
