import keys from './auth.js'

const resaultContainer = document.querySelector('#resaultContainer');
// const searchInput = document.querySelector('#searchInput');
const searchBtn = document.querySelector('#searchBtn');

const searchInput = document.getElementById('searchInput')

let page = 1;


// Pretraga na klik Search dugmeta
searchBtn.addEventListener('click', async () => {

    // searchInput.value = '';
    resaultContainer.innerHTML = '';

    const url = `https://www.omdbapi.com/?apikey=${keys.key}&s=${searchInput.value}&page=${page}`;

    try {
        await fetch(url)
            .then((response) => response.json())
            .then((data) => {
                showSearcResault(data.Search)
        });
        
    } catch (error) {
        console.log(error);
    }
})



// Prikazivanje rezultata pretrage 
const showSearcResault = (data) => {

    data.forEach(element => {
        resaultContainer.innerHTML += `
            <div class="col-3 d-flex flex-wrap justify-content-center my-3 ">
                <div class="card text-bg-dark customOpacity " >
                    <img src=${element.Poster} class="card-img-top imgHeight" alt="..." />
                    <div class="card-body py-2">
                        <h5 class="card-title m-0 text-white-50">${element.Title}</h5>
                    </div>
                    <ul class="list-group list-group-flush border-dark">
                        <li class="list-group-item text-bg-dark fs-6 border-dark text-white-50">Year: ${element.Year}</li>
                        <li class="list-group-item text-bg-dark fs-6 border-dark text-white-50">Genre: ${element.Type}</li>
                    </ul>
                    <div class="card-body d-flex justify-content-between p-3 px-3 border-dark">
                        <a href="#" class="card-link text-info fs-6">More Info</a>
                        <button class='btn btn-outline-success btn-sm'>Add to list</button>
                    </div>
                </div>
            </div>
        `
    });
}