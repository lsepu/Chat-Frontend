import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getChatHistory, initializeChat } from "../state/features/chatSlice";
import { updateUser } from "../state/features/userSlice";
import { AppDispatch, stateType } from "../state/store";

interface IContact {
  contact: string;
}

const ContactCard = ({ contact }: IContact) => {
  const dispatch = useDispatch<AppDispatch>();
  const chat = useSelector((state: stateType) => state.chat);
  const { user } = useSelector((state: stateType) => state.user);
  const navigate = useNavigate();

  //if there is no chat initialized
  const startPrivateChat = async () => {
    const chatHistory = await fetch(
      `https://realtime-chat-app-sofkau.herokuapp.com/messages/private/${user.email}/${contact}`
    );
    if (chatHistory.status === 200) {
      const chatHistoryFormatted = await chatHistory.json();
      const data = {
        chats: chatHistoryFormatted,
        email: contact,
      };

      dispatch(getChatHistory(data));
    } else {
      console.log("NUEVO CHAT");
      dispatch(
        initializeChat({
          email: contact,
        })
      );
    }

    navigate(`/chatroom/${contact}`);
  };

  const deleteContact = () => {
    const contactsUpdated = [...user.contacts].filter(
      (email) => email !== contact
    );
    const userUpdated = {
      ...user,
      contacts: contactsUpdated,
    };
    dispatch(updateUser(userUpdated));
  };

  return (
    <div className="contact-card">
      <span>{contact}</span>
      <div className="contact-options">
        <button onClick={startPrivateChat} className="btn">
          Send message
        </button>
        <button
          onClick={deleteContact}
          className="btn"
          style={{ marginLeft: "1em" }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ContactCard;
