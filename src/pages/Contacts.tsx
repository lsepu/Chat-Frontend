import ContactCard from "../components/ContactCard";
import Menu from "../components/Menu";

const Contacts = () => {
  return (
    <div className="content-wrapper">
      <div className="content-division">
        <Menu />
        <div className="content-main">
          <h1 style={{textAlign:"center"}}>Contact list</h1>
          <ContactCard />
          <button style={{ float: "right" }} className="btn">
            Add contact
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
