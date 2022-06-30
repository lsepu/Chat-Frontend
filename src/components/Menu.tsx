import { signOut } from "firebase/auth";
import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { postUser, selectUser, updateUser, userType } from "../state/features/userSlice";
import { AppDispatch, stateType } from "../state/store";

const Menu = ({ stompClient }: any) => {
  const navigate = useNavigate();
  const userState = useSelector(selectUser());
  const dispatch = useDispatch<AppDispatch>();

  const { logged } = useSelector((state: stateType) => state.user);
  const chat = useSelector((state: stateType) => state.chat);


  // const { logged }  = useSelector((state: stateType) => state.user);
  const userLogged = useSelector((state: stateType) => state.user.logged)

  const logout = async() => {
    const updatedUserAsUserType: userType = {
      id: `${userState.id}`,
      userName: `${userState.userName}`,
      email: `${userState.email}`,
      contacts: userState.contacts,
      isLogged: false,
      ipAddress: ""
    }
    dispatch(updateUser(updatedUserAsUserType));
    signOut(auth);
    
  };

  useEffect(() => {
    console.log("SOY EL USEFFECT: ",userLogged);
    if (!userLogged) {
      navigate("/login");
    }
  }, [userLogged]);

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
        <Link
          to="/channels"
          style={{ textDecoration: "none", color: "black" }}
          className="cardMenu-item"
        >
          Channels
        </Link>

        {chat.privateChatNames.map((name, key) => (
          <Link to={`/chatroom/${name}`} key={key} className="cardMenu-item">{name}</Link>
        ))}
      </div>
    </div>
  );
};

export default Menu;
