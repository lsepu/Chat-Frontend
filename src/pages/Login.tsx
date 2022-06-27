import { inMemoryPersistence, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import React, { useEffect } from "react";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { stateType } from "../state/store";
import axios from "axios";
import { getUserByEmail } from "../actions/UserActions";

const Login = () => {
  const { logged } = useSelector((state: stateType) => state.user);
  const navigate = useNavigate();

  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const [ip, setIP] = useState<string>('');

  //creating function to load ip address from the API
  const getData = async () => {
    const res = await axios.get('https://geolocation-db.com/json/')
    setIP(res.data.IPv4)
  }
  
  useEffect( () => {
    //passing getData method to the lifecycle method
    getData()
  }, [])

  const setLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInput({
      ...loginInput,
      [e.target.name]: [e.target.value],
    });
  };

  useEffect(() => {
    if (logged) {
      navigate("/chatroom");
    }
  }, [logged]);

  const loginUser = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    // const userByEmail = await getUserByEmail(loginInput.email)

    // if(userByEmail.isLogged){
    //   console.log("User already logged in");
    // }else{
    //   console.log("User not logged in yet");
    // }
    
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginInput.email.toString(),
        loginInput.password.toString()
      );
      console.log(user);
      // setPersistence(auth, inMemoryPersistence).then(() => {
      //   console.log("Hola");
      // })
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
            New to the app? <Link to="/register">Create an account</Link>
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
