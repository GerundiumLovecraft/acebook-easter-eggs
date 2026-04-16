import { Link } from "react-router-dom";
import "./Friends.css";

function FriendRequests({ friendRequestsObj, requestReponseHandler }) {

    let outgoingRequests = friendRequestsObj.outgoing;
    let incomingRequests = friendRequestsObj.incoming;

return (
    <>
      {/* INCOMING */}
      <div className="incoming-requests">
        <h3>Incoming Requests</h3>

        {incomingRequests.length === 0 ? (
          <p className="empty-text">No incoming requests</p>
        ) : (
          <ul>
            {incomingRequests.map((req) => (
              <li key={req.from._id} className="request-item">
                <Link to={`/users/${req.from._id}`}>
                    <div className="request-left">
                    <img
                        className="friend-pic"
                        src={req.from.profile.profilePic}
                        alt=""
                    />
                    <p className="friend-name">
                        {req.from.profile.firstName} {req.from.profile.lastName}
                    </p>
                    </div>
                </Link>
                <div className="request-actions">
                  <button
                    className="approve-btn"
                    onClick={() =>
                      requestReponseHandler(req._id.toString(), "approved")
                    }
                  >
                    Accept
                  </button>

                  <button
                    className="decline-btn"
                    onClick={() =>
                      requestReponseHandler(req._id.toString(), "rejected")
                    }
                  >
                    Decline
                  </button>
                </div>

              </li>
            ))}
          </ul>
        )}
      </div>

      {/* OUTGOING */}
      <div className="outgoing-requests">
        <h3>Outgoing Requests</h3>

        {outgoingRequests.length === 0 ? (
          <p className="empty-text">No outgoing requests</p>
        ) : (
          <ul>
            {outgoingRequests.map((req) => (
              <li key={req.to._id} className="request-item">
                
                <Link to={`/users/${req.to._id}`}>
                    <div className="request-left">
                    <img
                        className="friend-pic"
                        src={req.to.profile.profilePic}
                        alt=""
                    />
                    <p className="friend-name">
                        {req.to.profile.firstName} {req.to.profile.lastName}
                    </p>
                    </div>
                </Link>
                <span className="pending-text">Pending</span>

              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default FriendRequests;