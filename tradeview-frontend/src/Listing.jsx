import moment from "moment";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

function Listing() {
  const [messages, setMessages] = useState([]);
  const initDifference = "0.00%";

  const getDifference = (prevValue, newValue) => {
    return newValue - prevValue > 0
      ? (((newValue - prevValue) / newValue) * 100).toFixed(2) + "%"
      : initDifference;
  };

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL, {
      transports: ["websocket", "polling"],
      forceNew: true,
    });

    socket.on("connect", () => {
      console.log("WebSocket connection established.");
    });

    socket.on("continuousData", (newMessage) => {
      setMessages((prevMessages) => {
        const messageIndex = prevMessages.findIndex(
          (msg) => msg._id === newMessage._id
        );

        if (messageIndex !== -1) {
          // Update existing message if found existing record
          const updatedMessages = [...prevMessages];
          newMessage["bidDifference"] = getDifference(
            updatedMessages[messageIndex].bid,
            newMessage.bid
          );
          newMessage["askDifference"] = getDifference(
            updatedMessages[messageIndex].bid,
            newMessage.bid
          );
          updatedMessages[messageIndex] = newMessage;
          return updatedMessages;
        } else {
          // Add new message
          newMessage["bidDifference"] = initDifference;
          newMessage["askDifference"] = initDifference;
          return [...prevMessages, newMessage];
        }
      });
    });

    socket.on("disconnect", (reason) => {
      console.log("WebSocket connection closed:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h1>Tradeview</h1>
      <table border={1} style={{ width: "75%", margin: "auto" }}>
        <thead>
          <tr>
            <th>Index</th>
            <th>ID</th>
            <th>Ask</th>
            <th>Ask Difference</th>
            <th>Update Time</th>
            <th>Symbol</th>
            <th>Bid</th>
            <th>Bid Difference</th>
            <th>Exchange</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>{item._id}</td>
              <td>{item.ask.toFixed(2)}</td>
              <td>{item.bidDifference}</td>
              <td>
                {moment(item.update_time).format("YYYY-MM-DD hh:mm:ss a")}
              </td>
              <td>{item.symbol}</td>
              <td>{item.bid.toFixed(2)}</td>
              <td>{item.bidDifference}</td>
              <td>{item.exchange}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Listing;
