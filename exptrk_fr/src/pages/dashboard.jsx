import React, { useEffect, useState } from "react";
import './dashboardcss.css';

import { LuWallet } from "react-icons/lu";
import { BiUpArrowAlt } from "react-icons/bi";
import { BiDownArrowAlt } from "react-icons/bi";

import {
    TrendingUp,
    TrendingDown,
    UtensilsCrossed,
    IndianRupee,
    Clapperboard,
    SquarePlus,
    CircleEllipsis,
    X,
    ShoppingCart,
    ReceiptIndianRupee,
    MapPinned,
    HandCoins,
    Handshake,
    Building2
} from "lucide-react";

import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

    const backendUrl = "https://ext-bd.onrender.com/";

    const navigate = useNavigate();

    const [openpopup, setOpenPopup] = useState(false);

    const [transactiontype, setTransactionType] = useState("Income");

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");

    const [transactions, setTransactions] = useState([]);
    
    

    useEffect(() => {
        if (transactiontype === "Income") {
            setCategory("Salary");
        } else {
            setCategory("Food");
        }
        }, [transactiontype]);

    const getTransactions = async () => {

        try {

            const response = await axios.get(
                `${backendUrl}get-transactions`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`
                    }
                }
            );

            setTransactions(response.data);

        }

        catch (error) {

            if (error.response?.status === 401) {

                try {

                    const refreshResponse = await axios.post(
                        `${backendUrl}api/token/refresh/`,
                        {
                            refresh: localStorage.getItem("refresh")
                        }
                    );

                    localStorage.setItem(
                        "access",
                        refreshResponse.data.access
                    );

                    const retryResponse = await axios.get(
                        `${backendUrl}get-transactions`,
                        {
                            headers: {
                                Authorization: `Bearer ${refreshResponse.data.access}`
                            }
                        }
                    );

                    setTransactions(retryResponse.data);

                }

                catch (refreshError) {

                    console.log("Refresh token expired");

                    localStorage.clear();

                    navigate("/");

                }

            }

        }

    };

    useEffect(() => {

        getTransactions();

    }, []);

    const handleAddTransaction = async () => {

        try {

            if (
                    title.trim() === "" ||
                    amount.trim() === "" ||
                    date.trim() === ""
                ) {
                    alert("Please fill in all fields.");
                    return;
                }

            await axios.post(
                `${backendUrl}add-transaction`,
                {
                    title: title,
                    amount: amount,
                    category: category,
                    type: transactiontype,
                    date: date
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`
                    }
                }
            );

            getTransactions();

        }

        catch (error) {

            if (error.response?.status === 401) {

                try {

                    const refreshRes = await axios.post(
                        `${backendUrl}api/token/refresh/`,
                        {
                            refresh: localStorage.getItem("refresh")
                        }
                    );

                    localStorage.setItem(
                        "access",
                        refreshRes.data.access
                    );

                   if (
                        title.trim() === "" ||
                        amount.trim() === "" ||
                        date.trim() === ""
                    ) {
                        alert("Please fill in all fields.");
                        return;
                    }

                    await axios.post(
                        `${backendUrl}add-transaction`,
                        {
                            title: title,
                            amount: amount,
                            category: category,
                            type: transactiontype,
                            date: date
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${refreshRes.data.access}`
                            }
                        }
                    );

                    getTransactions();

                }

                catch (refreshError) {

                    console.error("Failed to refresh token");

                    localStorage.clear();

                    navigate("/");

                }

            }

            else {

                console.error("Failed to add transaction:", error);

            }

        }

        setTitle("");
        setAmount("");
        setCategory("");
        setTransactionType("Income");
        setDate("");

        setOpenPopup(false);

    };

    const username = localStorage.getItem("username") || "User";

    const incomeCategories = [
        "Salary",
        "Freelancing",
        "Business",
        "Bonus",
        "Others"
    ];

    const expenseCategories = [
        "Food",
        "Entertainment",
        "Shopping",
        "Bills",
        "Travel",
        "Others"
    ];

    const categories =
        transactiontype === "Income"
            ? incomeCategories
            : expenseCategories;

    const caticons = {

        "Salary": <IndianRupee />,
        "Freelancing": <Handshake />,
        "Business": <Building2 />,
        "Bonus": <HandCoins />,

        "Food": <UtensilsCrossed />,
        "Entertainment": <Clapperboard />,
        "Shopping": <ShoppingCart />,
        "Bills": <ReceiptIndianRupee />,
        "Travel": <MapPinned />,
        "Others": <CircleEllipsis />

    };

    const totalIncome = transactions
        .filter((t) => t.type === "Income")
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const totalExpenses = transactions
        .filter((t) => t.type === "Expense")
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const totalBalance =
        totalIncome - totalExpenses;

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const thisMonthTransactions = transactions.filter((transaction) => {

        const transactionDate = new Date(transaction.date);

        return (
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
        );

    });

    const thisMonthIncome = thisMonthTransactions
        .filter((t) => t.type === "Income")
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const thisMonthExpenses = thisMonthTransactions
        .filter((t) => t.type === "Expense")
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

    const thisMonthSavings =
        thisMonthIncome - thisMonthExpenses;

    const savingsPercentage =
        thisMonthIncome > 0
            ? (thisMonthSavings / thisMonthIncome) * 100
            : 0;

    const recentTransactions =
        transactions.slice(0, 5);

    return (

        <section className="dashboard">

            <div className="s-1">

                <h3>
                    Welcome Back, {username}!
                </h3>

                <button onClick={() => setOpenPopup(true)}>
                    <SquarePlus size={20} />
                    Add Transaction
                </button>

            </div>

            {openpopup && (

                <div className="popup-overlay">

                    <div className="popup">

                        <div className="popup-header">

                            <h3>Add Transaction</h3>

                            <button
                                className="close-btn"
                                onClick={() => setOpenPopup(false)}
                            >
                                <X size={20} />
                            </button>

                        </div>

                        <div className="popup-r1">

                            <div className="form-group">

                                <label>Title</label>

                                <input
                                    type="text"
                                    placeholder="Eg. Grocery Shopping"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    } 
                                />

                            </div>

                            <div className="form-group">

                                <label>Amount</label>

                                <input
                                    type="number"
                                    placeholder="Enter transaction amount"
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(e.target.value)
                                    }
                                    onWheel={(e) =>
                                        e.target.blur()
                                    } 
                                />

                            </div>

                        </div>

                        <div className="popup-r2">

                            <div className="form-group">

                                <label>Type</label>

                                <div className="in-ex-btns">

                                    <button
                                        className={`type-btn ${
                                            transactiontype === "Income"
                                                ? "active-income"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            setTransactionType("Income");
                                            setCategory("Salary");
                                        }}
                                    >
                                        Income
                                    </button>

                                    <button
                                        className={`type-btn ${
                                            transactiontype === "Expense"
                                                ? "active-expense"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            setTransactionType("Expense");
                                            setCategory("Food");
                                        }}
                                    >
                                        Expense
                                    </button>

                                </div>

                            </div>

                            <div className="form-group">

                                <label>Category</label>

                                <select
                                    value={category}
                                    onChange={(e) =>
                                        setCategory(e.target.value)
                                    }
                                >

                                    {categories.map((cat, index) => (

                                        <option
                                            key={index}
                                            value={cat}
                                        >
                                            {cat}
                                        </option>

                                    ))}

                                </select>

                            </div>

                        </div>

                        <div className="popup-r3">

                            <div className="form-group">

                                <label>Date</label>

                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) =>
                                        setDate(e.target.value)
                                    } 
                                />

                            </div>

                        </div>

                        <div className="popup-footer">

                            <button
                                className="cancel-btn"
                                onClick={() =>
                                    setOpenPopup(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="add-btn"
                                onClick={handleAddTransaction}
                            >
                                Add Transaction
                            </button>

                        </div>

                    </div>

                </div>

            )}

            <div className="s-2">

                <div className="card">

                    <div className="details">

                        <p>Total Balance</p>

                        <h4>
                            ₹{totalBalance.toFixed(2)}
                        </h4>

                    </div>

                    <div className="icon">
                        <LuWallet size={30} />
                    </div>

                </div>

                <div className="card">

                    <div className="details">

                        <p>Total Income</p>

                        <h4>
                            ₹{totalIncome.toFixed(2)}
                        </h4>

                    </div>

                    <div className="icon">
                        <BiUpArrowAlt size={30} />
                    </div>

                </div>

                <div className="card">

                    <div className="details">

                        <p>Total Expenses</p>

                        <h4>
                            ₹{totalExpenses.toFixed(2)}
                        </h4>

                    </div>

                    <div className="icon">
                        <BiDownArrowAlt size={30} />
                    </div>

                </div>

            </div>

            <div className="s-3">

                <div className="heading">

                    <h3>
                        Quick stats (This month)
                    </h3>

                </div>

                <div className="cards-container">

                    <div className="card">

                        <div className="details">

                            <p>This Month Income</p>

                            <h4>
                                ₹{thisMonthIncome.toFixed(2)}
                            </h4>

                        </div>

                        <div className="trend-positive">
                            <TrendingUp />
                        </div>

                    </div>

                    <div className="card">

                        <div className="details">

                            <p>This Month Expenses</p>

                            <h4>
                                ₹{thisMonthExpenses.toFixed(2)}
                            </h4>

                        </div>

                        <div className="trend-negative">
                            <TrendingDown />
                        </div>

                    </div>

                    <div className="card">

                        <div className="details">

                            <p>This Month Savings</p>

                            <h4>
                                ₹{thisMonthSavings.toFixed(2)}
                            </h4>

                        </div>

                        <div className="percentage-bar">

                            <CircularProgressbar
                                value={savingsPercentage}
                                text={`${Math.round(savingsPercentage)}%`}
                                styles={{
                                    path: {
                                        stroke: '#5b5fff',
                                        strokeLinecap: 'round',
                                    },
                                    trail: {
                                        stroke: '#1a1a2e',
                                    },
                                    text: {
                                        fill: '#ffffff',
                                        fontSize: '18px'
                                    }
                                }}
                            />

                        </div>

                    </div>

                </div>

            </div>

            <div className="s-4">

                <div className="transactions">

                    <div className="transactions-header">

                        <h3>Recent Transactions</h3>

                        <button
                            onClick={() =>
                                navigate("/transactions")
                            }
                        >
                            View All
                        </button>

                    </div>

                    <div className="transaction-list">

                        {recentTransactions.length === 0 ? (

                            <div className="no-transactions">

                                <div className="no-transactions-icon">
                                    <ReceiptIndianRupee size={55} />
                                </div>

                                <h2>No Transactions Yet</h2>

                                <p>
                                    Start tracking your income and expenses
                                    by adding your first transaction.
                                </p>

                                <button
                                    className="empty-add-btn"
                                    onClick={() => setOpenPopup(true)}
                                >
                                    <SquarePlus size={18} />
                                    Add Your First Transaction
                                </button>

                            </div>

                        ) : (

                            recentTransactions.map((transaction) => (

                                <div
                                    className="transaction-item"
                                    key={transaction.id}
                                >

                                    <div className="left">

                                        <div className="tx-icon">

                                            {caticons[transaction.category] || "📝"}

                                        </div>

                                        <div className="info">

                                            <p>
                                                {transaction.title}
                                            </p>

                                            <span>
                                                {transaction.category}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="date">
                                        {transaction.date}
                                    </div>

                                    <div
                                        className={`amount ${
                                            transaction.type === "Income"
                                                ? "positive"
                                                : "negative"
                                        }`}
                                    >

                                        {transaction.type === "Income"
                                            ? "+"
                                            : "-"}

                                        ₹

                                        {Math.abs(transaction.amount).toFixed(2)}

                                    </div>

                                </div>

                            ))

                        )}

                    </div>

                </div>

            </div>

        </section>

    );

};

export default Dashboard;