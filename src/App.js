import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import Footer from './Footer/Footer'
import './App.css';
import AddMovie from './components/AddMovie';



function App() {
  const [movies, setMovies] = useState([]);
const [isLoading ,setIsLoading] =useState(false);
const [error, setError] = useState(null);

   
  const  fetchMoviesHandler = useCallback(async function(){
    setIsLoading(true);
    setError(null);
    try
    {
      const response =  await fetch('https://react-http-683cd-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json')
      if(!response.ok){
        throw new Error('Something went wrong')
      }

      
      const data = await response.json();

      const  loadedMovies =[];

      for(const key in data){
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        })
      }

          
        // const transformedMovies = data.map((movieData) => {
        //   return {
        //     id: movieData.episode_id,
        //     title: movieData.title,
        //     openingText: movieData.opening_crawl,
        //     releaseDate: movieData.release_date,
        //   };
        // });
        setMovies(loadedMovies);
       
  }   catch(error){
      setError(error.message)
  }
  setIsLoading(false);

    },[]);

    useEffect(()=>{
      fetchMoviesHandler();
    }, [fetchMoviesHandler]);

  async  function addMovieHandler(movie){
    const response= await  fetch('https://react-http-683cd-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json',{
        method: 'POST',
        body: JSON.stringify(movie),
        headers: {
          'Content-type': 'application/json'
        }
      });
 
      const data = await response.json();
      console.log(data);
    }


    let content = <h1>No movies</h1>

    if(movies.length >0){
      content = <MoviesList movies={movies}/>
    }

      if (error){
        content = <h2>{error}</h2>
      }
      if(isLoading){
        content = <h1>Loading...</h1>
      }
  return (
    <div>
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler}/>
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}
       {/* {!isLoading && movies.length>0}
       {!isLoading && movies.length ===0 && !error &&<h2>No Movies </h2>}
        {!isLoading && error && <h2>{error}</h2>}
        {isLoading && <h1>Loading...</h1>} */}
      </section>
    </React.Fragment>
    <Footer/>
    </div>
  );
}

export default App;
