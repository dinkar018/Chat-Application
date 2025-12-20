import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { addMessage } from "../redux/messageSlice";
import { getSocket } from "../socket";

const useGetRealTimeMessage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let interval = setInterval(() => {
      const socket = getSocket();
      if (!socket) return;

      socket.on("newMessage", (message) => {
        dispatch(addMessage(message));
      });

      clearInterval(interval);
    }, 200);

    return () => clearInterval(interval);
  }, []);
};

export default useGetRealTimeMessage;
