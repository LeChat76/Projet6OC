function extractBestMovie() {

    fetch("http://localhost:8000/api/v1/titles/?sort_by=-title")
        .then(response => response.json())
        .then((bestMovie) => {
            bestMovieTitle.innerHTML = bestMovie["results"][0]["title"];
            besMovieImg.src = bestMovie["results"][0]["image_url"];
            fetch(bestMovie["results"][0]["url"])
                .then(response => response.json())
                .then(bestMovieDesc => {
                    bestMovieDescription.innerHTML = bestMovieDesc["description"];
                    bestMovieLongDescription.innerHTML = bestMovieDesc["long_description"];
                })
        })

        let bestMovieTitle = document.getElementById('best-movie-title');
        let besMovieImg = document.getElementsByClassName('best-movie-image')[0].getElementsByTagName("img")[0];
        let bestMovieDescription = document.getElementsByClassName('best-movie-summary')[0].getElementsByTagName("p")[0];
        let bestMovieLongDescription = document.getElementsByClassName('best-movie-description')[0].getElementsByTagName("span")[0];
}

window.addEventListener('load', () => {
    extractBestMovie()
});

function extractRandomMovies() {

    fetch("http://localhost:8000/api/v1/titles/")
        .then(response => response.json())
        .then((bestMovie) => {
            bestMovieTitle.innerHTML = bestMovie["results"][0]["title"];
            besMovieImg.src = bestMovie["results"][0]["image_url"];
            fetch(bestMovie["results"][0]["url"])
                .then(response => response.json())
                .then(bestMovieDesc => {
                    bestMovieDescription.innerHTML = bestMovieDesc["description"];
                    bestMovieLongDescription.innerHTML = bestMovieDesc["long_description"];
                })
        })

        let bestMovieTitle = document.getElementById('best-movie-title');
        let besMovieImg = document.getElementsByClassName('best-movie-image')[0].getElementsByTagName("img")[0];
        let bestMovieDescription = document.getElementsByClassName('best-movie-summary')[0].getElementsByTagName("p")[0];
        let bestMovieLongDescription = document.getElementsByClassName('best-movie-description')[0].getElementsByTagName("span")[0];
}

function displayDescription() {
    /* fonction d'affichage ou 'cachage' de la longue description quand on click sur le bouton */
    let span = document.getElementById("best-movie-description");
    if(span.style.display == "none") {
      span.style.display = "inline";
    } 
    else if (span.style.display = "inline") {
      span.style.display = "none";
    }
}