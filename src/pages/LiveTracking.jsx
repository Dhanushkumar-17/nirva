import { useState, useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";

import {
  FiTruck,
  FiClock,
  FiNavigation,
  FiMap,
  FiCheck,
  FiAlertCircle,
} from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";

import "leaflet/dist/leaflet.css";


// ==========================================
// BENGALURU DEFAULT LOCATION
// ==========================================

const bengaluruCenter = [
  12.9716,
  77.5946,
];


// ==========================================
// MAP CONTROLLER
// Moves map when current location changes
// ==========================================

function MapController({ userLocation }) {

  const map = useMap();

  useEffect(() => {

    if (!userLocation) {
      return;
    }

    map.flyTo(
      [
        userLocation.latitude,
        userLocation.longitude,
      ],
      15,
      {
        duration: 1.5,
      }
    );

  }, [userLocation, map]);

  return null;
}


// ==========================================
// LIVE TRACKING
// ==========================================

function LiveTracking() {

  const [userLocation, setUserLocation] =
    useState(null);

  const [locationMessage, setLocationMessage] =
    useState("");

  const [locationStatus, setLocationStatus] =
    useState("");


  // ==========================================
  // DEMO VEHICLES
  // ==========================================

  const vehicles = [

    {
      id: "BMTC 500D",
      type: "Bus",
      icon: FiTruck,
      status: "On time",
      location: "Silk Board",
      destination: "Majestic",
      eta: "8 min",

      latitude: 12.9176,
      longitude: 77.6238,
    },

    {
      id: "BMTC 201R",
      type: "Bus",
      icon: FiTruck,
      status: "Delayed",
      location: "BTM Layout",
      destination: "Shivajinagar",
      eta: "14 min",

      latitude: 12.9166,
      longitude: 77.6101,
    },

    {
      id: "Purple Line",
      type: "Metro",
      icon: FiMap,
      status: "On time",
      location: "Indiranagar",
      destination: "Kengeri",
      eta: "5 min",

      latitude: 12.9784,
      longitude: 77.6408,
    },

  ];


  // ==========================================
  // GET CURRENT LOCATION
  // ==========================================

  const handleGetLocation = () => {

    setLocationMessage("");
    setLocationStatus("");


    if (!navigator.geolocation) {

      setLocationStatus("error");

      setLocationMessage(
        "Geolocation is not supported by your browser."
      );

      return;
    }


    setLocationStatus("loading");

    setLocationMessage(
      "Detecting your location..."
    );


    navigator.geolocation.getCurrentPosition(

      (position) => {

        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;


        const location = {
          latitude,
          longitude,
        };


        // Save React state

        setUserLocation(location);


        // Save in browser

        localStorage.setItem(
          "nirva_latitude",
          latitude.toString()
        );

        localStorage.setItem(
          "nirva_longitude",
          longitude.toString()
        );


        setLocationStatus("success");

        setLocationMessage(
          "Your location was detected successfully."
        );


        console.log(
          "NIRVA Latitude:",
          latitude
        );

        console.log(
          "NIRVA Longitude:",
          longitude
        );

      },


      (error) => {

        console.error(
          "Location error:",
          error
        );


        setLocationStatus("error");


        if (error.code === 1) {

          setLocationMessage(
            "Location permission was denied."
          );

        } else if (error.code === 2) {

          setLocationMessage(
            "Unable to detect your location."
          );

        } else if (error.code === 3) {

          setLocationMessage(
            "Location request timed out."
          );

        } else {

          setLocationMessage(
            "Unable to get your location."
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


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <DashboardLayout>

      <div className="tracking-page">


        {/* =====================================
            HEADER
        ====================================== */}

        <div className="tracking-header">

          <div>

            <span className="section-label">
              LIVE MOBILITY
            </span>

            <h1>
              Live Tracking
            </h1>

            <p>
              Track buses and metro services
              around Bengaluru.
            </p>

          </div>


          <div className="live-indicator">

            <span className="live-dot"></span>

            Live

          </div>

        </div>


        {/* =====================================
            REAL MAP
        ====================================== */}

        <section className="tracking-map">


          <MapContainer
            center={bengaluruCenter}
            zoom={12}
            scrollWheelZoom={true}
            className="nirva-map"
          >


            {/* =================================
                OPEN STREET MAP
            ================================== */}

            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />


            {/* =================================
                MOVE MAP TO USER LOCATION
            ================================== */}

            <MapController
              userLocation={userLocation}
            />


            {/* =================================
                USER LOCATION
            ================================== */}

            {userLocation && (

              <CircleMarker

                center={[
                  userLocation.latitude,
                  userLocation.longitude,
                ]}

                radius={10}

                pathOptions={{
                  color: "#162033",
                  fillColor: "#162033",
                  fillOpacity: 1,
                }}

              >

                <Popup>

                  <strong>
                    You are here
                  </strong>

                  <br />

                  Your current location

                  <br />

                  Latitude:
                  {" "}
                  {userLocation.latitude.toFixed(5)}

                  <br />

                  Longitude:
                  {" "}
                  {userLocation.longitude.toFixed(5)}

                </Popup>

              </CircleMarker>

            )}


            {/* =================================
                BUS / METRO LOCATIONS
            ================================== */}

            {vehicles.map((vehicle) => (

              <CircleMarker

                key={vehicle.id}

                center={[
                  vehicle.latitude,
                  vehicle.longitude,
                ]}

                radius={8}

                pathOptions={{
                  color:
                    vehicle.status === "Delayed"
                      ? "#d9534f"
                      : "#162033",

                  fillColor:
                    vehicle.status === "Delayed"
                      ? "#d9534f"
                      : "#162033",

                  fillOpacity: 0.9,
                }}

              >

                <Popup>

                  <strong>
                    {vehicle.id}
                  </strong>

                  <br />

                  {vehicle.location}

                  {" → "}

                  {vehicle.destination}

                  <br />

                  Status:
                  {" "}
                  {vehicle.status}

                  <br />

                  ETA:
                  {" "}
                  {vehicle.eta}

                </Popup>

              </CircleMarker>

            ))}


          </MapContainer>


          {/* =================================
              CURRENT LOCATION BUTTON
              TOP RIGHT
          ================================== */}

          <button

            type="button"

            className="location-button"

            onClick={handleGetLocation}

            disabled={
              locationStatus === "loading"
            }

          >

            <FiNavigation />

            {locationStatus === "loading"

              ? "Detecting location..."

              : "Use current location"

            }

          </button>


          {/* =================================
              LOCATION MESSAGE
          ================================== */}

          {locationMessage && (

            <div

              className={
                locationStatus === "success"

                  ? "location-message success"

                  : locationStatus === "error"

                  ? "location-message error"

                  : "location-message"
              }

            >

              {locationStatus === "success"

                ? <FiCheck />

                : <FiAlertCircle />

              }


              <span>
                {locationMessage}
              </span>

            </div>

          )}


          {/* =================================
              COORDINATES
          ================================== */}

          {userLocation && (

            <div className="location-coordinates">

              <strong>
                Current location
              </strong>

              <span>
                Latitude:
                {" "}
                {userLocation.latitude.toFixed(5)}
              </span>

              <span>
                Longitude:
                {" "}
                {userLocation.longitude.toFixed(5)}
              </span>

            </div>

          )}


        </section>


        {/* =====================================
            NEARBY VEHICLES
        ====================================== */}

        <section className="vehicles-section">


          <div className="vehicles-header">

            <div>

              <span className="section-label">
                NEARBY TRANSPORT
              </span>

              <h2>
                Live vehicles
              </h2>

            </div>


            <span className="updated-text">
              Updated just now
            </span>

          </div>


          <div className="vehicle-list">


            {vehicles.map((vehicle) => {

              const Icon = vehicle.icon;


              return (

                <div
                  className="vehicle-card"
                  key={vehicle.id}
                >


                  {/* VEHICLE ICON */}

                  <div className="vehicle-icon">

                    <Icon />

                  </div>


                  {/* VEHICLE INFO */}

                  <div className="vehicle-main">

                    <div className="vehicle-title">

                      <strong>
                        {vehicle.id}
                      </strong>


                      <span
                        className={
                          vehicle.status === "Delayed"
                            ? "status delayed"
                            : "status"
                        }
                      >

                        {vehicle.status}

                      </span>

                    </div>


                    <p>

                      {vehicle.location}

                      {" → "}

                      {vehicle.destination}

                    </p>

                  </div>


                  {/* ETA */}

                  <div className="vehicle-eta">

                    <FiClock />

                    <strong>
                      {vehicle.eta}
                    </strong>

                    <span>
                      ETA
                    </span>

                  </div>


                </div>

              );

            })}


          </div>


        </section>


      </div>

    </DashboardLayout>

  );

}


export default LiveTracking;