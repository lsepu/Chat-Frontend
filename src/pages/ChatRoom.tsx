import Menu from "../components/Menu";
import { AppDispatch, stateType } from "../state/store";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { addOwnPrivateChatMessage } from "../state/features/chatSlice";
import { selectChannel } from "../state/features/channelSlice";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

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
  const channelState = useSelector(selectChannel());

  const { receiver, channel } = useParams();
  const [message, setMessage] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const [show, setShow] = useState(false);

  // console.log(channel);
  // console.log(chat.channelChat[`${channel}`]);

  const dispatch = useDispatch<AppDispatch>();

  const sendValue = () => {
    // console.log(stompClient);
    if (stompClient) {
      var chatMessage: IMessage = {
        idSender: user.email,
        idReceiver: channel,
        message: message,
        status: "MESSAGE",
        isSeen: false,
      };

      // stompClient.send(
      //   `/app/channel/${channel}`,
      //   {},
      //   JSON.stringify(chatMessage)
      // );
      stompClient.send("/app/channel/general", {}, JSON.stringify(chatMessage));
      setMessage("");
    }
  };

  const sendPrivateValue = () => {
    // console.log(stompClient);
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

  const showDescription = () => {
    let desc = "";
    channelState.map((channelReceieved) => {
      if (channelReceieved.name === channel) {
        desc = channelReceieved.description;
      }
    });
    setChannelDescription(desc);
    setShow(true);
  };

  return (
    <div className="content-wrapper">
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Channel Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>{channelDescription}</Modal.Body>
      </Modal>

      <div className="content-division">
        <Menu />
        <div className="content-main">
          <div className="chat">
            {channel && chat.channelChat[channel]
              ? chat.channelChat[channel].map((chat: any, index: number) => (
                  <p style={{ marginLeft: "10px" }} key={index}>
                    <b>{chat.idSender}</b> : {chat.message}{" "}
                  </p>
                ))
              : receiver !== undefined &&
                chat.privateChats[receiver] &&
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
              onClick={channel ? sendValue : sendPrivateValue}
              className="btn"
            >
              Send
            </button>
          </div>
          <div>
            {channel && channel !== "general" && (
              <p
                onClick={showDescription}
                style={{ color: "blue", cursor: "pointer", fontSize: "14px" }}
              >
                Check channel description
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
