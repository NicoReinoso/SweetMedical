import React, {useEffect, useState} from "react";
import { Spinner } from 'react-bootstrap';
import './Home.css';

function Home() {
  return (
    <div className="hero">
    <h1>Sweet Medical</h1>

    <p>
      Encontrá especialistas y reservá tus turnos
      de forma rápida y sencilla.
    </p>
  </div>
  );
}

export default Home;