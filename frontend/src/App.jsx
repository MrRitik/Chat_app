import React, { useState } from "react";
import io from "socket.io-client";
import { Chat } from "./Chat";
// import music from "./mixkit-tile-game-reveal-960.wav";

const socket = io.connect("http://localhost:1000");

const App = () => {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinChat = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <>
      {!showChat && (
        <div className="w-96 h-[65vh] bg-violet-400 m-auto mt-24 rounded-xl">
          <div className="grid grid-cols-1">
            <h1 className="font-extrabold text-5xl mx-auto my-9 ">Login</h1>
            <input
              type="text"
              placeholder="Enter Your Name"
              className="w-[80%] mx-auto my-6 py-3 px-4 "
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter Chat Room"
              className="w-[80%] mx-auto my-4 py-3 px-4 "
              onChange={(e) => setRoom(e.target.value)}
            />
            <button
              className="w-[80%] mx-auto bg-violet-700 py-3 text-xl font-bold my-10"
              onClick={joinChat}
            >
              Join
            </button>
          </div>
        </div>
      )}
      {showChat && <Chat socket={socket} username={username} room={room} />}
    </>
  );
};

export default App;
