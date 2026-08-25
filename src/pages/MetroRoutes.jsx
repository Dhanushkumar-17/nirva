import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

import {
  FiArrowRight,
  FiClock,
  FiMapPin,
  FiSearch,
} from "react-icons/fi";


const metroData = [
  {
    line: "Purple Line",
    from: "Majestic",
    to: "Indiranagar",
    duration: "18 min",
    fare: 30,
    stops: 6,
  },
  {
    line: "Green Line",
    from: "Majestic",
    to: "Yelachenahalli",
    duration: "25 min",
    fare: 35,
    stops: 9,
  },
  {
    line: "Purple Line",
    from: "Whitefield",
    to: "MG Road",
    duration: "32 min",
    fare: 40,
    stops: 11,
  },
  {
    line: "Green Line",
    from: "Yeshwanthpur",
    to: "Nagasandra",
    duration: "20 min",
    fare: 25,
    stops: 7,
  },
];


function MetroRoutes() {

  const [search, setSearch] = useState("");

  const [selectedRoute, setSelectedRoute] =
    useState(null);


  const filteredMetro = metroData.filter((metro) => {

    const value = search.toLowerCase().trim();

    return (
      metro.line.toLowerCase().includes(value) ||
      metro.from.toLowerCase().includes(value) ||
      metro.to.toLowerCase().includes(value)
    );

  });


  /*
   * ================================
   * ROUTE DETAILS PAGE
   * ================================
   */

  if (selectedRoute) {

    return (
      <DashboardLayout>

        <section className="dashboard-section">

          {/* Back button */}

          <button
            className="text-button"
            onClick={() => setSelectedRoute(null)}
          >
            ← Back to metro routes
          </button>


          {/* Route details */}

          <div className="dashboard-panel">

            <span className="section-label">
              METRO ROUTE DETAILS
            </span>


            <h2>
              🚇 {selectedRoute.line}
            </h2>


            <div className="trip-info">

              <strong>
                {selectedRoute.from}
              </strong>

              <FiArrowRight />

              <strong>
                {selectedRoute.to}
              </strong>

            </div>


            <div className="route-details">

              <div>
                <FiClock />

                <span>
                  {selectedRoute.duration}
                </span>
              </div>


              <div>
                <FiMapPin />

                <span>
                  {selectedRoute.stops} stops
                </span>
              </div>


              <div>

                <span>
                  ₹
                </span>

                <span>
                  {selectedRoute.fare}
                </span>

              </div>

            </div>


            <div style={{ marginTop: "25px" }}>

              <p>
                <strong>
                  Route:
                </strong>
              </p>

              <p>
                {selectedRoute.from}
                {" → "}
                Metro
                {" → "}
                {selectedRoute.to}
              </p>

            </div>


            {/* Choose route */}

            <button
              className="choose-route-button"
              onClick={() => {

                localStorage.setItem(
                  "nirva_selected_metro",
                  JSON.stringify(selectedRoute)
                );

                alert(
                  "Metro route selected successfully!"
                );

              }}
            >
              Choose this route

              <FiArrowRight />

            </button>

          </div>

        </section>

      </DashboardLayout>
    );

  }


  /*
   * ================================
   * METRO ROUTE LIST
   * ================================
   */

  return (

    <DashboardLayout>

      {/* Header */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <span className="section-label">
              BENGALURU METRO NETWORK
            </span>

            <h2>
              Metro Routes
            </h2>

            <p>
              Find metro routes and stations around Bengaluru.
            </p>

          </div>

        </div>


        {/* Search */}

        <div className="trip-search-card">

          <div className="search-card-header">

            <div>

              <span className="section-label">
                SEARCH METRO
              </span>

              <h3>
                Find a metro route
              </h3>

            </div>

          </div>


          <div className="journey-inputs">

            <div className="location-input">

              <div className="location-input-icon from">

                <FiSearch />

              </div>


              <div>

                <span>
                  Search
                </span>


                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Station or line name"
                />

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* Routes */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <span className="section-label">
              AVAILABLE ROUTES
            </span>

            <h3>
              {filteredMetro.length} metro routes found
            </h3>

          </div>

        </div>


        <div className="routes-grid">

          {filteredMetro.map(
            (metro, index) => (

              <div
                className="route-card"
                key={`${metro.line}-${index}`}
              >

                {/* Top */}

                <div className="route-top">

                  <div>

                    <span className="section-label">
                      METRO
                    </span>

                    <h2>
                      🚇 {metro.line}
                    </h2>

                  </div>


                  <div className="route-price">
                    ₹{metro.fare}
                  </div>

                </div>


                {/* From → To */}

                <div className="trip-info">

                  <strong>
                    {metro.from}
                  </strong>

                  <FiArrowRight />

                  <strong>
                    {metro.to}
                  </strong>

                </div>


                {/* Details */}

                <div className="route-details">

                  <div>

                    <FiClock />

                    <span>
                      {metro.duration}
                    </span>

                  </div>


                  <div>

                    <FiMapPin />

                    <span>
                      {metro.stops} stops
                    </span>

                  </div>

                </div>


                {/* View route */}

                <button
                  className="choose-route-button"
                  onClick={() =>
                    setSelectedRoute(metro)
                  }
                >
                  View route

                  <FiArrowRight />

                </button>

              </div>

            )
          )}

        </div>


        {/* No results */}

        {filteredMetro.length === 0 && (

          <div className="dashboard-panel">

            <h3>
              No metro routes found
            </h3>

            <p>
              Try searching for another station or line.
            </p>

          </div>

        )}

      </section>

    </DashboardLayout>

  );

}


export default MetroRoutes;