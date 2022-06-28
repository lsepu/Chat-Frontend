import { signOut } from "firebase/auth";
import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
// import { getUserByEmail, putUser } from "../actions/UserActions";
import { auth } from "../firebase";
import { postUser, selectUser, updateUser, userType } from "../state/features/userSlice";
import { AppDispatch, stateType } from "../state/store";

const Menu = () => {
  const navigate = useNavigate();
  const userState = useSelector(selectUser());
  const dispatch = useDispatch<AppDispatch>();



  const { logged }  = useSelector((state: stateType) => state.user);
  const userLogged = useSelector((state: stateType) => state.user)

  const logout = async() => {

    const updatedUserAsUserType: userType = {
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
          to="/chatroom"
          style={{ textDecoration: "none", color: "black" }}
          className="cardMenu-item"
        >
          Group chat
        </Link>
        <Link
          to="/contacts"
          style={{ textDecoration: "none", color: "black" }}
          className="cardMenu-item"
        >
          Contacts
        </Link>
        <div className="cardMenu-item">Juan</div>
      </div>
    </div>
  );
};

export default Menu;
