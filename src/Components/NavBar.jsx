import { useEffect, useState } from "react";
import io from "socket.io-client";
import Modal from "./Modal";
const socket = io("http://localhost:3003");

import { Link } from "react-router-dom";

const URL = import.meta.env.VITE_BASE_URL;

const formattedDate = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  //   second: "2-digit",
  hour12: true, // Use 12-hour time; set to false for 24-hour time
});

const NavBar = ({ toggleLogin, handleLogout }) => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  useEffect(() => {
    if (!toggleLogin) setUser(null);

    if (toggleLogin) {
      const token = localStorage.getItem("token");
      if (token) {
        // remember to use the new URL for the fetch using the checkController
        fetch(`${URL}/api/check/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("navuser", data.user);
            setUser(data.user);
          })
          .catch((error) => console.error("Error fetching user:", error));
      }
    }
  }, [toggleLogin]);

  useEffect(() => {
    //We only want this useEffect to run when the user is logged in
    if (toggleLogin) {
      // This is the socket.on method to listen for the remindersDue event in the backend schedule.js file
      socket.on("remindersDue", (receivedReminders) => {
        if (receivedReminders.length > 0) {
          // This is the content for the modal
          setModalContent(`You are schedule for ${receivedReminders[0].title} at
        ${formattedDate.format(new Date(receivedReminders[0].reminder_time))}`);
          // This is the method to open the modal
          setIsModalOpen(true);
        }
      });

      //  We need to add this return to avoid memory leaks. It turns the socket.on method off when the component is unmounted
      return () => {
        socket.off("remindersDue");
      };
    }
  }, [toggleLogin]);

  return (
    <div className="navbar-container">
      <h1>Navbar Component</h1>
      <h2>
        <Link style={{ textDecoration: "none" }} to="/">
          Your image or Logo (click here to go to Landing Page)
        </Link>
      </h2>

      {!toggleLogin ? (
        <Link to={"/login"}>
          <span>Login</span>
        </Link>
      ) : (
        <div>
          {user && <span>Hello, {user.username.toUpperCase()}? | </span>}
          <Link onClick={handleLogout}>
            <span>Logout</span>
          </Link>
        </div>
      )}
      <hr />
      {/* We are creating a modal to show the reminders. It will pop up each time the socket.on method is triggered in the backend schedule.js file. We give it an onClose method to close the modal by clicking ok and we reset the modalContent and isModalOpen to false */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalContent("");
        }}
      >
        {modalContent}
      </Modal>
    </div>
  );
};

export default NavBar;
