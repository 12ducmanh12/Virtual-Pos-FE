import routes from "./routes";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/protected-route";
import { useEffect, useState } from "react";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const expireDate = localStorage.getItem("expireToken");

    if (token && expireDate) {
      const now = new Date().getTime();
      if (now < Number(expireDate)) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("expireToken");
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  }, []);

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
