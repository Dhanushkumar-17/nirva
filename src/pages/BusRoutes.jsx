import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";

import {
  FiArrowRight,
  FiClock,
  FiMapPin,
  FiSearch,
} from "react-icons/fi";


const busData = [
  {
    number: "500D",
    from: "BTM Layout",
    to: "Majestic",
    duration: "42 min",
    fare: 25,
    stops: 12,
  },
  {
    number: "201R",
    from: "Koramangala",
    to: "Majestic",
    duration: "38 min",
    fare: 20,
    stops: 10,
  },
  {
    number: "356",
    from: "Silk Board",
    to: "Shivajinagar",
    duration: "55 min",
    fare: 30,
    stops: 16,
  },
  {
    number: "500",
    from: "HSR Layout",
    to: "KR Market",
    duration: "48 min",
    fare: 25,
    stops: 14,
  },
];


function BusRoutes() {

  const [search, setSearch] = useState("");

  const [selectedRoute, setSelectedRoute] =
    useState(null);


  const filteredBuses = busData.filter((bus) => {

    const value = search.toLowerCase().trim();

    return (
      bus.number.toLowerCase().includes(value) ||
      bus.from.toLowerCase().includes(value) ||
      bus.to.toLowerCase().includes(value)
    );

  });


  /*
   * ================================
   * BUS ROUTE DETAILS
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
            ← Back to bus routes
          </button>


          {/* Details */}

          <div className="dashboard-panel">

            <span className="section-label">
              BUS ROUTE DETAILS
            </span>


            <h2>
              🚌 {selectedRoute.number}
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
                BMTC Bus
                {" → "}
                {selectedRoute.to}
              </p>

            </div>


            {/* Choose route */}

            <button
              className="choose-route-button"
              onClick={() => {

                localStorage.setItem(
                  "nirva_selected_bus",
                  JSON.stringify(selectedRoute)
                );

                alert(
                  "Bus route selected successfully!"
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
   * BUS ROUTE LIST
   * ================================
   */

  return (

    <DashboardLayout>

      {/* Header */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <span className="section-label">
              BENGALURU BUS NETWORK
            </span>

            <h2>
              Bus Routes
            </h2>

            <p>
              Find buses and plan your journey around Bengaluru.
            </p>

          </div>

        </div>


        {/* Search */}

        <div className="trip-search-card">

          <div className="search-card-header">

            <div>

              <span className="section-label">
                SEARCH BUS
              </span>

              <h3>
                Find a bus route
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
                  placeholder="Bus number or destination"
                />

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* Bus results */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <span className="section-label">
              AVAILABLE BUSES
            </span>

            <h3>
              {filteredBuses.length} buses found
            </h3>

          </div>

        </div>


        <div className="routes-grid">

          {filteredBuses.map((bus) => (

            <div
              className="route-card"
              key={bus.number}
            >

              {/* Top */}

              <div className="route-top">

                <div>

                  <span className="section-label">
                    BUS
                  </span>

                  <h2>
                    🚌 {bus.number}
                  </h2>

                </div>


                <div className="route-price">
                  ₹{bus.fare}
                </div>

              </div>


              {/* From → To */}

              <div className="trip-info">

                <strong>
                  {bus.from}
                </strong>

                <FiArrowRight />

                <strong>
                  {bus.to}
                </strong>

              </div>


              {/* Details */}

              <div className="route-details">

                <div>

                  <FiClock />

                  <span>
                    {bus.duration}
                  </span>

                </div>


                <div>

                  <FiMapPin />

                  <span>
                    {bus.stops} stops
                  </span>

                </div>

              </div>


              {/* View route */}

              <button
                className="choose-route-button"
                onClick={() =>
                  setSelectedRoute(bus)
                }
              >
                View route

                <FiArrowRight />

              </button>

            </div>

          ))}

        </div>


        {/* No buses */}

        {filteredBuses.length === 0 && (

          <div className="dashboard-panel">

            <h3>
              No buses found
            </h3>

            <p>
              Try searching for another bus number
              or destination.
            </p>

          </div>

        )}

      </section>

    </DashboardLayout>

  );

}


export default BusRoutes;