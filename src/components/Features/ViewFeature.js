import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import FeatureService from "../../services/FeatureService"
import Loader from "../../shared/Loader"
import Swal from "sweetalert2"
function ViewFeature() {
  // SERVICES
  const featureService = new FeatureService()

  //State
  const [feature, setFeature] = useState({})
  const [eventCount, setEventCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const { FeatureId } = useParams()

  //UseEffect
  useEffect(() => {
    if (eventCount === 0) {
      getFeature()
      setEventCount(1)
    }
  }, [feature, eventCount]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions

  const getFeature = async () => {
    const response = await featureService.getById(FeatureId)
    if (response.data.Code === 1) {
      setFeature(response.data.Data)
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
                <Link className="arrow-container_link" to="/Features">
                  <img className="arrow-container_image" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" />
                  <h1 className="headertopbar_title">View Feature</h1>
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
                        src={feature.ImagePath ? "http://18.159.202.37:81/" + feature.ImagePath : "/img/images.png"}
                      />
                    </div>
                    <div className="col-md-4">
                      <h3 className="view-profile-name">In-Active Icon</h3>
                      <img
                        style={{ width: "30%", height: "100px", borderRadius: "15px" }}
                        alt="event_image"
                        src={feature.GreyIcon ? "http://18.159.202.37:81/" + feature.GreyIcon : "/img/images.png"}
                      />
                    </div>
                    <div className="col-md-12 ">
                      <div className="row event-container">
                        <div className="col-md-4 ">
                          <h3 className="view-profile-name">Feature Name</h3>
                          <h4 className="view-profile-user-name">{feature.Name}</h4>
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
export default ViewFeature
