import "./ProfilePage.css";
import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { getUser, getCurrentUser, updateCurrentUser } from "../../services/users";
import { formatCreatedAt, formatLastUpdated } from "../../utils/dates";
import { getPostsByUserId } from "../../services/posts";
import Post from "../../components/Post";
import { FriendRequestButton } from "./FriendRequestButton";
import { friendRequestExists, sendFriendRequest } from "../../services/friendRequests"
import { getFriendList } from "../../services/friends"
import { SquarePen} from "lucide-react";
import { Link } from "react-router-dom";


export function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const [formData, setFormData] = useState({
        email: "",
        firstName: "",
        lastName: ""
    })
    const [saveError, setSaveError] = useState("")
    const [isSaving, setIsSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [posts, setPosts] = useState([])
    const [friendshipStatus, setFriendshipStatus] = useState("loading");
    const [isSendingFriendRequest, setIsSendingFriendRequest] = useState(false);
    const {id} = useParams()
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        async function loadProfilePage() {
            try {
                const [profileData, currentUserData, postsData] = await Promise.all([
                getUser(id, token),
                getCurrentUser(token),
                getPostsByUserId(id, token),
            ]);

            setProfile(profileData);
            setCurrentUser(currentUserData);
            setPosts(postsData.posts || []);

            const isOwn = currentUserData?._id === profileData?._id;

            if (isOwn) {
                setFriendshipStatus("self");
                } else {
                const [friendListData, friendRequestData] = await Promise.all([
                    getFriendList(token),
                    friendRequestExists(token, id),
                ]);

                const isFriend = friendListData.friendList.some(
                    (friend) => friend._id === id
                );

                if (isFriend) {
                    setFriendshipStatus("friends");
                } else if (friendRequestData.requestExists) {
                    setFriendshipStatus("requested");
                } else {
                    setFriendshipStatus("none");
                }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
    }

    loadProfilePage();
    }, [id, token, navigate]);

    const isOwnProfile = currentUser?._id === profile?._id;

    function handleEditClick() {
        setFormData({
            email: profile.email || "",
            firstName: profile.profile?.firstName || "",
            lastName: profile.profile?.lastName || ""
        })
        setSaveError("")
        setIsEditing(true)
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleCancelClick() {
        setIsEditing(false);
        setSaveError("");
    }

    async function handleSaveClick() {
        setIsSaving(true);
        setSaveError("");

        try {
            const result = await updateCurrentUser(formData, token);

            setProfile(result.user);
            setCurrentUser(result.user);
            setIsEditing(false);
        } catch (error) {
            setSaveError(error.message || "Could not save profile");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    }

    async function handleSendFriendRequest() {
        setIsSendingFriendRequest(true);

        try {
        await sendFriendRequest(token, id);
        setFriendshipStatus("requested");
        } catch (error) {
        console.error(error);
        } finally {
        setIsSendingFriendRequest(false);
        }
    }

    if (loading) { return <p>Loading...</p>;}
    if (!profile) { return <p>User not found</p>;}

    const { email, createdAt, updatedAt } = profile;
    const { firstName, lastName, profilePic } = profile.profile;

    const nameSection = isEditing ? (
            <div className="profile-name-fields">
                <input name="firstName" value={formData.firstName} onChange={handleChange} />
                <input name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
        ) : (
            <h1 className="profile-name">{firstName} {lastName}</h1>
        );

    const emailSection = isEditing ? (
        <div className="profile-edit-fields">
            <input name="email" value={formData.email} onChange={handleChange} />
        </div>
    ) : (
        <p className="profile-email">Email: {email}</p>
    );

    const actionButtons = isEditing ? (
    <>
        {isSaving ? (
        <button className="profile-action-button profile-action-button--primary" disabled={true}>
            Saving...
        </button>
        ) : (
        <button className="profile-action-button profile-action-button--primary" onClick={handleSaveClick}>
            Save
        </button>
        )}
        <button className="profile-action-button profile-action-button--secondary" onClick={handleCancelClick}>
        Cancel
        </button>
    </>
    ) : (
    isOwnProfile ? (
        <>
        <button className="profile-action-button profile-action-button--primary" onClick={handleEditClick}>
            Edit Profile
        </button>
        </>
    ) : (
        <FriendRequestButton
        status={friendshipStatus}
        isSaving={isSendingFriendRequest}
        onAddFriend={handleSendFriendRequest}
        />
    )
    );

return (
        <>
            <div className="profile-page">
                <div className="profile-card">
                    <div className="profile-header">
                        <img className="profile-avatar" src={profilePic} />
                        <div className="profile-heading">
                            {nameSection}
                            {emailSection}
                        </div>
                    </div>

                    {saveError && <p className="profile-error">{saveError}</p>}

                    <div className="profile-meta">
                        <p>Joined: {formatCreatedAt(createdAt)}</p>
                        <p>Active: {formatLastUpdated(updatedAt)}</p>
                    </div>

                    <div className="profile-actions">
                        {actionButtons}
                    </div>
                </div>

                <h2 className="profile-posts-title">Posts</h2>

                <div className="feed" role="feed">
                    {posts.map((post) => (
                        <Post post={post} key={post._id} token={token} />
                    ))}
                </div>
            </div>
        </>
    );

}