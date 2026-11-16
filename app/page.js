
"use client";

import { useEffect, useState } from "react";
import movies from "../lib/movies";

export default function Page() {
  const [search, setSearch] = useState("");
  const [watchlist, setWatchlist] = useState([]);
  const [watchedMovies, setWatchedMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [storageLoaded, setStorageLoaded] = useState(false);

  const moviesPerPage = 4;

  // Load saved data from LocalStorage
  useEffect(() => {
    try {
      const savedWatchlist = JSON.parse(
        localStorage.getItem("movieWatchlist") || "[]"
      );

      const savedWatched = JSON.parse(
        localStorage.getItem("watchedMovies") || "[]"
      );

      setWatchlist(savedWatchlist);
      setWatchedMovies(savedWatched);
    } catch {
      setWatchlist([]);
      setWatchedMovies([]);
    }

    setStorageLoaded(true);
  }, []);

  // Add or remove a movie from watchlist
  function toggleWatchlist(movie) {
    const alreadyAdded = watchlist.some(
      (item) => item.id === movie.id
    );

    const updated = alreadyAdded
      ? watchlist.filter((item) => item.id !== movie.id)
      : [...watchlist, movie];

    setWatchlist(updated);
    localStorage.setItem("movieWatchlist", JSON.stringify(updated));
  }

  // Check if a movie is in watchlist
  function isInWatchlist(movie) {
    return watchlist.some((item) => item.id === movie.id);
  }

  // Mark a movie as watched or not watched
  function toggleWatched(movieId) {
    const updated = watchedMovies.includes(movieId)
      ? watchedMovies.filter((id) => id !== movieId)
      : [...watchedMovies, movieId];

    setWatchedMovies(updated);
    localStorage.setItem("watchedMovies", JSON.stringify(updated));
  }

  // Search movies
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredMovies.length / moviesPerPage)
  );

  const startIndex = (currentPage - 1) * moviesPerPage;

  const currentMovies = filteredMovies.slice(
    startIndex,
    startIndex + moviesPerPage
  );

  function changeSearch(value) {
    setSearch(value);
    setCurrentPage(1);
  }

  function openMovie(movie) {
    setSelectedMovie(movie);
    setShowTrailer(false);
  }

  function backToMovies() {
    setSelectedMovie(null);
    setShowTrailer(false);
  }

  // Movie detail page
  if (selectedMovie) {
    return (
      <div className="detailPage">
        <button className="backBtn" onClick={backToMovies}>
          ← Back to Movies
        </button>

        <div className="detailBox">
          <div className="detailPosterWrapper">
            <img
              src={selectedMovie.img}
              alt={selectedMovie.title}
              className="detailPoster"
            />
          </div>

          <div className="detailContent">
            <p className="detailLabel">MOVIE DETAILS</p>

            <h1>{selectedMovie.title}</h1>

            <div className="detailMeta">
              <span>{selectedMovie.year}</span>
              <span>{selectedMovie.genre}</span>
              <span>{selectedMovie.duration}</span>
            </div>

            <div className="detailRating">
              <span className="detailStars">★★★★★</span>
              <span>IMDb {selectedMovie.imdb}/10</span>
            </div>

            <h2>About the Movie</h2>

            <p className="detailDescription">
              {selectedMovie.detail}
            </p>

            <div className="detailActions">
              <button
                className="trailerBtn"
                onClick={() => setShowTrailer(true)}
                disabled={!selectedMovie.trailer}
              >
                ▶ Watch Trailer
              </button>

              <button
                className="watchBtn"
                onClick={() => toggleWatchlist(selectedMovie)}
              >
                {isInWatchlist(selectedMovie)
                  ? "✓ Added to Watchlist"
                  : "+ Add to Watchlist"}
              </button>
            </div>

            <button
              className="watchedBtn"
              onClick={() => toggleWatched(selectedMovie.id)}
            >
              {watchedMovies.includes(selectedMovie.id)
                ? "✓ Watched"
                : "○ Mark as Watched"}
            </button>
          </div>
        </div>

        {/* Trailer Popup */}
        {showTrailer && selectedMovie.trailer && (
          <div
            className="trailerModal"
            onClick={() => setShowTrailer(false)}
          >
            <div
              className="trailerContent"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                className="closeTrailer"
                onClick={() => setShowTrailer(false)}
              >
                ✕
              </button>

              <iframe
                src={`https://www.youtube.com/embed/${selectedMovie.trailer}?autoplay=1`}
                title={`${selectedMovie.title} trailer`}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main movie homepage
  return (
    <main className="app">
      <div className="content">

        {/* Hero Section */}
        <section className="hero">
          <div className="heroFrame">
            <img
              src="/images/publicbg.jpg"
              alt="Cinema background"
            />
          </div>

          <div className="heroOverlay">
            <h1>🎬Movie Watchlist</h1>
            <p>Discover. Watch. Remember.</p>
          </div>
        </section>

        {/* Search */}
        <input
          type="text"
          className="searchInput"
          placeholder="Search your favorite movies..."
          value={search}
          onChange={(event) => changeSearch(event.target.value)}
        />

        {/* Movie List */}
        <h2 className="section">Explore Movies</h2>

        <div className="movieGrid">
          {currentMovies.map((movie) => (
            <div className="movieCard" key={movie.id}>
              <img
                src={movie.img}
                alt={movie.title}
                onClick={() => openMovie(movie)}
              />

              <div className="movieInfo">
                <h3 onClick={() => openMovie(movie)}>
                  {movie.title}
                </h3>

                <p>
                  {movie.year} | {movie.genre}
                </p>

                <p className="rating">
                  ★★★★★ IMDb {movie.imdb}/10
                </p>

                <button
                  className="watchBtn"
                  onClick={() => toggleWatchlist(movie)}
                >
                  {isInWatchlist(movie)
                    ? "✓ Added"
                    : "+ Add to Watchlist"}
                </button>

                <button
                  className="detailsBtn"
                  onClick={() => openMovie(movie)}
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMovies.length === 0 && (
          <p className="emptyText">No movies found. Try another title.</p>
        )}

        {/* Pagination */}
        {filteredMovies.length > 0 && (
          <div className="pagination">
            <button
              className="nav-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                className={`page-btn ${
                  currentPage === page ? "active" : ""
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="nav-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}

        {/* My Watchlist */}
        <h2 className="section">🔖My Watchlist</h2>

        {!storageLoaded ? (
          <p className="emptyText">Loading your watchlist...</p>
        ) : watchlist.length === 0 ? (
          <p className="emptyText">
            Your watchlist is empty. Add your favorite movies!
          </p>
        ) : (
          <div className="watchlistGrid">
            {watchlist.map((movie) => (
              <div className="watchlistCard" key={movie.id}>
                <img
                  src={movie.img}
                  alt={movie.title}
                  onClick={() => openMovie(movie)}
                />

                <div className="watchlistInfo">
                  <h3>{movie.title}</h3>

                  <p className="rating">
                    ★ IMDb {movie.imdb}/10
                  </p>

                  <p className="watchedStatus">
                    {watchedMovies.includes(movie.id)
                      ? "✓ Watched"
                      : "○ Not Watched"}
                  </p>

                  <button
                    className="removeSmallBtn"
                    onClick={() => toggleWatchlist(movie)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
