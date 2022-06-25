import React from "react";

const ContactCard = () => {
  return (
    <div className="contact-card">
      <span>Luis@gmail.com</span>
      <div className="contact-options">
        <button className="btn">Send message</button>
        <button className="btn" style={{ marginLeft: "1em" }}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default ContactCard;
