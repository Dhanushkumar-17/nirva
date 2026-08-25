import { useState } from "react";
import {
  FiArrowRight,
  FiClock,
  FiMapPin,
  FiNavigation,
  FiX,
} from "react-icons/fi";

function RouteCard({
  recommended = false,
  duration,
  cost,
  walking,
  changes,
  route = [],
  onChoose,
  onFavourite,
}) {

  const [showDetails, setShowDetails] =
    useState(false);


  // ==========================================
  // CLEAN COST
  // ==========================================

  const cleanCost = String(
    cost ?? "0"
  )
    .replace(/₹/g, "")
    .replace(/Rs\.?/gi, "")
    .trim();


  // ==========================================
  // VIEW ROUTE
  // ==========================================

  const handleViewRoute = () => {

    setShowDetails(true);

  };


  // ==========================================
  // CLOSE DETAILS
  // ==========================================

  const closeDetails = () => {

    setShowDetails(false);

  };


  return (

    <>

      {/* ======================================
          ROUTE CARD
      ====================================== */}

      <div
        className={
          recommended
            ? "route-card recommended"
            : "route-card"
        }
      >


        {/* RECOMMENDED */}

        {recommended && (

          <span className="recommended-badge">
            Recommended
          </span>

        )}


        {/* ==================================
            TOP
        ================================== */}

        <div className="route-top">


          {/* TRANSPORT */}

          <div className="transport-icons">

            {route.map(
              (icon, index) => (

                <div
                  className="transport-item"
                  key={index}
                >

                  <span className="transport-icon">
                    {icon}
                  </span>


                  {index <
                    route.length - 1 && (

                    <FiArrowRight
                      className="route-arrow"
                    />

                  )}

                </div>

              )
            )}

          </div>


          {/* PRICE */}

          <div className="route-price">

            ₹{cleanCost}

          </div>

        </div>


        {/* ==================================
            DETAILS
        ================================== */}

        <div className="route-details">

          <div>

            <FiClock />

            <span>
              {duration}
            </span>

          </div>


          <div>

            <FiMapPin />

            <span>
              {walking} walking
            </span>

          </div>


          <div>

            <FiNavigation />

            <span>
              {changes} changes
            </span>

          </div>

        </div>


        {/* ==================================
            ACTIONS
        ================================== */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            paddingTop: "13px",
          }}
        >

          {/* VIEW ROUTE */}

          <button
            type="button"
            className="view-route-button"
            onClick={handleViewRoute}
          >

            View route

            <FiArrowRight
              style={{
                marginLeft: "5px",
                verticalAlign: "middle",
              }}
            />

          </button>


          {/* CHOOSE */}

          {onChoose && (

            <button
              type="button"
              onClick={onChoose}
              style={{
                border: "1px solid #dfe3ea",
                background: "#ffffff",
                color: "#30394d",
                borderRadius: "8px",
                padding: "7px 10px",
                fontSize: "10px",
                fontWeight: "600",
              }}
            >

              Choose this route

            </button>

          )}


          {/* FAVOURITE */}

          {onFavourite && (

            <button
              type="button"
              onClick={onFavourite}
              style={{
                border: "1px solid #dfe3ea",
                background: "#ffffff",
                color: "#30394d",
                borderRadius: "8px",
                padding: "7px 10px",
                fontSize: "10px",
                fontWeight: "600",
              }}
            >

              ⭐ Favourite

            </button>

          )}

        </div>


      </div>


      {/* ======================================
          ROUTE DETAILS MODAL
      ====================================== */}

      {showDetails && (

        <div
          style={{
            position: "fixed",
            inset: "0",
            background: "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 9999,
          }}
          onClick={closeDetails}
        >

          <div
            style={{
              width: "100%",
              maxWidth: "520px",
              background: "#ffffff",
              borderRadius: "18px",
              padding: "24px",
              boxShadow:
                "0 20px 60px rgba(15, 23, 42, 0.2)",
            }}
            onClick={(event) =>
              event.stopPropagation()
            }
          >


            {/* HEADER */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "22px",
              }}
            >

              <div>

                <span
                  style={{
                    color: "#8b93a4",
                    fontSize: "9px",
                    fontWeight: "700",
                    letterSpacing: "1px",
                  }}
                >
                  ROUTE DETAILS
                </span>

                <h2
                  style={{
                    margin: "6px 0 0",
                    fontSize: "22px",
                    color: "#172033",
                  }}
                >
                  Recommended route
                </h2>

              </div>


              <button
                type="button"
                onClick={closeDetails}
                style={{
                  width: "36px",
                  height: "36px",
                  border: "1px solid #e1e5eb",
                  borderRadius: "9px",
                  background: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >

                <FiX />

              </button>

            </div>


            {/* TRANSPORT */}

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexWrap: "wrap",
                marginBottom: "22px",
              }}
            >

              {route.map(
                (icon, index) => (

                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >

                    <span
                      style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "11px",
                        background: "#f4f6f9",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "19px",
                      }}
                    >
                      {icon}
                    </span>


                    {index <
                      route.length - 1 && (

                      <FiArrowRight
                        style={{
                          color: "#9aa1af",
                        }}
                      />

                    )}

                  </div>

                )
              )}

            </div>


            {/* PRICE */}

            <div
              style={{
                background: "#f7f8fa",
                borderRadius: "12px",
                padding: "15px",
                marginBottom: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >

              <span
                style={{
                  color: "#7d8597",
                  fontSize: "11px",
                }}
              >
                Estimated fare
              </span>

              <strong
                style={{
                  fontSize: "20px",
                  color: "#172033",
                }}
              >
                ₹{cleanCost}
              </strong>

            </div>


            {/* TIME */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(3, 1fr)",
                gap: "10px",
              }}
            >

              <div
                style={{
                  background: "#f7f8fa",
                  borderRadius: "11px",
                  padding: "13px",
                }}
              >

                <FiClock />

                <p
                  style={{
                    margin: "7px 0 2px",
                    fontWeight: "700",
                    fontSize: "14px",
                  }}
                >
                  {duration}
                </p>

                <span
                  style={{
                    color: "#8b93a4",
                    fontSize: "9px",
                  }}
                >
                  Duration
                </span>

              </div>


              <div
                style={{
                  background: "#f7f8fa",
                  borderRadius: "11px",
                  padding: "13px",
                }}
              >

                <FiMapPin />

                <p
                  style={{
                    margin: "7px 0 2px",
                    fontWeight: "700",
                    fontSize: "14px",
                  }}
                >
                  {walking}
                </p>

                <span
                  style={{
                    color: "#8b93a4",
                    fontSize: "9px",
                  }}
                >
                  Walking
                </span>

              </div>


              <div
                style={{
                  background: "#f7f8fa",
                  borderRadius: "11px",
                  padding: "13px",
                }}
              >

                <FiNavigation />

                <p
                  style={{
                    margin: "7px 0 2px",
                    fontWeight: "700",
                    fontSize: "14px",
                  }}
                >
                  {changes}
                </p>

                <span
                  style={{
                    color: "#8b93a4",
                    fontSize: "9px",
                  }}
                >
                  Changes
                </span>

              </div>

            </div>


            {/* CHOOSE */}

            {onChoose && (

              <button
                type="button"
                onClick={() => {
                  closeDetails();
                  onChoose();
                }}
                style={{
                  width: "100%",
                  marginTop: "18px",
                  padding: "12px",
                  border: "none",
                  borderRadius: "10px",
                  background: "#172033",
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >

                Choose this route

              </button>

            )}

          </div>

        </div>

      )}

    </>

  );
}

export default RouteCard;