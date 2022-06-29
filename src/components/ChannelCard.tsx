import {channelType} from "../state/features/channelSlice";
import { useSelector, useDispatch } from "react-redux";
import { stateType, AppDispatch } from "../state/store";
import {
  deleteChannel
} from "../state/features/channelSlice";

const ChannelCard = ({id,name,description}: channelType)=> {
  const dispatch = useDispatch<AppDispatch>();
  const handleDeleteChannels= (id:string|undefined)=>{
    console.log(id)
    dispatch(deleteChannel(id));
  }

  return (
    <div className="contact-card">
      <span>{name}</span>
      <div className="contact-options">
        <button className="btn">Join</button>
        <button className="btn" style={{ marginLeft: "1em" }} onClick={()=>handleDeleteChannels(id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ChannelCard;
