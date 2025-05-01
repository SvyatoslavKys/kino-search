const API_KEY = "8c8e1a50-6322-4135-8875-5d40a5420d86";
const API_URL_POPULAR = "https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1";
const API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

getMovies(API_URL_POPULAR);

async function getMovies(url) {
  try {
    const resp = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY,
      },
    });

    const data = await resp.json();
    showMovies(data);
  } catch (error) {
    console.error("Failed to fetch movies:", error);
    document.querySelector(".movies").innerHTML = "<p>Failed to load movies.</p>";
  }
}

function getClassByRating(vote) {
  if (vote >= 7) return "green";
  else if (vote > 5) return "yellow";
  else return "red";
}

function showMovies(data) {
  const moviesE1 = document.querySelector(".movies");
  moviesE1.innerHTML = "";

  const films = data.films || [];

  if (films.length === 0) {
    moviesE1.innerHTML = "<p>No results found.</p>";
    return;
  }

  films.forEach((movie) => {
    const rating = movie.rating || movie.ratingKinopoisk || "N/A";
    const title = movie.nameRu || movie.nameEn || "Untitled";
    const poster = movie.posterUrlPreview || "";
    const genres = (movie.genres || []).map((g) => g.genre).join(", ");

    const movieE1 = document.createElement("div");
    movieE1.classList.add("movie");
    movieE1.innerHTML = `
      <div class="movie__cover--inner">
        <img class="movie__cover" src="${poster}" alt="${title}">
        <div class="movie__cover--darkened"></div>
        <p class="movie-average movie__average--${getClassByRating(rating)}">${rating}</p>
      </div>
      <h3 class="movie-title">${title}</h3>
      <p class="movie-category">${genres}</p>
    `;

    movieE1.addEventListener("click", () => {
      getMovieDetails(movie.filmId);
    });

    moviesE1.appendChild(movieE1);
  });
}

async function getMovieDetails(filmId) {
  try {
    const [detailsResp, videoResp] = await Promise.all([
      fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}`, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
      }),
      fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}/videos`, {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": API_KEY,
        },
      }),
    ]);

    const movie = await detailsResp.json();
    const videos = await videoResp.json();
    showMovieDetails(movie, videos.items || []);
  } catch (error) {
    console.error("Error fetching movie details or video:", error);
  }
}

function showMovieDetails(movie, videos) {
  const moviesE1 = document.querySelector(".movies");

  const title = movie.nameRu || movie.nameEn || "Untitled";
  const poster = movie.posterUrlPreview;
  const videoEmbed = getVideoEmbed(videos);

  moviesE1.innerHTML = `
    <div class="movie-details">
      <img src="${poster}" alt="${title}" />
      <h2>${title}</h2>
      <p><strong>Year:</strong> ${movie.year}</p>
      <p><strong>Duration:</strong> ${movie.filmLength || "N/A"} min</p>
      <p><strong>Country:</strong> ${(movie.countries || []).map((c) => c.country).join(", ")}</p>
      <p><strong>Genres:</strong> ${(movie.genres || []).map((g) => g.genre).join(", ")}</p>
      <p><strong>Description:</strong> ${movie.description || "No description available."}</p>

      ${videoEmbed}

      <button class="back-button">Back to list</button>
    </div>
  `;

  document.querySelector(".back-button").addEventListener("click", () => {
    getMovies(API_URL_POPULAR);
  });
}

function getVideoEmbed(videos) {
  const video = videos.find(v =>
    v.site === "YOUTUBE" || v.site === "KINOPOISK_WIDGET"
  );

  if (!video) return "<p><em>No video available.</em></p>";

  if (video.site === "YOUTUBE") {
    const videoId = new URL(video.url).searchParams.get("v");
    return `<iframe width="300" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
  }

  return `<iframe width="300" height="315" src="${video.url}" frameborder="0" allowfullscreen></iframe>`;
}

const form = document.querySelector("form");
const search = document.querySelector(".nav-input");

if (form && search) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = search.value.trim();
    const searchUrl = `${API_URL_SEARCH}${encodeURIComponent(query)}`;

    if (query) {
      getMovies(searchUrl);
    }

    search.value = "";
  });
}
