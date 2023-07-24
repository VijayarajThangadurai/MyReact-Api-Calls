import React, { useCallback, useRef, useEffect, useState} from 'react';
import NewMovieForm from './components/NewMovieForm';
import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies,setmovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  //const [isClicked, setIsClicked]= useState(false);
  const [error, setError]= useState(null);
  const isCancelled = useRef(false);
  const [visibleButton, setVisibleBtn]= useState();

  const fetchMoviesHandler=useCallback(async()=>{
    console.log(isCancelled);
   if(isCancelled.current){
    setError("Please try again late.");
    return;
   }
   console.log("s");
   setIsLoading(true);
   setError(null);
  try{
   const response = await fetch("https://myreact-movie-default-rtdb.firebaseio.com/movies.json")
   if(!response.ok){
    throw new Error("Something Went Wrong... Retrying");
   }
  const data = await response.json();
 const loadedMovies=[];
 for(const key in data){
  loadedMovies.push({
    id:key,
    title: data[key].title,
    openingText:data[key].openingText,
    releaseDate:data[key].releaseDate,
  });
 }
 setmovies(loadedMovies);
}catch (error){
  setError(error.message);
 if(!isCancelled.current){
  setVisibleBtn(true);
  setTimeout(()=>{
    fetchMoviesHandler();
    },5000);
 }
}
setIsLoading(false);
},[]);
async function addMovieHandler(movie){
  try{
    const response = await fetch(
      "https://myreact-movie-default-rtdb.firebaseio.com/movies.json",{
        method:'POST',
        body: JSON.stringify(movie),
        headers:{
          "content-type": "application/json",
        },
      }
    );
    if(!response.ok){
      throw new Error('Something Wrong...Please try again')
    }
  }catch(error){
    setError(error.message);
  }
}

useEffect(()=>{
  fetchMoviesHandler();
}, [fetchMoviesHandler]);
const cancelRetryHandler=(event)=>{
  console.log(isCancelled);
  isCancelled.current=true;
  setVisibleBtn(false);
};
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

  return (
    <React.Fragment>
      <section>
        <NewMovieForm onAddMovie={addMovieHandler}/>
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
         <section>
          {content}
          {visibleButton && <button onClick={cancelRetryHandler}>Cancel Retry</button>}
        </section>
    </React.Fragment>
  );
}

export default App;
