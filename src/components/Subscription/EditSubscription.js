import React, { useEffect, useState } from "react"
import { Link, useParams, useHistory } from "react-router-dom"
import Swal from "sweetalert2"
import "react-datepicker/dist/react-datepicker.css"
import SubscriptionService from "../../services/SubscriptionService"
import Loader from "../../shared/Loader"
import DatePicker from "react-datepicker"
import moment from "moment"
function EditSubscription() {
  //State
  const { SubscriptionId } = useParams()
  const history = useHistory()
  const [offerCount, setOfferCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const [subscription, setSubscription] = useState({})
  const [expiryDate, setExpiryDate] = useState(new Date())
  const [btnLock, setBtnLock] = useState(false)
  const [emptyValidation, setEmptyValidation] = useState({
    imageEmpty: false,
    nameEmpty: false,
    addressEmpty: false,
    dateEmpty: false,
    descriptionEmpty: false,
    DaysEmpty: false,
    LimitsEmpty: false,
  })
  // SERVICES
  const subscriptionService = new SubscriptionService()

  //UseEffect
  useEffect(() => {
    if (offerCount === 0) {
      getEvent()
      setOfferCount(1)
    }
  }, [subscription, offerCount]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions
  const handleSubmit = async (e) => {
    e.preventDefault()
    let validCount = 0
    const c = { ...emptyValidation }

    if (subscription.Name === "") {
      c.nameEmpty = true
      validCount++
    } else {
      c.nameEmpty = false
    }

    if (subscription.Price === "") {
      c.priceEmpty = true
      validCount++
    } else {
      c.priceEmpty = false
    }
    // if (subscription.Days === "") {
    //   c.DaysEmpty = true
    //   validCount++
    // } else {
    //   c.DaysEmpty = false
    // }
    // if (subscription.description === "") {
    //   c.descriptionEmpty = true
    //   validCount++
    // } else {
    //   c.descriptionEmpty = false
    // }
    if (subscription.Limits === "") {
      c.LimitsEmpty = true
      validCount++
    } else {
      c.LimitsEmpty = false
    }
    setEmptyValidation(c)

    if (validCount > 0) {
      return
    }
    setBtnLock(true)
    subscription.updatedBy = 4
    const response = await subscriptionService.update(subscription)

    if (response.data.Code === 1) {
      setBtnLock(false)
      history.push("/ManageSubscription")

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Subscription has been saved",
        showConfirmButton: true,
        timer: 5000,
      })
    }
    if (response.data.Code === 0) {
      setBtnLock(false)

      Swal.fire({
        position: "center",
        icon: "error",
        title: response.data.Data.Message,
        showConfirmButton: true,
        timer: 5000,
      })
    }
  }

  const getEvent = async () => {
    const response = await subscriptionService.getById(SubscriptionId)
    if (response.data.Code === 1) {
      setSubscription(response.data.Data)
      setExpiryDate(new Date(response.data.Data.ExpiryDate))
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
                <Link to="/ManageSubscription" className="headertopbar_title">
                  {" "}
                  <img className="headertopbar__arrowimage" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" /> Edit Subscription
                </Link>
              </div>
            </div>
            <div className="col-12">
              <div className="card_custom">
                {loader ? (
                  Loader
                ) : (
                  <form className="myform" onSubmit={handleSubmit}>
                    <div className="form-row form-row--layout2">
                      <div className="form-group col-md-4 form-group--margin0">
                        <label htmlfor="subscriptionplan">Subscription Plan</label>
                        <input
                          type="text"
                          name="eventname"
                          className="form_control"
                          placeholder="Enter Plan"
                          value={subscription.Name}
                          onChange={(e) => {
                            const x = { ...subscription }
                            x.Name = e.target.value
                            setSubscription(x)
                          }}
                        />
                        {emptyValidation.nameEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Subscription Name is Required </p> : ""}
                      </div>
                      <div className="form-group col-md-4 form-group--margin0">
                        <label htmlfor="subscriptionplan">Description</label>
                        <input
                          type="text"
                          name="eventname"
                          className="form_control"
                          placeholder="Enter description"
                          value={subscription.Description}
                          onChange={(e) => {
                            const x = { ...subscription }
                            x.description = e.target.value
                            setSubscription(x)
                          }}
                        />
                        {emptyValidation.descriptionEmpty ? (
                          <p style={{ marginTop: "5px", color: "red" }}>Subscription description is Required </p>
                        ) : (
                          ""
                        )}
                      </div>

                      <div className="form-group col-md-4 form-group--margin0">
                        <label htmlfor="subscriptionprice">Price</label>
                        <input
                          type="number"
                          name="description"
                          className="form_control"
                          placeholder="Enter Price"
                          value={subscription.Price}
                          onChange={(e) => {
                            const x = { ...subscription }
                            x.Price = e.target.value
                            setSubscription(x)
                          }}
                        />
                        {emptyValidation.descriptionEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Price is Required </p> : ""}
                      </div>
                      {/* <div className="form-group col-md-4 form-group--margin0" id="form-Days">
                        <label htmlfor="subscriptionprice">Days</label>
                        <input
                          type="number"
                          name="description"
                          className="form_control"
                          placeholder="Enter Days"
                          value={subscription.Days}
                          onChange={(e) => {
                            const x = { ...subscription }
                            x.Days = e.target.value
                            setSubscription(x)
                          }}
                        />
                        {emptyValidation.daysEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Days is Required </p> : ""}
                      </div> */}

                      <div className="form-group col-md-4 form-group--margin0" style={{ paddingTop: "30px" }}>
                        <label htmlfor="pwd" className="100">
                          Limits
                        </label>
                        <input
                          type="number"
                          name="pwd"
                          className="form_control"
                          id="password"
                          placeholder="Enter Limit"
                          onChange={(e) => {
                            const c = { ...subscription }
                            c.Limits = e.target.value
                            setSubscription(c)
                          }}
                          value={subscription.Limits}
                        />
                        {emptyValidation.LimitsEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Limits is required </p> : ""}
                      </div>

                      <div className="form-group col-md-4 form-group--margin0">
                        <label htmlfor="pwd" className="100">
                          Expiry Date
                        </label>
                        <DatePicker
                          selected={expiryDate}
                          minDate={moment().toDate()}
                          className="form_control"
                          onChange={(date) => setExpiryDate(date)}
                        />
                      </div>

                      <div className="form-group col-md-12 formbtncontainer__outercontainer--layout3">
                        <div className="formbtncontainer">
                          <button type="submit" disabled={btnLock} className="btn_primary submitbtn">
                            Save
                            {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                          </button>
                          <Link to="/ManageSubscription" className="btn_primary_outline cancelbtn">
                            Cancel
                          </Link>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
export default EditSubscription
