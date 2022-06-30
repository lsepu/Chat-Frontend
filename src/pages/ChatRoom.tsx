import Menu from "../components/Menu";
import { AppDispatch, stateType } from "../state/store";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { addOwnPrivateChatMessage } from "../state/features/chatSlice";
import useOnScreen from "../actions/UserActions";
import { useInView } from "react-cool-inview";


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
  const [message, setMessage] = useState('');
  const dispatch = useDispatch<AppDispatch>();


  //Esto es del observer
  

  const ref = useRef(null);
  let isVisible = useOnScreen(ref);
  console.log("IsVisible true")
  
  //


  const sendValue = () => {
    if (stompClient) {
      var chatMessage: IMessage = {
        idSender: user.email,
        idReceiver: receiver,
        message: message,
        status: 'MESSAGE',
        isSeen: false,
      };

      stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
      setMessage('');
    }
  };

  const sendReadNotification = () => {
    if (stompClient) {
      var chatMessage: IMessage = {
        idSender: user.email,
        idReceiver: receiver,
        message: 'Your message has been read',
        status: 'MESSAGE',
        isSeen: true,
      };

      dispatch(
        addOwnPrivateChatMessage({
          data: chatMessage,
        })
      );

      
        stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      
      // useEffect(()=>{
      //   console.log("IsVisible false")
      //     let isVisible = false;
      //   },[chat])
      setMessage("");
    }
  };

  const sendPrivateValue = () => {
    if (stompClient) {
      var chatMessage: IMessage = {
        idSender: user.email,
        idReceiver: receiver,
        message: message,
        status: 'MESSAGE',
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
 
  if(isVisible && receiver === "public"){
    console.log(user.email + " leyó mensaje publico")
    isVisible = false;
  } else if(isVisible && receiver!== undefined){
    console.log(user.email + " leyó tu mensaje," + receiver)
    // console.log("isVisible before: " +isVisible)
    // console.log("isVisible after: " +isVisible)
    
    // setMessage(user.email + " leyó tu mensaje,")
    // sendReadNotification();
    // isVisible = false;
    // setSendNoti(false);
  };





  return (
    <div className="content-wrapper">
      <div className="content-division">
        <Menu />
        <div className="content-main">

          <div className="chat" ref={ref}>
            {receiver === "public"
              ? chat.publicChat.map((chat: any, index: number) => (
                  <p style={{ marginLeft: '10px' }} key={index}>
                    <b>{chat.idSender}</b> : {chat.message}{' '}
                  </p>
                ))
              : receiver !== undefined &&
                chat.privateChats[receiver].map((chat: any, index: number) => (
                  <p style={{ marginLeft: '10px' }} key={index}>
                    <b>{chat.idSender}</b> : {chat.message}{' '}
                  </p>
                ))}
          </div>

          <div className="send-message">
            <input
              style={{ margin: '0 1em 0 0', padding: '0.6em' }}
              type="text"
              className="input-message"
              placeholder="enter the message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={receiver === 'public' ? sendValue : sendPrivateValue}
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
