import Menu from '../components/Menu';
import { AppDispatch, stateType } from '../state/store';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { addOwnPrivateChatMessage } from '../state/features/chatSlice';
import { useInView } from 'react-cool-inview';

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

      stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
      setMessage('');
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

      stompClient.send('/app/private-message', {}, JSON.stringify(chatMessage));
      setMessage('');
    }
  };

  const { observe, unobserve, inView, scrollDirection, entry } =
    useInView<HTMLDivElement>({
      threshold: 0, // Default is 0
      // Stop observe when the target enters the viewport, so the "inView" only triggered once
      //unobserveOnEnter: true,
      onChange: ({ inView, scrollDirection, entry, observe, unobserve }) => {
        // Triggered whenever the target meets a threshold, e.g. [0.25, 0.5, ...]
        console.log('On change inview:' + inView);
        // unobserve(); // To stop observing the current target element
        observe(); // To re-start observing the current target element
      },
      onEnter: ({ scrollDirection, entry, observe, unobserve }) => {
        console.log('On enter');
        if (receiver !== 'public') {
          sendReadNotification();
        }
        observe(); // To re-start observing the current target element
        // unobserve(); // To re-start observing the current target element

        // Triggered when the target enters the viewport
      },
      onLeave: ({ scrollDirection, entry, observe, unobserve }) => {
        console.log('On leave');
        unobserve(); // To stop observing the current target element
        // Triggered when the target leaves the viewport
      },
      // More useful options...
    });

  return (
    <div className="content-wrapper">
      <div className="content-division">
        <Menu />
        <div className="content-main">
          <div className="chat" ref={observe}>
            {receiver === 'public'
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
