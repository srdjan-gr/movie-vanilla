// import keys from './auth.js'

const resaultContainer = document.querySelector('#resaultContainer');
const searchInput = document.querySelector('#searchInput');
const searchBtn = document.querySelector('#searchBtn');
const listBtn = document.querySelector('#listBtn');
const selectedList = document.querySelector('#selectedList');
const singleElement = document.querySelector('#singleElement');
const modalListContent = document.querySelector('#modalListContent');
const counter = document.querySelector('#counter');


const key = 'b1c7adef';
let page = 1;

let movies = []
// let movieList = []

let readStorage = JSON.parse(localStorage.getItem('movieList'));


// Prikazivanje liste filmova u LS na load stranice
window.addEventListener('load', () => {

    let store = localStorage.getItem('movieList');;

    if (store == null) {
        store = localStorage.setItem('movieList', JSON.stringify(''));
    }

    moviesInList()
    showMovieList();
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

        // console.log(element)

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
                        <a href="#" class="card-link text-info fs-6" onclick=detailInfo('${element.imdbID}') >More Info</a>
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

    fetch(url)
        .then((response) => response.json())
        .then((data) => {

            let store = JSON.parse(localStorage.getItem('movieList'));
            // movieList.push(data);
            store = [...store, data]
            localStorage.setItem('movieList', JSON.stringify(store));

            showMovieList();
        })
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
                    <span class="text-success" type="button"><i class="bi bi-eye fs-5 pointer"></i></span>
                </div>
                <hr class="text-bg-dark mb-4">
            `
        });
    }

    moviesInList();
}


// Brisanje filma iz Liste odabranih
const deleteFromMovieList = (idx) => {

    const store = JSON.parse(localStorage.getItem('movieList'));

    if (confirm(`Are you sure you want to delete movie from list?`)) {

        store.splice(idx, 1);

        localStorage.setItem('movieList', JSON.stringify(store));
    }

    showMovieList();
    moviesInList();
}


// Movi list brojac
const moviesInList = () => {
    let readStorage = JSON.parse(localStorage.getItem('movieList'));
    counter.innerHTML = `<h3 class="fs-6 text-white mt-2">${readStorage.length}</h3>`
}
