import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { useState } from "react";
import { auth } from "../firebase";

const Login = () => {
  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const setLogin = (e) => {
    setLoginInput({
      ...loginInput,
      [e.target.name]: [e.target.value],
    });
  };

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginInput.email.toString(),
        loginInput.password.toString()
      );
    } catch (error) {
      let message;
      if (error instanceof Error) message = error.message;
      reportError({ message });
    }
  };

  return (
    <>
      <div className="form-wrapper">
        <h1 style={{ textAlign: "center" }}>Log in</h1>

        {/* <div className="message">Sorry, That login is incorrect</div> */}

        <form className="login__form">
          <label>Email:</label>
          <input
            value={loginInput.email}
            onChange={setLogin}
            type="text"
            name="email"
          />

          <label>Password:</label>
          <input
            value={loginInput.password}
            onChange={setLogin}
            type="password"
            name="password"
          />

          <p>
            New to the app? <a href="">Create an account</a>
          </p>

          <button onClick={loginUser} className="btn btn--login">
            Log In
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
