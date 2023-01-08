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


const key = 'b1c7adef';
let page = 1;

let movies = []
// let movieList = []

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

    // searchInput.value = '';
    resaultContainer.innerHTML = '';

    // const url = `https://www.omdbapi.com/?apikey=${keys.key}&s=${searchInput.value}&page=${page}`;
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
})


// Pretraga na Enter dugme
// searchInput.addEventListener('keypress', async (e) => {

//     if(e.key === 'Enter'){
//         searchInput.value = '';
//         resaultContainer.innerHTML = '';
    
//         const url = `https://www.omdbapi.com/?apikey=${key}&s=${searchInput.value}&page=${page}`;
    
//         try {
//             await fetch(url)
//                 .then((response) => response.json())
//                 .then((data) => {
    
//                     movies = data.Search

//                     showSearcResault()
//                 });
    
//         } catch (error) {
//             console.log(error);
//         }
//     }
// })



// Prikazivanje rezultata pretrage 
const showSearcResault = () => {

    movies.forEach((element, idx) => {

        resaultContainer.innerHTML += `
            <div class="col d-flex justify-content-center my-3 ">
                <div class="card text-bg-dark customOpacity " style="width: 19rem;">
                    <img src=${element.Poster} class="card-img-top imgHeight" alt="..." style="height: 22rem; object-fit: cover; "/>
                    <div class="card-body py-2">
                        <h5 class="card-title m-0 text-white-50" >${element.Title}</h5>
                    </div>
                    <ul class="list-group list-group-flush border-dark" >
                        <li class="list-group-item text-bg-dark fs-6 border-dark text-white-50">Year: ${element.Year}</li>
                        <li class="list-group-item text-bg-dark fs-6 border-dark text-white-50">Genre: ${element.Type}</li>
                    </ul>
                    <div class="card-body d-flex justify-content-between p-3 px-3 border-dark">
                        <a href="#" class="card-link text-info fs-6" onclick=getMovieDetails('${element.imdbID}') >More Info</a>
                        <span class="btn btn-outline-success btn-sm" onclick=addToMovieList('${element.imdbID}') >Add to list</span>
                    </div>
                </div>
            </div>
        `;
    })
};


// Dodavanje filmova po IMDBID u LocalStorage za koriscenje u Listi Odabranih filmova
const addToMovieList = (imdbID) => {

    const url = `https://www.omdbapi.com/?apikey=${key}&i=${imdbID}`;

    try {
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
    
                let store = JSON.parse(localStorage.getItem('movieList'));
                // movieList.push(data);
                store = [...store, data]
                localStorage.setItem('movieList', JSON.stringify(store));
    
                // const toast = new bootstrap.Toast(toastMessage)
                // toast.show()

                alertMessage.innerHTML = `
                    <div class="alert alert-success alert-dismissible fade show mx-2 float my-6 z-3" role="alert">
                        Movie added to list.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `

                showMovieList();
    
            })
        
    } catch (error) {
        console.log(error)
    }
}


// Detaljne onformacije o filmu sa slanje zahteva sa IMDBID 
// const detailInfo = async (imdbID)  => {

//     const url = `https://www.omdbapi.com/?apikey=${key}&i=${imdbID}`;

//     fetch(url)
//         .then((response) => response.json())
//         .then((data) => {

//             console.log(data)
//         });

// }





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
        <div class="alert alert-danger alert-dismissible fade show mx-2 float" role="alert">
            Movie delleted from the list.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `
    }

    showMovieList();
    moviesCounter();
}


const getMovieDetails = (imdbID) => {

    localStorage.removeItem('movieDetails');

    const url = `https://www.omdbapi.com/?apikey=${key}&i=${imdbID}`;
    
    try {
        fetch(url)
        .then((response) => response.json())
        .then((data) =>  localStorage.setItem('movieDetails', JSON.stringify(data)))
        .then((_) => {

            window.location = 'movieDetails.html'
        });
        
    } catch (error) {
        console.log(error);
    }
}


const showMovieDetails = () => {

    const storageMovie = JSON.parse(localStorage.getItem('movieDetails'));
        
        movieDetailView.innerHTML = `
                        
            <article class="single__movie d-flex flex-column flex-md-row text-white container my-3">
        
                <table class="table table-borderless w-75">
                    <thead>
                        <tr>
                            <td colspan="6"><h1 class="fs-3 mb-3 text-white">${storageMovie.Title}</h1></td>
                        </tr>
                    </thead>
        
                    <tr>
                    <th scope="row" colspan="2"> <label for="" class="text-white-50 me-3">Release date:</label></th>
                    <td><h3 class="m-0 fs-5 text-white">${storageMovie.Released}</h3></td>
                </tr>

                <tr>
                    <th scope="row" colspan="2"> <label for="" class="text-white-50 me-3">Director:</label></th>
                    <td><h3 class="m-0 fs-5 text-white">${storageMovie.Director}</h3></td>
                </tr>

                <tr>
                    <th scope="row" colspan="2"> <label for="" class="text-white-50 me-3">Writer:</label></th>
                    <td><h3 class="m-0 fs-5 text-white">${storageMovie.Writer}</h3></td>
                </tr>

                <tr>
                    <th scope="row" colspan="2"> <label for="" class="text-white-50 me-3">Genre:</label></th>
                    <td><h3 class="m-0 fs-5 text-white">${storageMovie.Genre}</h3></td>
                </tr>

                <tr>
                    <th scope="row" colspan="2"> <label for="" class="text-white-50 me-3">Type:</label></th>
                    <td><h3 class="m-0 fs-5 text-white">${storageMovie.Type}</h3></td>
                </tr>

                <tr>
                    <th scope="row" colspan="2"> <label for="" class="text-white-50 me-3">Actors:</label></th>
                    <td><h3 class="m-0 fs-5 text-white">${storageMovie.Actors}</h3></td>
                </tr>

                <tr>
                    <th scope="row" colspan="2"> <label for="" class="text-white-50 me-3">Synopsis:</label></th>
                    <td><h3 class="m-0 fs-5 text-white">${storageMovie.Plot}</h3></td>
                </tr>

                <tr>
                    <th scope="row" colspan="2"> <label for="" class="text-white-50 me-3">IMDB rating:</label></th>
                    <td><h3 class="m-0 fs-5 text-white">${storageMovie.imdbRating}</h3></td>
                </tr>

                <tr>
                    <th scope="row" colspan="2"> <label for="" class="text-white-50 me-3">Money earned:</label></th>
                    <td><h3 class="m-0 fs-5 text-white">${storageMovie.BoxOffice}</h3></td>
                </tr>

                    </tbody>
                </table>

                <div class="movie_poster d-flex align-items-center">
                    <img src=${storageMovie.Poster} alt=${storageMovie.Title} >
                </div>
        
            </article>
        `
}

// Brojac filmova u listi
const moviesCounter = () => {
    let readStorage = JSON.parse(localStorage.getItem('movieList'));
    counter.innerHTML = `<h3 class="text-white mt-2">${readStorage.length}</h3>`
}
