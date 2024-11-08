import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/navbar"; // Đảm bảo đường dẫn đúng đến component Navbar
import ProtectedRoute from "./utils/protected-route"; // Component bảo vệ các route cần xác thực
import { useAuthStore } from "./hooks/authStore"; // Custom hook xác thực người dùng
import routes from "./routes"; // Tập hợp các route của ứng dụng

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

  const isAuthenticationPage = location.pathname === "/login";

  return (
    <BrowserRouter>
      {!isAuthenticationPage && <Navbar/>}
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.key}
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
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
