import { useEffect, useState } from "react";
import io from "socket.io-client";
import Modal from "./Modal";
const socket = io("http://localhost:3003");

const formattedDate = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  //   second: "2-digit",
  hour12: true, // Use 12-hour time; set to false for 24-hour time
});

const SocketComponent = () => {
  const [reminders, setReminders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    fetch("http://localhost:3003/reminders/1")
      .then((res) => res.json())
      .then((data) => setReminders(data));
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h1>Reminders</h1>
      <ul>
        {reminders &&
          reminders.map((reminder) => (
            <ol key={reminder.id}>
              {reminder.title} -{" "}
              {formattedDate.format(new Date(reminder.reminder_time))}
            </ol>
          ))}
      </ul>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default SocketComponent;
