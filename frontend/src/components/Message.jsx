import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const Message = ({ message }) => {
  const scroll = useRef();
  const { authUser } = useSelector((store) => store.user);

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const senderId =
    typeof message?.senderId === "object"
      ? message?.senderId?._id
      : message?.senderId;

  const isSender = String(senderId) === String(authUser?._id);

  return (
    <div ref={scroll} className={`chat ${isSender ? "chat-end" : "chat-start"}`}>
      <div
        className={`chat-bubble ${
          isSender ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        {message?.message}
      </div>
    </div>
  );
};
export default Message;