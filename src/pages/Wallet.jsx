import { useEffect, useState } from "react";
import {
  FiCreditCard,
  FiPlus,
  FiArrowDown,
  FiRefreshCw,
} from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../Services/api";

function Wallet() {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");

  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [recharging, setRecharging] = useState(false);

  const [showRecharge, setShowRecharge] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  // ==========================================
  // LOAD WALLET + TRANSACTIONS
  // ==========================================

  useEffect(() => {
    loadWallet();
    loadTransactions();
  }, []);


  // ==========================================
  // LOAD WALLET
  // ==========================================

  const loadWallet = async () => {
    try {
      setLoading(true);

      const response = await api.get("/wallet");

      setBalance(
        response.data?.balance || 0
      );

    } catch (error) {
      console.error(
        "Wallet loading error:",
        error
      );

      setError(
        "Unable to load wallet."
      );
    } finally {
      setLoading(false);
    }
  };


  // ==========================================
  // LOAD TRANSACTIONS
  // ==========================================

  const loadTransactions = async () => {
    try {
      const response =
        await api.get(
          "/wallet/transactions"
        );

      setTransactions(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {
      console.error(
        "Transaction loading error:",
        error
      );
    }
  };


  // ==========================================
  // REFRESH
  // ==========================================

  const refreshWallet = async () => {
    setError("");

    await Promise.all([
      loadWallet(),
      loadTransactions(),
    ]);
  };


  // ==========================================
  // RECHARGE
  // ==========================================

  const handleRecharge = async (event) => {
    event.preventDefault();

    const rechargeAmount =
      Number(amount);


    if (
      !rechargeAmount ||
      rechargeAmount <= 0
    ) {
      setError(
        "Please enter a valid amount."
      );

      return;
    }


    try {
      setRecharging(true);

      setMessage("");
      setError("");


      const response =
        await api.post(
          "/wallet/recharge",
          {
            amount: rechargeAmount,
          }
        );


      setBalance(
        response.data?.balance || 0
      );


      // Reload transactions

      await loadTransactions();


      setAmount("");

      setShowRecharge(false);


      setMessage(
        `₹${rechargeAmount.toLocaleString(
          "en-IN"
        )} added successfully!`
      );


      setTimeout(() => {
        setMessage("");
      }, 3000);


    } catch (error) {
      console.error(
        "Recharge error:",
        error
      );

      setError(
        error.response?.data ||
        "Unable to add money."
      );

    } finally {
      setRecharging(false);
    }
  };


  // ==========================================
  // QUICK AMOUNT
  // ==========================================

  const selectAmount = (value) => {
    setAmount(String(value));
    setError("");
  };


  return (
    <DashboardLayout>

      <div className="wallet-page">


        {/* ==================================
            HEADER
        ================================== */}

        <section className="wallet-header">

          <div>

            <span className="wallet-label">
              DIGITAL WALLET
            </span>

            <h1>
              Wallet
            </h1>

            <p>
              Manage your NIRVA travel balance.
            </p>

          </div>


          <div className="wallet-header-icon">

            <FiCreditCard />

          </div>

        </section>


        {/* ==================================
            BALANCE CARD
        ================================== */}

        <section className="balance-card">

          <div className="balance-top">

            <span>
              Available balance
            </span>

            <FiCreditCard />

          </div>


          <div className="balance-amount">

            {loading
              ? "₹..."
              : `₹${Number(
                  balance
                ).toLocaleString("en-IN")}`}

          </div>


          <p>
            Available for your NIRVA travel
            services.
          </p>


          <button
            type="button"
            className="recharge-button"
            onClick={() => {
              setShowRecharge(
                !showRecharge
              );

              setError("");
              setMessage("");
            }}
          >

            <FiPlus />

            {showRecharge
              ? "Close"
              : "Add money"}

          </button>

        </section>


        {/* ==================================
            SUCCESS MESSAGE
        ================================== */}

        {message && (

          <div className="wallet-message">

            ✓ {message}

          </div>

        )}


        {/* ==================================
            ERROR
        ================================== */}

        {error && (

          <div className="wallet-error">

            {error}

          </div>

        )}


        {/* ==================================
            RECHARGE FORM
        ================================== */}

        {showRecharge && (

          <section className="recharge-card">

            <div className="recharge-header">

              <div className="recharge-icon">

                <FiPlus />

              </div>


              <div>

                <h2>
                  Add money
                </h2>

                <p>
                  Add funds to your NIRVA wallet.
                </p>

              </div>

            </div>


            <form
              onSubmit={handleRecharge}
              className="recharge-form"
            >

              <label>
                Amount
              </label>


              <div className="amount-input">

                <span>
                  ₹
                </span>

                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(event) =>
                    setAmount(
                      event.target.value
                    )
                  }
                  placeholder="Enter amount"
                />

              </div>


              {/* QUICK AMOUNTS */}

              <div className="quick-amounts">

                <button
                  type="button"
                  onClick={() =>
                    selectAmount(100)
                  }
                >
                  ₹100
                </button>

                <button
                  type="button"
                  onClick={() =>
                    selectAmount(250)
                  }
                >
                  ₹250
                </button>

                <button
                  type="button"
                  onClick={() =>
                    selectAmount(500)
                  }
                >
                  ₹500
                </button>

                <button
                  type="button"
                  onClick={() =>
                    selectAmount(1000)
                  }
                >
                  ₹1000
                </button>

              </div>


              <button
                type="submit"
                className="confirm-recharge"
                disabled={recharging}
              >

                <FiPlus />

                {recharging
                  ? "Adding..."
                  : "Add money"}

              </button>

            </form>

          </section>

        )}


        {/* ==================================
            WALLET OVERVIEW
        ================================== */}

        <section className="wallet-section">

          <div className="wallet-section-header">

            <div>

              <span className="wallet-label">
                WALLET OVERVIEW
              </span>

              <h2>
                Quick overview
              </h2>

            </div>


            <button
              type="button"
              className="refresh-button"
              onClick={refreshWallet}
            >

              <FiRefreshCw />

              Refresh

            </button>

          </div>


          <div className="wallet-info-grid">


            {/* ADD MONEY */}

            <div className="wallet-info-card">

              <div className="wallet-info-icon green">

                <FiPlus />

              </div>


              <div>

                <strong>
                  Add money
                </strong>

                <p>
                  Recharge your wallet for
                  future travel.
                </p>

              </div>

            </div>


            {/* TRAVEL PAYMENTS */}

            <div className="wallet-info-card">

              <div className="wallet-info-icon blue">

                <FiArrowDown />

              </div>


              <div>

                <strong>
                  Travel payments
                </strong>

                <p>
                  Use your balance for NIRVA
                  travel services.
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* ==================================
            TRANSACTION HISTORY
        ================================== */}

        <section className="transactions-section">

          <div className="wallet-section-header">

            <div>

              <span className="wallet-label">
                TRANSACTION HISTORY
              </span>

              <h2>
                Recent transactions
              </h2>

            </div>

          </div>


          {transactions.length === 0 ? (

            <div className="transaction-empty">

              <FiCreditCard size={28} />

              <h3>
                No transactions yet
              </h3>

              <p>
                Your wallet activity will
                appear here.
              </p>

            </div>

          ) : (

            <div className="transaction-list">

              {transactions
                .slice()
                .reverse()
                .map((transaction) => (

                  <div
                    className="transaction-card"
                    key={transaction.id}
                  >

                    <div className="transaction-icon">

                      <FiPlus />

                    </div>


                    <div className="transaction-info">

                      <strong>
                        {transaction.title}
                      </strong>

                      <span>
                        {transaction.transactionDate}
                      </span>

                    </div>


                    <div className="transaction-amount">

                      <strong>
                        {transaction.type ===
                        "DEBIT"
                          ? "- "
                          : "+ "}
                        ₹
                        {Number(
                          transaction.amount || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                      <span>
                        {transaction.type}
                      </span>

                    </div>

                  </div>

                ))}

            </div>

          )}

        </section>


        {/* ==================================
            NOTE
        ================================== */}

        <div className="wallet-note">

          <FiCreditCard />

          <span>
            Your wallet balance is securely
            stored in your NIRVA account.
          </span>

        </div>


        {/* ==================================
            CSS
        ================================== */}

        <style>{`

          .wallet-page {
            width: 100%;
            max-width: 950px;
            margin: 0 auto;
            padding: 38px 32px 60px;
          }


          /* HEADER */

          .wallet-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 28px;
          }


          .wallet-label {
            display: block;
            color: #718096;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1.5px;
          }


          .wallet-header h1 {
            margin: 7px 0 8px;
            color: #111827;
            font-size: 40px;
          }


          .wallet-header p {
            margin: 0;
            color: #64748b;
            font-size: 16px;
          }


          .wallet-header-icon {
            width: 58px;
            height: 58px;
            border-radius: 18px;
            background: #f0fdf4;
            color: #16a34a;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
          }


          /* BALANCE */

          .balance-card {
            background: #111827;
            border-radius: 18px;
            padding: 30px;
            color: white;
            margin-bottom: 20px;
          }


          .balance-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: #cbd5e1;
            font-size: 13px;
          }


          .balance-top svg {
            font-size: 22px;
          }


          .balance-amount {
            margin-top: 15px;
            font-size: 42px;
            font-weight: 800;
            letter-spacing: -1px;
          }


          .balance-card p {
            margin: 7px 0 22px;
            color: #94a3b8;
            font-size: 13px;
          }


          .recharge-button {
            height: 44px;
            padding: 0 17px;
            border: none;
            border-radius: 9px;
            background: white;
            color: #111827;
            display: flex;
            align-items: center;
            gap: 7px;
            font-weight: 700;
            cursor: pointer;
          }


          .recharge-button:hover {
            background: #f1f5f9;
          }


          /* MESSAGES */

          .wallet-message {
            padding: 13px 16px;
            border-radius: 10px;
            background: #ecfdf5;
            color: #059669;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 20px;
          }


          .wallet-error {
            padding: 13px 16px;
            border-radius: 10px;
            background: #fef2f2;
            color: #dc2626;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 20px;
          }


          /* RECHARGE */

          .recharge-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 27px;
            margin-bottom: 35px;
          }


          .recharge-header {
            display: flex;
            align-items: center;
            gap: 13px;
            margin-bottom: 22px;
          }


          .recharge-icon {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: #f0fdf4;
            color: #16a34a;
            display: flex;
            align-items: center;
            justify-content: center;
          }


          .recharge-header h2 {
            margin: 0 0 4px;
            font-size: 19px;
          }


          .recharge-header p {
            margin: 0;
            color: #94a3b8;
            font-size: 13px;
          }


          .recharge-form {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }


          .recharge-form label {
            color: #475569;
            font-size: 12px;
            font-weight: 600;
          }


          .amount-input {
            height: 50px;
            display: flex;
            align-items: center;
            gap: 9px;
            padding: 0 14px;
            border: 1px solid #dbe3ec;
            border-radius: 10px;
          }


          .amount-input span {
            color: #64748b;
            font-weight: 600;
          }


          .amount-input input {
            width: 100%;
            height: 100%;
            border: none;
            outline: none;
            font-size: 15px;
          }


          .quick-amounts {
            display: flex;
            gap: 9px;
            margin: 5px 0 10px;
          }


          .quick-amounts button {
            padding: 9px 16px;
            border: 1px solid #dbe3ec;
            border-radius: 8px;
            background: white;
            cursor: pointer;
            font-weight: 600;
            color: #334155;
          }


          .quick-amounts button:hover {
            background: #f8fafc;
          }


          .confirm-recharge {
            height: 48px;
            border: none;
            border-radius: 9px;
            background: #111827;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-weight: 700;
            cursor: pointer;
          }


          .confirm-recharge:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }


          /* OVERVIEW */

          .wallet-section {
            margin-top: 25px;
          }


          .wallet-section-header {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            margin-bottom: 16px;
          }


          .wallet-section-header h2 {
            margin: 6px 0 0;
            font-size: 24px;
            color: #111827;
          }


          .refresh-button {
            height: 37px;
            padding: 0 12px;
            border: 1px solid #dbe3ec;
            border-radius: 8px;
            background: white;
            display: flex;
            align-items: center;
            gap: 7px;
            cursor: pointer;
            color: #475569;
          }


          .refresh-button:hover {
            background: #f8fafc;
          }


          .wallet-info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 13px;
          }


          .wallet-info-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 15px;
            padding: 20px;
            display: flex;
            align-items: center;
            gap: 13px;
          }


          .wallet-info-icon {
            width: 45px;
            height: 45px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }


          .wallet-info-icon.green {
            background: #f0fdf4;
            color: #16a34a;
          }


          .wallet-info-icon.blue {
            background: #eff6ff;
            color: #2563eb;
          }


          .wallet-info-card strong {
            display: block;
            color: #172033;
            font-size: 14px;
            margin-bottom: 4px;
          }


          .wallet-info-card p {
            margin: 0;
            color: #94a3b8;
            font-size: 12px;
            line-height: 1.4;
          }


          /* TRANSACTIONS */

          .transactions-section {
            margin-top: 35px;
          }


          .transaction-list {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }


          .transaction-card {
            min-height: 75px;
            display: flex;
            align-items: center;
            gap: 13px;
            padding: 15px 17px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 13px;
            transition: 0.2s;
          }


          .transaction-card:hover {
            transform: translateY(-1px);
            box-shadow:
              0 5px 15px
              rgba(15, 23, 42, 0.05);
          }


          .transaction-icon {
            width: 42px;
            height: 42px;
            border-radius: 11px;
            background: #f0fdf4;
            color: #16a34a;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }


          .transaction-info {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }


          .transaction-info strong {
            color: #172033;
            font-size: 14px;
          }


          .transaction-info span {
            color: #94a3b8;
            font-size: 11px;
          }


          .transaction-amount {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 4px;
          }


          .transaction-amount strong {
            color: #059669;
            font-size: 14px;
          }


          .transaction-amount span {
            color: #94a3b8;
            font-size: 10px;
            font-weight: 700;
          }


          /* EMPTY TRANSACTIONS */

          .transaction-empty {
            min-height: 150px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #94a3b8;
            text-align: center;
          }


          .transaction-empty h3 {
            margin: 9px 0 4px;
            color: #334155;
            font-size: 15px;
          }


          .transaction-empty p {
            margin: 0;
            font-size: 12px;
          }


          /* NOTE */

          .wallet-note {
            min-height: 50px;
            margin-top: 18px;
            border: 1px solid #dbe3ec;
            border-radius: 11px;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            color: #64748b;
            font-size: 12px;
          }


          /* MOBILE */

          @media (max-width: 700px) {

            .wallet-page {
              padding: 25px 18px 45px;
            }


            .wallet-header h1 {
              font-size: 32px;
            }


            .balance-card {
              padding: 24px;
            }


            .balance-amount {
              font-size: 35px;
            }


            .wallet-info-grid {
              grid-template-columns: 1fr;
            }


            .quick-amounts {
              display: grid;
              grid-template-columns: 1fr 1fr;
            }


            .wallet-section-header {
              align-items: flex-start;
              gap: 10px;
            }


            .transaction-card {
              padding: 13px;
            }


            .transaction-amount strong {
              font-size: 12px;
            }

          }

        `}</style>

      </div>

    </DashboardLayout>
  );
}

export default Wallet;