import RouteDetails from "../components/RouteDetails";
import { useState } from "react";

import {
  FiArrowRight,
  FiClock,
  FiMapPin,
  FiNavigation,
  FiSearch,
} from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";

function TripPlanner() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [preference, setPreference] = useState("FASTEST");
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [error, setError] = useState("");

  const demoRoutes = [
    {
      id: 1,
      route: ["🚶", "🚌", "🚇", "🚶"],
      duration: 46,
      cost: 45,
      walking: "650m",
      changes: 2,
    },
    {
      id: 2,
      route: ["🚶", "🚇", "🚶", "🚌"],
      duration: 52,
      cost: 38,
      walking: "800m",
      changes: 2,
    },
    {
      id: 3,
      route: ["🚶", "🚌", "🛺"],
      duration: 58,
      cost: 55,
      walking: "1.2km",
      changes: 1,
    },
  ];

  const findRoutes = () => {
    setError("");

    if (!from.trim() || !to.trim()) {
      setError("Please enter both starting point and destination.");
      setRoutes([]);
      return;
    }

    let sortedRoutes = [...demoRoutes];

    if (preference === "FASTEST") {
      sortedRoutes.sort(
        (a, b) => a.duration - b.duration
      );
    }

    if (preference === "CHEAPEST") {
      sortedRoutes.sort(
        (a, b) => a.cost - b.cost
      );
    }

    if (preference === "LESS_WALKING") {
      sortedRoutes.sort(
        (a, b) =>
          parseFloat(a.walking) -
          parseFloat(b.walking)
      );
    }

    setRoutes(sortedRoutes);
  };

  return (
    <DashboardLayout>
   {selectedRoute ? (
      <RouteDetails
        route={selectedRoute}
        from={from}
        to={to}
        onBack={() => setSelectedRoute(null)}
      />
    ):(
      <div className="planner-page">

        {/* Header */}

        <div className="page-header">

          <div>
            <span className="section-label">
              SMART TRIP PLANNER
            </span>

            <h1>
              Plan your journey
            </h1>

            <p>
              Find the best way to travel around Bengaluru.
            </p>
          </div>

          <div className="planner-score">
            <FiNavigation />
            Smart routing
          </div>

        </div>


        {/* Search Card */}

        <section className="planner-card">

          <div className="planner-card-title">
            <FiSearch />

            <div>
              <h2>
                Where do you want to go?
              </h2>

              <p>
                Enter your starting point and destination.
              </p>
            </div>
          </div>


          <div className="planner-inputs">

            {/* FROM */}

            <div className="planner-input">

              <div className="planner-input-icon">
                <FiMapPin />
              </div>

              <div>
                <label>
                  From
                </label>

                <input
                  type="text"
                  value={from}
                  onChange={(event) =>
                    setFrom(event.target.value)
                  }
                  placeholder="e.g. Central Silk Board"
                />
              </div>

            </div>


            {/* ARROW */}

            <div className="planner-arrow">
              <FiArrowRight />
            </div>


            {/* TO */}

            <div className="planner-input">

              <div className="planner-input-icon destination">
                <FiMapPin />
              </div>

              <div>
                <label>
                  To
                </label>

                <input
                  type="text"
                  value={to}
                  onChange={(event) =>
                    setTo(event.target.value)
                  }
                  placeholder="e.g. Majestic"
                />
              </div>

            </div>

          </div>


          {/* Preferences */}

          <div className="planner-preferences">

            <span>
              Travel preference
            </span>

            <button
              className={
                preference === "FASTEST"
                  ? "planner-preference active"
                  : "planner-preference"
              }
              onClick={() =>
                setPreference("FASTEST")
              }
            >
              Fastest
            </button>

            <button
              className={
                preference === "CHEAPEST"
                  ? "planner-preference active"
                  : "planner-preference"
              }
              onClick={() =>
                setPreference("CHEAPEST")
              }
            >
              Cheapest
            </button>

            <button
              className={
                preference === "LESS_WALKING"
                  ? "planner-preference active"
                  : "planner-preference"
              }
              onClick={() =>
                setPreference("LESS_WALKING")
              }
            >
              Less walking
            </button>

          </div>


          {/* Error */}

          {error && (
            <p className="planner-error">
              {error}
            </p>
          )}


          {/* Search Button */}

          <button
            className="planner-search-button"
            onClick={findRoutes}
          >
            Find routes
            <FiArrowRight />
          </button>

        </section>


        {/* Results */}

        {routes.length > 0 && (

          <section className="planner-results">

            <div className="results-header">

              <div>
                <span className="section-label">
                  ROUTE RESULTS
                </span>

                <h2>
                  Recommended routes
                </h2>

                <p>
                  {from} → {to}
                </p>
              </div>

              <span className="result-count">
                {routes.length} routes found
              </span>

            </div>


            <div className="planner-route-list">

              {routes.map((route, index) => (

                <div
                  className={
                    index === 0
                      ? "planner-route recommended-route"
                      : "planner-route"
                  }
                  key={route.id}
                >

                  {index === 0 && (
                    <span className="route-recommended">
                      Recommended
                    </span>
                  )}


                  <div className="planner-route-top">

                    <div className="planner-transport">

                      {route.route.map(
                        (transport, transportIndex) => (
                          <div
                            className="planner-transport-item"
                            key={`${route.id}-${transportIndex}`}
                          >
                            <span>
                              {transport}
                            </span>

                            {transportIndex <
                              route.route.length - 1 && (
                              <FiArrowRight />
                            )}

                          </div>
                        )
                      )}

                    </div>


                    <div className="planner-cost">
                      ₹{route.cost}
                    </div>

                  </div>


                  <div className="planner-route-details">

                    <div>
                      <FiClock />
                      {route.duration} min
                    </div>

                    <div>
                      <FiMapPin />
                      {route.walking} walking
                    </div>

                    <div>
                      <FiNavigation />
                      {route.changes} changes
                    </div>

                  </div>


                  <button className="view-route">
                    View route
                    <FiArrowRight />
                  </button>

                </div>

              ))}

            </div>

          </section>

        )}

      </div>
    )}</DashboardLayout>
    );
}

export default TripPlanner;