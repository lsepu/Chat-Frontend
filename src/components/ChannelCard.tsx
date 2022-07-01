import { channelType } from "../state/features/channelSlice";
import { useSelector, useDispatch } from "react-redux";
import { stateType, AppDispatch } from "../state/store";
import { deleteChannel } from "../state/features/channelSlice";
import { joinChannel } from "../state/features/chatSlice";
import { useNavigate } from "react-router-dom";

const ChannelCard = ({ id, name, description }: channelType) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleDeleteChannels = (id: string | undefined) => {
    console.log(id);
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

  return (
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
      </div>
    </div>
  );
};

export default ChannelCard;
