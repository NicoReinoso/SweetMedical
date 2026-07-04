import React, {useEffect, useState} from "react";
import { Spinner } from 'react-bootstrap';
import './HomePublica.css';

function HomePublica() {
  return (
    <div className="hero" id="main-content">
    <h1>Sweet Medical</h1>

    <p>
      Encontrá especialistas y reservá tus turnos
      de forma rápida y sencilla. O gestiona los turnos de tu consultorio de manera eficiente.
    </p>
  </div>
  );
}

export default HomePublica;