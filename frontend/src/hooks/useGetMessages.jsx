import { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setMessages, clearMessages } from "../redux/messageSlice";
import { BASE_URL } from "../config";

const useGetMessages = () => {
  const { selectedUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedUser?._id) {
      dispatch(clearMessages());
      return;
    }

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/v1/message/${selectedUser._id}`,
          { withCredentials: true }
        );
        dispatch(setMessages(res.data));
      } catch (err) {
        console.error(err);
      }
    };

    fetchMessages();
  }, [selectedUser?._id]);
};

export default useGetMessages;
