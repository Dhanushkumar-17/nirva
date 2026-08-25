import { useEffect, useState } from "react";
import {
  FiAlertTriangle,
  FiMapPin,
  FiSend,
  FiTrash2,
  FiInfo,
} from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../Services/api";

function getIssueIcon(issueType) {
  switch (issueType) {
    case "Pothole":
      return "🕳️";

    case "Road Damage":
      return "🚧";

    case "Traffic Signal":
      return "🚦";

    case "Water Logging":
      return "💧";

    case "Accident":
      return "⚠️";

    default:
      return "❗";
  }
}

function RoadIssues() {

  const [issueType, setIssueType] =
    useState("Pothole");

  const [location, setLocation] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [issues, setIssues] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [loadingIssues, setLoadingIssues] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");


  // ==========================================
  // LOAD ISSUES
  // ==========================================

  useEffect(() => {
    loadIssues();
  }, []);


  const loadIssues = async () => {

    try {

      setLoadingIssues(true);
      setError("");

      const response =
        await api.get("/road-issues");

      setIssues(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {

      console.error(
        "Failed to load road issues:",
        error
      );

      setError(
        "Unable to load road issues."
      );

    } finally {

      setLoadingIssues(false);

    }
  };


  // ==========================================
  // SUBMIT ISSUE
  // ==========================================

  const submitIssue = async (event) => {

    event.preventDefault();

    if (!location.trim()) {

      setMessage(
        "Please enter the location."
      );

      return;
    }

    setLoading(true);
    setMessage("");
    setError("");


    try {

      await api.post(
        "/road-issues",
        {
          issueType,
          location: location.trim(),
          description: description.trim(),
          status: "Reported",
        }
      );


      setMessage(
        "Road issue reported successfully! 🚧"
      );

      setLocation("");
      setDescription("");

      await loadIssues();


      setTimeout(() => {
        setMessage("");
      }, 3000);


    } catch (error) {

      console.error(
        "Road issue error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to submit road issue."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // DELETE ISSUE
  // ==========================================

  const deleteIssue = async (id) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this road issue?"
      );

    if (!confirmed) {
      return;
    }


    try {

      await api.delete(
        `/road-issues/${id}`
      );


      setIssues((current) =>
        current.filter(
          (issue) =>
            issue.id !== id
        )
      );


    } catch (error) {

      console.error(
        "Delete issue error:",
        error
      );

      alert(
        "Unable to delete road issue."
      );

    }
  };


  return (

    <DashboardLayout>

      <div className="road-page">


        {/* ==================================
            PAGE HEADER
        ================================== */}

        <section className="road-header">

          <div>

            <span className="road-label">
              COMMUNITY REPORTS
            </span>

            <h1>
              Road Issues
            </h1>

            <p>
              Report potholes, damaged roads and
              other problems around Bengaluru.
            </p>

          </div>


          <div className="road-header-icon">

            <FiAlertTriangle />

          </div>

        </section>


        {/* ==================================
            REPORT FORM
        ================================== */}

        <section className="road-form-card">


          {/* FORM TITLE */}

          <div className="road-form-header">

            <div className="road-form-icon">

              <FiAlertTriangle />

            </div>


            <div>

              <h2>
                Report a road issue
              </h2>

              <p>
                Help other commuters travel safely.
              </p>

            </div>

          </div>


          <form
            onSubmit={submitIssue}
            className="road-form"
          >


            {/* ISSUE TYPE */}

            <div className="road-field">

              <label>
                Issue type
              </label>

              <select
                value={issueType}
                onChange={(event) =>
                  setIssueType(
                    event.target.value
                  )
                }
              >

                <option value="Pothole">
                  🕳️ Pothole
                </option>

                <option value="Road Damage">
                  🚧 Road Damage
                </option>

                <option value="Traffic Signal">
                  🚦 Traffic Signal
                </option>

                <option value="Water Logging">
                  💧 Water Logging
                </option>

                <option value="Accident">
                  ⚠️ Accident
                </option>

                <option value="Other">
                  ❗ Other
                </option>

              </select>

            </div>


            {/* LOCATION */}

            <div className="road-field">

              <label>
                Location
              </label>

              <div className="road-location">

                <FiMapPin />

                <input
                  type="text"
                  value={location}
                  onChange={(event) =>
                    setLocation(
                      event.target.value
                    )
                  }
                  placeholder="Example: Silk Board"
                />

              </div>

            </div>


            {/* DESCRIPTION */}

            <div className="road-field">

              <label>
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                placeholder="Describe the problem..."
                rows="5"
              />

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              className="road-submit"
              disabled={loading}
            >

              <FiSend />

              {loading
                ? "Submitting..."
                : "Report issue"}

            </button>


          </form>


          {/* MESSAGE */}

          {message && (

            <div className="road-success">
              ✓ {message}
            </div>

          )}


          {error && (

            <div className="road-error">
              {error}
            </div>

          )}

        </section>


        {/* ==================================
            REPORTED ISSUES
        ================================== */}

        <section className="reported-section">


          {/* SECTION HEADER */}

          <div className="reported-header">

            <div>

              <span className="road-label">
                LIVE COMMUNITY DATA
              </span>

              <h2>
                Reported road issues
              </h2>

            </div>


            <div className="report-count">

              {issues.length} reports

            </div>

          </div>


          {/* LOADING */}

          {loadingIssues && (

            <div className="empty-card">

              <p>
                Loading road issues...
              </p>

            </div>

          )}


          {/* ERROR */}

          {!loadingIssues &&
            error &&
            issues.length === 0 && (

              <div className="empty-card">

                <p>
                  {error}
                </p>

                <button
                  className="retry-button"
                  onClick={loadIssues}
                >
                  Try again
                </button>

              </div>

            )}


          {/* EMPTY */}

          {!loadingIssues &&
            !error &&
            issues.length === 0 && (

              <div className="empty-card">

                <FiAlertTriangle size={30} />

                <h3>
                  No road issues reported
                </h3>

                <p>
                  Be the first person to report
                  a problem.
                </p>

              </div>

            )}


          {/* ISSUE LIST */}

          {!loadingIssues &&
            issues.length > 0 && (

              <div className="issue-list">

                {issues.map((issue) => (

                  <div
                    className="issue-card"
                    key={issue.id}
                  >


                    {/* ICON */}

                    <div className="issue-icon">

                      {getIssueIcon(
                        issue.issueType
                      )}

                    </div>


                    {/* CONTENT */}

                    <div className="issue-content">

                      <div className="issue-title-row">

                        <h3>
                          {issue.issueType}
                        </h3>

                        <span className="status-badge">
                          {issue.status ||
                            "Reported"}
                        </span>

                      </div>


                      <div className="issue-location">

                        <FiMapPin />

                        <span>
                          {issue.location}
                        </span>

                      </div>


                      {issue.description && (

                        <p>
                          {issue.description}
                        </p>

                      )}

                    </div>


                    {/* DELETE */}

                    <button
                      type="button"
                      className="delete-button"
                      onClick={() =>
                        deleteIssue(
                          issue.id
                        )
                      }
                      title="Delete issue"
                    >

                      <FiTrash2 />

                    </button>

                  </div>

                ))}

              </div>

            )}


          {/* FOOTER MESSAGE */}

          {!loadingIssues &&
            issues.length > 0 && (

              <div className="road-footer-message">

                <FiInfo />

                <span>
                  Thank you for helping make
                  Bengaluru safer for everyone!
                </span>

              </div>

            )}

        </section>


        {/* ==================================
            PAGE CSS
        ================================== */}

        <style>{`

          /* ================================
             PAGE
          ================================= */

          .road-page {
            width: 100%;
            max-width: 1050px;
            margin: 0 auto;
            padding: 38px 32px 60px;
          }


          /* ================================
             HEADER
          ================================= */

          .road-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 28px;
          }


          .road-label {
            display: block;
            color: #718096;
            font-size: 10px;
            font-weight: 800;
            letter-spacing: 1.5px;
          }


          .road-header h1 {
            margin: 7px 0 8px;
            color: #111827;
            font-size: 40px;
            line-height: 1.1;
          }


          .road-header p {
            margin: 0;
            color: #64748b;
            font-size: 17px;
          }


          .road-header-icon {
            width: 58px;
            height: 58px;
            border-radius: 18px;

            background: #fff7ed;
            color: #f97316;

            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 30px;

            flex-shrink: 0;
          }


          /* ================================
             FORM CARD
          ================================= */

          .road-form-card {
            background: #ffffff;

            border: 1px solid #e2e8f0;

            border-radius: 17px;

            padding: 30px;

            box-shadow:
              0 5px 18px rgba(
                15,
                23,
                42,
                0.04
              );

            margin-bottom: 38px;
          }


          /* ================================
             FORM HEADER
          ================================= */

          .road-form-header {
            display: flex;
            align-items: center;
            gap: 16px;

            margin-bottom: 28px;
          }


          .road-form-icon {
            width: 54px;
            height: 54px;

            border-radius: 15px;

            background: #fff7ed;

            color: #f97316;

            display: flex;
            align-items: center;
            justify-content: center;

            font-size: 25px;

            flex-shrink: 0;
          }


          .road-form-header h2 {
            margin: 0 0 5px;

            color: #111827;

            font-size: 22px;
          }


          .road-form-header p {
            margin: 0;

            color: #64748b;

            font-size: 14px;
          }


          /* ================================
             FORM
          ================================= */

          .road-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }


          .road-field {
            display: flex;
            flex-direction: column;
            gap: 8px;
          }


          .road-field label {
            color: #172033;

            font-size: 13px;

            font-weight: 600;
          }


          .road-field select {
            width: 100%;

            height: 52px;

            padding: 0 15px;

            border: 1px solid #dbe3ec;

            border-radius: 11px;

            background: #ffffff;

            color: #172033;

            font-size: 15px;

            outline: none;

            cursor: pointer;
          }


          .road-field select:focus {
            border-color: #111827;
          }


          /* ================================
             LOCATION
          ================================= */

          .road-location {
            width: 100%;

            height: 52px;

            display: flex;
            align-items: center;

            gap: 11px;

            padding: 0 15px;

            border: 1px solid #dbe3ec;

            border-radius: 11px;

            color: #64748b;

            background: #ffffff;
          }


          .road-location:focus-within {
            border-color: #111827;
          }


          .road-location input {
            width: 100%;

            height: 100%;

            border: none;

            outline: none;

            font-size: 15px;

            color: #172033;

            background: transparent;
          }


          .road-location input::placeholder {
            color: #94a3b8;
          }


          /* ================================
             DESCRIPTION
          ================================= */

          .road-field textarea {
            width: 100%;

            min-height: 125px;

            padding: 14px 15px;

            border: 1px solid #dbe3ec;

            border-radius: 11px;

            resize: vertical;

            outline: none;

            font-family: inherit;

            font-size: 15px;

            line-height: 1.5;

            color: #172033;
          }


          .road-field textarea:focus {
            border-color: #111827;
          }


          .road-field textarea::placeholder {
            color: #94a3b8;
          }


          /* ================================
             SUBMIT BUTTON
          ================================= */

          .road-submit {
            width: 100%;

            height: 53px;

            margin-top: 2px;

            border: none;

            border-radius: 10px;

            background: #111827;

            color: #ffffff;

            display: flex;

            align-items: center;

            justify-content: center;

            gap: 9px;

            font-size: 15px;

            font-weight: 700;

            cursor: pointer;

            transition: 0.2s;
          }


          .road-submit:hover {
            background: #1f2937;

            transform: translateY(-1px);
          }


          .road-submit:disabled {
            opacity: 0.6;

            cursor: not-allowed;

            transform: none;
          }


          /* ================================
             MESSAGES
          ================================= */

          .road-success {
            margin-top: 18px;

            padding: 12px 15px;

            border-radius: 9px;

            background: #ecfdf5;

            color: #059669;

            font-size: 13px;

            font-weight: 600;
          }


          .road-error {
            margin-top: 18px;

            padding: 12px 15px;

            border-radius: 9px;

            background: #fef2f2;

            color: #dc2626;

            font-size: 13px;

            font-weight: 600;
          }


          /* ================================
             REPORTED SECTION
          ================================= */

          .reported-section {
            width: 100%;
          }


          .reported-header {
            display: flex;

            align-items: flex-end;

            justify-content: space-between;

            margin-bottom: 17px;
          }


          .reported-header h2 {
            margin: 6px 0 0;

            color: #111827;

            font-size: 25px;
          }


          .report-count {
            padding: 8px 15px;

            border: 1px solid #dbe3ec;

            border-radius: 30px;

            color: #172033;

            background: #ffffff;

            font-size: 13px;

            font-weight: 600;
          }


          /* ================================
             ISSUE LIST
          ================================= */

          .issue-list {
            display: flex;

            flex-direction: column;

            gap: 11px;
          }


          /* ================================
             ISSUE CARD
          ================================= */

          .issue-card {
            min-height: 110px;

            display: flex;

            align-items: center;

            gap: 17px;

            padding: 17px 18px;

            background: #ffffff;

            border: 1px solid #e2e8f0;

            border-radius: 15px;

            box-shadow:
              0 3px 12px rgba(
                15,
                23,
                42,
                0.035
              );

            transition: 0.2s;
          }


          .issue-card:hover {
            transform: translateY(-1px);

            box-shadow:
              0 6px 18px rgba(
                15,
                23,
                42,
                0.07
              );
          }


          /* ================================
             ISSUE ICON
          ================================= */

          .issue-icon {
            width: 62px;

            height: 62px;

            border-radius: 15px;

            background: #f8fafc;

            display: flex;

            align-items: center;

            justify-content: center;

            font-size: 27px;

            flex-shrink: 0;
          }


          /* ================================
             ISSUE CONTENT
          ================================= */

          .issue-content {
            flex: 1;

            min-width: 0;
          }


          .issue-title-row {
            display: flex;

            align-items: center;

            gap: 10px;

            margin-bottom: 7px;
          }


          .issue-title-row h3 {
            margin: 0;

            color: #111827;

            font-size: 16px;
          }


          .status-badge {
            padding: 4px 10px;

            border-radius: 20px;

            background: #ecfdf5;

            color: #059669;

            font-size: 10px;

            font-weight: 700;
          }


          .issue-location {
            display: flex;

            align-items: center;

            gap: 6px;

            color: #64748b;

            font-size: 13px;
          }


          .issue-content p {
            margin: 7px 0 0;

            color: #718096;

            font-size: 13px;

            line-height: 1.4;
          }


          /* ================================
             DELETE
          ================================= */

          .delete-button {
            width: 40px;

            height: 40px;

            border: 1px solid #fee2e2;

            border-radius: 10px;

            background: #fff7f7;

            color: #ef4444;

            display: flex;

            align-items: center;

            justify-content: center;

            cursor: pointer;

            flex-shrink: 0;

            transition: 0.2s;
          }


          .delete-button:hover {
            background: #fee2e2;
          }


          /* ================================
             EMPTY
          ================================= */

          .empty-card {
            min-height: 180px;

            background: #ffffff;

            border: 1px solid #e2e8f0;

            border-radius: 15px;

            display: flex;

            flex-direction: column;

            align-items: center;

            justify-content: center;

            text-align: center;

            color: #94a3b8;
          }


          .empty-card h3 {
            margin: 10px 0 4px;

            color: #334155;
          }


          .empty-card p {
            margin: 0;

            font-size: 13px;
          }


          .retry-button {
            margin-top: 15px;

            padding: 9px 16px;

            border: none;

            border-radius: 8px;

            background: #111827;

            color: white;

            cursor: pointer;
          }


          /* ================================
             FOOTER
          ================================= */

          .road-footer-message {
            min-height: 52px;

            margin-top: 18px;

            border: 1px solid #dbe3ec;

            border-radius: 12px;

            display: flex;

            align-items: center;

            justify-content: center;

            gap: 9px;

            color: #64748b;

            font-size: 13px;

            background: #ffffff;
          }


          /* ================================
             RESPONSIVE
          ================================= */

          @media (max-width: 700px) {

            .road-page {
              padding: 25px 18px 45px;
            }


            .road-header h1 {
              font-size: 32px;
            }


            .road-header p {
              font-size: 14px;

              max-width: 270px;
            }


            .road-form-card {
              padding: 20px;
            }


            .road-form-header h2 {
              font-size: 18px;
            }


            .issue-card {
              align-items: flex-start;

              padding: 14px;
            }


            .issue-icon {
              width: 48px;

              height: 48px;

              font-size: 21px;
            }


            .issue-title-row {
              flex-wrap: wrap;
            }


            .delete-button {
              width: 35px;

              height: 35px;
            }


            .reported-header {
              align-items: flex-start;

              gap: 12px;

              flex-direction: column;
            }

          }

        `}</style>

      </div>

    </DashboardLayout>
  );
}

export default RoadIssues;