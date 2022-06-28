import { signOut } from "firebase/auth";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { stateType } from "../state/store";

const Menu = () => {
  const navigate = useNavigate();

  const { logged } = useSelector((state: stateType) => state.user);
  const chat = useSelector((state: stateType) => state.chat);

  const logout = () => {
    signOut(auth);
  };

  useEffect(() => {
    if (!logged) {
      navigate("/login");
    }
  }, [logged]);

  return (
    <div>
      <div className="cardMenu-container">
        <div
          style={{ marginTop: "0px" }}
          onClick={logout}
          className="cardMenu-item btn-logout"
        >
          Logout
        </div>
        <Link
          to="/chatroom/public"
          className="cardMenu-item"
        >
          Group chat
        </Link>
        <Link
          to="/contacts"
          className="cardMenu-item"
        >
          Contacts
        </Link>

        {chat.privateChatNames.map((name, key) => (
          <Link to={`/chatroom/${name}`} key={key} className="cardMenu-item">{name}</Link>
        ))}
      </div>
    </div>
  );
};

export default Menu;
