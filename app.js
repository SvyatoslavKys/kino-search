const API_KEY = "8c8e1a50-6322-4135-8875-5d40a5420d86";

const API_URL_POPULAR = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";

const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

getMovies(API_URL_POPULAR);

async function getMovies(url) {
  const resp = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });
  const respData = await resp.json();
  console.log(respData);
  showMovies(respData);
}

function getClassByRating (vote) {
    if(vote >= 7){
        return "green"
    }else if (vote > 5){
        return "yellow"
    }else{
        return "red"
    }
}

function showMovies(data) {
  const moviesE1 = document.querySelector(".movies"); // Assuming 'movies' is a class

  data.films.forEach(movie => {
    const movieE1 = document.createElement("div");
    movieE1.classList.add("movie");
    movieE1.innerHTML = `
      <div class="movie__cover--inner">
        <img class="movie__cover" src="${movie.posterUrlPreview}" alt="${movie.nameRu}">
        <div class="movie__cover--darkened"></div>
        <p class="movie-average movie__average--${getClassByRating(movie.rating)}">${movie.rating}</p>
      </div>
      <h3 class="movie-title">${movie.nameRu}</h3>
      <p class="movie-category">${movie.genres.map(
        (genre) => ` ${genre.genre}`
      ).join(", ")}</p>
    `;
    moviesE1.appendChild(movieE1);
  });
}
