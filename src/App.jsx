import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Catalogue from "./pages/Catalogue";
import Dashboard from "./pages/Dashboard";
import Business from "./pages/Business";
import Categories from "./pages/Categories";
import Items from "./pages/Items";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
<Route
  path="/business"
  element={<Business />}
/>

<Route
  path="/categories"
  element={<Categories />}
/>

<Route
  path="/items"
  element={<Items />}
/>
        <Route
          path="/:slug"
          element={<Catalogue />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/moorthi-furniture"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;