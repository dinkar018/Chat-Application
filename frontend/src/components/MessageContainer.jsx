import React from "react";
import SendInput from "./SendInput";
import Messages from "./Messages";
import { useSelector } from "react-redux";
import { use } from "react";
import useGetMessages from "../hooks/useGetMessages";
import useGetRealTimeMessage from "../hooks/useGetRealTimeMessage";
const MessageContainer = () => {
    useGetMessages();
    useGetRealTimeMessage();
  const { selectedUser, authUser, onlineUsers } = useSelector(
    (store) => store.user
  );

  const isOnline =
    selectedUser &&
    onlineUsers.some(
      (id) => String(id) === String(selectedUser._id)
    );

  if (!selectedUser) {
    return (
      <div className="md:min-w-[550px] flex flex-col justify-center items-center">
        <h1 className="text-4xl text-white font-bold">
          Hi, {authUser?.fullName}
        </h1>
        <h1 className="text-2xl text-white">
          Let's start conversation
        </h1>
      </div>
    );
  }

  return (
    <div className="md:min-w-[550px] flex flex-col">
      {/* Header */}
      <div className="flex gap-3 items-center bg-zinc-800 text-white px-4 py-2 mb-2">
        {/* Avatar + online dot */}
        <div className="relative">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src={selectedUser.profilePhoto}
              alt="user-profile"
              className="w-full h-full object-cover"
            />
          </div>

          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-zinc-800 rounded-full"></span>
          )}
        </div>

        <div className="flex flex-col">
          <p className="font-semibold">{selectedUser.fullName}</p>
          <span className="text-xs text-gray-400">
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      <Messages />
      <SendInput />
    </div>
  );
};

export default MessageContainer;
