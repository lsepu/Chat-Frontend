import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import "./App.css";
import { auth } from "./firebase";
import ChatRoom from "./pages/ChatRoom";
import Contacts from "./pages/Contacts";
import Register from "./pages/Register";
import Modal from "react-bootstrap/Modal";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import Login from "./pages/Login";
import { login, logout } from "./state/features/userSlice";
import { AppDispatch, stateType } from "./state/store";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import {
  addPrivateChatMessage,
  addPublicChatMessage,
  createPrivateChat,
} from "./state/features/chatSlice";



var stompClient: any = null;
function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { logged, user } = useSelector((state: stateType) => state.user);
  const [isLoading, setLoading] = useState(true);
  

  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        if (userAuth.emailVerified) {
          //if userByEmail.status === 500
          //userAsUserType
          //postNewUser
          // console.log(userAuth);
          // console.log("is verified");

          // dispatch(
          // login({
          //     email: userAuth.email,
          //     contacts: ["lesepulveda@uninorte.edu.co"],
          //   })
          // );

          connectToSocket();

        } else {
          handleShow();
          signOut(auth);
        }
      } else {
        dispatch(logout());
        stompClient?.disconnect();
      }
      setLoading(false);
    });
  }, []);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //--------------------------------------------Socket Config-------------------------------------------------------------------------
  const [privateChats, setPrivateChats] = useState(new Map());

  const chat = useSelector((state: stateType) => state.chat);
  console.log(chat);
  // console.log(receiver);

  const connectToSocket = () => {
    let Sock = new SockJS("https://realtime-chat-app-sofkau.herokuapp.com//ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    stompClient.subscribe("/chatroom/public", onMessageReceived);
    stompClient.subscribe(
      "/user/" + auth.currentUser?.email + "/private",
      onPrivateMessage
    );
    userJoin();
  };

  const onMessageReceived = (payload: any) => {
    var payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case "JOIN":
        console.log("JOIN");
        break;
      case "MESSAGE":
        dispatch(
          addPublicChatMessage({
            message: payloadData,
          })
        );
        break;
    }
  };

  const onPrivateMessage = (payload: any) => {
    var payloadData = JSON.parse(payload.body);

    if (privateChats.get(payloadData.idSender)) {
      //manage local state
      //deep copy of array
      let tempList = JSON.parse(
        JSON.stringify(privateChats.get(payloadData.idSender))
      );
      tempList.push(payloadData);

      privateChats.set(payloadData.idSender, tempList);
      privateChats.get(payloadData.idSender).push(payloadData);
      setPrivateChats(new Map(privateChats));

      //manage in redux
      dispatch(
        addPrivateChatMessage({
          data: payloadData,
        })
      );
    } else {
      let list = [];
      list.push(payloadData);

      //manage local state
      privateChats.set(payloadData.idSender, list);
      setPrivateChats(new Map(privateChats));

      dispatch(
        createPrivateChat({
          data: payloadData,
          list: list,
        })
      );
    }
  };

  const userJoin = () => {
    var chatMessage = {
      idSender: user.email,
      idReceiver: "public",
      message: "",
      status: "JOIN",
      isSeen: false,
    };
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  };

  const onError = (err: any) => {
    console.log(err);
  };

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
              element={
                <Navigate to={logged ? "/chatroom/public" : "/login"} replace />
              }
            />

            <Route path="login" element={<Login connectToSocket={connectToSocket}/>} />
            <Route path="register" element={<Register />} />
            <Route path="contacts" element={<Contacts connectToSocket={connectToSocket}/>} />
            <Route
              path="chatroom/:receiver"
              element={
                <ChatRoom
                  privateChats={privateChats}
                  stompClient={stompClient}
                />
              }
            />
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
