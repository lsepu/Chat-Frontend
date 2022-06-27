import Menu from "../components/Menu";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useEffect } from "react";
import { stateType } from "../state/store";
import { useSelector } from "react-redux";
import { useState } from "react";

interface IMessage {
  idSender: string | undefined;
  idReceiver: string;
  message: string;
  status: string;
  isSeen: boolean;
}

var stompClient: any = null;
const ChatRoom = () => {
  const { logged, user } = useSelector((state: stateType) => state.user);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<any>([]); 

  useEffect(() => {
    logged && connectToSocket();
  }, []);

  const connectToSocket = () => {
    let Sock = new SockJS("http://localhost:8080/ws");
    stompClient = over(Sock);
    stompClient.connect({}, onConnected, onError);
  };

  const onConnected = () => {
    console.log("connected");
    stompClient.subscribe("/chatroom/public", onMessageReceived);
    userJoin();
  };

  const onMessageReceived = (payload: any) => {
    var payloadData = JSON.parse(payload.body);
    switch (payloadData.status) {
      case "JOIN":
        console.log("JOIN");
        break;
      case "MESSAGE":
        console.log(payloadData);
        chatHistory.push(payloadData);
        setChatHistory([...chatHistory]);
        break;
    }
  };

  const userJoin = () => {
    var chatMessage : IMessage = {
      idSender: user?.email,
      idReceiver: "public",
      message: "",
      status: "JOIN",
      isSeen: false
    };
    stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
  };

  const onError = (err: any) => {
    console.log(err);
  };

  const sendValue = () => {
    if (stompClient) {
      var chatMessage: IMessage = {
        idSender: user?.email,
        idReceiver: "public",
        message: message,
        status: "MESSAGE",
        isSeen: false
      };
      console.log(chatMessage);
      stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
      setMessage("");
    }
  };

  return (
    <div className="content-wrapper">
      <div className="content-division">
        <Menu />
        <div className="content-main">
          <div className="chat">
            {
              chatHistory.map((chat : any, index : number) => (
                <p style={{marginLeft: "10px"}} key={index}><b>{chat.idSender}</b> : {chat.message} </p>
              ))
            }

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
            <button onClick={sendValue} className="btn">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
