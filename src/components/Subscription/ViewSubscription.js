import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import SubscriptionService from "../../services/SubscriptionService"
import Loader from "../../shared/Loader"
import Swal from "sweetalert2"
import moment from "moment"

function ViewSubscription() {
  // SERVICES
  const subscriptionService = new SubscriptionService()

  //State
  const [subscription, setSubscription] = useState({})
  const [eventCount, setEventCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const { SubscriptionId } = useParams()

  //UseEffect
  useEffect(() => {
    if (eventCount === 0) {
      getSubscription()
      setEventCount(1)
    }
  }, [subscription, eventCount]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions
  let ExpiryDate = moment(subscription.ExpiryDate).format("LL")
  const getSubscription = async () => {
    const response = await subscriptionService.getById(SubscriptionId)
    if (response.data.Code === 1) {
      setSubscription(response.data.Data)
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
                <Link className="arrow-container_link" to="/ManageSubscription">
                  <img className="arrow-container_image" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" />
                  <h1 className="headertopbar_title">View Subscription</h1>
                </Link>
              </div>
            </div>
            <div className="col-12 column_margin">
              <div className="card_custom">
                {loader ? (
                  Loader
                ) : (
                  <div className="row">
                    <div className="col-md-12 ">
                      <div className="row">
                        <div className="col-md-3 ">
                          <h3 className="view-profile-name">Subscription Name</h3>
                          <h4 className="view-profile-user-name">{subscription.Name}</h4>
                        </div>
                        <div className="col-md-3">
                          <h3 className="view-profile-name">Price</h3>
                          <h4 className="view-profile-user-name">{subscription.Price}</h4>
                        </div>
                        <div className="col-md-3">
                          <h3 className="view-profile-name">Limits</h3>
                          <h4 className="view-profile-user-name">{subscription.Limits}</h4>
                        </div>
                        <div className="col-md-3">
                          <h3 className="view-profile-name">Expiry Date</h3>
                          <h4 className="view-profile-user-name">{ExpiryDate}</h4>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-12">
                      <div className="view-event-description">
                        <h3 className="view-profile-name">Description</h3>
                        <h4 className="view-profile-user-name">{subscription.Description}</h4>
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
export default ViewSubscription
