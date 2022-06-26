import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect } from "react";

import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Login = () => {

  const { user } = useSelector((state) => state.logged);
  const navigate = useNavigate();

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

  useEffect(() => {
    if (user) {
      navigate("/chatroom");
    } 
  }, [user]);

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

          <p>New to the app? <Link to="/register">Create an account</Link></p>

          <button onClick={loginUser} className="btn btn--login">
            Log In
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
