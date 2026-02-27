import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateUsername } from '../store/authSlice';

const ACCOUNTS = [
    { id: 1, title: 'Argent Bank Checking (x8349)', amount: '$2,082.79', description: 'Available Balance' },
    { id: 2, title: 'Argent Bank Savings (x6712)', amount: '$10,928.42', description: 'Available Balance' },
    { id: 3, title: 'Argent Bank Credit Card (x8349)', amount: '$184.30', description: 'Current Balance' }
];

export default function User() {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [editUserName, setEditUserName] = useState('');

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    const handleEditClick = () => {
        setEditUserName(user?.userName ?? '');
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (editUserName.trim()) {
            try {
                await dispatch(updateUsername(editUserName.trim())).unwrap();
                setIsEditing(false);
            } catch {
                // erreur déjà dans le store
            }
        }
    };

    const handleCancel = () => {
        setEditUserName('');
        setIsEditing(false);
    };

    if (loading && !user) {
        return (
            <main className="main bg-dark">
                <div className="header">
                    <p>Loading...</p>
                </div>
            </main>
        );
    }

    if (error && !user) {
        return (
            <main className="main bg-dark">
                <div className="header">
                    <p style={{ color: '#ff6b6b' }}>{error}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="main bg-dark">
            <div className="header">
                {isEditing ? (
                    <>
                        <h1>Edit user info</h1>
                        <div className="input-wrapper">
                            <label htmlFor="userName">User name</label>
                            <input
                                type="text"
                                id="userName"
                                value={editUserName}
                                onChange={(e) => setEditUserName(e.target.value)}
                            />
                        </div>
                        <div className="input-wrapper">
                            <label htmlFor="firstName">First name</label>
                            <input
                                type="text"
                                id="firstName"
                                value={user?.firstName ?? ''}
                                disabled
                            />
                        </div>
                        <div className="input-wrapper">
                            <label htmlFor="lastName">Last name</label>
                            <input
                                type="text"
                                id="lastName"
                                value={user?.lastName ?? ''}
                                disabled
                            />
                        </div>
                        <div>
                            <button className="edit-button" onClick={handleSave} disabled={loading}>
                                {loading ? 'Saving...' : 'Save'}
                            </button>
                            <button className="edit-button" onClick={handleCancel} style={{ marginLeft: '10px' }}>
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h1>
                            Welcome back<br />
                            {user?.firstName} {user?.lastName}!
                        </h1>
                        <button className="edit-button" onClick={handleEditClick}>
                            Edit Name
                        </button>
                    </>
                )}
            </div>
            <h2 className="sr-only">Accounts</h2>
            {ACCOUNTS.map((account) => (
                <section key={account.id} className="account">
                    <div className="account-content-wrapper">
                        <h3 className="account-title">{account.title}</h3>
                        <p className="account-amount">{account.amount}</p>
                        <p className="account-amount-description">{account.description}</p>
                    </div>
                    <div className="account-content-wrapper cta">
                        <button className="transaction-button"><i className="fa-solid fa-angle-right"></i></button>
                    </div>
                </section>
            ))}
        </main>
    );
}
