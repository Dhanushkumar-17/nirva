import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  FiBell,
  FiHome,
  FiMap,
  FiClock,
  FiHeart,
  FiMapPin,
  FiUsers,
  FiNavigation,
  FiCreditCard,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiAlertTriangle,
} from "react-icons/fi";

import api from "../Services/api";

function DashboardLayout({ children }) {

  const navigate = useNavigate();
  const location = useLocation();

  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);


  // ==========================================
  // USER
  // ==========================================

  const savedUser =
    localStorage.getItem("nirvaUser");

  let user = null;

  try {
    user = savedUser
      ? JSON.parse(savedUser)
      : null;
  } catch {
    user = null;
  }


  // ==========================================
  // NOTIFICATION COUNT
  // ==========================================

  useEffect(() => {

    loadUnreadCount();

    const interval = setInterval(() => {
      loadUnreadCount();
    }, 10000);

    return () => {
      clearInterval(interval);
    };

  }, []);


  const loadUnreadCount = async () => {

    try {

      const response =
        await api.get("/notifications");

      const notifications =
        Array.isArray(response.data)
          ? response.data
          : [];

      const unread =
        notifications.filter(
          (notification) =>
            !notification.readStatus
        ).length;

      setUnreadCount(unread);

    } catch (error) {

      console.error(
        "Notification count error:",
        error
      );

    }

  };


  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {

    localStorage.removeItem("nirvaUser");

    navigate("/login");

  };


  // ==========================================
  // SIDEBAR MENU
  // ==========================================

  const menuItems = [

    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FiHome />,
    },

    {
      name: "Trip Planner",
      path: "/trip-planner",
      icon: <FiMap />,
    },

    {
      name: "My Trips",
      path: "/my-trips",
      icon: <FiClock />,
    },

    {
      name: "Favourites",
      path: "/favourites",
      icon: <FiHeart />,
    },

    {
      name: "Live Tracking",
      path: "/live-tracking",
      icon: <FiNavigation />,
    },

    {
      name: "Crowd Reports",
      path: "/crowd-reports",
      icon: <FiUsers />,
    },

    {
      name: "Road Issues",
      path: "/road-issues",
      icon: <FiAlertTriangle />,
    },

    {
      name: "Parking",
      path: "/parking",
      icon: <FiMapPin />,
    },

    {
      name: "Wallet",
      path: "/wallet",
      icon: <FiCreditCard />,
    },

  ];


  // ==========================================
  // ACCOUNT MENU
  // ==========================================

  const accountItems = [

    {
      name: "Notifications",
      path: "/notifications",
      icon: <FiBell />,
    },

    {
      name: "Settings",
      path: "/settings",
      icon: <FiSettings />,
    },

  ];


  // ==========================================
  // NAVIGATION
  // ==========================================

  const handleNavigation = (path) => {

    navigate(path);

    setMobileOpen(false);

  };


  return (

    <div className="nirva-layout">


      {/* =====================================
          MOBILE OVERLAY
      ====================================== */}

      {mobileOpen && (

        <div
          className="sidebar-overlay"
          onClick={() =>
            setMobileOpen(false)
          }
        />

      )}


      {/* =====================================
          SIDEBAR
      ====================================== */}

      <aside
        className={
          mobileOpen
            ? "nirva-sidebar mobile-open"
            : "nirva-sidebar"
        }
      >


        {/* LOGO */}

        <div className="sidebar-logo">

          <div className="logo-mark">
            N
          </div>

          <div className="logo-text">

            <strong>
              NIRVA
            </strong>

            <span>
              Bengaluru Mobility
            </span>

          </div>


          <button
            type="button"
            className="mobile-close"
            onClick={() =>
              setMobileOpen(false)
            }
          >

            <FiX />

          </button>

        </div>


        {/* USER */}

        <div className="sidebar-user">

          <div className="user-avatar">

            {user?.name
              ? user.name
                  .charAt(0)
                  .toUpperCase()
              : "U"}

          </div>


          <div className="user-details">

            <strong>
              {user?.name || "User"}
            </strong>

            <span>
              Traveller
            </span>

          </div>

        </div>


        {/* MAIN MENU */}

        <nav className="sidebar-menu">

          <span className="sidebar-label">
            MENU
          </span>


          {menuItems.map((item) => {

            const active =
              location.pathname ===
              item.path;

            return (

              <button
                type="button"
                key={item.path}
                className={
                  active
                    ? "sidebar-item active"
                    : "sidebar-item"
                }
                onClick={() =>
                  handleNavigation(
                    item.path
                  )
                }
              >

                <span className="sidebar-item-icon">
                  {item.icon}
                </span>

                <span>
                  {item.name}
                </span>

              </button>

            );

          })}

        </nav>


        {/* ACCOUNT */}

        <div className="sidebar-bottom">

          <span className="sidebar-label">
            ACCOUNT
          </span>


          {accountItems.map((item) => {

            const active =
              location.pathname ===
              item.path;

            return (

              <button
                type="button"
                key={item.path}
                className={
                  active
                    ? "sidebar-item active"
                    : "sidebar-item"
                }
                onClick={() =>
                  handleNavigation(
                    item.path
                  )
                }
              >

                <span className="sidebar-item-icon">
                  {item.icon}
                </span>

                <span>
                  {item.name}
                </span>


                {item.name ===
                  "Notifications" &&
                  unreadCount > 0 && (

                    <span className="sidebar-notification-badge">

                      {unreadCount > 99
                        ? "99+"
                        : unreadCount}

                    </span>

                  )}

              </button>

            );

          })}


          {/* LOGOUT */}

          <button
            type="button"
            className="sidebar-item logout-item"
            onClick={handleLogout}
          >

            <span className="sidebar-item-icon">
              <FiLogOut />
            </span>

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>


      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <div className="nirva-content">


        {/* HEADER */}

        <header className="nirva-header">


          {/* MOBILE MENU */}

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() =>
              setMobileOpen(true)
            }
          >

            <FiMenu />

          </button>


          <div className="header-title">

            NIRVA

          </div>


          {/* NOTIFICATION */}

          <button
            type="button"
            className="header-notification"
            onClick={() =>
              navigate("/notifications")
            }
            title="Notifications"
          >

            <FiBell />


            {unreadCount > 0 && (

              <span className="header-badge">

                {unreadCount > 99
                  ? "99+"
                  : unreadCount}

              </span>

            )}

          </button>

        </header>


        {/* PAGE */}

        <main className="nirva-main">

          {children}

        </main>

      </div>


      {/* =====================================
          CSS
      ====================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }


        .nirva-layout {
          min-height: 100vh;
          background: #f5f7fb;
          display: flex;
        }


        /* SIDEBAR */

        .nirva-sidebar {
          position: fixed;
          left: 0;
          top: 0;
          bottom: 0;

          width: 250px;

          background: #ffffff;

          border-right: 1px solid #e5e7eb;

          display: flex;
          flex-direction: column;

          padding: 22px 14px;

          z-index: 1000;
        }


        /* LOGO */

        .sidebar-logo {
          display: flex;
          align-items: center;
          gap: 11px;

          padding: 4px 10px 22px;

          border-bottom: 1px solid #f1f5f9;
        }

        .logo-mark {
          width: 38px;
          height: 38px;

          border-radius: 11px;

          background: #111827;

          color: white;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 18px;
          font-weight: 800;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-text strong {
          font-size: 17px;
          color: #111827;
          letter-spacing: 1px;
        }

        .logo-text span {
          font-size: 9px;
          color: #94a3b8;
          margin-top: 2px;
        }


        /* USER */

        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 10px;

          padding: 18px 10px;
        }

        .user-avatar {
          width: 38px;
          height: 38px;

          border-radius: 50%;

          background: #e8f5ef;

          color: #16835b;

          display: flex;
          align-items: center;
          justify-content: center;

          font-weight: 700;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .user-details strong {
          color: #172033;
          font-size: 13px;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-details span {
          color: #94a3b8;
          font-size: 11px;
          margin-top: 2px;
        }


        /* LABEL */

        .sidebar-label {
          display: block;

          padding: 8px 12px;

          color: #94a3b8;

          font-size: 9px;

          font-weight: 700;

          letter-spacing: 1.3px;
        }


        /* MENU */

        .sidebar-menu {
          display: flex;
          flex-direction: column;
          gap: 3px;

          flex: 1;

          overflow-y: auto;
        }


        .sidebar-item {
          width: 100%;

          min-height: 42px;

          border: none;

          background: transparent;

          border-radius: 10px;

          display: flex;
          align-items: center;

          gap: 12px;

          padding: 0 12px;

          color: #64748b;

          font-size: 13px;

          cursor: pointer;

          text-align: left;

          transition: 0.2s;

          position: relative;
        }


        .sidebar-item:hover {
          background: #f5f7fb;
          color: #111827;
        }


        .sidebar-item.active {
          background: #111827;
          color: white;
          font-weight: 600;
        }


        .sidebar-item-icon {
          width: 20px;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 17px;
        }


        /* ACCOUNT */

        .sidebar-bottom {
          border-top: 1px solid #f1f5f9;

          padding-top: 10px;

          display: flex;
          flex-direction: column;

          gap: 3px;
        }


        /* LOGOUT */

        .logout-item {
          color: #ef4444;
          margin-top: 4px;
        }

        .logout-item:hover {
          color: #dc2626;
          background: #fef2f2;
        }


        /* NOTIFICATION BADGE */

        .sidebar-notification-badge {
          margin-left: auto;

          min-width: 20px;
          height: 20px;

          padding: 0 5px;

          border-radius: 20px;

          background: #ef4444;

          color: white;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 9px;
          font-weight: 700;
        }


        /* CONTENT */

        .nirva-content {
          margin-left: 250px;

          width: calc(100% - 250px);

          min-height: 100vh;
        }


        /* HEADER */

        .nirva-header {
          height: 64px;

          background: white;

          border-bottom: 1px solid #e5e7eb;

          display: flex;
          align-items: center;

          padding: 0 28px;

          position: sticky;
          top: 0;

          z-index: 500;
        }


        .header-title {
          flex: 1;

          color: #111827;

          font-size: 15px;

          font-weight: 700;
        }


        .header-notification {
          position: relative;

          width: 40px;
          height: 40px;

          border: none;

          background: transparent;

          border-radius: 10px;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 20px;

          color: #475569;

          cursor: pointer;
        }


        .header-notification:hover {
          background: #f1f5f9;
        }


        .header-badge {
          position: absolute;

          top: 1px;
          right: 1px;

          min-width: 18px;
          height: 18px;

          padding: 0 4px;

          border-radius: 20px;

          background: #ef4444;

          color: white;

          border: 2px solid white;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 9px;
          font-weight: 700;
        }


        /* MAIN */

        .nirva-main {
          min-height: calc(100vh - 64px);
        }


        /* MOBILE */

        .mobile-menu-button {
          display: none;

          width: 40px;
          height: 40px;

          border: none;

          background: transparent;

          border-radius: 9px;

          font-size: 22px;

          cursor: pointer;

          margin-right: 8px;
        }


        .mobile-close {
          display: none;
        }


        .sidebar-overlay {
          display: none;
        }


        /* RESPONSIVE */

        @media (max-width: 900px) {

          .nirva-sidebar {
            transform: translateX(-100%);

            transition: transform 0.25s ease;
          }


          .nirva-sidebar.mobile-open {
            transform: translateX(0);
          }


          .nirva-content {
            margin-left: 0;

            width: 100%;
          }


          .mobile-menu-button {
            display: flex;

            align-items: center;
            justify-content: center;
          }


          .mobile-close {
            display: flex;

            margin-left: auto;

            width: 32px;
            height: 32px;

            border: none;

            background: transparent;

            align-items: center;
            justify-content: center;

            font-size: 20px;

            cursor: pointer;
          }


          .sidebar-overlay {
            display: block;

            position: fixed;

            inset: 0;

            background: rgba(15, 23, 42, 0.35);

            z-index: 900;
          }

        }

      `}</style>

    </div>
  );
}

export default DashboardLayout;