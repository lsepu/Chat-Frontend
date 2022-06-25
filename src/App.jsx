import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect } from "react";
import "./App.css";
import { auth } from "./firebase";
import ChatRoom from "./pages/ChatRoom";
import Contacts from "./pages/Contacts";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {

  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        if(userAuth.emailVerified){
          console.log("is verified")
        }
        else{
          alert("need verification");
          signOut(auth);
        }
      } else {
        console.log("logout")
      }
    });
  }, []);

  return (
    <div>
      <div className="container">
        <Login  />
      </div>
    </div>
  );
}

export default App;
