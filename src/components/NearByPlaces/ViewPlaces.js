import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"

import Loader from "../../shared/Loader"
import Swal from "sweetalert2"
import PlacesService from "../../services/PlacesService"
function ViewPlaces() {
  // SERVICES
  const placeService = new PlacesService()

  //State
  const [place, setPlace] = useState({})
  const [eventCount, setEventCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const { PlaceId } = useParams()

  //UseEffect
  useEffect(() => {
    if (eventCount === 0) {
      getFeature()
      setEventCount(1)
    }
  }, [place]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions

  const getFeature = async () => {
    debugger
    const response = await placeService.getById(PlaceId)
    if (response.data.Code === 1) {
      setPlace(response.data.Data)
      setLoader(false)
    }

    if (response.data.Code === 0) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: response.data.Data.Message,
        showConfirmButton: true,
        timer: 5000,
      })
    }
  }

  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <Link className="arrow-container_link" to="/ManagePlaces">
                  <img className="arrow-container_image" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" />
                  <h1 className="headertopbar_title">View Place</h1>
                </Link>
              </div>
            </div>
            <div className="col-12 column_margin">
              <div className="card_custom">
                {loader ? (
                  Loader
                ) : (
                  <div className="row">
                    <div className="col-md-4">
                      <h3 className="view-profile-name">Active Icon</h3>
                      <img
                        style={{ width: "30%", height: "100px", borderRadius: "15px" }}
                        alt="event_image"
                        src={place.ActiveImage ? "http://18.159.202.37:81/" + place.ActiveImage : "/img/images.png"}
                      />
                    </div>
                    <div className="col-md-4">
                      <h3 className="view-profile-name">In-Active Icon</h3>
                      <img
                        style={{ width: "30%", height: "100px", borderRadius: "15px" }}
                        alt="event_image"
                        src={place.InActiveImage ? "http://18.159.202.37:81/" + place.InActiveImage : "/img/images.png"}
                      />
                    </div>
                    <div className="col-md-12">
                      <div className="row event-container">
                        <div className="col-md-4 ">
                          <h3 className="view-profile-name">Place Name</h3>
                          <h4 className="view-profile-user-name">{place.Title}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
export default ViewPlaces
