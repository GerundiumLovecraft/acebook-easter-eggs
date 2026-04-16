import { Link } from "react-router-dom";

function FriendRequests({ friendRequestsObj, requestReponseHandler }) {

    let outgoingRequests = friendRequestsObj.outgoing;
    let incomingRequests = friendRequestsObj.incoming;

    return (
        <>
        <div className="incoming-requests" >
            <h3>Incoming requests</h3>
            <ul>
                {incomingRequests.map((req) => (
                    <li key={req.from._id}>
                        <Link to={`/users/${req.from._id}`}>
                            <img className="friend-pic" src={req.from.profile.profilePic} alt={`${req.from.profile.firstName[0]} ${req.from.profile.lastName[0]}`} />
                            <p className="friend-name">{req.from.profile.firstName} {req.from.profile.lastName}</p>
                        </Link>
                        <button type="button" onClick={() => requestReponseHandler(req._id.toString(), "approved")} >Aprpove</button>
                        <button type="button" onClick={() => requestReponseHandler(req._id.toString(), "rejected")} >Decline</button>
                    </li>
                ))}
            </ul>
        </div>
        <div className="outgoing-requests" >
            <h3>Outgoing requests</h3>
            <ul>
                {outgoingRequests.map((req) => (
                    <li key={req.to._id}>
                        <Link to={`/users/${req.to._id}`}>
                            <img className="friend-pic" src={req.to.profile.profilePic} alt={`${req.to.profile.firstName[0]} ${req.to.profile.lastName[0]}`} />
                            <p className="friend-name">{req.to.profile.firstName} {req.to.profile.lastName}</p>
                        </Link>
                        
                    </li>
                ))}
            </ul>
        </div>
        </>
    )
}

export default FriendRequests;