import { useParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { getUser } from "../../services/users";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";


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
                console.log(data, '<----data in loggedIn')
                setProfile(data)
                setLoading(false)
            })
            .catch((error) => {
                console.log(error)
                setLoading(false)
            })
        }
    }, [id, navigate]);

    console.log(profile, '<----profile in ProfilePage')

return (
    <div>
        {loading ? (
            <p>Loading...</p>
        ) : profile ? (
            <div className="container mx-auto py-10">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader className="flex flex-row items-center gap-6">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={profile.profile.profilePic} />
                        <AvatarFallback>{profile.profile.firstName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-3xl font-bold">
                        {profile.profile.firstName} {profile.profile.lastName}
                        </CardTitle>
                    </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                    <Separator />
                    <div>
                        <h4 className="text-sm font-medium">Member since:</h4>
                        <p className="text-sm text-muted-foreground mt-1">{profile.createdAt}</p>
                    </div>
                    
                    {profile && (
                        <Button variant="outline" className="w-full">Edit Profile</Button>
                    )}
                    </CardContent>
                </Card>
</div>
        ) : (
            <p>User not found</p>
        )}
    </div>
);

}