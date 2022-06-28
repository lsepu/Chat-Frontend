import Menu from "../components/Menu";
import { AppDispatch, stateType } from "../state/store";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { addOwnPrivateChatMessage } from "../state/features/chatSlice";

interface IMessage {
  idSender: string;
  idReceiver: string | undefined;
  message: string;
  status: string;
  isSeen: boolean;
}

const ChatRoom = ({ stompClient }: any) => {
  const { user } = useSelector((state: stateType) => state.user);
  const chat = useSelector((state: stateType) => state.chat);

  const { receiver } = useParams();
  const [message, setMessage] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const sendValue = () => {
    console.log(stompClient);
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
    console.log(stompClient);
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
            {receiver === "public"
              ? chat.publicChat.map((chat: any, index: number) => (
                  <p style={{ marginLeft: "10px" }} key={index}>
                    <b>{chat.idSender}</b> : {chat.message}{" "}
                  </p>
                ))
              : receiver !== undefined &&
                chat.privateChats[receiver].map((chat: any, index: number) => (
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
