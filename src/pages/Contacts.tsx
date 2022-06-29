import { useSelector } from "react-redux";
import ContactCard from "../components/ContactCard";
import Menu from "../components/Menu";
import { stateType } from "../state/store";

const Contacts = ({ stompClient }: any) => {

  const { user } = useSelector((state: stateType) => state.user);

  return (
    <div className="content-wrapper">
      <div className="content-division">
        <Menu stompClient={stompClient}/>
        <div className="content-main">
          <h1 style={{textAlign:"center"}}>Contact list</h1>
          {
            user.contacts.map((contact, index) => <ContactCard key={index} contact={contact} /> )
          }
          <button style={{ float: "right" }} className="btn">
            Add contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
