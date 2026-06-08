import React, { useEffect, useState } from "react";
import "./reportscss.css";

import {
  CalendarDays,
  IndianRupee
} from "lucide-react";

import axios from "axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid
} from "recharts";

import { useNavigate } from "react-router-dom";

const ReportsPage = () => {

  const backendUrl = "https://ext-bd.onrender.com/";
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);

  // ===================================================
  // FETCH TRANSACTIONS
  // ===================================================

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

        catch {

          localStorage.clear();

          navigate("/");

        }

      }

      else {

        console.log(error);

      }

    }

  };

  useEffect(() => {

    getTransactions();

  }, []);

  // ===================================================
  // TOTALS
  // ===================================================

  const totalIncome = transactions
    .filter((t) => t.type === "Income")
    .reduce(
      (acc, curr) => acc + Number(curr.amount),
      0
    );

  const totalExpense = transactions
    .filter((t) => t.type === "Expense")
    .reduce(
      (acc, curr) => acc + Number(curr.amount),
      0
    );

  const netSavings = totalIncome - totalExpense;

  // ===================================================
  // MONTHLY DATA
  // ===================================================

  const monthlyData = [
    { month: "Jan", expense: 0 },
    { month: "Feb", expense: 0 },
    { month: "Mar", expense: 0 },
    { month: "Apr", expense: 0 },
    { month: "May", expense: 0 },
    { month: "Jun", expense: 0 },
    { month: "Jul", expense: 0 },
    { month: "Aug", expense: 0 },
    { month: "Sep", expense: 0 },
    { month: "Oct", expense: 0 },
    { month: "Nov", expense: 0 },
    { month: "Dec", expense: 0 }
  ];

  transactions.forEach((transaction) => {

    if (transaction.type === "Expense") {

      const month =
        new Date(transaction.date).getMonth();

      monthlyData[month].expense += Number(
        transaction.amount
      );

    }

  });

  // ===================================================
  // CATEGORY DATA
  // ===================================================

  const categoryMap = {};

  transactions.forEach((transaction) => {

    if (transaction.type === "Expense") {

      if (!categoryMap[transaction.category]) {

        categoryMap[transaction.category] = 0;

      }

      categoryMap[transaction.category] += Number(
        transaction.amount
      );

    }

  });

  const pieData = Object.keys(categoryMap).map(
    (category) => ({
      name: category,
      value: categoryMap[category]
    })
  );

  // ===================================================
  // INCOME VS EXPENSE
  // ===================================================

  const incomeExpenseData = [
    {
      name: "Income",
      amount: totalIncome
    },
    {
      name: "Expense",
      amount: totalExpense
    }
  ];

  // ===================================================
  // COLORS
  // ===================================================

  const COLORS = [
    "#5b5fff",
    "#14b8a6",
    "#fbbf24",
    "#fb923c",
    "#a855f7",
    "#f43f5e"
  ];

  // ===================================================
  // CUSTOM TOOLTIP
  // ===================================================

  const CustomTooltip = ({
    active,
    payload,
    label
  }) => {

    if (active && payload && payload.length) {

      return (

        <div className="custom-tooltip">

          <p className="tooltip-label">
            {label}
          </p>

          <p className="tooltip-value">
            ₹ {payload[0].value}
          </p>

        </div>

      );

    }

    return null;

  };

  return (

    <div className="reports-page">

      {/* HEADER */}

      <div className="reports-header">

        <h1>Reports Overview</h1>

        

      </div>

      {/* MONTHLY EXPENSES */}

      <div className="reports-main-card">

        <h2>Monthly Expenses</h2>

        <div className="real-chart-container">

          <ResponsiveContainer width="100%" height={350}>

            <BarChart
              data={monthlyData}
              margin={{
                top: 10,
                right: 20,
                left: -10,
                bottom: 5
              }}
            >

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#18212b"
              />

              <XAxis
                dataKey="month"
                stroke="#94a3b8"
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
              />

              <YAxis
                stroke="#94a3b8"
                tickLine={false}
                axisLine={{ stroke: "#334155" }}
              />

              <Tooltip
                cursor={{
                  fill: "transparent"
                }}
                content={<CustomTooltip />}
              />

              <Bar
                dataKey="expense"
                fill="#6366f1"
                radius={[12, 12, 0, 0]}
                barSize={48}
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

      </div>

      {/* MIDDLE */}

      <div className="reports-middle-section">

        {/* PIE */}

        <div className="reports-card">

          <h2>Expense by Category</h2>

          <div className="real-pie-chart">

            {
              pieData.length > 0 ? (

                <ResponsiveContainer
                  width="100%"
                  height={320}
                >

                  <PieChart>

                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="45%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={3}
                      dataKey="value"
                    >

                      {pieData.map((entry, index) => (

                        <Cell
                          key={index}
                          fill={
                            COLORS[index % COLORS.length]
                          }
                          stroke="transparent"
                        />

                      ))}

                    </Pie>

                    <Tooltip
                      cursor={{
                        fill: "transparent"
                      }}
                      content={<CustomTooltip />}
                    />

                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                    />

                  </PieChart>

                </ResponsiveContainer>

              ) : (

                <div className="no-data">

                  No expense data available

                </div>

              )
            }

          </div>

        </div>

        {/* INCOME VS EXPENSE */}

        <div className="reports-card">

          <h2>Income vs Expense</h2>

          <div className="real-chart-container">

            <ResponsiveContainer width="100%" height={320}>

              <BarChart
                data={incomeExpenseData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 10,
                  bottom: 5
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#18212b"
                />

                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={{ stroke: "#334155" }}
                />

                <YAxis
                  stroke="#94a3b8"
                  tickLine={false}
                  axisLine={{ stroke: "#334155" }}
                />

                <Tooltip
                  cursor={{
                    fill: "transparent"
                  }}
                  content={<CustomTooltip />}
                />

                <Bar
                  dataKey="amount"
                  radius={[12, 12, 0, 0]}
                  barSize={120}
                >

                  <Cell fill="#22c55e" />

                  <Cell fill="#ef4444" />

                </Bar>

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* SUMMARY */}

      <div className="reports-summary-cards">

        <div className="summary-card">

          <h3>Total Income</h3>

          <p className="income-text">

            <IndianRupee size={26} />

            {totalIncome.toFixed(2)}

          </p>

        </div>

        <div className="summary-card">

          <h3>Total Expense</h3>

          <p className="expense-text">

            <IndianRupee size={26} />

            {totalExpense.toFixed(2)}

          </p>

        </div>

        <div className="summary-card">

          <h3>Net Savings</h3>

          <p className="savings-text">

            <IndianRupee size={26} />

            {netSavings.toFixed(2)}

          </p>

        </div>

      </div>

    </div>

  );

};

export default ReportsPage;