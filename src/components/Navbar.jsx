import {
  FiBell,
  FiChevronDown,
  FiMapPin,
  FiSearch,
} from "react-icons/fi";

function Navbar() {
  return (
    <header className="navbar">

      <div className="mobile-brand">
        <div className="brand-icon">
          N
        </div>

        <span>NIRVA</span>
      </div>

      <div className="navbar-search">

        <FiSearch />

        <input
          type="text"
          placeholder="Search routes, places..."
        />

      </div>

      <div className="navbar-right">

        <div className="location">

          <FiMapPin />

          <span>Bengaluru</span>

        </div>

        <button className="notification-button">
          <FiBell />
          <span className="notification-dot"></span>
        </button>

        <div className="profile">

          <div className="profile-avatar">
            D
          </div>

          <div className="profile-info">
            <strong>Dhanush</strong>
            <span>Traveler</span>
          </div>

          <FiChevronDown className="profile-arrow" />

        </div>

      </div>

    </header>
  );
}

export default Navbar;