import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';

/**
 * Header affiché lorsque l'utilisateur est connecté.
 * Nom d'utilisateur + 3 icônes Font Awesome (profil, paramètres, déconnexion) dans cercles verts.
 */
export default function HeaderConnected() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const displayName = user?.userName ?? user?.firstName ?? 'Profile';

    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(logout());
        navigate('/');
    };

    return (
        <nav className="main-nav">
            <Link className="main-nav-logo" to="/">
                <img
                    className="main-nav-logo-image"
                    src="/img/argentBankLogo.png"
                    alt="Argent Bank Logo"
                />
                <h1 className="sr-only">Argent Bank</h1>
            </Link>
            <div className="main-nav-right main-nav-right--connected">
                <span className="main-nav-username">{displayName}</span>
                <Link
                    className="nav-icon-circle nav-icon-circle--filled"
                    to="/user"
                    title="Profil"
                    aria-label="Profil"
                >
                    <i className="fa-solid fa-user" aria-hidden="true"></i>
                </Link>
                <Link
                    className="nav-icon-circle nav-icon-circle--filled"
                    to="/user"
                    title="Paramètres"
                    aria-label="Paramètres"
                >
                    <i className="fa-solid fa-gear" aria-hidden="true"></i>
                </Link>
                <Link
                    className="nav-icon-circle nav-icon-circle--filled"
                    to="/"
                    onClick={handleLogout}
                    title="Déconnexion"
                    aria-label="Déconnexion"
                >
                    <i className="fa-solid fa-power-off" aria-hidden="true"></i>
                </Link>
            </div>
        </nav>
    );
}
