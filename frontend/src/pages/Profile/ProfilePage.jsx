import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { getUser, getCurrentUser } from "../../services/users";


export function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState(null);
    const {id} = useParams()
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        Promise.all([
            getUser(id, token),
            getCurrentUser(token)
            ])
            .then(([profileData, currentUserData]) => {
                setProfile(profileData);
                setCurrentUser(currentUserData);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, [id, navigate]);

    const isOwnProfile = currentUser?._id === profile?._id;

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : profile ? (
                <>
                    <h1>{profile.profile.firstName} {profile.profile.lastName}</h1>
                    <p>Email: {profile.email}</p>
                    <p>Profile pic: {profile.profile.ProfilePic}</p>
                    <p>Created At: {profile.createdAt}</p>
                    <p>Last Updated: {profile.updatedAt}</p>
                    {isOwnProfile && <button>Edit Profile</button>}
                </>
            ) : (
                <p>User not found</p>
            )}
        </div>
    );

}