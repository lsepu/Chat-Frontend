import Menu from "../components/Menu";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useEffect } from "react";
import { AppDispatch, stateType } from "../state/store";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  addOwnPrivateChatMessage,
  addPrivateChatMessage,
  createPrivateChat,
} from "../state/features/chatSlice";

interface IMessage {
  idSender: string;
  idReceiver: string | undefined;
  message: string;
  status: string;
  isSeen: boolean;
}

var stompClient: any = null;
const ChatRoom = () => {
  const { logged, user } = useSelector((state: stateType) => state.user);
  const chat = useSelector((state: stateType) => state.chat);

  const { receiver} = useParams();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<any>([]);
  const [privateChats, setPrivateChats] = useState(new Map());

  const dispatch = useDispatch<AppDispatch>();

  console.log(chat);
  // console.log(receiver);

  useEffect(() => {
    logged && connectToSocket();
  }, []);

  const connectToSocket = () => {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    stompClient.subscribe("/chatroom/public", onMessageReceived);
    stompClient.subscribe("/user/" + user.email + "/private", onPrivateMessage);
    userJoin();
  };

  const onMessageReceived = (payload: any) => {
    var payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case "JOIN":
        console.log("JOIN");
        break;
      case "MESSAGE":
        chatHistory.push(payloadData);
        setChatHistory([...chatHistory]);
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

      console.log("COSAS");
      console.log(list);

      //manage local state
      privateChats.set(payloadData.idSender, list);
      setPrivateChats(new Map(privateChats));

      //manage in redux
      // IF I'M THE ONE THAT INITIATED THE CHAT THEN IS NOT NEEDED TO CREATE WHEN SOMEONE SEND ME THE MESSAGE

      // console.log("michat");
      // console.log(chatStarted)

      // if (chatStarted) {
      //   console.log("chat empezado");
      //   dispatch(
      //     addPrivateChatMessage({
      //       data: payloadData,
      //     })
      //   );
      // } else {
      //   console.log("no deberia entrar aca")
      //   dispatch(
      //     createPrivateChat({
      //       data: payloadData,
      //       list: list,
      //     })
      //   );
      // }

      dispatch(
        createPrivateChat({
          data: payloadData,
          list: list,
        })
      );

    }
  };

  const userJoin = () => {
    var chatMessage: IMessage = {
      idSender: user.email,
      idReceiver: receiver,
      message: "",
      status: "JOIN",
      isSeen: false,
    };
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  };

  const onError = (err: any) => {
    console.log(err);
  };

  const sendValue = () => {
    if (stompClient) {
      var chatMessage: IMessage = {
        idSender: user.email,
        idReceiver: receiver,
        message: message,
        status: "MESSAGE",
        isSeen: false,
      };
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
      setMessage("");
    }
  };

  const sendPrivateValue = () => {
    if (stompClient) {
      var chatMessage: IMessage = {
        idSender: user.email,
        idReceiver: receiver,
        message: message,
        status: "MESSAGE",
        isSeen: false,
      };

      dispatch(
        addOwnPrivateChatMessage({
          data: chatMessage,
        })
      );

      stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      setMessage("");
    }
  };

  return (
    <div className="content-wrapper">
      <div className="content-division">
        <Menu />
        <div className="content-main">
          <div className="chat">
            {chatHistory.map((chat: any, index: number) => (
              <p style={{ marginLeft: "10px" }} key={index}>
                <b>{chat.idSender}</b> : {chat.message}{" "}
              </p>
            ))}
          </div>
          <div className="send-message">
            <input
              style={{ margin: "0 1em 0 0", padding: "0.6em" }}
              type="text"
              className="input-message"
              placeholder="enter the message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={receiver === "public" ? sendValue : sendPrivateValue}
              className="btn"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
