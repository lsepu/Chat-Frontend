import {
  inMemoryPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import React, { useEffect } from "react";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, stateType } from "../state/store";
import axios from "axios";
// import { getUserByEmail, postNewUser, putUser } from "../actions/UserActions";
import {
  getUser,
  postUser,
  userType,
  selectUser,
  updateUser,
  selectUserStatus,
  userFetchStatus,
} from "../state/features/userSlice";
import { initializeChannelChat } from "../state/features/chatSlice";


const Login = ({connectToSocket} : any) => {
  const userState = useSelector(selectUser());
  const userStatus = useSelector(selectUserStatus());
  const dispatch = useDispatch<AppDispatch>();
  const { logged } = useSelector((state: stateType) => state.user);

  const navigate = useNavigate();

  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const [ip, setIP] = useState<string>("");

  //creating function to load ip address from the API
  const getData = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    setIP(res.data.IPv4);
  };

  useEffect(() => {
    //passing getData method to the lifecycle method
    getData();
  }, []);

  const setLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginInput({
      ...loginInput,
      [e.target.name]: [e.target.value],
    });
  };

  // useEffect(() => {
  //   if (logged) {
  //     connectToSocket();
  //     //navigate("/chatroom/public");
  //   }
  // }, [logged]);

  const loginUser = async(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginInput.email.toString(),
        loginInput.password.toString()
      );

      // let userByEmail = await getUserByEmail(`${user.user.email}`);
      let response: any = await dispatch(getUser(`${user.user.email}`));

      console.log(response.payload);

      if (response.error) {
        console.log("Voy a guardar el usuario");
        const newUserAsUserType: userType = {
          userName: `${user.user.email}`,
          email: `${user.user.email}`,
          contacts: [],
          isLogged: true,
          ipAddress: ip,
        };

        response = await dispatch(postUser(newUserAsUserType));
      }

      //console.log("PRUEBAAA");
      console.log(ip);

      if (response.payload!==500 && !response.payload.isLogged) {
        //console.log("ENTRE A ACTUALIZAR");
        const userUpdated: userType = {
          id: response.payload.id,
          userName: response.payload.userName,
          email: response.payload.email,
          contacts: response.payload.contacts,
          isLogged: true,
          ipAddress: ip,
        };
        response = await dispatch(updateUser(userUpdated));
      }

      if (response.payload.isLogged && response.payload.ipAddress !== ip) {
        auth.signOut();
        window.alert("There is another sesion active");
      } else {
          onAuthStateChanged(auth, (userAuth) => {
          if (!userAuth?.emailVerified) {
          console.log("NO ESTÁ VERIFICADO");
          navigate("/login");
          } else {
            // connectToSocket();
            dispatch(initializeChannelChat());
            navigate("/chatroom/channel/general");
          }
        }
      )}
      // userState.isLogged = true;
      // userState.ipAddress = ip;
      // const userLoggedStatusUpdated = await putUser(userState)

      setPersistence(auth, inMemoryPersistence).then(() => {
        // console.log("Hola");
      });
    } catch (error) {
      window.alert("Not able to login with the provided credentials");
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
          <button onClick={(e) => loginUser(e)} className="btn btn--login">
            Log In
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
