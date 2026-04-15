import { Link } from "react-router-dom";

function FriendList({ friendList }) {
    return (
        <>
            <div className="friend-list">
                <h3>Friend list</h3>
                {friendList.length === 0 ? (
                    <p>You don't have any friends</p>
                ) : (
                    <ul>
                        {
                            friendList.map((friend) => (
                                <li key={friend.id} className="friend">
                                    <Link to={`/users/${friend.id}`}>
                                        <img className="friend-pic" src={friend.profile.profilePic} alt={`${friend.profile.firstName[0]}${friend.profile.lastName[0]}`} />
                                    </Link>
                                    <Link to={`/users/${friend.id}`}>
                                        <p className="friend-name">{friend.profile.firstName} {friend.profile.lastName}</p>
                                    </Link>
                                </li>
                            ))
                        }
                    </ul>
                )}
            </div>
        </>
    )
}

export default FriendList;