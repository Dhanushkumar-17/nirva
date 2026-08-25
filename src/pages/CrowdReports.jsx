import { useEffect, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../Services/api";
import {
  FiUsers,
  FiMapPin,
  FiSend,
} from "react-icons/fi";

function CrowdReports() {
  const [transport, setTransport] = useState("Metro");
  const [location, setLocation] = useState("");
  const [crowdLevel, setCrowdLevel] = useState("Moderate");

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const response = await api.get("/crowd-reports");
      setReports(response.data);
    } catch (error) {
      console.error("Failed to load reports:", error);
    }
  };

  const submitReport = async (event) => {
    event.preventDefault();

    if (!location.trim()) {
      setMessage("Please enter a location.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await api.post("/crowd-reports", {
        transport,
        location,
        crowdLevel,
      });

      setMessage("Crowd report submitted successfully! 👥");

      setLocation("");

      await loadReports();

    } catch (error) {
      console.error("Crowd report error:", error);
      setMessage("Unable to submit crowd report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>

      <section className="dashboard-section">

        <div className="section-heading">

          <div>
            <span className="section-label">
              COMMUNITY REPORTS
            </span>

            <h2>
              Crowd Reports
            </h2>

            <p>
              Help Bengaluru commuters know how crowded
              public transport is.
            </p>
          </div>

          <FiUsers size={30} />

        </div>


        {/* Report Form */}

        <div className="dashboard-panel">

          <h3>
            Report current crowd level
          </h3>

          <form onSubmit={submitReport}>

            <label>
              Transport
            </label>

            <select
              value={transport}
              onChange={(event) =>
                setTransport(event.target.value)
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
            </select>


            <label>
              Location
            </label>

            <div className="location-input">

              <FiMapPin />

              <input
                type="text"
                value={location}
                onChange={(event) =>
                  setLocation(event.target.value)
                }
                placeholder="Example: Majestic"
              />

            </div>


            <label>
              Crowd level
            </label>

            <div className="preference-row">

              <button
                type="button"
                className={
                  crowdLevel === "Low"
                    ? "preference active"
                    : "preference"
                }
                onClick={() =>
                  setCrowdLevel("Low")
                }
              >
                🟢 Low
              </button>

              <button
                type="button"
                className={
                  crowdLevel === "Moderate"
                    ? "preference active"
                    : "preference"
                }
                onClick={() =>
                  setCrowdLevel("Moderate")
                }
              >
                🟡 Moderate
              </button>

              <button
                type="button"
                className={
                  crowdLevel === "High"
                    ? "preference active"
                    : "preference"
                }
                onClick={() =>
                  setCrowdLevel("High")
                }
              >
                🔴 High
              </button>

            </div>


            <button
              type="submit"
              className="choose-route-button"
              disabled={loading}
            >
              <FiSend />

              {loading
                ? "Submitting..."
                : "Submit report"}
            </button>

          </form>


          {message && (
            <p className="success-message">
              {message}
            </p>
          )}

        </div>

      </section>


      {/* Existing Reports */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>
            <span className="section-label">
              LIVE COMMUNITY DATA
            </span>

            <h3>
              Recent reports
            </h3>
          </div>

        </div>


        <div className="routes-grid">

          {reports.map((report) => (

            <div
              className="route-card"
              key={report.id}
            >

              <div className="route-top">

                <div>
                  <span className="section-label">
                    {report.transport}
                  </span>

                  <h3>
                    {report.location}
                  </h3>
                </div>

                <FiUsers size={24} />

              </div>


              <div className="route-details">

                <div>
                  <FiMapPin />

                  <span>
                    {report.location}
                  </span>
                </div>

                <div>
                  <FiUsers />

                  <span>
                    {report.crowdLevel} crowd
                  </span>
                </div>

              </div>


              <div className="crowd-level">
                {report.crowdLevel === "Low" && "🟢 Low"}
                {report.crowdLevel === "Moderate" && "🟡 Moderate"}
                {report.crowdLevel === "High" && "🔴 High"}
              </div>

            </div>

          ))}

        </div>


        {reports.length === 0 && (
          <div className="dashboard-panel">
            <p>
              No crowd reports yet.
            </p>
          </div>
        )}

      </section>

    </DashboardLayout>
  );
}

export default CrowdReports;