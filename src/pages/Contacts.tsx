import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ContactCard from "../components/ContactCard";
import Menu from "../components/Menu";
import { AppDispatch, stateType } from "../state/store";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { updateUser } from "../state/features/userSlice";

const Contacts = ({ stompClient }: any) => {
  const { user } = useSelector((state: stateType) => state.user);
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  const addContact = async () => {
    const response = await fetch(
      `https://realtime-chat-app-sofkau.herokuapp.com/user/userEmail/${email}`
    );
    console.log(response.status);
    if (response.status === 200) {
      const formatedResponse = await response.json();
      const emailReceived = formatedResponse.email;

      const found = [...user.contacts].find((email) => email === emailReceived);

      if (!found && emailReceived !== user.email) {
        const contactsUpdated = [...user.contacts];
        contactsUpdated.push(emailReceived);

        const userUpdated = {
          ...user,
          contacts: contactsUpdated,
        };

        dispatch(updateUser(userUpdated));
        setShow(false);
        setEmail("");
      } else {
        alert("the user can't be added");
      }
    } else {
      alert("user not found");
    }
  };

  return (
    <div className="content-wrapper">
      <div className="content-division">
        <Menu stompClient={stompClient} />
        <div className="content-main">
          <h1 style={{ textAlign: "center" }}>Contact list</h1>
          {user.contacts.map((contact, index) => (
            <ContactCard key={index} contact={contact} />
          ))}
          <button
            onClick={() => setShow(true)}
            style={{ float: "right" }}
            className="btn"
          >
            Add contact
          </button>
        </div>
      </div>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add new contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form>
          <Button variant="primary" onClick={addContact}>
            Add Contact
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Contacts;
