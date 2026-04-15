import { friendRequestExists, sendFriendRequestResponse, sendFriendRequest } from "../../services/friendRequests"
import { getFriendList } from "../../services/friends"
import { useState, useEffect } from "react";

export function FriendRequestButton({token, profilePageId}) {
    const [isFriend, setIsFriend] = useState(false)
    const [friendRequested, setFriendRequested] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    console.log(profilePageId, '<--profilePageId in FriendRequestButton')

    useEffect(() => {
        Promise.all([
            getFriendList(token),
            friendRequestExists(token, profilePageId)

        ])
        .then(([friendsData, friendsRequestData]) => {
            const { friendsList } = friendsData
            if (friendsList.includes(profilePageId)) {
                setIsFriend(true)
            }
            console.log(friendsData, '<----friendsData')
            console.log(friendsRequestData, '<----friendsRequestData')
        })
    })

    console.log(isFriend, '<----isFriend')

    async function handleAddFriend() {
        setIsSaving(true)
        try {
            const token = localStorage.getItem("token");
            console.log(profilePageId, '<----profilePageId in handleAddFriend')
            const result = sendFriendRequest(token, profilePageId)
            console.log(result, '<---result from friend request')
            setFriendRequested(true)
        } catch (error) {
            console.log(error)
            setFriendRequested(false)
        } finally {
            setIsSaving(false)
        }
    }

    console.log(friendRequested, '<---friendRequested')

    return (
        <button onClick={handleAddFriend}>Add friend</button>
    )
}