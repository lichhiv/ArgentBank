import { Link } from 'react-router-dom';

/**
 * Header affiché lorsque l'utilisateur n'est pas connecté.
 * Logo + lien Sign In.
 */
export default function Header() {
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
                <Link className="main-nav-item" to="/sign-in">
                    <i className="fa fa-user-circle"></i>
                    Sign In
                </Link>
            </div>
        </nav>
    );
}
