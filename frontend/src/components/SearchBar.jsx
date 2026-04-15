import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";
import { Search } from "lucide-react";
import { searchUser } from "../services/users";

function SearchBar() {
    const [searchName, setSearchName] = useState("");
    const [queryResults, setQueryResults] = useState([]);
    const token = localStorage.getItem("token");

    useEffect(() => {
        // if search bar is empty do nothing
        if (!searchName.trim()) {
            setQueryResults([]);
            return;
        };

        // Set a timer to fire search request after 300ms
        const timer = setTimeout(async () => {
            const users = await searchUser(token, searchName);
            setQueryResults(users);
        }, 300);

        return () => clearTimeout(timer);

    }, [searchName]);

    function handleSearchInput(event) {
        setSearchName(event.target.value);
    }

    return(
        <>
            <div className="navbar-search-wrapper">
                <Search size={16} className="search-icon" />
                <input type="text" placeholder="Search..." className="navbar-search" value={searchName} onChange={handleSearchInput} />
                {queryResults.length > 0 && (
                    <div className="search-dropdown">
                        {queryResults.map((user) => (
                            <div key={user._id} className="search-result">
                                <Link to={`users/${user._id.toString()}`} onClick={() => {
                                    setSearchName("");
                                    setQueryResults([]);
                                }}>
                                    <img src={user.profile.profilePic || "avatar.jpg"} alt={`${user.profile.firstName[0]} ${user.profile.lastName[0]}`} />
                                    <span>{user.profile.firstName} {user.profile.lastName}</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    )
};

export default SearchBar;