import { useEffect, useState } from "react";

import {
  FiArrowRight,
  FiHeart,
  FiMapPin,
  FiTrash2,
} from "react-icons/fi";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../Services/api";

function Favourites() {

  const [favourites, setFavourites] =
    useState([]);

  const [name, setName] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  // ==================================================
  // LOAD FAVOURITES
  // ==================================================

  const loadFavourites = async () => {

    try {

      setLoading(true);

      const response =
        await api.get("/favourites");

      console.log(
        "Favourites:",
        response.data
      );

      setFavourites(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {

      console.error(
        "Loading favourites failed:",
        error
      );

      setMessage(
        "Unable to load favourites."
      );

    } finally {

      setLoading(false);

    }

  };


  // ==================================================
  // LOAD WHEN PAGE OPENS
  // ==================================================

  useEffect(() => {

    loadFavourites();

  }, []);


  // ==================================================
  // ADD FAVOURITE
  // ==================================================

  const addFavourite = async () => {

    if (
      !name.trim() ||
      !location.trim()
    ) {

      setMessage(
        "Please enter both a name and location."
      );

      return;

    }


    try {

      setSaving(true);

      setMessage("");


      const favourite = {

        fromLocation:
          name.trim(),

        toLocation:
          location.trim(),

      };


      const response =
        await api.post(
          "/favourites",
          favourite
        );


      console.log(
        "Favourite saved:",
        response.data
      );


      setFavourites(
        (current) => [
          response.data,
          ...current,
        ]
      );


      setName("");

      setLocation("");


      setMessage(
        "⭐ Favourite saved successfully!"
      );


    } catch (error) {

      console.error(
        "Add favourite error:",
        error
      );


      setMessage(
        "Unable to save favourite."
      );


    } finally {

      setSaving(false);

    }

  };


  // ==================================================
  // DELETE FAVOURITE
  // ==================================================

  const deleteFavourite = async (
    id
  ) => {

    try {

      await api.delete(
        `/favourites/${id}`
      );


      setFavourites(
        (current) =>
          current.filter(
            (item) =>
              item.id !== id
          )
      );


    } catch (error) {

      console.error(
        "Delete favourite error:",
        error
      );


      alert(
        "Unable to delete favourite."
      );

    }

  };


  // ==================================================
  // RENDER
  // ==================================================

  return (

    <DashboardLayout>

      <div className="favourites-page">


        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="favourites-header">

          <div>

            <span className="section-label">
              SAVED JOURNEYS
            </span>


            <h1>
              Favourites
            </h1>


            <p>
              Quickly access your favourite places and routes.
            </p>

          </div>


          <div className="favourites-count">

            <FiHeart />

            {favourites.length} saved

          </div>

        </div>



        {/* ==========================================
            ADD FAVOURITE
        ========================================== */}

        <section className="favourite-form-card">

          <div className="favourite-form-title">

            <div className="favourite-icon">

              <FiHeart />

            </div>


            <div>

              <h2>
                Add favourite route
              </h2>


              <p>
                Save a route you use frequently.
              </p>

            </div>

          </div>



          <div className="favourite-form">


            {/* FROM */}

            <div className="favourite-input">

              <label>
                From
              </label>


              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value
                  )
                }
                placeholder="e.g. BTM Layout"
              />

            </div>



            {/* TO */}

            <div className="favourite-input">

              <label>
                To
              </label>


              <input
                type="text"
                value={location}
                onChange={(event) =>
                  setLocation(
                    event.target.value
                  )
                }
                placeholder="e.g. Koramangala"
              />

            </div>



            {/* SAVE */}

            <button
              type="button"
              className="add-favourite-button"
              onClick={addFavourite}
              disabled={saving}
            >

              {saving
                ? "Saving..."
                : "Add favourite"
              }

            </button>

          </div>



          {message && (

            <p className="favourite-message">

              {message}

            </p>

          )}

        </section>



        {/* ==========================================
            SAVED FAVOURITES
        ========================================== */}

        <section className="favourites-section">


          <div className="favourites-section-header">

            <div>

              <span className="section-label">
                SAVED ROUTES
              </span>


              <h2>
                Your favourite routes
              </h2>

            </div>


            <span>
              {favourites.length} routes
            </span>

          </div>



          {/* LOADING */}

          {loading && (

            <div className="dashboard-panel">

              <p>
                Loading favourites...
              </p>

            </div>

          )}



          {/* EMPTY */}

          {!loading &&
            favourites.length === 0 && (

              <div className="dashboard-panel">

                <FiHeart />

                <h3>
                  No favourites yet
                </h3>


                <p>
                  Add a route you use frequently
                  and it will appear here.
                </p>

              </div>

            )}



          {/* FAVOURITES */}

          {!loading &&
            favourites.length > 0 && (

              <div className="favourite-route-list">

                {favourites.map(
                  (item) => (

                    <div
                      className="favourite-route-card"
                      key={item.id}
                    >


                      {/* ICON */}

                      <div className="route-heart-icon">

                        <FiHeart />

                      </div>



                      {/* CONTENT */}

                      <div className="favourite-route-content">

                        <strong>

                          {item.fromLocation}

                          {" → "}

                          {item.toLocation}

                        </strong>


                        <div className="favourite-route-path">

                          <span>
                            {item.fromLocation}
                          </span>


                          <FiArrowRight />


                          <span>
                            {item.toLocation}
                          </span>

                        </div>

                      </div>



                      {/* DELETE */}

                      <button
                        type="button"
                        className="remove-favourite"
                        onClick={() =>
                          deleteFavourite(
                            item.id
                          )
                        }
                        title="Remove favourite"
                      >

                        <FiTrash2 />

                      </button>

                    </div>

                  )
                )}

              </div>

            )}

        </section>



        {/* ==========================================
            SAVED PLACES NOTE
        ========================================== */}

        <section className="favourites-section">

          <div className="favourites-section-header">

            <div>

              <span className="section-label">
                NIRVA
              </span>


              <h2>
                Favourite locations
              </h2>

            </div>

          </div>


          <div className="dashboard-panel">

            <FiMapPin />


            <p>
              Your saved routes are connected
              to the NIRVA backend.
            </p>


          </div>

        </section>


      </div>

    </DashboardLayout>

  );

}


export default Favourites;