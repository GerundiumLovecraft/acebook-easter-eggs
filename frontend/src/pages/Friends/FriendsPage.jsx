import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getFriendList } from "../../services/friends";
import { getFriendRequests, sendFriendRequestResponse } from "../../services/friendRequests"

import FriendRequests from "../../components/FriendRequests";
import FriendList from "../../components/FriendList";

export function FriendsPage() {
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState({
    incoming: [],
    outgoing: [],
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const loggedIn = token !== null;
    if (loggedIn) {
      getFriendList(token)
        .then((data) => {
          setFriends(data.friendList);
          localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        });
      getFriendRequests(token)
        .then((data) => {
          setFriendRequests(data.requests);
          localStorage.setItem("token", data.token);
        })
        .catch((err) => {
          console.error(err);
          navigate("/login");
        })
    }
  }, [navigate]);

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  const requestResponseHandler = async (requestId, status) => {
    const token = localStorage.getItem("token");
    try {
        const data = await sendFriendRequestResponse(token, requestId, status);
        localStorage.setItem("token", data.token);
        setFriendRequests((prev) => ({
            incoming: prev.incoming.filter((req) => req._id.toString() !== requestId),
            outgoing: prev.outgoing.filter((req) => req._id.toString() !== requestId),
        }));
        if (status === "approved") {
            setFriends((prev) => [...prev, data.newFriend]);
        }
    } catch (err) {
        console.error(err);
    }
};

  return (
    <>
      <FriendRequests friendRequestsObj={friendRequests} requestReponseHandler={requestResponseHandler} />
      <FriendList friendList={friends} />
    </>
  );
}