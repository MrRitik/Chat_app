import React, { useState, useEffect, useRef } from "react";

// import music from "./iphone-sms-tone-original-mp4-5732.mp3";

export const Chat = ({ socket, username, room }) => {
  const [currentMessage, setcurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  //   const notification = new Audio(music);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        id: Math.random(),
        room: room,
        author: username,
        message: currentMessage,
        time:
          (new Date(Date.now()).getHours() % 12) +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setcurrentMessage("");
      //   notification.play();
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
              className="w-[45vw] border-4 py-2 px-2 "
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
