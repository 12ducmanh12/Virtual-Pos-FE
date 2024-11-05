import routes from "./routes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/protected-route";
import { useEffect } from "react";
import { useAuthStore } from "./hooks/authStore";

const App: React.FC = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiration = localStorage.getItem("expiration");

    if (token && expiration) {
      const expirationDate = new Date(expiration);
      const isTokenExpired = new Date() > expirationDate;

      if (!isTokenExpired) {
        setIsAuthenticated(true);
      } else {
        // Xóa token nếu đã hết hạn
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [setIsAuthenticated]);

  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => (
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
