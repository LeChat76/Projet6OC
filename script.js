/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
const BASE_URL = 'http://localhost:8000/api/v1/titles'
const BASE_URL_BY_SCORE = BASE_URL + '/?sort_by=-imdb_score'
const COVER_WIDTH = 210
const MIN_IMG_CAROUSEL = 0
const MAX_IMG_CAROUSEL = 7
const MIN_IMG_BEST_CAROUSEL = 1
const MAX_IMG_BEST_CAROUSEL = 8

// setInterval(console.clear, 9999)
setInterval(extractDataBestMovie, 10000)
setInterval(extractDataMovies, 10000, 'Best')
setInterval(extractDataMovies, 10000, 'Horror')
setInterval(extractDataMovies, 10000, 'Thriller')
setInterval(extractDataMovies, 10000, 'Comedy')

async function extractDataBestMovie () {
    const bestMovieTitle = document.getElementById('best-movie-title')
    const bestMovieImg = document.getElementsByClassName(
        'best-cover')[0].getElementsByTagName('img')[0]
    const bestMovieDescription = document.getElementsByClassName(
        'best-movie-summary')[0].getElementsByTagName('p')[0]
    const bestMovieButton = document.getElementById('bestMovieButton')

    const bestMovies = await fetch(BASE_URL_BY_SCORE)
        .then(function (response) {
            return response.json()
        })
        .catch(function (error) {
            alert("Probleme de connexion à l'API : " + error)
        })
    const bestMovie = await getMovieInfos(bestMovies.results[0].id)
    bestMovieTitle.innerHTML = bestMovie.title
    bestMovieImg.src = bestMovie.image_url
    bestMovieImg.setAttribute('onDragStart', 'return false')
    bestMovieDescription.innerHTML = bestMovie.description
    bestMovieImg.setAttribute('onclick', 'openModal(' + bestMovie.id + ')')
    bestMovieImg.setAttribute('title', bestMovie.title +
        ' (cliquez moi pour infos)')
    bestMovieButton.setAttribute('onclick', 'openModal(' + bestMovie.id + ')')
}

function createMovieObject (movie) {
    const movieObj = {}
    movieObj.id = movie.id
    movieObj.image_url = movie.image_url
    movieObj.title = movie.title
    return movieObj
}

async function extractDataMovies (gender) {
    let minImg = MIN_IMG_CAROUSEL
    let maxImg = MAX_IMG_CAROUSEL
    if (gender === 'Best') {
        minImg = MIN_IMG_BEST_CAROUSEL
        maxImg = MAX_IMG_BEST_CAROUSEL
    }
    let reqUrl = null
    if (gender === 'Best') {
        reqUrl = BASE_URL_BY_SCORE + '&page_size=' + MAX_IMG_BEST_CAROUSEL
    } else {
        reqUrl = BASE_URL_BY_SCORE + '&genre_contains=' + gender +
            '&page_size=' + MAX_IMG_CAROUSEL
    }
    const moviesImgUrls = []
    await fetch(reqUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (response) {
            let i = minImg
            for (i; i < maxImg; i += 1) {
                const movieImgUrl = createMovieObject(response.results[i])
                moviesImgUrls.push(movieImgUrl)
            }
        })

    createDivImg(moviesImgUrls, gender)
}

function createDivImg (moviesUrls, gender) {
    const containerDiv = document.getElementById('container-' + gender)
    containerDiv.innerHTML = ''

    // console.log('Declenchement setInterval : ' + gender)

    /* creation des img */
    moviesUrls.forEach((movieUrl, index) => {
        const newImg = document.createElement('img')
        newImg.setAttribute('src', movieUrl.image_url)
        newImg.setAttribute('class', 'cover')
        newImg.setAttribute('onclick', 'openModal(' + movieUrl.id + ')')
        newImg.setAttribute('id', 'img-' + gender + '-' + (index + 1))
        newImg.setAttribute('style', 'display: null;')
        newImg.setAttribute('title', movieUrl.title +
            ' (cliquez moi pour infos)')
        newImg.setAttribute('onDragStart', 'return false')
        containerDiv.appendChild(newImg)
    })

    const rightArrow = document.getElementById(gender + '-right')
    const leftArrow = document.getElementById(gender + '-left')

    /* positionnement auto des boutons en fonctions de taille de la section */
    const heightContainer = containerDiv.clientHeight
    const heightArrow = rightArrow.clientHeight
    leftArrow.style.marginTop = (((heightContainer - heightArrow) / 2) + 'px')
    rightArrow.style.marginTop = (((heightContainer - heightArrow) / 2) + 'px')
}

async function getMovieInfos (movieId) {
    return await fetch(`${BASE_URL}/${movieId}`)
        .then(function (response) {
            return response.json()
        })
        .then(function (movieImdbUrlJson) {
            const movieObj = {}

            /* récupération de tous les attributs */
            movieObj.id = movieImdbUrlJson.id
            movieObj.image_url = movieImdbUrlJson.image_url
            movieObj.title = movieImdbUrlJson.title
            movieObj.genres = movieImdbUrlJson.genres
            movieObj.date_published = movieImdbUrlJson.date_published
            movieObj.rated = movieImdbUrlJson.rated
            movieObj.imdb_score = movieImdbUrlJson.imdb_score
            movieObj.directors = movieImdbUrlJson.directors
            movieObj.actors = movieImdbUrlJson.actors
            movieObj.duration = movieImdbUrlJson.duration
            movieObj.countries = movieImdbUrlJson.countries
            movieObj.worldwide_gross_income =
                movieImdbUrlJson.worldwide_gross_income
            movieObj.description = movieImdbUrlJson.description
            return movieObj
        })
}

async function openModal (movieId) {
    const modal = document.getElementById('modal')

    /* recuperation de chaque elements du DOM */
    const movieTitleModal = document.getElementById('modal-title')
    const movieImgModal = document.getElementById('modal-cover')
    const movieGenre = document.getElementById('modal-genre')
    const movieDatePublished = document.getElementById('modal-date-published')
    const movieRated = document.getElementById('modal-rated')
    const movieImdbScore = document.getElementById('modal-imdb-score')
    const movieDirectors = document.getElementById('modal-directors')
    const movieActors = document.getElementById('modal-actors')
    const movieDuration = document.getElementById('modal-duration')
    const movieCountries = document.getElementById('modal-countries')
    const movieWorldwideGrossIncome = document.getElementById(
        'modal-worldwide-gross-income')
    const movieDescription = document.getElementById('modal-description')

    /* creation de l'objet film */
    const movieModal = await getMovieInfos(movieId)

    /* 'remplissage des champs du modal */
    movieImgModal.src = movieModal.image_url
    movieTitleModal.innerHTML = movieModal.title
    movieGenre.innerHTML = movieModal.genres
    movieDatePublished.innerHTML = movieModal.date_published
    movieRated.innerHTML = movieModal.rated
    movieImdbScore.innerHTML = movieModal.imdb_score
    movieDirectors.innerHTML = movieModal.directors
    movieActors.innerHTML = movieModal.actors
    movieDuration.innerHTML = movieModal.duration
    movieCountries.innerHTML = movieModal.countries
    movieWorldwideGrossIncome.innerHTML = movieModal.worldwide_gross_income
    movieDescription.innerHTML = movieModal.description

    /* affichage du modal */
    modal.style.display = null
}

function closeModal () {
    /* faire disparaitre le modal */
    const modal = document.getElementById('modal')
    modal.style.display = 'none'
}

function carouselRight (gender) {
    const imgContainer = document.getElementById('container-' + gender)
    const leftArrow = document.getElementById(gender + '-left')
  // let rightArrow = document.getElementById(gender + "-right");
    leftArrow.style.pointerEvents = 'auto'
    leftArrow.style.opacity = '0.4'
    imgContainer.scrollLeft += (COVER_WIDTH + 40)
}

function carouselLeft (gender) {
    const imgContainer = document.getElementById('container-' + gender)
    const rightArrow = document.getElementById(gender + '-right')
    rightArrow.style.pointerEvents = 'auto'
    rightArrow.style.opacity = '0.4'
    imgContainer.scrollLeft -= (COVER_WIDTH + 40)
}

window.addEventListener('load', () => {
  /* execution à l'ouverture ou rafraichissement de la page index */
    extractDataBestMovie()
    extractDataMovies('Best')
    extractDataMovies('Horror')
    extractDataMovies('Thriller')
    extractDataMovies('Comedy')
})
