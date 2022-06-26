import { signOut } from "firebase/auth";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { logOutInReducer } from "../state/features/loggedInSlice";

const Menu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.logged);

  const logout = () => {
    signOut(auth);
    dispatch(logOutInReducer());
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } 
  }, [user]);

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
