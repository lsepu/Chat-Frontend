import Menu from "../components/Menu";
import { AppDispatch, stateType } from "../state/store";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const { connectionAvailable } = useParams();



  //Esto es del observer
  

  const ref = useRef(null);
  let isVisible = useOnScreen(ref);
  //

  // const [lastReceiver, setLastReceiver] = useState<string | undefined>('');
  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
  })

  useEffect(() => {
    // setLastReceiver(receiver);
    console.log(`stompClient: ${stompClient}`);
    console.log(`connectionAvailable: ${connectionAvailable}`);
    setTimeout(() => {
      if (stompClient && !firstUpdate.current) {
          console.log(user.email + " leyó tu mensaje por useEffect," + receiver)
          sendReadNotification()
          firstUpdate.current = false;
        }
    }, 10000);
  }, [receiver, chat.privateChats[`${receiver}`]]);


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
        message: `Your message has been read ${receiver}`,
        status: 'NOTIFICATION',
        isSeen: true,
      };

      if(receiver === "public"){
      stompClient.send('/app/message', {}, JSON.stringify(chatMessage));
      } else{
        dispatch(
          addOwnPrivateChatMessage({
            data: chatMessage,
          })
          );
        stompClient.send("/app/private-message", {}, JSON.stringify(chatMessage));
      }

      
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
                    {chat.status === 'NOTIFICATION' && ?
                    <b className="text-info">&#2713;</b>
                    //Dispatch => Mandarle chatIdSender, en el chatSlice crear el
                    :
                    <><b>{chat.idSender}</b> : {chat.message}{' '}</>
                  }
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
