import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { getUser, getCurrentUser, updateCurrentUser } from "../../services/users";
import { formatCreatedAt, formatLastUpdated } from "../../utils/dates";
import { getPostsByUserId } from "../../services/posts";
import Post from "../../components/Post";
import { FriendRequestButton } from "./FriendRequestButton";
import { friendRequestExists, sendFriendRequest } from "../../services/friendRequests"
import { getFriendList } from "../../services/friends"


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
        <>
            <input name="firstName" value={formData.firstName} onChange={handleChange} />
            <input name="lastName" value={formData.lastName} onChange={handleChange} />
        </>
        ) : (
            <h1>{firstName} {lastName}</h1>
        );

    const emailSection = isEditing ? (
            <input name="email" value={formData.email} onChange={handleChange} />
        ) : (
            <p>Email: {email}</p>
        );

    const actionButtons = isEditing ? (
    <>
        {isSaving ? <button disabled={true}>Saving...</button> : <button onClick={handleSaveClick}>Save</button>}
        <button onClick={handleCancelClick}>Cancel</button>
    </>
    ) : (
        isOwnProfile ? <> 
        <button onClick={handleEditClick}>Edit Profile</button> 
        <button>Create Post</button> </> 
        : <FriendRequestButton
            status={friendshipStatus}
            isSaving={isSendingFriendRequest}
            onAddFriend={handleSendFriendRequest}
        />
    )

    return (
        <>
        <div>
            <img src={profilePic}/>
            {nameSection}
            {emailSection}
            <p>Joined: {formatCreatedAt(createdAt)}</p>
            <p>Active: {formatLastUpdated(updatedAt)}</p>
            {actionButtons}
        </div>
        <h2>Posts</h2>
            <div className="feed" role="feed">
                {posts.map((post) => (
                <Post post={post} key={post._id} token={token} />
                ))}
            </div>
        </>
    );

}