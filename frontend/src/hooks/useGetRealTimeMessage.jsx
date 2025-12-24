import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage } from "../redux/messageSlice";
import { getSocket } from "../socket";

const useGetRealTimeMessage = () => {
  const dispatch = useDispatch();
  const { selectedUser } = useSelector((store) => store.user);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !selectedUser?._id) return;

    const handleNewMessage = (message) => {
      const senderId =
        typeof message.senderId === "object"
          ? message.senderId._id
          : message.senderId;

      const receiverId =
        typeof message.receiverId === "object"
          ? message.receiverId._id
          : message.receiverId;

      if (
        senderId === selectedUser._id ||
        receiverId === selectedUser._id
      ) {
        dispatch(addMessage(message));
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [dispatch, selectedUser?._id]);
};

export default useGetRealTimeMessage;
