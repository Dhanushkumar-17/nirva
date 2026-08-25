import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiCompass,
  FiNavigation,
  FiMap,
  FiTruck,
  FiUsers,
  FiAlertTriangle,
  FiGrid,
  FiClock,
  FiHeart,
  FiCreditCard,
  FiSettings,
} from "react-icons/fi";

function Sidebar() {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: FiHome,
    },
    {
      name: "Trip Planner",
      path: "/trip-planner",
      icon: FiCompass,
    },
    {
      name: "Live Tracking",
      path: "/live-tracking",
      icon: FiNavigation,
    },
    {
      name: "Metro Routes",
      path: "/metro",
      icon: FiMap,
    },
    {
      name: "Bus Routes",
      path: "/bus",
      icon: FiTruck,
    },
    {
      name: "Crowd Reports",
      path: "/crowd-reports",
      icon: FiUsers,
    },
    {
      name: "Road Issues",
      path: "/road-issues",
      icon: FiAlertTriangle,
    },
    {
      name: "Parking",
      path: "/parking",
      icon: FiGrid,
    },
    {
      name: "My Trips",
      path: "/my-trips",
      icon: FiClock,
    },
    {
      name: "Favourites",
      path: "/favourites",
      icon: FiHeart,
    },
   {
  name: "Wallet",
  path: "/wallet",
  icon: FiCreditCard,
   },
    {
      name: "Settings",
      path: "/settings",
      icon: FiSettings,
    },
  ];

  return (
    <aside className="sidebar">

      {/* Logo */}

      <div className="brand">

        <div className="brand-icon">
          N
        </div>

        <div>
          <h1>NIRVA</h1>
          <span>Smart Mobility</span>
        </div>

      </div>


      {/* Menu */}

      <nav className="sidebar-navigation">

        <p className="menu-title">
          MAIN MENU
        </p>

        {menuItems.map((item) => {

          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >

              <span className="sidebar-icon">
                <Icon />
              </span>

              <span>
                {item.name}
              </span>

            </NavLink>
          );

        })}

      </nav>


      {/* Bottom Card */}

      <div className="sidebar-bottom">

        <div className="help-card">

          <div className="help-icon">
            ?
          </div>

          <div>
            <strong>Need help?</strong>

            <p>
              Plan your journey with NIRVA.
            </p>
          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;