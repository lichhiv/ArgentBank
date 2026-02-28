import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');
    const navigate = useNavigate();

    const handleLogout = () => {
        setIsLoggedIn(false);
        setUserName('');
        navigate('/');
    };

    const handleLogin = (name) => {
        setIsLoggedIn(true);
        setUserName(name);
    };

    return (
        <nav className="main-nav">
            <Link className="main-nav-logo" to="/">
                <img
                    className="main-nav-logo-image"
                    src="/img/argentBankLogo.webp"
                    alt="Argent Bank Logo"
                />
                <h1 className="sr-only">Argent Bank</h1>
            </Link>
            <div>
                {!isLoggedIn ? (
                    <Link className="main-nav-item" to="/sign-in">
                        <i className="fa fa-user-circle"></i>
                        Sign In
                    </Link>
                ) : (
                    <>
                        <Link className="main-nav-item" to="/user">
                            <i className="fa fa-user-circle"></i>
                            {userName}
                        </Link>
                        <Link
                            className="main-nav-item"
                            to="/"
                            onClick={handleLogout}
                        >
                            <i className="fa fa-sign-out"></i>
                            Sign Out
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
