import routes from "./routes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/protected-route";
import { useEffect, useState } from "react";
import { useAuthStore } from "./hooks/authStore";

const App: React.FC = () => {
  // const initialAuthState = localStorage.getItem("isAuthenticated") === "true";
  const { isAuthenticated, setIsAuthenticated } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expireDate = localStorage.getItem("expiration");
    if (token && expireDate) {
      const now = new Date().getTime();
      const expirationTime = new Date(expireDate).getTime();
      if (now < expirationTime) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [setIsAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route: any) => (
          <Route
            path={route.route}
            element={
              route.isProtected ? (
                <ProtectedRoute
                  element={route.component}
                  isAuthenticated={isAuthenticated}
                />
              ) : (
                route.component
              )
            }
            key={route.key}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
