import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import "./App.css";
import { auth } from "./firebase";
import ChatRoom from "./pages/ChatRoom";
import Contacts from "./pages/Contacts";
import Register from "./pages/Register";
import Modal from "react-bootstrap/Modal";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import Login from "./pages/Login";
import { logInInReducer } from "./state/features/loggedInSlice";

function App() {
  const { user } = useSelector((state) => state.logged);
  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState(true);


  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        if (userAuth.emailVerified) {
          console.log("is verified");
          dispatch(
            logInInReducer({
              email: userAuth.email,
            })
          );
        } else {
          handleShow();
          signOut(auth);
        }
      } else {
        console.log("not enter");
      }
      setLoading(false);
    });
  }, []);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      {isLoading ? (
        "loading..."
      ) : (
        <BrowserRouter>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Verify your account</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Please check your inbox and click on the link to verify your
              account
            </Modal.Body>
          </Modal>

          <Routes>
            <Route
              path="/"
              element={<Navigate to={user ? "/chatroom" : "/login"} replace />}
            />

            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="chatroom" element={<ChatRoom />} />
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
      )}
    </div>
  );
}

export default App;
