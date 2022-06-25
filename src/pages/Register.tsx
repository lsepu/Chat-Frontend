import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { logInInReducer } from "../features/loggedInSlice";
import { useDispatch } from "react-redux";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
          dispatch(logInInReducer(user));
          navigate("/welcome");
        })
        .catch((error) => {
          const errorCode = error.code;
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
      <h1>Sign In</h1>
      <form>
        <label htmlFor="username" id="username">
          Usuario
        </label>
        <br />
        <input
          onChange={(e) => setUserName(e.target.value)}
          type="email"
          name="Usuario"
          value={userName}
          placeholder="Username"
          pattern="^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$"
          title="Por favor, ingrese un correo válido. (johndoe@gmail.com)"
          required
        />
        <br />
        <label htmlFor="password">Contraseña</label>
        <br />
        <input
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          name="password"
          value={password}
          placeholder="Contraseña"
          pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$"
          title="La contraseña debe contener mínimo 8 caracteres alfanuméricos en combinación de mayúsculas, minúsculas y por lo menos dos caracteres especiales. (abc123$$)"
          required
        />
        <br />
        <br />
        <Button type="submit" variant="primary" onClick={() => signInForm()}>
          Registrar
        </Button>
        <br />
        <br />
      </form>
    </div>
  );
};

export default Register;
