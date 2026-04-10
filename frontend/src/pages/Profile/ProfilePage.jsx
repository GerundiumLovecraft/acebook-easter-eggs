import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { getUser, getCurrentUser, updateCurrentUser } from "../../services/users";


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
            const token = localStorage.getItem("token");
            const result = await updateCurrentUser(formData, token);

            setProfile(result.user);
            setCurrentUser(result.user);
            setIsEditing(false);
        } catch (error) {
            setSaveError(error.message);
            console.error(saveError)
        } finally {
            setIsSaving(false);
        }
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!profile) {
        return <p>User not found</p>;
    }

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
        isOwnProfile && <button onClick={handleEditClick}>Edit Profile</button>
    );

    return (
        <div>
            {nameSection}
            {emailSection}
            <p>Profile pic: {profilePic}</p>
            <p>Created At: {createdAt}</p>
            <p>Last Updated: {updatedAt}</p>
            {actionButtons}
        </div>
    );

}