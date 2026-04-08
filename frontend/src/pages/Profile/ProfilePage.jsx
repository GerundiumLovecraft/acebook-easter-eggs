import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { getUser } from "../../services/users";


export function ProfilePage() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true);
    const {id} = useParams()
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const loggedIn = token !== null;
        if (loggedIn) {
            getUser(id, token)
            .then((data) => {
                setProfile(data)
                setLoading(false)
            })
            .catch((error) => {
                console.log(error)
                setLoading(false)
            })
        }
    }, [id, navigate]);

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
            </>
        ) : (
            <p>User not found</p>
        )}
    </div>
);

}