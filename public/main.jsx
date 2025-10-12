import React from "react";
import { createRoot } from 'react-dom/client';
import { UserRole, fetchUserData } from "/main";

const Header = () => {
    const [userData, setUserData] = React.useState({});
    React.useEffect(() => {
        const fetchData = async () => {
            const d = await fetchUserData();
            setUserData(d);
        };
        fetchData();
    }, []);

    return (
        <header>
            <a href="/offers/index.html" className="header-button">T-Shirts Offers</a>
            <nav id="user-buttons">
                {!userData ?
                <>
                    <a href="/login/index.html" className="header-button hoverable">Log in</a>
                    <a href="/registration/index.html" className="header-button hoverable">Register</a>
                </> :
                <>
                    {userData.role === UserRole.SELLER && 
                        <>
                            <a href="/add-new-item/index.html" className="header-button hoverable">Add new Item</a>
                            <a href="/seller-items/index.html" className="header-button hoverable">Items</a>
                        </>
                    }
                    {userData.role === UserRole.MODERATOR && 
                        <>
                            <a href="/moderation/index.html" className="header-button hoverable">Moderation</a>
                        </>
                    }
                    <a href="/cart/index.html" className="header-button hoverable">Cart</a>
                    <a href="/profile/index.html" className="header-button hoverable">Profile</a>
                </>
                }
            </nav>
        </header>
    );
};

const root = createRoot(document.getElementById('root-header'));
root.render(<React.StrictMode><Header /></React.StrictMode>);
