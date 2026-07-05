import { ToastContainer, Toast } from "react-bootstrap";

function ToastNotificacion({ show, mensaje, variant = "success", onClose }) {
  return (
  <ToastContainer
    position="top-center"
    className="p-3"
    style={{
      zIndex: 9999,
      position: "fixed",
      top: "15vh",
      left: "50%",
      transform: "translateX(-50%)"
    }}
  >
    
      <Toast
        show={show}
        onClose={onClose}
        delay={3000}
        autohide
        bg={variant}
      >
        <Toast.Body className={variant === "light" ? "text-center" : "text-white text-center"}>
          {mensaje}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}

export default ToastNotificacion;