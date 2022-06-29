import ContactCard from "../components/ContactCard";
import Menu from "../components/Menu";
import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
const Contacts = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="content-wrapper">
      <div className="content-division">
        <Menu />
        <div className="content-main">
          <h1 style={{ textAlign: "center" }}>Contact list</h1>
          <ContactCard />
          <button
            style={{ float: "right" }}
            className="btn"
            onClick={handleShow}
          >
            Añadir
          </button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Añadir Contacto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Ingrese correo del contacto</Form.Label>
                  <Form.Control type="email" placeholder="Email" />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={handleClose}>Volver</Button>
              <Button onClick={handleClose}>Añadir</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
