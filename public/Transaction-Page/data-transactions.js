const transactions = [
    {
        id: "food-500",
        sender: "Dhruv",
        receiver: "Rahul Sharma",
        amount: 500,
        type: "debit",
        category: "payment",
        note: "Food",
        date: "16 Jun 2026",
        time: "08:15 PM",
        createdAt: "2026-06-16T20:15:00"
    },
    {
        id: "topup-1000",
        sender: "Amit",
        receiver: "Dhruv",
        amount: 1000,
        type: "credit",
        category: "topup",
        note: "Wallet Topup",
        date: "17 Jun 2026",
        time: "10:30 AM",
        createdAt: "2026-06-17T10:30:00"
    },
    {
        id: "coffee-300",
        sender: "Dhruv",
        receiver: "Neha",
        amount: 300,
        type: "debit",
        category: "payment",
        note: "Coffee",
        date: "14 Jun 2026",
        time: "06:45 PM",
        createdAt: "2026-06-14T18:45:00"
    },
    {
        id: "credited-750",
        sender: "Priya",
        receiver: "Dhruv",
        amount: 750,
        type: "credit",
        category: "payment",
        note: "Money credited",
        date: "18 Jun 2026",
        time: "11:20 AM",
        createdAt: "2026-06-18T11:20:00"
    },
    {
        id: "electricity-1200",
        sender: "Dhruv",
        receiver: "Electricity Board",
        amount: 1200,
        type: "debit",
        category: "payment",
        note: "Electricity Bill",
        date: "12 Jun 2026",
        time: "04:40 PM",
        createdAt: "2026-06-12T16:40:00"
    },
    {
        id: "refund-450",
        sender: "Amazon",
        receiver: "Dhruv",
        amount: 450,
        type: "credit",
        category: "payment",
        note: "Order Refund",
        date: "10 Jun 2026",
        time: "01:25 PM",
        createdAt: "2026-06-10T13:25:00"
    },
    {
        id: "topup-600",
        sender: "Dhruv",
        receiver: "Dhruv",
        amount: 600,
        type: "credit",
        category: "topup",
        note: "Wallet Topup",
        date: "8 Jun 2026",
        time: "09:10 AM",
        createdAt: "2026-06-08T09:10:00"
    }
];

const transactionStorageKey = "sadakPeNewTransactions";

// ===== BACKEND ENDPOINTS (fill these in) =====
const GET_TRANSACTIONS_ENDPOINT = "";
const CREATE_TRANSACTION_ENDPOINT = "";
// ===============================================

function getSavedTransactions()
{
    try
    {
        const savedTransactions =
            JSON.parse(localStorage.getItem(transactionStorageKey)) || [];

        return Array.isArray(savedTransactions) ? savedTransactions : [];
    }
    catch(error)
    {
        return [];
    }
}

function saveNewTransaction(transaction)
{
    const savedTransactions = getSavedTransactions();

    savedTransactions.unshift(transaction);
    localStorage.setItem(
        transactionStorageKey,
        JSON.stringify(savedTransactions)
    );

    fetch(CREATE_TRANSACTION_ENDPOINT, { method: "POST", body: JSON.stringify(transaction) });
}

function getAllTransactions()
{
    // fetch(GET_TRANSACTIONS_ENDPOINT);

    return [...getSavedTransactions(), ...transactions].sort(function(a, b)
    {
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
}

function escapeHtml(value)
{
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}