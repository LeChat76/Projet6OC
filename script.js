function extractBestMovie() {

    fetch("http://localhost:8000/api/v1/titles/?sort_by=-year")
        .then(response => response.json())
        .then((bestMovie) => {
            bestMovieTitle.innerHTML = bestMovie["results"][0]["title"];
            besMovieImg.src = bestMovie["results"][0]["image_url"];
            fetch(bestMovie["results"][0]["url"])
                .then(response => response.json())
                .then(bestMovieDesc => {
                    bestMovieDescription.innerHTML = bestMovieDesc["description"];
                })
        })

        let bestMovieTitle = document.getElementById('best-movie-title');
        let besMovieImg = document.getElementsByClassName('best-movie-image')[0].getElementsByTagName("img")[0];
        let bestMovieDescription = document.getElementsByClassName('best-movie-summary')[0].getElementsByTagName("p")[0];

}

window.addEventListener('load', () => {
    extractBestMovie()
});