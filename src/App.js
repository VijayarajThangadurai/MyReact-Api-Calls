import React, { useCallback, useRef, useEffect, useState} from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies,setmovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //const [isClicked, setIsClicked]= useState(false);
  const [error, setError]= useState(null);
  const isCancelled = useRef(false);
  const [visibleButton, setVisibleBtn]= useState();

  const fetchMoviesHandler=(event)=>{
    console.log(isCancelled);
   if(isCancelled.current){
    setError("Please try again late.");
    return;
   }
   console.log("s");
   setIsLoading(true);
   setError(null);
  try{
   const response = await fetch("https://swapi.dev/api/films")
   if(!response.ok){
    throw new Error("Something Went Wrong... Retrying");
   }
  const data = await response.json();
  const trasnformedMovies= data.results.map((movieData)=>{
    return {
      id: movieData.episode_id,
      title: movieData.title,
      openingText: movieData.opening_crawl,
      releaseDate:movieData.release_date,
    };
  });
  setmovies(trasnformedMovies);
}catch (error){
  setError(error.message);
 if(!isCancelled.current){
  setVisibleBtn(true);
  setTimeout(()=>{
    fetchMoviesHandler();
    },5000)
 }
  setIsLoading(false);
}
}
useEffect(()=>{
  setTimeout(()=>{
    if(retryCount>0){
      fetchMoviesHandler();
    }
  },5000)
}, [retryCount]);
let content =<p>{error}</p>
if (movies.length > 0){
  content = <MoviesList movies={movies}/>;
}
if(error){
  content = <p>{error}</p>;
}
if(isLoading){
  content = <p>Loading...</p>;
}
if(isCancelled && error){
  content = <p>{error}</p>;
}
  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      {/* { isClicked && <section>
        {!isLoading && movies.length>0 && <MoviesList movies={movies}/>}
        {!isLoading && movies.length===0 && <p>Found no movies</p>}
        {isLoading && <p>Loading...</p>}
      </section>} */}
      {isClicked && (
        <section>
          {content}
          {error && !isCancelled && <button onClick={cancelRetryHandler}>Cancel Retry</button>}
        </section>
      )}
    </React.Fragment>
  );
}

export default App;
