const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "lemonchiffon",
          padding: "20px",
          borderRadius: "5px",
          width: "80%",
          maxWidth: "400px",
        }}
      >
        {children}
        <button
          onClick={onClose}
          style={{
            background: "lightgreen",
            borderRadius: "5px",
            padding: 5,
            marginTop: "10px",
            display: "block",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
export default Modal;
