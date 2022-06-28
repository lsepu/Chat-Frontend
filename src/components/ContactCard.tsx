import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { initializeChat } from "../state/features/chatSlice";
import { AppDispatch, stateType } from "../state/store";

interface IContact {
  contact: string;
}

const ContactCard = ({ contact }: IContact) => {
  const dispatch = useDispatch<AppDispatch>();
  const chat = useSelector((state: stateType) => state.chat);
  const navigate = useNavigate();

  //if there is no chat initialized
  const startPrivateChat = () => {
    if (!chat.privateChats[contact]) {
      console.log("NUEVO CHAT");
      dispatch(
        initializeChat({
          email: contact,
        })
      );
    }
    navigate(`/chatroom/${contact}`);
  };

  return (
    <div className="contact-card">
      <span>{contact}</span>
      <div className="contact-options">
        <button onClick={startPrivateChat} className="btn">
          Send message
        </button>
        <button className="btn" style={{ marginLeft: "1em" }}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ContactCard;
