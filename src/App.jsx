import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

// ==========================================
// PAGES
// ==========================================

import Dashboard from "./pages/DashBoard";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Notifications from "./pages/Notifications";

import TripPlanner from "./pages/TripPlanner";

import LiveTracking from "./pages/LiveTracking";

import MetroRoutes from "./pages/MetroRoutes";
import BusRoutes from "./pages/BusRoutes";

import CrowdReports from "./pages/CrowdReports";

import RoadIssues from "./pages/RoadIssues";

import Parking from "./pages/Parking";

import MyTrips from "./pages/MyTrips";

import Favourites from "./pages/Favourites";

import Wallet from "./pages/Wallet";

import Settings from "./pages/Settings";


// ==========================================
// PROTECTED ROUTE
// ==========================================

function ProtectedRoute({ children }) {

  const user =
    localStorage.getItem("nirvaUser");


  if (!user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }


  return children;
}


// ==========================================
// APP
// ==========================================

function App() {

  return (

    <BrowserRouter>

      <Routes>


        {/* ==================================
            DEFAULT
        ================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />


        {/* ==================================
            AUTHENTICATION
        ================================== */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ==================================
            DASHBOARD
        ================================== */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />


        {/* ==================================
            TRIP PLANNER
        ================================== */}

        <Route
          path="/trip-planner"
          element={
            <ProtectedRoute>
              <TripPlanner />
            </ProtectedRoute>
          }
        />


        {/* ==================================
            LIVE TRACKING
        ================================== */}

        <Route
          path="/live-tracking"
          element={
            <ProtectedRoute>
              <LiveTracking />
            </ProtectedRoute>
          }
        />


        {/* ==================================
            METRO
        ================================== */}

        <Route
          path="/metro"
          element={
            <ProtectedRoute>
              <MetroRoutes />
            </ProtectedRoute>
          }
        />


        {/* ==================================
            BUS
        ================================== */}

        <Route
          path="/bus"
          element={
            <ProtectedRoute>
              <BusRoutes />
            </ProtectedRoute>
          }
        />


        {/* ==================================
            CROWD REPORTS
        ================================== */}

        <Route
          path="/crowd-reports"
          element={
            <ProtectedRoute>
              <CrowdReports />
            </ProtectedRoute>
          }
        />


        {/* ==================================
            ROAD ISSUES
        ================================== */}

        <Route
          path="/road-issues"
          element={
            <ProtectedRoute>
              <RoadIssues />
            </ProtectedRoute>
          }
        />


        {/* ==================================
            PARKING
        ================================== */}

        <Route
          path="/parking"
          element={
            <ProtectedRoute>
              <Parking />
            </ProtectedRoute>
          }
        />


        {/* ==================================
            MY TRIPS
        ================================== */}

        <Route
          path="/my-trips"
          element={
            <ProtectedRoute>
              <MyTrips />
            </ProtectedRoute>
          }
        />


        {/* ==================================
            FAVOURITES
        ================================== */}

        <Route
          path="/favourites"
          element={
            <ProtectedRoute>
              <Favourites />
            </ProtectedRoute>
          }
        />


        {/* ==================================
            WALLET
        ================================== */}

        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          }
        />


        {/* ==================================
            NOTIFICATIONS
        ================================== */}

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />


        {/* ==================================
            SETTINGS
        ================================== */}

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />


        {/* ==================================
            UNKNOWN URL
        ================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />


      </Routes>

    </BrowserRouter>
  );
}

export default App;