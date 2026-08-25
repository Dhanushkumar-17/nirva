import { useEffect, useState } from "react";
import {
  FiBell,
  FiCheck,
  FiTrash2,
  FiRefreshCw,
  FiInfo,
  FiAlertTriangle,
} from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../Services/api";

function Notifications() {

  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD NOTIFICATIONS
  // ==========================================

  useEffect(() => {
    loadNotifications();
  }, []);


  const loadNotifications = async () => {

    try {

      setLoading(true);
      setError("");

      const response =
        await api.get("/notifications");

      setNotifications(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {

      console.error(
        "Notification loading error:",
        error
      );

      setError(
        "Unable to load notifications."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // MARK AS READ
  // ==========================================

  const markAsRead = async (id) => {

    try {

      const response =
        await api.put(
          `/notifications/${id}/read`
        );


      setNotifications((current) =>
        current.map((notification) =>
          notification.id === id
            ? response.data
            : notification
        )
      );

    } catch (error) {

      console.error(
        "Mark as read error:",
        error
      );

    }
  };


  // ==========================================
  // DELETE
  // ==========================================

  const deleteNotification = async (id) => {

    try {

      await api.delete(
        `/notifications/${id}`
      );


      setNotifications((current) =>
        current.filter(
          (notification) =>
            notification.id !== id
        )
      );

    } catch (error) {

      console.error(
        "Delete notification error:",
        error
      );

    }
  };


  // ==========================================
  // UNREAD COUNT
  // ==========================================

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.readStatus
    ).length;


  // ==========================================
  // ICON
  // ==========================================

  const getIcon = (type) => {

    switch (type) {

      case "success":
        return "✅";

      case "warning":
        return "⚠️";

      case "parking":
        return "🅿️";

      case "wallet":
        return "💳";

      case "road":
        return "🚧";

      case "crowd":
        return "👥";

      case "travel":
        return "🚌";

      default:
        return "🔔";
    }
  };


  return (

    <DashboardLayout>

      <div className="notification-page">


        {/* ==================================
            HEADER
        ================================== */}

        <section className="notification-header">

          <div>

            <span className="notification-label">
              NIRVA UPDATES
            </span>

            <h1>
              Notifications
            </h1>

            <p>
              Stay updated with your travel
              activity and NIRVA services.
            </p>

          </div>


          <div className="notification-header-icon">

            <FiBell />

          </div>

        </section>


        {/* ==================================
            SUMMARY
        ================================== */}

        <section className="notification-summary">

          <div>

            <span>
              Total notifications
            </span>

            <strong>
              {notifications.length}
            </strong>

          </div>


          <div>

            <span>
              Unread
            </span>

            <strong>
              {unreadCount}
            </strong>

          </div>


          <button
            type="button"
            className="refresh-button"
            onClick={loadNotifications}
          >

            <FiRefreshCw />

            Refresh

          </button>

        </section>


        {/* ==================================
            ERROR
        ================================== */}

        {error && (

          <div className="notification-error">

            <FiAlertTriangle />

            {error}

          </div>

        )}


        {/* ==================================
            LOADING
        ================================== */}

        {loading && (

          <div className="notification-empty">

            <FiBell size={30} />

            <h3>
              Loading notifications...
            </h3>

          </div>

        )}


        {/* ==================================
            EMPTY
        ================================== */}

        {!loading &&
          notifications.length === 0 && (

            <div className="notification-empty">

              <FiInfo size={32} />

              <h3>
                No notifications
              </h3>

              <p>
                You're all caught up!
              </p>

            </div>

          )}


        {/* ==================================
            NOTIFICATION LIST
        ================================== */}

        {!loading &&
          notifications.length > 0 && (

            <section className="notification-list">

              {notifications
                .slice()
                .reverse()
                .map((notification) => (

                  <div
                    key={notification.id}
                    className={
                      notification.readStatus
                        ? "notification-card read"
                        : "notification-card unread"
                    }
                  >


                    {/* ICON */}

                    <div className="notification-icon">

                      {getIcon(
                        notification.type
                      )}

                    </div>


                    {/* CONTENT */}

                    <div className="notification-content">

                      <div className="notification-title-row">

                        <h3>
                          {notification.title}
                        </h3>


                        {!notification.readStatus && (

                          <span className="unread-badge">
                            NEW
                          </span>

                        )}

                      </div>


                      <p>
                        {notification.message}
                      </p>


                      <span className="notification-date">

                        {notification.createdAt ||
                          "Recently"}

                      </span>

                    </div>


                    {/* ACTIONS */}

                    <div className="notification-actions">


                      {!notification.readStatus && (

                        <button
                          type="button"
                          className="read-button"
                          onClick={() =>
                            markAsRead(
                              notification.id
                            )
                          }
                          title="Mark as read"
                        >

                          <FiCheck />

                        </button>

                      )}


                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          deleteNotification(
                            notification.id
                          )
                        }
                        title="Delete"
                      >

                        <FiTrash2 />

                      </button>

                    </div>

                  </div>

                ))}

            </section>

          )}


        {/* ==================================
            FOOTER
        ================================== */}

        {!loading &&
          notifications.length > 0 && (

            <div className="notification-footer">

              <FiBell />

              <span>
                You're up to date with NIRVA.
              </span>

            </div>

          )}


        {/* ==================================
            CSS
        ================================== */}

        <style>{`

          .notification-page {
            width: 100%;
            max-width: 950px;
            margin: 0 auto;
            padding: 38px 32px 60px;
          }


          /* HEADER */

          .notification-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 28px;
          }


          .notification-label {
            display: block;
            color: #718096;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1.5px;
          }


          .notification-header h1 {
            margin: 7px 0 8px;
            color: #111827;
            font-size: 40px;
          }


          .notification-header p {
            margin: 0;
            color: #64748b;
            font-size: 16px;
          }


          .notification-header-icon {
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


          /* SUMMARY */

          .notification-summary {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 20px;
          }


          .notification-summary > div {
            min-width: 130px;
            padding: 14px 17px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
          }


          .notification-summary span {
            display: block;
            color: #94a3b8;
            font-size: 11px;
            margin-bottom: 4px;
          }


          .notification-summary strong {
            color: #111827;
            font-size: 20px;
          }


          .refresh-button {
            height: 48px;
            padding: 0 14px;
            margin-left: auto;
            border: 1px solid #dbe3ec;
            border-radius: 10px;
            background: white;
            color: #475569;
            display: flex;
            align-items: center;
            gap: 7px;
            font-weight: 600;
            cursor: pointer;
          }


          .refresh-button:hover {
            background: #f8fafc;
          }


          /* ERROR */

          .notification-error {
            padding: 13px 16px;
            margin-bottom: 18px;
            border-radius: 10px;
            background: #fef2f2;
            color: #dc2626;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 13px;
            font-weight: 600;
          }


          /* LIST */

          .notification-list {
            display: flex;
            flex-direction: column;
            gap: 11px;
          }


          /* CARD */

          .notification-card {
            min-height: 95px;
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 16px 18px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            transition: 0.2s;
          }


          .notification-card:hover {
            transform: translateY(-1px);
            box-shadow:
              0 5px 16px
              rgba(15, 23, 42, 0.06);
          }


          .notification-card.unread {
            border-left: 3px solid #2563eb;
          }


          .notification-card.read {
            opacity: 0.78;
          }


          /* ICON */

          .notification-icon {
            width: 50px;
            height: 50px;
            border-radius: 13px;
            background: #f8fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 23px;
            flex-shrink: 0;
          }


          /* CONTENT */

          .notification-content {
            flex: 1;
            min-width: 0;
          }


          .notification-title-row {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 5px;
          }


          .notification-title-row h3 {
            margin: 0;
            color: #111827;
            font-size: 15px;
          }


          .unread-badge {
            padding: 3px 7px;
            border-radius: 20px;
            background: #eff6ff;
            color: #2563eb;
            font-size: 9px;
            font-weight: 800;
          }


          .notification-content p {
            margin: 0 0 5px;
            color: #64748b;
            font-size: 13px;
            line-height: 1.4;
          }


          .notification-date {
            color: #94a3b8;
            font-size: 10px;
          }


          /* ACTIONS */

          .notification-actions {
            display: flex;
            align-items: center;
            gap: 7px;
          }


          .read-button,
          .delete-button {
            width: 37px;
            height: 37px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          }


          .read-button {
            border: 1px solid #dcfce7;
            background: #f0fdf4;
            color: #16a34a;
          }


          .delete-button {
            border: 1px solid #fee2e2;
            background: #fff7f7;
            color: #ef4444;
          }


          .read-button:hover {
            background: #dcfce7;
          }


          .delete-button:hover {
            background: #fee2e2;
          }


          /* EMPTY */

          .notification-empty {
            min-height: 210px;
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


          .notification-empty h3 {
            margin: 10px 0 5px;
            color: #334155;
            font-size: 16px;
          }


          .notification-empty p {
            margin: 0;
            font-size: 13px;
          }


          /* FOOTER */

          .notification-footer {
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

            .notification-page {
              padding: 25px 18px 45px;
            }


            .notification-header h1 {
              font-size: 32px;
            }


            .notification-summary {
              flex-wrap: wrap;
            }


            .notification-summary > div {
              flex: 1;
              min-width: 100px;
            }


            .refresh-button {
              margin-left: 0;
            }


            .notification-card {
              align-items: flex-start;
              padding: 13px;
            }


            .notification-icon {
              width: 43px;
              height: 43px;
              font-size: 19px;
            }


            .notification-actions {
              flex-direction: column;
            }


          }

        `}</style>

      </div>

    </DashboardLayout>
  );
}

export default Notifications;