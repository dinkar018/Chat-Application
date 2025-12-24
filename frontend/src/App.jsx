import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import HomePage from "./components/HomePage";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setOnlineUsers } from "./redux/userSlice";
import { connectSocket, disconnectSocket } from "./socket";

const router = createBrowserRouter([
  { path: "/", element: <HomePage /> },
  { path: "/signup", element: <Signup /> },
  { path: "/login", element: <Login /> },
]);

function App() {
  const { authUser } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!authUser?._id) return;

    const socket = connectSocket(authUser._id);

    const handleOnlineUsers = (users) => {
      console.log("🟢 Online users from server:", users);
      dispatch(setOnlineUsers(users));
    };

    socket.on("getOnlineUsers", handleOnlineUsers);

    return () => {
      socket.off("getOnlineUsers", handleOnlineUsers);
      disconnectSocket();
    };
  }, [authUser?._id, dispatch]);

  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
