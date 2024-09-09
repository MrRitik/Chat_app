import React, { useState, useEffect, useRef } from "react";

const now = new Date();
let hours = now.getHours();
const minutes = now.getMinutes();
const ampm = hours >= 12 ? "PM" : "AM";

export const Chat = ({ socket, username, room }) => {
  const [currentMessage, setcurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  hours = hours % 12;
  hours = hours ? hours : 12;

  const timeString = `${hours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`;

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        id: Math.random(),
        room: room,
        author: username,
        message: currentMessage,
        time: timeString,
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setcurrentMessage("");
    }
  };

  useEffect(() => {
    const handleReceiveMsg = (data) => {
      setMessageList((list) => [...list, data]);
    };
    socket.on("receive_message", handleReceiveMsg);

    return () => {
      socket.off("receive_message", handleReceiveMsg);
    };
  }, [socket]);

  const containRef = useRef(null);

  useEffect(() => {
    containRef.current.scrollTop = containRef.current.scrollHeight;
  }, [messageList]);

  return (
    <>
      <div className="w-[50vw] mx-auto  ">
        <h1 className="bg-slate-200 py-2 px-6 font-bold text-xl mt-6">
          Welcome: {username}
        </h1>
        <div className="relative">
          <div
            className="w-[50vw] h-[80vh] bg-slate-400 mx-auto overflow-y-auto"
            ref={containRef}
          >
            {messageList.map((data) => (
              <div
                key={data.id}
                className="flex"
                id={username == data.author ? "you" : "other"}
              >
                <div>
                  <div
                    className=" rounded-lg mt-2 mx-2"
                    id={username == data.author ? "y" : "b"}
                  >
                    <p className="font-bold">{data.author}:</p>
                    <p>{data.message}</p>
                  </div>
                  <div className="">
                    <p className="text-xs px-3">{data.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="">
            <input
              value={currentMessage}
              type="text"
              className="w-[85%] border-4 py-2 px-2 "
              placeholder="Message...."
              onChange={(e) => setcurrentMessage(e.target.value)}
              onKeyPress={(e) => {
                e.key === "Enter" && sendMessage();
              }}
            />
            <button
              className="border-4 bg-slate-500 px-4 py-2 rounded-lg"
              onClick={sendMessage}
            >
              &#9658;
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
