// import keys from './auth.js'

const resaultContainer = document.querySelector('#resaultContainer');
const searchInput = document.querySelector('#searchInput');
const searchBtn = document.querySelector('#searchBtn');
const listBtn = document.querySelector('#listBtn');
const selectedList = document.querySelector('#selectedList');
const singleElement = document.querySelector('#singleElement');
const modalListContent = document.querySelector('#modalListContent');
const counter = document.querySelector('#counter');
const toastMessage = document.querySelector('#toastMessage');
const movieDetailView = document.querySelector('#movieDetailView');

const alertMessage = document.querySelector('#alertMessage');
const movieListMessage = document.querySelector('#movieListMessage');
const searchPagination = document.querySelector('#searchPagination');
const spinerContainer = document.querySelector('#spinerContainer');


const key = 'b1c7adef';
let page = 1;
let prevPage = 0;
let nextPage = 2;

// Moguci odgovori sa API-ja
let movies = [];
let totalResults = 0;

// let readStorage = JSON.parse(localStorage.getItem('movieList'));


// Prikazivanje liste filmova u LS na load stranice
window.addEventListener('load', () => {

    let store = localStorage.getItem('movieList');;

    if (store == null) {
        store = localStorage.setItem('movieList', JSON.stringify(''));
    }

    moviesCounter()
    showMovieList();
    showMovieDetails();
})


// Pretraga na klik Search dugmeta
searchBtn.addEventListener('click', async () => {

    // spiner = showSpiner();

    // searchInput.value = '';
    resaultContainer.innerHTML = '';

    
    if(searchInput.value != ''){
        fetchData();
    }else{
        alertMessage.innerHTML = `
            <div class="alert alert-info alert-dismissible fade show mx-2 float my-6 z-3 text-center" role="alert">
                Search field is empty! Enter movie name for search.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `
        setTimeout(() => {
            alertMessage.innerHTML = '';
        }, "1500") 
    }
})


// Pretraga na Enter dugme
searchInput.addEventListener('keypress', async (e) => {

    // searchInput.value = '';
    resaultContainer.innerHTML = '';

    if(e.key === 'Enter'){
        searchInput.value = '';
        resaultContainer.innerHTML = '';
    
        const url = `https://www.omdbapi.com/?apikey=${key}&s=${searchInput.value}&page=${page}`;
    
        try {
            await fetch(url)
                .then((response) => response.json())
                .then((data) => {
    
                    movies = data.Search

                    showSearcResault()
                });
    
        } catch (error) {
            console.log(error);
        }
    }
})


// Fetch podataka sa API-ja
const fetchData = async () => {

    const url = `https://www.omdbapi.com/?apikey=${key}&s=${searchInput.value}&page=${page}`;

    try {
        await fetch(url)
            .then((response) => response.json())
            .then((data) => {

                movies = data.Search
                totalResults = data.totalResults
                res = data.Response

                // if(data.Response == 'true'){
                //     showSpiner();
                // }
                showSearcResault()
                pagination();
            });
            
        } catch (error) {
            console.log(error);
        }
}


// Prikazivanje rezultata pretrage 
const showSearcResault = () => {

    movies.forEach((element, idx) => {

        resaultContainer.innerHTML += `
            <div class="col d-flex justify-content-center my-3 ">
                <div class="card text-bg-dark customOpacity " style="width: 19rem;">
                    <img src=${element.Poster} class="card-img-top imgHeight" alt="..." style="height: 22rem; object-fit: cover; "/>
                    <div class="card-body py-2">
                        <h5 class="card-title m-0 mt-2 text-white" >${element.Title}</h5>
                    </div>
                    <ul class="list-group list-group-flush border-dark" >
                        <li class="list-group-item text-bg-dark fs-6 border-dark text-white-50">Year: ${element.Year}</li>
                        <li class="list-group-item text-bg-dark fs-6 border-dark text-white-50">Genre: ${element.Type}</li>
                    </ul>
                    <div class="card-body d-flex justify-content-between p-3 px-3 border-dark">
                        <a href="#" class="card-link text-info fs-6" onclick=getMovieDetails('${element.imdbID}') >More Info</a>
                        <span class="btn btn-outline-success btn-sm" onclick=addMovieToList('${element.imdbID}') >Add to list</span>
                    </div>
                </div>
            </div>
        `;
    })
    
};


// Dodavanje filmova po IMDBID u LocalStorage za koriscenje u Listi Odabranih filmova
const addMovieToList = (imdbID) => {

    const url = `https://www.omdbapi.com/?apikey=${key}&i=${imdbID}`;

    try {
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
    
                let store = JSON.parse(localStorage.getItem('movieList'));
                // movieList.push(data);
                store = [...store, data]
                localStorage.setItem('movieList', JSON.stringify(store));

                alertMessage.innerHTML = `
                    <div class="alert alert-success alert-dismissible fade show mx-2 float my-6 z-3 text-center" role="alert">
                        Movie added to list.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `
                setTimeout(() => {
                    alertMessage.innerHTML = '';
                }, "1500")
                  
                showMovieList();
            })
        
    } catch (error) {
        console.log(error)
    }
}



// Prikaz liste sa dodatim filmovima
const showMovieList = () => {

    modalListContent.innerHTML = ''

    const store = JSON.parse(localStorage.getItem('movieList'));

    if(store == null || store.length === 0){

        modalListContent.innerHTML = `
            <h2 class="fs-5 text-info">You don't have movies in the list.</h2>
        `
    }else{

        store.forEach((element, idx) => {

            modalListContent.innerHTML += `
                <div class="">
                    <div class="movie__card d-flex mb-3">
                        <img src=${element.Poster} alt=${element.Title} style="height: 220px;">

                        <div>
                            <ul class="list-group list-group-flush border-dark" >
                                <li class="list-group-item text-bg-dark fs-6 border-dark text-white-50 py-1 pe-0 pt-0">Title: <span class="text-white">${element.Title}</span> </li>
                                <li class="list-group-item text-bg-dark fs-6 border-dark text-white-50 py-1 pe-0">Director: <span class="text-white">${element.Director}</span> </li>
                                <li class="list-group-item text-bg-dark fs-6 border-dark text-white-50 py-1 pe-0">Year: <span class="text-white">${element.Year}</span></li>
                                <li class="list-group-item text-bg-dark fs-6 border-dark text-white-50 py-1 pe-0">IMDB Rating: <span class="text-white">${element.imdbRating}</span></li>
                                <li class="list-group-item text-bg-dark fs-6 border-dark text-white-50 py-1 pe-0">Genre: <span class="text-white">${element.Genre}</span></li>
                                <li class="list-group-item text-bg-dark fs-6 border-dark text-white-50 py-1 pe-0">Actors: <span class="text-white">${element.Actors}</span></li>
                            </ul>
                        </div>

                    </div>

                    <span class="text-danger me-2" type="button" onclick=deleteFromMovieList(${idx})><i class="bi bi-trash3 fs-5 pointer"></i></span>
                    <span class="text-success" type="button" onclick=getMovieDetails('${element.imdbID}')><i class="bi bi-eye fs-5 pointer"></i></span>
                </div>
                <hr class="text-bg-dark mb-4">
            `
        });
    }

    moviesCounter();
}


// Brisanje filma iz Liste odabranih
const deleteFromMovieList = (idx) => {

    const store = JSON.parse(localStorage.getItem('movieList'));

    if (confirm(`Are you sure you want to delete movie from list?`)) {

        store.splice(idx, 1);

        localStorage.setItem('movieList', JSON.stringify(store));

        movieListMessage.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show w-75 m-0 text-center px-2" role="alert">
                Movie delleted from the list.
            </div>
        `

        setTimeout(() => {
            movieListMessage.innerHTML = '';
        }, "1500")
          
    }

    showMovieList();
    moviesCounter();
}


// Fetch detalje filma sa API uz pomoc IMCBID filma
const getMovieDetails = (imdbID) => {

    localStorage.removeItem('movieDetails');

    const url = `https://www.omdbapi.com/?apikey=${key}&i=${imdbID}`;
    
    try {
        fetch(url)
        .then((response) => response.json())
        .then((data) =>  localStorage.setItem('movieDetails', JSON.stringify(data)))
        .then((_) => {

            window.location = `movieDetails.html?id=${imdbID}`;
        });
        
    } catch (error) {
        console.log(error);
    }
}


// Prikazivanje svih detalja fetchovanog filma na stranici MovieDetails
const showMovieDetails = () => {

    const storageMovie = JSON.parse(localStorage.getItem('movieDetails'));
        
        movieDetailView.innerHTML = `
                        
            <article class="single__movie d-flex flex-column flex-md-row text-white container my-3">
        
                <table class="table table-borderless w-md-75">
                    <thead>
                        <tr>
                            <th colspan="6"><h1 class="fs-3 mb-3 text-white">${storageMovie.Title}</h1></th>
                        </tr>
                    </thead>
        
                    <tr>
                        <th scope="row" colspan="2"> <label for="" class="text-white-50">Release date:</label></th>
                        <td><h3 class="m-0 fs-5 text-white">${storageMovie.Released}</h3></td>
                    </tr>

                    <tr>
                        <th scope="row" colspan="2"> <label for="" class="text-white-50">Director:</label></th>
                        <td><h3 class="m-0 fs-5 text-white">${storageMovie.Director}</h3></td>
                    </tr>

                    <tr>
                        <th scope="row" colspan="2"> <label for="" class="text-white-50">Writer:</label></th>
                        <td><h3 class="m-0 fs-5 text-white">${storageMovie.Writer}</h3></td>
                    </tr>

                    <tr>
                        <th scope="row" colspan="2"> <label for="" class="text-white-50">Genre:</label></th>
                        <td><h3 class="m-0 fs-5 text-white">${storageMovie.Genre}</h3></td>
                    </tr>

                    <tr>
                        <th scope="row" colspan="2"> <label for="" class="text-white-50">Type:</label></th>
                        <td><h3 class="m-0 fs-5 text-white">${storageMovie.Type}</h3></td>
                    </tr>

                    <tr>
                        <th scope="row" colspan="2"> <label for="" class="text-white-50">Actors:</label></th>
                        <td><h3 class="m-0 fs-5 text-white">${storageMovie.Actors}</h3></td>
                    </tr>

                    <tr>
                        <th scope="row" colspan="2"> <label for="" class="text-white-50">Synopsis:</label></th>
                        <td><h3 class="m-0 fs-5 text-white">${storageMovie.Plot}</h3></td>
                    </tr>

                    <tr>
                        <th scope="row" colspan="2"> <label for="" class="text-white-50">IMDB rating:</label></th>
                        <td><h3 class="m-0 fs-5 text-white">${storageMovie.imdbRating}</h3></td>
                    </tr>

                    <tr>
                        <th scope="row" colspan="2"> <label for="" class="text-white-50">Money earned:</label></th>
                        <td><h3 class="m-0 fs-5 text-white">${storageMovie.BoxOffice}</h3></td>
                    </tr>

                    <tr>
                    </tr>
                    
                    </tbody>
                </table>
                    
                <div class="movie_poster d-flex align-items-start justify-content-between flex-column">
                    <img src=${storageMovie.Poster} alt=${storageMovie.Title} style="height: 90%;">
                    <span class="btn btn-outline-success btn-sm mt-3" onclick=addMovieToList('${storageMovie.imdbID}') >Add to list</span>
                </div>

            </article>
        `
}


// Brojac filmova u listi
const moviesCounter = () => {
    let readStorage = JSON.parse(localStorage.getItem('movieList'));
    counter.innerHTML = `<h3 class="text-white m-0">${readStorage.length}</h3>`
}


// Pagionation
const pagination = () => {

    searchPagination.innerHTML = `
    
        <ul class="pagination m-0 border-success">

            <li class="page-item ">
                <a class="page-link bg-dark text-white-50 border-secondary" href="#" aria-label="Previous"  onclick=goToPreviousPage()>
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>

            <li class="page-item " ><span class="page-link bg-dark border-secondary text-white-50 ">${prevPage}</span></li>
            <li class="page-item active" ><span class="page-link bg-success border-secondary">${page}</span></li>
            <li class="page-item " ><span class="page-link bg-dark border-secondary text-white-50">${nextPage}</span></li>
            <li class="page-item " ><span class="page-link bg-dark border-secondary text-white-50">...</span></li>
            <li class="page-item " ><span class="page-link bg-dark border-secondary text-white-50">${Math.floor(totalResults / 10)}</span></li>

            <li class="page-item">
                <a class="page-link bg-dark text-white-50 border-secondary" href="#" aria-label="Next" onclick=goToNextPage()>
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
            
        </ul>
    `
}


// Pagination - klik na dugme Next Page
const goToNextPage = async () => {
    resaultContainer.innerHTML = '';

    if(nextPage <= x){

        page = page + 1;
    
        prevPage = page - 1;
        nextPage = page + 1;
        fetchData();
    }else{
        fetchData();  
    }
}


// Pagination - klik na dugme Previous Page
const goToPreviousPage = async () => {
    resaultContainer.innerHTML = '';

    if(prevPage != 0){

        page = page - 1;
    
        prevPage = page - 1;
        nextPage = page + 1;
    
        fetchData();
    }else{
        fetchData();
    }
}



