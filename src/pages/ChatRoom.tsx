import Menu from "../components/Menu";

const ChatRoom = () => {

  return (
    <div className="content-wrapper">
      <div className="content-division">
        <Menu />
        <div className="content-main">
          <div className="chat"></div>
          <div className="send-message">
            <input
              style={{ margin: "0 1em 0 0", padding: "0.6em" }}
              type="text"
              className="input-message"
              placeholder="enter the message"
            />
            <button className="btn">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;