import { useEffect, useState } from "react";

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
    </div>
  );
};

export default SocketComponent;
