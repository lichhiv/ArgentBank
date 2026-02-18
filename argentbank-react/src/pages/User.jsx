import { useState } from 'react';

const ACCOUNTS = [
    {
        id: 1,
        title: 'Argent Bank Checking (x8349)',
        amount: '$2,082.79',
        description: 'Available Balance'
    },
    {
        id: 2,
        title: 'Argent Bank Savings (x6712)',
        amount: '$10,928.42',
        description: 'Available Balance'
    },
    {
        id: 3,
        title: 'Argent Bank Credit Card (x8349)',
        amount: '$184.30',
        description: 'Current Balance'
    }
];

export default function User() {
    const [firstName, setFirstName] = useState('Tony');
    const [lastName, setLastName] = useState('Jarvis');
    const [isEditing, setIsEditing] = useState(false);
    const [editFirstName, setEditFirstName] = useState(firstName);
    const [editLastName, setEditLastName] = useState(lastName);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setFirstName(editFirstName);
        setLastName(editLastName);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditFirstName(firstName);
        setEditLastName(lastName);
        setIsEditing(false);
    };

    return (
        <main className="main bg-dark">
            <div className="header">
                {isEditing ? (
                    <>
                        <h1>Edit user info</h1>
                        <div className="input-wrapper">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                value={editFirstName}
                                onChange={(e) => setEditFirstName(e.target.value)}
                            />
                        </div>
                        <div className="input-wrapper">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                value={editLastName}
                                onChange={(e) => setEditLastName(e.target.value)}
                            />
                        </div>
                        <div>
                            <button className="edit-button" onClick={handleSave}>
                                Save
                            </button>
                            <button
                                className="edit-button"
                                onClick={handleCancel}
                                style={{ marginLeft: '10px' }}
                            >
                                Cancel
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <h1>
                            Welcome back<br />
                            {firstName} {lastName}!
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
                        <button className="transaction-button">View transactions</button>
                    </div>
                </section>
            ))}
        </main>
    );
}
