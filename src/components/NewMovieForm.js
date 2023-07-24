import React from "react";

import classes from './NewMovieForm.module.css';

const NewMovieForm = props=>{
const clickHandler = (event)=>{
    event.preventDefault();
    const ti = document.getElementById('title').value;
    const ot = document.getElementById('openingtext').value;
    const de = document.getElementById('date').value;
    props.onAddMovie({tittle: ti, openingText: ot, releaseDate: de});
}

return (
    <form className={classes.form}>
        <label htmlFor="title">Tittle</label>
        <input type="text" id="title"></input>
        <label htmlFor="openingtext">Opening Text</label>
        <textarea  id="openingtext"/>
        <label htmlFor="date"> Release Date</label>
        <input type="date" id="date"></input>
        <button onClick={clickHandler}>Add Movie</button>
    </form>
)
}

export default NewMovieForm;