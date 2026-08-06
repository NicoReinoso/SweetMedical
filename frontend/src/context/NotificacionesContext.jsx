import { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "../api/api.js";
import { useSession } from "./SessionContext.jsx";

const NotificacionesContext = createContext();

export function NotificacionesProvider({ children }) {
  const [noLeidasCount, setNoLeidasCount] = useState(0);
  const { user } = useSession();

  const refrescarConteo = useCallback(async () => {
    if (!user?.id) {
      setNoLeidasCount(0);
      return;
    }
    try {
      const { data } = await api.get(`/notificaciones/${user.id}`, {
        params: { estado: "NO_LEIDA" },
      });
      setNoLeidasCount(data.length);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  useEffect(() => {
    refrescarConteo();

    if (!user?.id) return;

    const intervalId = setInterval(refrescarConteo, 30000);
    return () => clearInterval(intervalId);
  }, [user, refrescarConteo]);

  return (
    <NotificacionesContext.Provider
      value={{ noLeidasCount, setNoLeidasCount, refrescarConteo }}
    >
      {children}
    </NotificacionesContext.Provider>
  );
}

export function useNotificaciones() {
  return useContext(NotificacionesContext);
}