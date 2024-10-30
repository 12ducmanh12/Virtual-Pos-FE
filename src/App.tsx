/* eslint-disable @typescript-eslint/no-explicit-any */
import routes from "./routes";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          {routes.map((route: any) => (
            <Route
              path={route.route}
              element={route.component}
              key={route.key}
            />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
