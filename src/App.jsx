import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Catalogue from "./pages/Catalogue";
import Dashboard from "./pages/Dashboard";
import Business from "./pages/Business";
import Categories from "./pages/Categories";
import Items from "./pages/Items";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />

        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />

        {/* REGISTER */}

        <Route
          path="/register"
          element={<Register />}
        />

        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* BUSINESS */}

        <Route
          path="/business"
          element={<Business />}
        />

        {/* CATEGORIES */}

        <Route
          path="/categories"
          element={<Categories />}
        />

        {/* ITEMS */}

        <Route
          path="/items"
          element={<Items />}
        />

        {/* CATALOGUE */}

        <Route
          path="/:slug"
          element={<Catalogue />}
        />

        {/* 404 */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;