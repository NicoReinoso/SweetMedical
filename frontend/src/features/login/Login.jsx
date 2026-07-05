import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import "./Login.css";

function Login({ setRol }) {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (usuario === "paciente") {
      localStorage.setItem("rol", "paciente");
      localStorage.setItem("nombre", "Juan Pérez");
      setRol("paciente"); 
      navigate("/paciente");
    }

    if (usuario === "medico") {
      localStorage.setItem("rol", "medico");
      localStorage.setItem("nombre", "Dra. María Gómez");
      setRol("medico"); 
      navigate("/medico");
    }

    setError("Usuario no encontrado");
  };

  return (
    <div className="login-container">
      <div className="login-card">

        <div className="login-logo">
          <img
            src="/logo.png"
            alt="Sweet Medical"
            height="60"
          />
        </div>

        <h2 className="login-title">
          Iniciar sesión
        </h2>

        <Form onSubmit={handleSubmit}>

          <Form.Group className="mb-3">
            <Form.Label>Usuario</Form.Label>

            <Form.Control
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="paciente/medico"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>

            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
            />
          </Form.Group>

          <Button
            variant="success"
            type="submit"
            className="login-btn"
          >
            Ingresar
          </Button>

        </Form>

        {error && (
          <Alert variant="danger" className="mt-3">
          {error}
          </Alert>
        )}

        <div className="login-help">
          Para la demo ingresar usuario: <strong>paciente</strong> o <strong>medico</strong> y cualquier contraseña.
        </div>

      </div>
    </div>
  );
}

export default Login;