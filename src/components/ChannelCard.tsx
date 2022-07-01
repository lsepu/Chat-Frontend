import { channelType, updateChannel } from "../state/features/channelSlice";
import { useSelector, useDispatch } from "react-redux";
import { stateType, AppDispatch } from "../state/store";
import { deleteChannel } from "../state/features/channelSlice";
import { joinChannel, removeChannelCard } from "../state/features/chatSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const ChannelCard = ({ id, name, description }: channelType) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showEdit, setShowEdit] = useState(false);
  const [channelDescription, setChannelDescription] = useState("");

  const handleDeleteChannels = (id: string | undefined) => {
    dispatch(deleteChannel(id));
  };

  const handleJoin = async () => {

      dispatch(
        joinChannel({
          name,
        })
      );

      navigate(`/chatroom/channel/${name}`);

  };

  const handleEdit = () => {
    const channelUpdated = {
      id: id,
      name: name,
      description: channelDescription
    }
    dispatch(updateChannel(channelUpdated));
    alert("La descripción del canal ha sido actualizada");
    setShowEdit(false);
    setChannelDescription("");
  }

  return (
    <>
    <div className="contact-card">
      <span>{name}</span>
      <div className="contact-options">
        <button onClick={handleJoin} className="btn">
          Join
        </button>
        <button
          className="btn"
          style={{ marginLeft: "1em" }}
          onClick={() => handleDeleteChannels(id)}
        >
          Delete
        </button>
        <button
          className="btn"
          style={{ marginLeft: "1em" }}
          onClick={() => setShowEdit(true)}
        >
          Edit
        </button>
      </div>
    </div>

    <Modal show={showEdit} onHide={() => setShowEdit(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Editar descripción del canal</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
              <Button onClick={handleEdit}>Actualizar</Button>
            </Modal.Footer>
          </Modal>

    </>
  );
};

export default ChannelCard;
