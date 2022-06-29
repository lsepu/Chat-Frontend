import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import  { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  
  //^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$
  const signInForm = () => {
    const regEmail =
      /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    const regPassword =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (
      password &&
      userName &&
      regEmail.test(userName)! &&
      regPassword.test(password)!
    ) {
      createUserWithEmailAndPassword(auth, userName, password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("****user****");
          console.log(user);
          navigate("/login");
          sendEmailVerification(user).then(() => {
            console.log("Email verification sent!");
          }) 
        })
        .catch((error) => {
          const errorMessage = error.message;
          console.log("*** sign in error ***");
          console.log(errorMessage);
        });
      setUserName("");
      setPassword("");
    }
  };
  return (
    <div>
      <div className="form-wrapper">
        <h1 style={{ textAlign: "center" }}>Register</h1>

        {/* <div className="message">Sorry, That login is incorrect</div> */}

        <form className="login__form">
          <label>Email:</label>
          <input
            onChange={(e) => setUserName(e.target.value)}
            type="email"
            name="Usuario"
            value={userName}
            pattern="^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$"
            title="Por favor, ingrese un correo válido. (johndoe@gmail.com)"
            required
          />

          <label>Password:</label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            name="password"
            value={password}
            pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
            title="La contraseña debe contener mínimo 8 caracteres alfanuméricos en combinación de mayúsculas, minúsculas y por lo menos dos caracteres especiales. (abc123$$)"
            required
          />

          {/* <label>Verify password:</label>
          <input type="password" name="verify-password" /> */}

          <p>
            Already have an account? <Link to="/login">Log In</Link>
          </p>

          <button onClick={() => signInForm()} className="btn btn--login">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
