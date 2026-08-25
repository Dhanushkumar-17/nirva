import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiUser,
  FiSave,
  FiLogOut,
  FiNavigation,
} from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";

function Settings() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [notifications, setNotifications] =
    useState(true);

  const [defaultTransport, setDefaultTransport] =
    useState("Metro");

  const [message, setMessage] = useState("");


  // ==========================================
  // LOAD USER SETTINGS
  // ==========================================

  useEffect(() => {

    const savedUser =
      localStorage.getItem("nirvaUser");

    if (!savedUser) {

      navigate("/login");

      return;
    }

    try {

      const parsedUser =
        JSON.parse(savedUser);

      setUser(parsedUser);

      setName(
        parsedUser.name || ""
      );

      setEmail(
        parsedUser.email || ""
      );


      const savedSettings =
        localStorage.getItem(
          "nirvaSettings"
        );

      if (savedSettings) {

        const settings =
          JSON.parse(savedSettings);

        setNotifications(
          settings.notifications ?? true
        );

        setDefaultTransport(
          settings.defaultTransport ||
          "Metro"
        );
      }

    } catch (error) {

      console.error(
        "Settings loading error:",
        error
      );

    }

  }, [navigate]);


  // ==========================================
  // SAVE SETTINGS
  // ==========================================

  const handleSave = () => {

    if (!name.trim()) {

      setMessage(
        "Please enter your name."
      );

      return;
    }


    const updatedUser = {

      ...user,

      name: name.trim(),

      email: email.trim(),

    };


    localStorage.setItem(
      "nirvaUser",
      JSON.stringify(updatedUser)
    );


    const settings = {

      notifications,

      defaultTransport,

    };


    localStorage.setItem(
      "nirvaSettings",
      JSON.stringify(settings)
    );


    setUser(updatedUser);

    setMessage(
      "Settings saved successfully! ✓"
    );


    setTimeout(() => {

      setMessage("");

    }, 3000);

  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem(
      "nirvaUser"
    );

    navigate("/login");

  };


  return (

    <DashboardLayout>

      <div className="settings-page">


        {/* ==================================
            HEADER
        =================================== */}

        <section className="settings-header">

          <div>

            <span className="section-label">
              ACCOUNT
            </span>

            <h1>
              Settings
            </h1>

            <p>
              Manage your NIRVA account and
              travel preferences.
            </p>

          </div>

          <FiUser size={32} />

        </section>


        {/* ==================================
            PROFILE
        =================================== */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon">
              <FiUser />
            </div>

            <div>

              <h2>
                Profile
              </h2>

              <p>
                Update your personal information.
              </p>

            </div>

          </div>


          <div className="settings-form">

            <div className="settings-field">

              <label>
                Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="Your name"
              />

            </div>


            <div className="settings-field">

              <label>
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="Your email"
              />

            </div>

          </div>

        </section>


        {/* ==================================
            TRAVEL PREFERENCES
        =================================== */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon">
              <FiNavigation />
            </div>

            <div>

              <h2>
                Travel preferences
              </h2>

              <p>
                Choose your preferred transport.
              </p>

            </div>

          </div>


          <div className="settings-field">

            <label>
              Default transport
            </label>

            <select
              value={defaultTransport}
              onChange={(event) =>
                setDefaultTransport(
                  event.target.value
                )
              }
            >

              <option value="Metro">
                🚇 Metro
              </option>

              <option value="Bus">
                🚌 Bus
              </option>

              <option value="Auto">
                🛺 Auto
              </option>

              <option value="Walk">
                🚶 Walking
              </option>

            </select>

          </div>

        </section>


        {/* ==================================
            NOTIFICATIONS
        =================================== */}

        <section className="settings-card">

          <div className="settings-card-header">

            <div className="settings-icon">
              <FiBell />
            </div>

            <div>

              <h2>
                Notifications
              </h2>

              <p>
                Control travel alerts and updates.
              </p>

            </div>

          </div>


          <div className="settings-toggle-row">

            <div>

              <strong>
                Travel notifications
              </strong>

              <span>
                Receive crowd, route and
                travel updates.
              </span>

            </div>


            <button
              type="button"
              className={
                notifications
                  ? "settings-toggle active"
                  : "settings-toggle"
              }
              onClick={() =>
                setNotifications(
                  !notifications
                )
              }
            >

              <span />

            </button>

          </div>

        </section>


        {/* ==================================
            SAVE
        =================================== */}

        <section className="settings-actions">

          <button
            type="button"
            className="save-settings-button"
            onClick={handleSave}
          >

            <FiSave />

            Save settings

          </button>


          {message && (

            <span className="settings-success">
              {message}
            </span>

          )}

        </section>


        {/* ==================================
            LOGOUT
        =================================== */}

        <section className="settings-card danger-card">

          <div>

            <h2>
              Sign out
            </h2>

            <p>
              Sign out of your NIRVA account
              on this device.
            </p>

          </div>


          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >

            <FiLogOut />

            Logout

          </button>

        </section>


        {/* ==================================
            CSS
        =================================== */}

        <style>{`

          .settings-page {
            padding: 32px;
            max-width: 900px;
            margin: 0 auto;
          }


          .settings-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 25px;
          }


          .settings-header h1 {
            margin: 6px 0;
          }


          .settings-header p {
            margin: 0;
            color: #64748b;
          }


          .settings-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 25px;
            margin-bottom: 16px;
          }


          .settings-card-header {
            display: flex;
            align-items: center;
            gap: 13px;
            margin-bottom: 22px;
          }


          .settings-card-header h2 {
            margin: 0 0 4px;
            font-size: 18px;
          }


          .settings-card-header p {
            margin: 0;
            color: #94a3b8;
            font-size: 13px;
          }


          .settings-icon {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            background: #f1f5f9;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 19px;
          }


          .settings-form {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
          }


          .settings-field {
            display: flex;
            flex-direction: column;
            gap: 7px;
          }


          .settings-field label {
            font-size: 12px;
            font-weight: 600;
            color: #475569;
          }


          .settings-field input,
          .settings-field select {
            height: 45px;
            border: 1px solid #dbe3ec;
            border-radius: 9px;
            padding: 0 13px;
            outline: none;
            font-size: 14px;
            background: white;
          }


          .settings-field input:focus,
          .settings-field select:focus {
            border-color: #111827;
          }


          .settings-toggle-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }


          .settings-toggle-row strong {
            display: block;
            font-size: 14px;
            margin-bottom: 4px;
          }


          .settings-toggle-row span {
            display: block;
            color: #94a3b8;
            font-size: 12px;
          }


          .settings-toggle {
            width: 48px;
            height: 26px;
            border: none;
            border-radius: 20px;
            background: #cbd5e1;
            padding: 3px;
            cursor: pointer;
            transition: 0.2s;
          }


          .settings-toggle span {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: white;
            display: block;
            transition: 0.2s;
          }


          .settings-toggle.active {
            background: #111827;
          }


          .settings-toggle.active span {
            transform: translateX(22px);
          }


          .settings-actions {
            display: flex;
            align-items: center;
            gap: 15px;
            margin: 20px 0;
          }


          .save-settings-button {
            display: flex;
            align-items: center;
            gap: 8px;
            border: none;
            border-radius: 10px;
            background: #111827;
            color: white;
            padding: 12px 20px;
            cursor: pointer;
            font-weight: 600;
          }


          .save-settings-button:hover {
            background: #1f2937;
          }


          .settings-success {
            color: #059669;
            font-size: 13px;
            font-weight: 600;
          }


          .danger-card {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }


          .danger-card h2 {
            margin: 0 0 5px;
            font-size: 17px;
          }


          .danger-card p {
            margin: 0;
            color: #94a3b8;
            font-size: 13px;
          }


          .logout-button {
            display: flex;
            align-items: center;
            gap: 8px;
            border: 1px solid #fecaca;
            color: #dc2626;
            background: #fff;
            border-radius: 9px;
            padding: 10px 16px;
            cursor: pointer;
            font-weight: 600;
          }


          .logout-button:hover {
            background: #fef2f2;
          }


          @media (max-width: 650px) {

            .settings-page {
              padding: 20px;
            }

            .settings-form {
              grid-template-columns: 1fr;
            }

            .danger-card {
              align-items: flex-start;
              flex-direction: column;
              gap: 15px;
            }

          }

        `}</style>

      </div>

    </DashboardLayout>
  );
}

export default Settings;