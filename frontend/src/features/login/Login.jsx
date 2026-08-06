import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import "./Login.css";
import { useSession } from "../../context/SessionContext.jsx";
import api from "../../api/api.js";

function Login({ setRol }) {
  const navigate = useNavigate();
  const { login } = useSession();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  setError("");

  try {

    const { data } = await api.post("/login", {
      usuario,
      password
    });

    const usuarioLogueado = login(data.token);

    if (usuarioLogueado.rol === "paciente") {
        navigate("/paciente");
    } else {
        navigate("/medico");
    }

  } catch (err) {

    setError(
      err.response?.data?.message ??
      "Usuario o contraseña incorrectos"
    );

  }
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
              placeholder="Ingrese su usuario"
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

      </div>
    </div>
  );
}

export default Login;