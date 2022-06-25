import React from "react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <>
      <div className="form-wrapper">
        <h1 style={{textAlign: "center"}}>Log in</h1>

       {/* <div className="message">Sorry, That login is incorrect</div> */}

        <form className="login__form">
          <label>Email:</label>
          <input type="text" name="username" />

          <label>Password:</label>
          <input type="password" name="password" />

          <p>New to the app? <Link to="/register">Create an account</Link></p>

          <button className="btn btn--login">Log In</button>
        </form>
      </div>
    </>
  );
};

export default Login;
