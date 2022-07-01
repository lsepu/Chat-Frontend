import ChannelCard from "../components/ChannelCard";
import Menu from "../components/Menu";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { stateType, AppDispatch } from "../state/store";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {
  getAllChannels,
  postChannel,
  channelType,
  selectChannel,
  updateChannel,
  selectChannelError,
  selectChannelStatus,
  channelFetchStatus,
} from "../state/features/channelSlice";

const Channels = () => {
  const [show, setShow] = useState(false);
  const channelState = useSelector(selectChannel());
  const channelStatus = useSelector(selectChannelStatus());
  const channelError = useSelector(selectChannelError());
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (channelStatus === channelFetchStatus.IDLE) {
      dispatch(getAllChannels());
    }
  }, []);

  const handleAddChannels = async () => {
    const channels = await fetch(
      "https://realtime-chat-app-sofkau.herokuapp.com/channel/"
    );
    const channelsJson = await channels.json();

    const found = channelsJson.find((channel : any) => channel.name === channelName);

    if (!found) {
      if (channelDescription! && channelName!) {
        const canal = { name: channelName, description: channelDescription };
        dispatch(postChannel(canal));
        handleClose();
        setChannelDescription("");
        setChannelName("");
      }
    } else {
      alert("A channel with that name already exists");
    }
  };

  return (
    <div className="content-wrapper">
      <div className="content-division">
        <Menu />
        <div className="content-main">
          <h1 style={{ textAlign: "center" }}>Canales</h1>
          <>
            {!channelError &&
              channelState.map((channel) => {
                return (
                  <ChannelCard
                    key={channel.id}
                    name={channel.name}
                    description={channel.description}
                    id={channel.id}
                  />
                );
              })}
          </>
          <button
            style={{ float: "right" }}
            className="btn"
            onClick={handleShow}
          >
            Añadir
          </button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Añadir Canal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nombre"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Form>
              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Descripcion</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Descripcion"
                    as="textarea"
                    rows={3}
                    maxLength={2000}
                    value={channelDescription}
                    onChange={(e) => setChannelDescription(e.target.value)}
                    required
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={handleClose}>Volver</Button>
              <Button onClick={handleAddChannels}>Añadir</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Channels;
