import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import moment from "moment"
import OfferService from "../../services/OfferService"
import Loader from "../../shared/Loader"
import Swal from "sweetalert2"
function ViewOffer() {
  // SERVICES
  const offerService = new OfferService()

  //State
  const [offer, setOffer] = useState({})
  const [offerCount, setOfferCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const { OfferId } = useParams()

  //UseEffect
  useEffect(() => {
    if (offerCount === 0) {
      getEvent()
      setOfferCount(1)
    }
  }, [offer, offerCount]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions

  const getEvent = async () => {
    const response = await offerService.getById(OfferId)
    if (response.data.Code === 1) {
      setOffer(response.data.Data)
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
                <Link className="arrow-container_link" to="/ManageOffers">
                  <img className="arrow-container_image" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" />
                  <h1 className="headertopbar_title">View Offer</h1>
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
                      <img
                        style={{ width: "60%", height: "150px", borderRadius: "15px" }}
                        alt="event_image"
                        src={offer.ImagePath ? "http://18.159.202.37:81/" + offer.ImagePath : ""}
                      />
                    </div>
                    <div className="col-md-12 ">
                      <div className="row event-container">
                        <div className="col-md-4 ">
                          <h3 className="view-profile-name">Event Name</h3>
                          <h4 className="view-profile-user-name">{offer.Name}</h4>
                        </div>
                        {/* <div className="col-md-4">
                          <h3 className="view-profile-name">Business Name</h3>
                          <h4 className="view-profile-user-name">{offer.BusinessName}</h4>
                        </div> */}
                        <div className="col-md-4">
                          <h3 className="view-profile-name">Date</h3>
                          <h4 className="view-profile-user-name"> {moment(offer.Date).format("L")}</h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="view-event-description">
                        <h3 className="view-profile-name">Offer Details</h3>
                        <h4 className="view-profile-user-name">{offer.Description}</h4>
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
export default ViewOffer
