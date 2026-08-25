import { useEffect, useState } from "react";
import {
  FiMapPin,
  FiPlus,
  FiTrash2,
  FiNavigation,
  FiSearch,
  FiCreditCard,
} from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../Services/api";

function Parking() {
  const [parking, setParking] = useState([]);
  const [balance, setBalance] = useState(0);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [payingId, setPayingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    location: "",
    distance: "",
    price: "",
    availableSlots: "",
    status: "Available",
  });


  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    loadParking();
    loadWallet();
  }, []);


  const loadParking = async () => {
    try {
      setLoading(true);

      const response =
        await api.get("/parking");

      setParking(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {
      console.error(
        "Parking loading error:",
        error
      );

      setError(
        "Unable to load parking locations."
      );

    } finally {
      setLoading(false);
    }
  };


  const loadWallet = async () => {
    try {
      const response =
        await api.get("/wallet");

      setBalance(
        response.data?.balance || 0
      );

    } catch (error) {
      console.error(
        "Wallet loading error:",
        error
      );
    }
  };


  // ==========================================
  // FORM
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };


  // ==========================================
  // ADD PARKING
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.location.trim()
    ) {
      setError(
        "Please enter parking name and location."
      );

      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      await api.post("/parking", {
        name: form.name.trim(),
        location: form.location.trim(),
        distance: Number(form.distance) || 0,
        price: Number(form.price) || 0,
        availableSlots:
          Number(form.availableSlots) || 0,
        status: form.status,
      });

      setMessage(
        "Parking location added successfully!"
      );

      setForm({
        name: "",
        location: "",
        distance: "",
        price: "",
        availableSlots: "",
        status: "Available",
      });

      setShowForm(false);

      await loadParking();

    } catch (error) {
      console.error(
        "Add parking error:",
        error
      );

      setError(
        error.response?.data ||
        "Unable to add parking."
      );

    } finally {
      setSaving(false);
    }
  };


  // ==========================================
  // DELETE
  // ==========================================

  const deleteParking = async (id) => {
    const confirmed = window.confirm(
      "Delete this parking location?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/parking/${id}`
      );

      setParking((current) =>
        current.filter(
          (item) => item.id !== id
        )
      );

      setMessage(
        "Parking location deleted."
      );

    } catch (error) {
      console.error(
        "Delete parking error:",
        error
      );

      setError(
        "Unable to delete parking."
      );
    }
  };


  // ==========================================
  // PAY FROM WALLET
  // ==========================================

  const payForParking = async (item) => {
    const price = Number(item.price) || 0;

    if (price <= 0) {
      setError(
        "This parking location has no valid price."
      );
      return;
    }

    if (balance < price) {
      setError(
        `Insufficient wallet balance. Required ₹${price}.`
      );
      return;
    }

    const confirmed = window.confirm(
      `Pay ₹${price} for ${item.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setPayingId(item.id);

      setError("");
      setMessage("");

      const response = await api.post(
        "/wallet/pay",
        {
          amount: price,
          title: `Parking Payment - ${item.name}`,
        }
      );

      setBalance(
        response.data?.balance || 0
      );

      setMessage(
        `✓ ₹${price} paid successfully for ${item.name}.`
      );

    } catch (error) {
      console.error(
        "Parking payment error:",
        error
      );

      setError(
        error.response?.data ||
        "Unable to complete payment."
      );

    } finally {
      setPayingId(null);
    }
  };


  // ==========================================
  // SEARCH
  // ==========================================

  const filteredParking =
    parking.filter((item) => {
      const text =
        `${item.name} ${item.location}`
          .toLowerCase();

      return text.includes(
        search.toLowerCase()
      );
    });


  return (
    <DashboardLayout>

      <div className="parking-page">


        {/* ==================================
            HEADER
        ================================== */}

        <section className="parking-header">

          <div>

            <span className="parking-label">
              SMART PARKING
            </span>

            <h1>
              Parking
            </h1>

            <p>
              Find convenient parking locations
              around Bengaluru.
            </p>

          </div>


          <div className="parking-header-right">

            <div className="wallet-mini">

              <FiCreditCard />

              <div>

                <span>
                  Wallet
                </span>

                <strong>
                  ₹{Number(
                    balance
                  ).toLocaleString("en-IN")}
                </strong>

              </div>

            </div>


            <div className="parking-header-icon">

              <FiMapPin />

            </div>

          </div>

        </section>


        {/* ==================================
            TOOLBAR
        ================================== */}

        <section className="parking-toolbar">

          <div className="parking-search">

            <FiSearch />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search parking location..."
            />

          </div>


          <button
            type="button"
            className="add-parking-button"
            onClick={() => {
              setShowForm(!showForm);
              setError("");
              setMessage("");
            }}
          >

            <FiPlus />

            {showForm
              ? "Close"
              : "Add parking"}

          </button>

        </section>


        {/* ==================================
            MESSAGES
        ================================== */}

        {message && (

          <div className="parking-message">

            {message}

          </div>

        )}


        {error && (

          <div className="parking-error">

            {error}

          </div>

        )}


        {/* ==================================
            ADD FORM
        ================================== */}

        {showForm && (

          <section className="parking-form-card">

            <div className="parking-form-header">

              <div className="parking-form-icon">
                <FiPlus />
              </div>

              <div>

                <h2>
                  Add parking location
                </h2>

                <p>
                  Add parking information for
                  NIRVA commuters.
                </p>

              </div>

            </div>


            <form
              onSubmit={handleSubmit}
              className="parking-form"
            >

              <div className="parking-field">

                <label>
                  Parking name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Example: Majestic Parking"
                />

              </div>


              <div className="parking-field">

                <label>
                  Location
                </label>

                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="Example: Majestic"
                />

              </div>


              <div className="parking-form-row">

                <div className="parking-field">

                  <label>
                    Distance (km)
                  </label>

                  <input
                    type="number"
                    name="distance"
                    value={form.distance}
                    onChange={handleChange}
                    placeholder="1"
                    min="0"
                  />

                </div>


                <div className="parking-field">

                  <label>
                    Price (₹)
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="30"
                    min="0"
                  />

                </div>


                <div className="parking-field">

                  <label>
                    Available slots
                  </label>

                  <input
                    type="number"
                    name="availableSlots"
                    value={form.availableSlots}
                    onChange={handleChange}
                    placeholder="25"
                    min="0"
                  />

                </div>

              </div>


              <div className="parking-field">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >

                  <option value="Available">
                    Available
                  </option>

                  <option value="Limited">
                    Limited
                  </option>

                  <option value="Full">
                    Full
                  </option>

                </select>

              </div>


              <button
                type="submit"
                className="save-parking-button"
                disabled={saving}
              >

                <FiPlus />

                {saving
                  ? "Adding..."
                  : "Add parking"}

              </button>

            </form>

          </section>

        )}


        {/* ==================================
            PARKING LIST
        ================================== */}

        <section className="parking-section">

          <div className="parking-section-header">

            <div>

              <span className="parking-label">
                AVAILABLE LOCATIONS
              </span>

              <h2>
                Nearby parking
              </h2>

            </div>

            <span className="parking-count">
              {filteredParking.length} locations
            </span>

          </div>


          {loading && (

            <div className="parking-empty">

              <p>
                Loading parking locations...
              </p>

            </div>

          )}


          {!loading &&
            filteredParking.length === 0 && (

              <div className="parking-empty">

                <FiMapPin size={30} />

                <h3>
                  No parking locations found
                </h3>

                <p>
                  Try another search or add a
                  parking location.
                </p>

              </div>

            )}


          {!loading &&
            filteredParking.length > 0 && (

              <div className="parking-list">

                {filteredParking.map((item) => {

                  const price =
                    Number(item.price) || 0;

                  const isPaying =
                    payingId === item.id;

                  return (

                    <div
                      className="parking-card"
                      key={item.id}
                    >


                      {/* ICON */}

                      <div className="parking-card-icon">

                        <FiMapPin />

                      </div>


                      {/* CONTENT */}

                      <div className="parking-card-content">

                        <div className="parking-title-row">

                          <h3>
                            {item.name}
                          </h3>

                          <span
                            className={
                              item.status ===
                              "Available"
                                ? "parking-status available"
                                : item.status ===
                                  "Limited"
                                ? "parking-status limited"
                                : "parking-status full"
                            }
                          >
                            {item.status}
                          </span>

                        </div>


                        <div className="parking-location">

                          <FiMapPin />

                          {item.location}

                        </div>


                        <div className="parking-details">

                          <span>
                            📍 {item.distance} km
                          </span>

                          <span>
                            ₹{price}
                          </span>

                          <span>
                            🅿️{" "}
                            {item.availableSlots}
                            {" "}slots
                          </span>

                        </div>

                      </div>


                      {/* ACTIONS */}

                      <div className="parking-actions">

                        <button
                          type="button"
                          className="pay-button"
                          disabled={
                            isPaying ||
                            item.status === "Full"
                          }
                          onClick={() =>
                            payForParking(item)
                          }
                        >

                          <FiCreditCard />

                          {isPaying
                            ? "Paying..."
                            : `Pay ₹${price}`}

                        </button>


                        <button
                          type="button"
                          className="navigate-button"
                          onClick={() =>
                            alert(
                              `Navigate to ${item.location}`
                            )
                          }
                        >

                          <FiNavigation />

                          Navigate

                        </button>


                        <button
                          type="button"
                          className="delete-parking-button"
                          onClick={() =>
                            deleteParking(
                              item.id
                            )
                          }
                          title="Delete parking"
                        >

                          <FiTrash2 />

                        </button>

                      </div>

                    </div>

                  );
                })}

              </div>

            )}

        </section>


        {/* ==================================
            CSS
        ================================== */}

        <style>{`

          .parking-page {
            width: 100%;
            max-width: 1050px;
            margin: 0 auto;
            padding: 38px 32px 60px;
          }


          .parking-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 28px;
          }


          .parking-label {
            display: block;
            color: #718096;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1.5px;
          }


          .parking-header h1 {
            margin: 7px 0 8px;
            color: #111827;
            font-size: 40px;
          }


          .parking-header p {
            margin: 0;
            color: #64748b;
            font-size: 17px;
          }


          .parking-header-right {
            display: flex;
            align-items: center;
            gap: 12px;
          }


          .wallet-mini {
            min-width: 125px;
            height: 58px;
            padding: 0 13px;
            border: 1px solid #e2e8f0;
            border-radius: 13px;
            background: white;
            display: flex;
            align-items: center;
            gap: 9px;
          }


          .wallet-mini > svg {
            color: #16a34a;
            font-size: 20px;
          }


          .wallet-mini div {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }


          .wallet-mini span {
            color: #94a3b8;
            font-size: 10px;
          }


          .wallet-mini strong {
            color: #172033;
            font-size: 14px;
          }


          .parking-header-icon {
            width: 58px;
            height: 58px;
            border-radius: 18px;
            background: #eff6ff;
            color: #2563eb;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
          }


          .parking-toolbar {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
          }


          .parking-search {
            flex: 1;
            height: 50px;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 0 15px;
            background: white;
            border: 1px solid #dbe3ec;
            border-radius: 10px;
            color: #64748b;
          }


          .parking-search input {
            flex: 1;
            border: none;
            outline: none;
            font-size: 14px;
          }


          .add-parking-button {
            height: 50px;
            padding: 0 18px;
            display: flex;
            align-items: center;
            gap: 8px;
            border: none;
            border-radius: 10px;
            background: #111827;
            color: white;
            font-weight: 600;
            cursor: pointer;
          }


          .add-parking-button:hover {
            background: #1f2937;
          }


          .parking-message {
            padding: 13px 16px;
            margin-bottom: 18px;
            border-radius: 10px;
            background: #ecfdf5;
            color: #059669;
            font-size: 13px;
            font-weight: 600;
          }


          .parking-error {
            padding: 13px 16px;
            margin-bottom: 18px;
            border-radius: 10px;
            background: #fef2f2;
            color: #dc2626;
            font-size: 13px;
            font-weight: 600;
          }


          .parking-form-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 27px;
            margin-bottom: 35px;
          }


          .parking-form-header {
            display: flex;
            align-items: center;
            gap: 13px;
            margin-bottom: 25px;
          }


          .parking-form-icon {
            width: 45px;
            height: 45px;
            border-radius: 12px;
            background: #eff6ff;
            color: #2563eb;
            display: flex;
            align-items: center;
            justify-content: center;
          }


          .parking-form-header h2 {
            margin: 0 0 4px;
            font-size: 20px;
          }


          .parking-form-header p {
            margin: 0;
            color: #94a3b8;
            font-size: 13px;
          }


          .parking-form {
            display: flex;
            flex-direction: column;
            gap: 17px;
          }


          .parking-field {
            display: flex;
            flex-direction: column;
            gap: 7px;
          }


          .parking-field label {
            font-size: 12px;
            font-weight: 600;
            color: #475569;
          }


          .parking-field input,
          .parking-field select {
            height: 46px;
            padding: 0 13px;
            border: 1px solid #dbe3ec;
            border-radius: 9px;
            outline: none;
            font-size: 14px;
            background: white;
          }


          .parking-field input:focus,
          .parking-field select:focus {
            border-color: #111827;
          }


          .parking-form-row {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
          }


          .save-parking-button {
            height: 48px;
            border: none;
            border-radius: 9px;
            background: #111827;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-weight: 600;
            cursor: pointer;
          }


          .save-parking-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }


          .parking-section-header {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            margin-bottom: 17px;
          }


          .parking-section-header h2 {
            margin: 6px 0 0;
            font-size: 25px;
            color: #111827;
          }


          .parking-count {
            padding: 7px 13px;
            border: 1px solid #dbe3ec;
            border-radius: 20px;
            background: white;
            font-size: 12px;
            font-weight: 600;
          }


          .parking-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }


          .parking-card {
            display: flex;
            align-items: center;
            gap: 17px;
            min-height: 105px;
            padding: 17px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 15px;
            transition: 0.2s;
          }


          .parking-card:hover {
            transform: translateY(-1px);
            box-shadow:
              0 6px 18px
              rgba(15, 23, 42, 0.07);
          }


          .parking-card-icon {
            width: 58px;
            height: 58px;
            border-radius: 14px;
            background: #eff6ff;
            color: #2563eb;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 25px;
            flex-shrink: 0;
          }


          .parking-card-content {
            flex: 1;
            min-width: 0;
          }


          .parking-title-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 6px;
          }


          .parking-title-row h3 {
            margin: 0;
            font-size: 16px;
            color: #111827;
          }


          .parking-status {
            padding: 4px 9px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 700;
          }


          .parking-status.available {
            background: #ecfdf5;
            color: #059669;
          }


          .parking-status.limited {
            background: #fffbeb;
            color: #d97706;
          }


          .parking-status.full {
            background: #fef2f2;
            color: #dc2626;
          }


          .parking-location {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #64748b;
            font-size: 13px;
            margin-bottom: 9px;
          }


          .parking-details {
            display: flex;
            gap: 16px;
            color: #475569;
            font-size: 12px;
          }


          .parking-actions {
            display: flex;
            align-items: center;
            gap: 8px;
          }


          .pay-button {
            height: 38px;
            padding: 0 13px;
            display: flex;
            align-items: center;
            gap: 6px;
            border: none;
            border-radius: 8px;
            background: #16a34a;
            color: white;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
          }


          .pay-button:hover {
            background: #15803d;
          }


          .pay-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }


          .navigate-button {
            height: 38px;
            padding: 0 13px;
            display: flex;
            align-items: center;
            gap: 6px;
            border: 1px solid #dbe3ec;
            border-radius: 8px;
            background: white;
            color: #334155;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
          }


          .navigate-button:hover {
            background: #f8fafc;
          }


          .delete-parking-button {
            width: 38px;
            height: 38px;
            border: 1px solid #fee2e2;
            border-radius: 8px;
            background: #fff7f7;
            color: #ef4444;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }


          .parking-empty {
            min-height: 180px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #94a3b8;
          }


          .parking-empty h3 {
            color: #334155;
            margin: 10px 0 5px;
          }


          .parking-empty p {
            margin: 0;
            font-size: 13px;
          }


          @media (max-width: 800px) {

            .parking-card {
              align-items: flex-start;
            }

            .parking-actions {
              flex-direction: column;
            }

            .navigate-button {
              display: none;
            }

          }


          @media (max-width: 700px) {

            .parking-page {
              padding: 25px 18px 45px;
            }

            .parking-header h1 {
              font-size: 32px;
            }

            .parking-header-right {
              gap: 6px;
            }

            .wallet-mini {
              min-width: auto;
            }

            .wallet-mini span {
              display: none;
            }

            .parking-toolbar {
              flex-direction: column;
            }

            .parking-form-row {
              grid-template-columns: 1fr;
            }

            .parking-card {
              gap: 11px;
            }

            .parking-card-icon {
              width: 45px;
              height: 45px;
              font-size: 20px;
            }

            .parking-details {
              flex-wrap: wrap;
              gap: 8px;
            }

            .pay-button {
              padding: 0 10px;
            }

          }

        `}</style>

      </div>

    </DashboardLayout>
  );
}

export default Parking;