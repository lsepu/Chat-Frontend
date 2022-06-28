import { signOut } from "firebase/auth";
import  { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getUserByEmail, putUser } from "../actions/UserActions";
import { auth } from "../firebase";
import { stateType } from "../state/store";

const Menu = () => {
  const navigate = useNavigate();

  const { logged }  = useSelector((state: stateType) => state.user);
  const userLogged = useSelector((state: stateType) => state.user)

  const logout = async() => {
    const userEmail = userLogged.user?.email;
    let user = await getUserByEmail(`${userEmail}`)
    user.isLogged = false;
    user.ipAddress = "";
    // console.log(user)
    const userLoggedStatusUpdated = await putUser(user)
    // console.log(userLoggedStatusUpdated)
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
