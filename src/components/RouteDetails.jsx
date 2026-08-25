import {
  FiArrowLeft,
  FiClock,
  FiMapPin,
  FiNavigation,
  FiDollarSign,
} from "react-icons/fi";

function RouteDetails({ route, from, to, onBack }) {
  if (!route) {
    return null;
  }

  const steps = [
    {
      type: "Walk",
      icon: "🚶",
      title: `Walk from ${from}`,
      description: "Walk to the nearest transport stop.",
      duration: "6 min",
      distance: "450m",
    },
    {
      type: "Bus",
      icon: "🚌",
      title: "Take BMTC Bus",
      description: "Travel towards the city centre.",
      duration: "18 min",
      distance: "5.2 km",
    },
    {
      type: "Metro",
      icon: "🚇",
      title: "Take Metro",
      description: "Travel towards Majestic.",
      duration: "15 min",
      distance: "7.4 km",
    },
    {
      type: "Walk",
      icon: "🚶",
      title: `Walk to ${to}`,
      description: "Walk from the station to your destination.",
      duration: "7 min",
      distance: "650m",
    },
  ];

  return (
    <div className="route-details-page">

      {/* Header */}

      <div className="route-details-header">

        <button
          className="back-button"
          onClick={onBack}
        >
          <FiArrowLeft />
          Back to routes
        </button>

        <span className="route-details-badge">
          Recommended Route
        </span>

      </div>


      {/* Journey Summary */}

      <section className="route-summary-card">

        <div className="route-summary-heading">

          <div>
            <span className="section-label">
              YOUR JOURNEY
            </span>

            <h1>
              {from} → {to}
            </h1>
          </div>

          <div className="route-summary-price">
            ₹{route.cost}
          </div>

        </div>


        <div className="route-summary-stats">

          <div>
            <FiClock />
            <strong>{route.duration} min</strong>
            <span>Travel time</span>
          </div>

          <div>
            <FiMapPin />
            <strong>{route.walking}</strong>
            <span>Walking</span>
          </div>

          <div>
            <FiNavigation />
            <strong>{route.changes}</strong>
            <span>Changes</span>
          </div>

          <div>
            <FiDollarSign />
            <strong>₹{route.cost}</strong>
            <span>Total fare</span>
          </div>

        </div>

      </section>


      {/* Journey Steps */}

      <section className="journey-steps">

        <div className="journey-title">

          <span className="section-label">
            STEP BY STEP
          </span>

          <h2>
            Your route
          </h2>

        </div>


        <div className="steps-container">

          {steps.map((step, index) => (

            <div
              className="journey-step"
              key={index}
            >

              <div className="step-number">
                {index + 1}
              </div>


              <div className="step-icon">
                {step.icon}
              </div>


              <div className="step-content">

                <span className="step-type">
                  {step.type}
                </span>

                <h3>
                  {step.title}
                </h3>

                <p>
                  {step.description}
                </p>

                <div className="step-info">

                  <span>
                    <FiClock />
                    {step.duration}
                  </span>

                  <span>
                    <FiMapPin />
                    {step.distance}
                  </span>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

    </div>
  );
}

export default RouteDetails;