// import keys from './auth.js'

const resaultContainer = document.querySelector('#resaultContainer');
// const searchInput = document.querySelector('#searchInput');
const searchBtn = document.querySelector('#searchBtn');

const searchInput = document.getElementById('searchInput')
const listBtn = document.getElementById('listBtn')
const selectedList = document.getElementById('selectedList')
const singleElement = document.getElementById('singleElement')

const key = 'b1c7adef';
let page = 1;

let movies = []
let moviesList = []

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
searchInput.addEventListener('keypress', async (e) => {

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
                        <span class="btn btn-outline-success btn-sm" onclick=addToList('${element.imdbID}') >Add to list</span>
                    </div>
                </div>
            </div>
        `;
    })
};


// Dodavanje u LocalStorage IMDBID-jeva za koriscenje u Listi Odabranih fiolmova
const addToList = (imdbID) => {

    moviesList.push(imdbID);
    localStorage.setItem('movieList', moviesList);
}


// Detaljne onformacije o filmu sa slanje zahteva sa IMDBID 
const detailInfo = async (imdbID)  => {

    const url = `https://www.omdbapi.com/?apikey=${key}&i=${imdbID}`;

    fetch(url)
        .then((response) => response.json())
        .then((data) => {

            console.log(data)
        });

}



