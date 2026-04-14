import { friendRequestExists, sendFriendRequestResponse } from "../../services/friendRequests"
import { getFriendList } from "../../services/friends"
import { useState, useEffect } from "react";

export function FriendRequestButton(token, profilePageId) {
    const [isFriend, setIsFriend] = useState(false)
    const [friendRequest, setFriendRequested] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

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
            sendRequest
        }
    }

    return (
        <button>Add friend</button>
    )
}