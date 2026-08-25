import { useEffect, useState } from "react";
import {
  FiClock,
  FiMapPin,
  FiNavigation,
  FiArrowRight,
} from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../Services/api";

function getTransportIcon(transport) {
  switch (transport) {
    case "Walk":
      return "🚶";

    case "Bus":
      return "🚌";

    case "Metro":
      return "🚇";

    case "Auto":
      return "🛺";

    default:
      return "🚶";
  }
}

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/trips");

      console.log("My Trips:", response.data);

      setTrips(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {
      console.error(
        "Failed to load trips:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to load your trips."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>

      <section className="dashboard-section">

        {/* Header */}

        <div className="section-heading">

          <div>

            <span className="section-label">
              HISTORY
            </span>

            <h2>
              My Trips
            </h2>

            <p>
              Your saved journeys
            </p>

          </div>

        </div>


        {/* Loading */}

        {loading && (
          <div className="dashboard-panel">
            <p>Loading your trips...</p>
          </div>
        )}


        {/* Error */}

        {!loading && error && (
          <div className="dashboard-panel">

            <p className="error-message">
              {error}
            </p>

            <button
              className="choose-route-button"
              onClick={loadTrips}
            >
              Try again
            </button>

          </div>
        )}


        {/* Empty */}

        {!loading &&
          !error &&
          trips.length === 0 && (

            <div className="dashboard-panel">

              <FiNavigation />

              <h3>
                No trips saved yet
              </h3>

              <p>
                Search for a route and choose a
                route to see it here.
              </p>

            </div>

          )}


        {/* Trips */}

        {!loading &&
          !error &&
          trips.length > 0 && (

            <div className="routes-grid">

              {trips.map((trip) => (

                <div
                  className="route-card"
                  key={trip.id}
                >

                  {/* Top */}

                  <div className="route-top">

                    <div className="transport-icons">

                      {Array.isArray(
                        trip.transport
                      ) ? (

                        trip.transport.map(
                          (transport, index) => (

                            <div
                              className="transport-item"
                              key={`${transport}-${index}`}
                            >

                              <span className="transport-icon">
                                {getTransportIcon(
                                  transport
                                )}
                              </span>

                              {index <
                                trip.transport.length -
                                  1 && (
                                <FiArrowRight
                                  className="route-arrow"
                                />
                              )}

                            </div>

                          )
                        )

                      ) : (

                        <span>
                          🚶
                        </span>

                      )}

                    </div>


                    <div className="route-price">

                      ₹{trip.cost}

                    </div>

                  </div>


                  {/* Journey */}

                  <div className="trip-info">

                    <h3>

                      {trip.fromLocation}

                      {" → "}

                      {trip.toLocation}

                    </h3>

                  </div>


                  {/* Details */}

                  <div className="route-details">

                    <div>

                      <FiClock />

                      <span>
                        {trip.duration}
                      </span>

                    </div>


                    <div>

                      <FiMapPin />

                      <span>
                        {trip.walking} walking
                      </span>

                    </div>


                    <div>

                      <FiNavigation />

                      <span>
                        {trip.changes} changes
                      </span>

                    </div>

                  </div>


                  {/* Transport */}

                  <div className="trip-transport">

                    {Array.isArray(
                      trip.transport
                    )
                      ? trip.transport.join(
                          " → "
                        )
                      : trip.transport}

                  </div>

                </div>

              ))}

            </div>

          )}

      </section>

    </DashboardLayout>
  );
}

export default MyTrips;