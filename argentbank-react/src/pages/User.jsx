import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, updateUsername } from '../store/authSlice';

const ACCOUNTS = [
    { id: 1, title: 'Argent Bank Checking (x8349)', amount: '$2,082.79', description: 'Available Balance' },
    { id: 2, title: 'Argent Bank Savings (x6712)', amount: '$10,928.42', description: 'Available Balance' },
    { id: 3, title: 'Argent Bank Credit Card (x8349)', amount: '$184.30', description: 'Current Balance' }
];

// Données de transactions statiques pour la maquette
const TRANSACTIONS_BY_ACCOUNT = {
    1: [
        {
            id: 't1',
            date: '27/02/20',
            description: 'Golden Sun Bakery',
            amount: '$8.00',
            balance: '$298.00',
            type: 'Electronic',
            category: 'Food',
            note: 'lorem ipsum'
        },
        {
            id: 't2',
            date: '27/02/20',
            description: 'Golden Sun Bakery',
            amount: '$8.00',
            balance: '$298.00',
            type: 'Electronic',
            category: 'Food',
            note: 'lorem ipsum'
        },
        {
            id: 't3',
            date: '27/02/20',
            description: 'Golden Sun Bakery',
            amount: '$8.00',
            balance: '$298.00',
            type: 'Electronic',
            category: 'Food',
            note: 'lorem ipsum'
        }
    ],
    2: [
        {
            id: 't4',
            date: '27/02/20',
            description: 'Golden Sun Bakery',
            amount: '$12.00',
            balance: '$10,920.42',
            type: 'Electronic',
            category: 'Food',
            note: 'lorem ipsum'
        }
    ],
    3: [
        {
            id: 't5',
            date: '27/02/20',
            description: 'Golden Sun Bakery',
            amount: '$15.00',
            balance: '$169.30',
            type: 'Electronic',
            category: 'Food',
            note: 'lorem ipsum'
        }
    ]
};

export default function User() {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);
    const [isEditing, setIsEditing] = useState(false);
    const [editUserName, setEditUserName] = useState('');
    const [openAccountId, setOpenAccountId] = useState(null);
    const [openTransactionId, setOpenTransactionId] = useState(null);
    const [transactionsByAccount, setTransactionsByAccount] = useState(TRANSACTIONS_BY_ACCOUNT);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingNoteId, setEditingNoteId] = useState(null);

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

    const handleToggleTransaction = (transactionId) => {
        setOpenTransactionId((current) => (current === transactionId ? null : transactionId));
        setEditingCategoryId(null);
        setEditingNoteId(null);
    };

    const handleCategoryChange = (accountId, transactionId, newCategory) => {
        setTransactionsByAccount((prev) => ({
            ...prev,
            [accountId]: (prev[accountId] || []).map((tx) =>
                tx.id === transactionId ? { ...tx, category: newCategory } : tx
            )
        }));
    };

    const handleNoteChange = (accountId, transactionId, newNote) => {
        setTransactionsByAccount((prev) => ({
            ...prev,
            [accountId]: (prev[accountId] || []).map((tx) =>
                tx.id === transactionId ? { ...tx, note: newNote } : tx
            )
        }));
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
                        <div className="edit-user-form">
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
                        </div>
                        <div className="edit-buttons-wrapper">
                            <div className="edit-buttons">
                                <button className="edit-button" onClick={handleSave} disabled={loading}>
                                    {loading ? 'Saving...' : 'Save'}
                                </button>
                                <button className="edit-button" onClick={handleCancel}>
                                    Cancel
                                </button>
                            </div>
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
            {ACCOUNTS.map((account) => {
                const isOpen = openAccountId === account.id;
                const transactions = transactionsByAccount[account.id] || [];

                return (
                    <section key={account.id} className={`account ${isOpen ? 'account--open' : ''}`}>
                        <div className="account-header">
                            <div className="account-content-wrapper">
                                <h3 className="account-title">{account.title}</h3>
                                <p className="account-amount">{account.amount}</p>
                                <p className="account-amount-description">{account.description}</p>
                            </div>
                            <div className="account-content-wrapper cta">
                                <button
                                    className={`transaction-button ${isOpen ? 'transaction-button-open' : ''}`}
                                    type="button"
                                    onClick={() =>
                                        setOpenAccountId((current) => (current === account.id ? null : account.id))
                                    }
                                    aria-expanded={isOpen}
                                >
                                    <i
                                        className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-angle-right'}`}
                                    ></i>
                                </button>
                            </div>
                        </div>

                        {isOpen && (
                            <div className="transactions-panel">
                                <div className="transactions-list">
                                    <div className="transactions-header">
                                        <span className="transactions-header-date">Date</span>
                                        <span className="transactions-header-description">Description</span>
                                        <span className="transactions-header-amount">Amount</span>
                                        <span className="transactions-header-balance">Balance</span>
                                    </div>
                                    {transactions.map((tx) => {
                                        const isTxOpen = openTransactionId === tx.id;

                                        return (
                                            <div key={tx.id} className="transaction-block">
                                                <div
                                                    className={`transaction-row ${isTxOpen ? 'transaction-row-open' : ''
                                                        }`}
                                                >
                                                    <span className="transaction-cell transaction-cell-date">
                                                        {tx.date}
                                                    </span>
                                                    <span className="transaction-cell transaction-cell-description">
                                                        {tx.description}
                                                    </span>
                                                    <span className="transaction-cell transaction-cell-amount">
                                                        {tx.amount}
                                                    </span>
                                                    <span className="transaction-cell transaction-cell-balance">
                                                        {tx.balance}
                                                    </span>
                                                    <span className="transaction-cell transaction-cell-toggle">
                                                        <button
                                                            type="button"
                                                            className="transaction-toggle-button"
                                                            onClick={() => handleToggleTransaction(tx.id)}
                                                            aria-expanded={isTxOpen}
                                                        >
                                                            <i
                                                                className={`fa-solid ${isTxOpen ? 'fa-angle-up' : 'fa-angle-down'
                                                                    }`}
                                                            ></i>
                                                        </button>
                                                    </span>
                                                </div>

                                                {isTxOpen && (
                                                    <div className="transaction-detail-wrapper">
                                                        <div className="transaction-detail">
                                                    <div className="transaction-detail-row">
                                                        <span className="transaction-detail-label">
                                                            Transaction type
                                                        </span>
                                                        <span className="transaction-detail-value">
                                                            {tx.type}
                                                        </span>
                                                    </div>
                                                    <div className="transaction-detail-row">
                                                        <span className="transaction-detail-label">Category</span>
                                                        <span className="transaction-detail-value">
                                                            {editingCategoryId === tx.id ? (
                                                                <select
                                                                    value={tx.category}
                                                                    onChange={(e) =>
                                                                        handleCategoryChange(
                                                                            account.id,
                                                                            tx.id,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    onBlur={() => setEditingCategoryId(null)}
                                                                >
                                                                    <option value="Food">Food</option>
                                                                    <option value="Housing">Housing</option>
                                                                    <option value="Transport">Transport</option>
                                                                    <option value="Other">Other</option>
                                                                </select>
                                                            ) : (
                                                                <>
                                                                    {tx.category}
                                                                    <button
                                                                        type="button"
                                                                        className="icon-button"
                                                                        onClick={() => setEditingCategoryId(tx.id)}
                                                                    >
                                                                        <i className="fa-solid fa-pen"></i>
                                                                    </button>
                                                                </>
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="transaction-detail-row">
                                                        <span className="transaction-detail-label">Note</span>
                                                        <span className="transaction-detail-value">
                                                            {editingNoteId === tx.id ? (
                                                                <input
                                                                    type="text"
                                                                    value={tx.note}
                                                                    onChange={(e) =>
                                                                        handleNoteChange(
                                                                            account.id,
                                                                            tx.id,
                                                                            e.target.value
                                                                        )
                                                                    }
                                                                    onBlur={() => setEditingNoteId(tx.id)}
                                                                />
                                                            ) : (
                                                                <>
                                                                    {tx.note}
                                                                    <button
                                                                        type="button"
                                                                        className="icon-button"
                                                                        onClick={() => setEditingNoteId(tx.id)}
                                                                    >
                                                                        <i className="fa-solid fa-pen"></i>
                                                                    </button>
                                                                </>
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </section>
                );
            })}
        </main>
    );
}

