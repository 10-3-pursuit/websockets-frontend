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
    if (toggleLogin) {
      socket.on("remindersDue", (receivedReminders) => {
        // Assuming receivedReminders is an array of reminders

        if (receivedReminders.length > 0) {
          setModalContent(`You are schedule for ${receivedReminders[0].title} at
        ${formattedDate.format(new Date(receivedReminders[0].reminder_time))}`);
          setIsModalOpen(true);
          // alert(`You are schedule for ${receivedReminders[0].title} at
          // ${formattedDate.format(new Date(receivedReminders[0].reminder_time))}`);
        }

        // Further processing based on your application's logic
      });

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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default NavBar;
