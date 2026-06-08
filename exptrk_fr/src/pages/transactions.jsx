import React, { useRef, useState, useEffect } from "react";
import "./transactioncss.css";

import {
    SquarePen,
    Trash2,
    IndianRupee,
    X
} from "lucide-react";

import Pagination from "./pagination";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TransactionsPage = () => {

    const backendUrl = "https://ext-bd.onrender.com/";

    const dateRef = useRef();
    const dateRef2 = useRef();

    const navigate = useNavigate();

    // =========================================
    // MAIN STATES
    // =========================================

    const [transactions, setTransactions] = useState([]);

    // =========================================
    // FILTER STATES
    // =========================================

    const [searchTerm, setSearchTerm] = useState("");

    const [selectedType, setSelectedType] = useState("");

    const [selectedCategory, setSelectedCategory] = useState("");

    const [fromDate, setFromDate] = useState("");

    const [toDate, setToDate] = useState("");

    // =========================================
    // PAGINATION
    // =========================================

    const [currentPage, setCurrentPage] = useState(1);

    const transactionsPerPage = 10;

    // =========================================
    // EDIT POPUP STATES
    // =========================================

    const [openEditPopup, setOpenEditPopup] = useState(false);

    const [editTransactionId, setEditTransactionId] = useState(null);

    const [editTitle, setEditTitle] = useState("");
    const [editAmount, setEditAmount] = useState("");
    const [editCategory, setEditCategory] = useState("");
    const [editType, setEditType] = useState("Income");
    const [editDate, setEditDate] = useState("");

    // =========================================
    // CATEGORY LISTS
    // =========================================

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

    const allCategories = [
        ...incomeCategories,
        ...expenseCategories
    ];

    const categories =
        editType === "Income"
            ? incomeCategories
            : expenseCategories;

    // =========================================
    // GET TRANSACTIONS
    // =========================================

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

    // =========================================
    // DELETE TRANSACTION
    // =========================================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!confirmDelete) return;

        try {

            await axios.delete(
                `${backendUrl}delete-transaction/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`
                    }
                }
            );

            const updatedTransactions = transactions.filter(
                (transaction) => transaction.id !== id
            );

            setTransactions(updatedTransactions);

            const newTotalPages = Math.ceil(
                updatedTransactions.length / transactionsPerPage
            );

            if (currentPage > newTotalPages) {
                setCurrentPage(newTotalPages || 1);
            }

        }

        catch (error) {

            if(error.response?.status === 401) {

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


                await axios.delete(
                `${backendUrl}delete-transaction/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`
                    }
                }
            );

            const updatedTransactions = transactions.filter(
                (transaction) => transaction.id !== id
            );

            setTransactions(updatedTransactions);

            const newTotalPages = Math.ceil(
                updatedTransactions.length / transactionsPerPage
            );

            if (currentPage > newTotalPages) {
                setCurrentPage(newTotalPages || 1);
            }

        }
        catch (refreshError) {

            console.log("Refresh token expired");
            localStorage.clear();
            navigate("/");

        }
    }
    }

    };

    // =========================================
    // OPEN EDIT POPUP
    // =========================================

    const handleEditClick = (transaction) => {

        setEditTransactionId(transaction.id);

        setEditTitle(transaction.title);

        setEditAmount(transaction.amount);

        setEditCategory(transaction.category);

        setEditType(transaction.type);

        setEditDate(transaction.date);

        setOpenEditPopup(true);

    };

    // =========================================
    // UPDATE TRANSACTION
    // =========================================

    const handleUpdateTransaction = async () => {

        try {

            await axios.put(
                `${backendUrl}update-transaction/${editTransactionId}`,
                {
                    title: editTitle,
                    amount: editAmount,
                    category: editCategory,
                    type: editType,
                    date: editDate
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("access")}`
                    }
                }
            );

            const updatedTransactions = transactions.map((transaction) => {

                if (transaction.id === editTransactionId) {

                    return {
                        ...transaction,
                        title: editTitle,
                        amount: editAmount,
                        category: editCategory,
                        type: editType,
                        date: editDate
                    };

                }

                return transaction;

            });

            setTransactions(updatedTransactions);

            setOpenEditPopup(false);

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
                    await axios.put(
                        `${backendUrl}update-transaction/${editTransactionId}`,
                        {
                            title: editTitle,
                            amount: editAmount,
                            category: editCategory,
                            type: editType,
                            date: editDate
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem("access")}`
                            }
                        }
                    );
                    const updatedTransactions = transactions.map((transaction) => {

                        if (transaction.id === editTransactionId) {
                            return {
                                ...transaction,
                                title: editTitle,
                                amount: editAmount,
                                category: editCategory,
                                type: editType,
                                date: editDate
                            };
                        }
                        return transaction;
                    });
                    setTransactions(updatedTransactions);
                    setOpenEditPopup(false);
                }

                catch (refreshError) {

                    console.log("Refresh token expired");
                    localStorage.clear();
                    navigate("/");
                }
            }

        }

    };

    // =========================================
    // FILTER LOGIC
    // =========================================

    const filteredTransactions = transactions.filter((transaction) => {

        // SEARCH FILTER

        const matchesSearch =
            transaction.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        // TYPE FILTER

        const matchesType =
            selectedType === ""
                ? true
                : transaction.type === selectedType;

        // CATEGORY FILTER

        const matchesCategory =
            selectedCategory === ""
                ? true
                : transaction.category === selectedCategory;

        // FROM DATE FILTER

        const matchesFromDate =
            fromDate === ""
                ? true
                : transaction.date >= fromDate;

        // TO DATE FILTER

        const matchesToDate =
            toDate === ""
                ? true
                : transaction.date <= toDate;

        return (
            matchesSearch &&
            matchesType &&
            matchesCategory &&
            matchesFromDate &&
            matchesToDate
        );

    });

    // =========================================
    // PAGINATION LOGIC
    // =========================================

    const totalPages = Math.ceil(
        filteredTransactions.length / transactionsPerPage
    );

    const startIndex =
        (currentPage - 1) * transactionsPerPage;

    const endIndex =
        startIndex + transactionsPerPage;

    const currentTransactions =
        filteredTransactions.slice(startIndex, endIndex);

    // =========================================
    // RESET PAGE WHEN FILTERS CHANGE
    // =========================================

    useEffect(() => {

        setCurrentPage(1);

    }, [
        searchTerm,
        selectedType,
        selectedCategory,
        fromDate,
        toDate
    ]);

    return (

        <div className="transactions-page">

            {/* ===================================== */}
            {/* EDIT POPUP */}
            {/* ===================================== */}

            {openEditPopup && (

                <div className="popup-overlay">

                    <div className="popup">

                        <div className="popup-header">

                            <h3>Edit Transaction</h3>

                            <button
                                className="close-btn"
                                onClick={() =>
                                    setOpenEditPopup(false)
                                }
                            >
                                <X size={20} />
                            </button>

                        </div>

                        {/* ROW 1 */}

                        <div className="popup-r1">

                            <div className="form-group">

                                <label>Title</label>

                                <input
                                    type="text"
                                    placeholder="Eg. Grocery Shopping"
                                    value={editTitle}
                                    onChange={(e) =>
                                        setEditTitle(e.target.value)
                                    }
                                />

                            </div>

                            <div className="form-group">

                                <label>Amount</label>

                                <input
                                    type="number"
                                    placeholder="Enter transaction amount"
                                    value={editAmount}
                                    onChange={(e) =>
                                        setEditAmount(e.target.value)
                                    }
                                    onWheel={(e) => e.target.blur()}
                                />

                            </div>

                        </div>

                        {/* ROW 2 */}

                        <div className="popup-r2">

                            <div className="form-group">

                                <label>Type</label>

                                <div className="in-ex-btns">

                                    <button
                                        className={`type-btn ${
                                            editType === "Income"
                                                ? "active-income"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            setEditType("Income");
                                            setEditCategory("Salary");
                                        }}
                                    >
                                        Income
                                    </button>

                                    <button
                                        className={`type-btn ${
                                            editType === "Expense"
                                                ? "active-expense"
                                                : ""
                                        }`}
                                        onClick={() => {
                                            setEditType("Expense");
                                            setEditCategory("Food");
                                        }}
                                    >
                                        Expense
                                    </button>

                                </div>

                            </div>

                            <div className="form-group">

                                <label>Category</label>

                                <select
                                    value={editCategory}
                                    onChange={(e) =>
                                        setEditCategory(e.target.value)
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

                        {/* ROW 3 */}

                        <div className="popup-r3">

                            <div className="form-group">

                                <label>Date</label>

                                <input
                                    type="date"
                                    value={editDate}
                                    onChange={(e) =>
                                        setEditDate(e.target.value)
                                    }
                                />

                            </div>

                        </div>

                        {/* FOOTER */}

                        <div className="popup-footer">

                            <button
                                className="cancel-btn"
                                onClick={() =>
                                    setOpenEditPopup(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                className="add-btn"
                                onClick={handleUpdateTransaction}
                            >
                                Save Changes
                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* ===================================== */}
            {/* HEADER */}
            {/* ===================================== */}

            <div className="transactions-header">

                <h1>Transactions</h1>

            </div>

            {/* ===================================== */}
            {/* FILTERS */}
            {/* ===================================== */}

            <div className="transaction-filters">

                {/* SEARCH */}

                <input
                    className="fsearch"
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                />

                {/* TYPE */}

                <select
                    className="ftypes"
                    value={selectedType}
                    onChange={(e) =>
                        setSelectedType(e.target.value)
                    }
                >

                    <option value="">
                        All Types
                    </option>

                    <option value="Income">
                        Income
                    </option>

                    <option value="Expense">
                        Expense
                    </option>

                </select>

                {/* CATEGORY */}

                <select
                    className="fcategories"
                    value={selectedCategory}
                    onChange={(e) =>
                        setSelectedCategory(e.target.value)
                    }
                >

                    <option value="">
                        All Categories
                    </option>

                    {allCategories.map((category, index) => (

                        <option
                            key={index}
                            value={category}
                        >
                            {category}
                        </option>

                    ))}

                </select>

                {/* FROM DATE */}

                <input
                    type="date"
                    className="f-fdate"
                    ref={dateRef}
                    value={fromDate}
                    onChange={(e) =>
                        setFromDate(e.target.value)
                    }
                    onClick={() =>
                        dateRef.current.showPicker()
                    }
                />

                <span>to</span>

                {/* TO DATE */}

                <input
                    type="date"
                    className="f-tdate"
                    ref={dateRef2}
                    value={toDate}
                    onChange={(e) =>
                        setToDate(e.target.value)
                    }
                    onClick={() =>
                        dateRef2.current.showPicker()
                    }
                />

            </div>

            {/* ===================================== */}
            {/* TRANSACTIONS */}
            {/* ===================================== */}

            <div className="transactions-list">

                <div className="table-wrapper">

                <div className="transaction-item-header">

                    <h3>Title</h3>
                    <h3>Category</h3>
                    <h3>Date</h3>
                    <h3>Amount</h3>
                    <h3>Actions</h3>

                </div>

                {currentTransactions.length > 0 ? (

                    currentTransactions.map((transaction) => (

                        <div
                            key={transaction.id}
                            className="transaction-item"
                        >

                            <p className="th">
                                {transaction.title}
                            </p>

                            <p className="tp">
                                {transaction.category}
                            </p>

                            <p className="tp">
                                {transaction.date}
                            </p>

                            <p
                                className={`tp ${
                                    transaction.type === "Income"
                                        ? "positive"
                                        : "negative"
                                }`}
                            >

                                {transaction.type === "Income"
                                    ? "+"
                                    : "-"}

                                <IndianRupee size={15} />

                                {Math.abs(transaction.amount).toFixed(2)}

                            </p>

                            <div className="transaction-actions">

                                <button
                                    className="edit-button"
                                    onClick={() =>
                                        handleEditClick(transaction)
                                    }
                                >
                                    <SquarePen size={20} />
                                </button>

                                <button
                                    className="delete-button"
                                    onClick={() =>
                                        handleDelete(transaction.id)
                                    }
                                >
                                    <Trash2 size={20} />
                                </button>

                            </div>

                        </div>

                    ))

                ) : (

                    <div className="no-transactions">

                        No transactions found

                    </div>

                )}

            </div>

        </div>

            {/* ===================================== */}
            {/* PAGINATION */}
            {/* ===================================== */}

            {filteredTransactions.length > 0 && (

                <div className="pagination-div">

                    <Pagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                    />

                </div>

            )}

        </div>

    );

};

export default TransactionsPage;