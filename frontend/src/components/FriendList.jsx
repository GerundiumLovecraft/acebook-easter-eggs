import { Link } from "react-router-dom";

import "./Friends.css";

function FriendList({ friendList }) {
    return (
        <div className="friend-list">
        <h3>Friend List</h3>

        {friendList.length === 0 ? (
            <p className="empty-text">You do not have any friends</p>
        ) : (
            <ul>
            {friendList.map((friend) => (
                <li key={friend.id} className="friend-item">

                <Link to={`/users/${friend.id}`} className="friend-link">
                    <img
                    className="friend-pic"
                    src={friend.profile.profilePic}
                    alt=""
                    />
                    <p className="friend-name">
                    {friend.profile.firstName} {friend.profile.lastName}
                    </p>
                </Link>

                </li>
            ))}
            </ul>
        )}
        </div>
    );
}

export default FriendList;