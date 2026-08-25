import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Services/api";

import {
  FiArrowRight,
  FiClock,
  FiMapPin,
  FiNavigation,
  FiPlus,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";
import RouteCard from "../components/RouteCard";
import StatCard from "../components/StatCard";
import QuickAction from "../components/QuickAction";


// ======================================================
// TRANSPORT ICON
// ======================================================

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


// ======================================================
// DASHBOARD
// ======================================================

function Dashboard() {

  const navigate = useNavigate();


  // ======================================================
  // USER
  // ======================================================

  const [user, setUser] = useState(null);


  // ======================================================
  // JOURNEY
  // ======================================================

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");


  // ======================================================
  // ROUTES
  // ======================================================

  const [routes, setRoutes] = useState([]);

  const [routeLoading, setRouteLoading] =
    useState(false);

  const [routeError, setRouteError] =
    useState("");


  // ======================================================
  // PREFERENCE
  // ======================================================

  const [preference, setPreference] =
    useState("fastest");


  // ======================================================
  // SAVING
  // ======================================================

  const [savingRouteId, setSavingRouteId] =
    useState(null);


  // ======================================================
  // RECENT TRIPS
  // ======================================================

  const [recentTrips, setRecentTrips] =
    useState([]);

  const [tripsLoading, setTripsLoading] =
    useState(true);


  // ======================================================
  // LOGIN CHECK
  // ======================================================

  useEffect(() => {

    const savedUser =
      localStorage.getItem("nirvaUser");


    if (!savedUser) {

      navigate("/login");

      return;
    }


    try {

      setUser(
        JSON.parse(savedUser)
      );

    } catch (error) {

      console.error(
        "Invalid user data:",
        error
      );

      localStorage.removeItem(
        "nirvaUser"
      );

      navigate("/login");

    }

  }, [navigate]);


  // ======================================================
  // LOAD RECENT TRIPS
  // ======================================================

  const loadRecentTrips = async () => {

    try {

      setTripsLoading(true);


      const response =
        await api.get("/trips");


      console.log(
        "Dashboard trips:",
        response.data
      );


      if (Array.isArray(response.data)) {

        // Show latest 3 trips
        const latestTrips =
          [...response.data]
            .reverse()
            .slice(0, 3);


        setRecentTrips(
          latestTrips
        );

      } else {

        setRecentTrips([]);

      }

    } catch (error) {

      console.error(
        "Failed to load recent trips:",
        error
      );

      setRecentTrips([]);

    } finally {

      setTripsLoading(false);

    }

  };


  // ======================================================
  // LOAD TRIPS WHEN DASHBOARD OPENS
  // ======================================================

  useEffect(() => {

    if (user) {

      loadRecentTrips();

    }

  }, [user]);


  // ======================================================
  // FIND ROUTES
  // ======================================================

  const handleFindRoutes = async (
    selectedPreference = preference
  ) => {

    if (
      !from.trim() ||
      !to.trim()
    ) {

      setRouteError(
        "Please enter both starting point and destination."
      );

      return;
    }


    setRouteLoading(true);

    setRouteError("");


    try {

      const response =
        await api.post(
          "/routes/search",
          {
            from: from.trim(),
            to: to.trim(),
            preference:
              selectedPreference,
          },
        );


      console.log(
        "Routes:",
        response.data
      );


      setRoutes(
        response.data.routes || []
      );


    } catch (error) {

      console.error(
        "Route search error:",
        error
      );


      console.error(
        "Backend response:",
        error.response?.data
      );


      setRoutes([]);


      setRouteError(
        error.response?.data?.message ||
        "Unable to find routes."
      );


    } finally {

      setRouteLoading(false);

    }

  };


  // ======================================================
  // CHANGE PREFERENCE
  // ======================================================

  const handlePreferenceChange = (
    selectedPreference
  ) => {

    setPreference(
      selectedPreference
    );


    if (
      from.trim() &&
      to.trim()
    ) {

      handleFindRoutes(
        selectedPreference
      );

    }

  };


  // ======================================================
  // CHOOSE ROUTE
  // ======================================================

  const handleChooseRoute = async (
    route,
    index
  ) => {

    if (savingRouteId !== null) {

      return;

    }


    try {

      setSavingRouteId(
        route.id ?? index
      );


      const numericCost =
        Number(
          String(route.cost)
            .replace("₹", "")
            .replace(",", "")
            .trim()
        );


      const trip = {

        fromLocation:
          from.trim(),

        toLocation:
          to.trim(),

        duration:
          route.duration,

        cost:
          numericCost,

        walking:
          route.walking,

        changes:
          Number(route.changes),

        transport:
          route.transport || [],

      };


      console.log(
        "Saving trip:",
        trip
      );


      const response =
        await api.post(
          "/trips",
          trip
        );


      console.log(
        "Trip saved:",
        response.data
      );


      alert(
        "Trip saved successfully! 🎉"
      );


      // Refresh recent trips
      await loadRecentTrips();


      navigate(
        "/my-trips"
      );


    } catch (error) {

      console.error(
        "Failed to save trip:",
        error
      );


      console.error(
        "Backend response:",
        error.response?.data
      );


      alert(
        error.response?.data?.message ||
        "Unable to save trip."
      );


    } finally {

      setSavingRouteId(null);

    }

  };


  // ======================================================
  // FAVOURITE
  // ======================================================

  const handleFavourite = async () => {

    if (
      !from.trim() ||
      !to.trim()
    ) {

      alert(
        "Please select a route first."
      );

      return;

    }


    try {

      await api.post(
        "/favourites",
        {
          fromLocation:
            from.trim(),

          toLocation:
            to.trim(),
        }
      );


      alert(
        "⭐ Route added to favourites!"
      );


    } catch (error) {

      console.error(
        "Favourite error:",
        error
      );


      alert(
        "Unable to save favourite."
      );

    }

  };


  // ======================================================
  // CURRENT LOCATION
  // ======================================================

  const handleCurrentLocation = () => {

    if (!navigator.geolocation) {

      alert(
        "Geolocation is not supported by your browser."
      );

      return;

    }


    navigator.geolocation.getCurrentPosition(

      (position) => {

        const {
          latitude,
          longitude
        } = position.coords;


        console.log(
          "Latitude:",
          latitude
        );


        console.log(
          "Longitude:",
          longitude
        );


        localStorage.setItem(
          "nirva_latitude",
          latitude.toString()
        );


        localStorage.setItem(
          "nirva_longitude",
          longitude.toString()
        );


        setFrom(
          "Current location"
        );


        alert(
          "Current location detected successfully!"
        );

      },


      (error) => {

        console.error(
          "Location error:",
          error
        );


        if (error.code === 1) {

          alert(
            "Location permission was denied."
          );

        } else if (error.code === 2) {

          alert(
            "Unable to detect your location."
          );

        } else if (error.code === 3) {

          alert(
            "Location request timed out."
          );

        } else {

          alert(
            "Unable to get your current location."
          );

        }

      },


      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }

    );

  };


  // ======================================================
  // LOADING USER
  // ======================================================

  if (!user) {

    return (
      <div>
        Loading...
      </div>
    );

  }


  // ======================================================
  // DASHBOARD
  // ======================================================

  return (

    <DashboardLayout>


      {/* ==================================================
          WELCOME
      ================================================== */}

      <section className="welcome-section">

        <div>

          <p className="welcome-label">
            Wednesday, August 19
          </p>


          <h2>
            Good afternoon, {user.name} 👋
          </h2>


          <p className="welcome-description">
            Find the best way to travel around Bengaluru.
          </p>

        </div>


        <div className="travel-score">

          <div className="score-icon">

            <FiTrendingUp />

          </div>


          <div>

            <span>
              Your travel score
            </span>


            <strong>
              92
            </strong>

          </div>

        </div>

      </section>



      {/* ==================================================
          TRIP SEARCH
      ================================================== */}

      <section className="trip-search-card">

        <div className="search-card-header">

          <div>

            <span className="section-label">
              PLAN YOUR JOURNEY
            </span>


            <h3>
              Where do you want to go?
            </h3>

          </div>


          <button
            type="button"
            className="current-location-button"
            onClick={
              handleCurrentLocation
            }
          >

            <FiNavigation />

            Use current location

          </button>

        </div>


        <div className="journey-inputs">


          {/* FROM */}

          <div className="location-input">

            <div className="location-input-icon from">

              <FiMapPin />

            </div>


            <div>

              <span>
                From
              </span>


              <input
                type="text"
                value={from}
                onChange={(event) =>
                  setFrom(
                    event.target.value
                  )
                }
                placeholder="Enter starting point"
              />

            </div>

          </div>


          {/* ARROW */}

          <div className="journey-arrow">

            <FiArrowRight />

          </div>


          {/* TO */}

          <div className="location-input">

            <div className="location-input-icon to">

              <FiMapPin />

            </div>


            <div>

              <span>
                To
              </span>


              <input
                type="text"
                value={to}
                onChange={(event) =>
                  setTo(
                    event.target.value
                  )
                }
                placeholder="Enter destination"
              />

            </div>

          </div>


          {/* FIND ROUTES */}

          <button
            type="button"
            className="find-route-button"
            onClick={() =>
              handleFindRoutes()
            }
            disabled={routeLoading}
          >

            {routeLoading
              ? "Finding routes..."
              : "Find routes"
            }

            <FiArrowRight />

          </button>

        </div>


        {/* PREFERENCES */}

        <div className="preference-row">

          <span>
            Preferences:
          </span>


          <button
            type="button"
            className={
              preference === "fastest"
                ? "preference active"
                : "preference"
            }
            onClick={() =>
              handlePreferenceChange(
                "fastest"
              )
            }
          >
            Fastest
          </button>


          <button
            type="button"
            className={
              preference === "cheapest"
                ? "preference active"
                : "preference"
            }
            onClick={() =>
              handlePreferenceChange(
                "cheapest"
              )
            }
          >
            Cheapest
          </button>


          <button
            type="button"
            className={
              preference === "less-walking"
                ? "preference active"
                : "preference"
            }
            onClick={() =>
              handlePreferenceChange(
                "less-walking"
              )
            }
          >
            Less walking
          </button>

        </div>

      </section>



      {/* ==================================================
          ERROR
      ================================================== */}

      {routeError && (

        <p className="error-message">

          {routeError}

        </p>

      )}



      {/* ==================================================
          ROUTES
      ================================================== */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <span className="section-label">
              SMART RECOMMENDATIONS
            </span>


            <h3>
              Recommended routes
            </h3>

          </div>


          <button
            type="button"
            className="text-button"
            onClick={() =>
              navigate(
                "/trip-planner"
              )
            }
          >

            View all

            <FiArrowRight />

          </button>

        </div>


        <div className="routes-grid">

          {routes.length > 0 ? (

            routes.map(
              (route, index) => (

                <RouteCard

                  key={
                    route.id ??
                    index
                  }


                  recommended={
                    route.recommended === true
                  }


                  duration={
                    route.duration
                  }


                  cost={
                    route.cost
                  }


                  walking={
                    route.walking
                  }


                  changes={
                    route.changes
                  }


                  route={
                    (
                      route.transport ||
                      []
                    ).map(
                      getTransportIcon
                    )
                  }


                  onChoose={() =>
                    handleChooseRoute(
                      route,
                      index
                    )
                  }


                  onFavourite={() =>
                    handleFavourite(
                      route
                    )
                  }

                />

              )

            )

          ) : (

            <p>
              Enter your starting point
              and destination to find routes.
            </p>

          )}

        </div>

      </section>



      {/* ==================================================
          STATISTICS
      ================================================== */}

      <section className="dashboard-section">

        <div className="section-heading">

          <div>

            <span className="section-label">
              YOUR ACTIVITY
            </span>


            <h3>
              Travel overview
            </h3>

          </div>

        </div>


        <div className="stats-grid">

          <StatCard
            icon={<FiNavigation />}
            title="Total trips"
            value="28"
            description="+12% this month"
          />


          <StatCard
            icon={<span>₹</span>}
            title="Total spent"
            value="₹1,850"
            description="₹420 saved"
          />


          <StatCard
            icon={<FiClock />}
            title="Time saved"
            value="5.6 hrs"
            description="This month"
          />


          <StatCard
            icon={<FiMapPin />}
            title="Walking"
            value="14.2 km"
            description="This month"
          />

        </div>

      </section>



      {/* ==================================================
          BOTTOM SECTION
      ================================================== */}

      <div className="dashboard-bottom-grid">


        {/* =================================================
            RECENT TRIPS - NOW DYNAMIC
        ================================================= */}

        <section className="dashboard-panel">

          <div className="panel-header">

            <div>

              <span className="section-label">
                HISTORY
              </span>


              <h3>
                Recent trips
              </h3>

            </div>


            <button
              type="button"
              className="text-button"
              onClick={() =>
                navigate(
                  "/my-trips"
                )
              }
            >

              See all

              <FiArrowRight />

            </button>

          </div>


          <div className="trip-list">


            {/* LOADING */}

            {tripsLoading && (

              <p>
                Loading recent trips...
              </p>

            )}


            {/* EMPTY */}

            {!tripsLoading &&
              recentTrips.length === 0 && (

                <p>
                  No trips saved yet.
                </p>

              )}


            {/* ACTUAL TRIPS */}

            {!tripsLoading &&
              recentTrips.map(
                (trip) => (

                  <div
                    className="trip-item"
                    key={trip.id}
                  >


                    {/* Transport */}

                    <div className="trip-icon">

                      {Array.isArray(
                        trip.transport
                      ) && trip.transport.length > 0
                        ? getTransportIcon(
                            trip.transport[0]
                          )
                        : "🚌"}

                    </div>


                    {/* Trip details */}

                    <div className="trip-info">

                      <strong>

                        {trip.fromLocation}

                        {" → "}

                        {trip.toLocation}

                      </strong>


                      <span>

                        {trip.duration}
                        {" • "}
                        {trip.walking}

                      </span>

                    </div>


                    {/* Cost */}

                    <strong
                      className="trip-cost"
                    >

                      ₹{trip.cost}

                    </strong>

                  </div>

                )

              )}

          </div>

        </section>



        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <section className="dashboard-panel">

          <div className="panel-header">

            <div>

              <span className="section-label">
                SHORTCUTS
              </span>


              <h3>
                Quick actions
              </h3>

            </div>

          </div>


          <div className="quick-actions">

           <QuickAction
  icon={<FiPlus />}
  title="Report a road issue"
  description="Help improve Bengaluru roads"
  onClick={() => navigate("/road-issues")}
/>

<QuickAction
  icon={<FiUsers />}
  title="Report crowd level"
  description="Share transport crowd information"
  onClick={() => navigate("/crowd-reports")}
/>


            <QuickAction
              icon={<FiMapPin />}
              title="Find parking"
              description="Discover nearby parking spaces"
            />

          </div>

        </section>


      </div>


    </DashboardLayout>

  );

}


export default Dashboard;