import "./App.css";
import Contacts from "./pages/Contacts";
import Register from "./pages/Register";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { useSelector } from "react-redux";
import Login from "./pages/Login";

function App() {
  const { user } = useSelector((state) => state.logged);
  return (

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="contacts" element={<Contacts />} />
          <Route
            path="*"
            element={
              <div>
                <h2>404 Page not found</h2>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>

  );
}

export default App;
