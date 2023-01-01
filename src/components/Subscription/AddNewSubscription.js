import React, { useState, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import Swal from "sweetalert2"
import "react-datepicker/dist/react-datepicker.css"
import SubscriptionService from "../../services/SubscriptionService"
import Loader from "../../shared/Loader"
import DatePicker from "react-datepicker"
import moment from "moment"

function AddNewSubscription() {
  // SERVICES
  const subscriptionService = new SubscriptionService()

  //State
  const history = useHistory()
  const [subscription, setSubscription] = useState({
    name: "",
    description: "",
    Price: "",
    Days: "",
    Limits: "",
    ExpiryDate: new Date(),
    CreatedBy: JSON.parse(localStorage.getItem("makhtabquserId")),
  })

  const [btnLock, setBtnLock] = useState(false)
  const [emptyValidation, setEmptyValidation] = useState({
    NameEmpty: false,
    PriceEmpty: false,
    DescriptionEmpty: false,
    DaysEmpty: false,
    LimitsEmpty: false,
  })

  //UseEffect
  useEffect(() => {}, [emptyValidation, subscription])
  //Functions
  const handleSubmit = async (e) => {
    e.preventDefault()

    let validCount = 0
    const c = { ...emptyValidation }

    if (subscription.name === "") {
      c.NameEmpty = true
      validCount++
    } else {
      c.NameEmpty = false
    }

    if (subscription.description === "") {
      c.DescriptionEmpty = true
      validCount++
    } else {
      c.DescriptionEmpty = false
    }

    if (subscription.Price === "") {
      c.PriceEmpty = true
      validCount++
    } else {
      c.PriceEmpty = false
    }
    // if (subscription.Days === "") {
    //   c.DaysEmpty = true
    //   validCount++
    // } else {
    //   c.DaysEmpty = false
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

    const response = await subscriptionService.save(subscription)
    if (response.data.Code === 1) {
      const formData = new FormData()
      formData.append("id", response.data.Data.SubscriptionId)
      history.push("/ManageSubscription")
      setBtnLock(false)
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

  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <Link to="ManageSubscription" className="headertopbar_title">
                  {" "}
                  <img className="headertopbar__arrowimage" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" /> Add New Subscription
                </Link>
              </div>
            </div>
            <div className="col-12 column_margin">
              <div className="card_custom">
                <form className="myform" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group col-md-4">
                      <div className="name">
                        <label htmlfor="username">Subscription Plan</label>
                        <input
                          type="text"
                          name="username"
                          className="form_control"
                          placeholder="Plan"
                          onChange={(e) => {
                            const c = { ...subscription }
                            c.name = e.target.value
                            setSubscription(c)
                          }}
                          value={subscription.name}
                        />
                        {emptyValidation.NameEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Subscription name is required </p> : ""}
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="email-container position-relative">
                        <label htmlfor="uname" className="w-100 email-label">
                          Description
                        </label>
                        <input
                          type="text"
                          name="uname"
                          placeholder="Description"
                          className="form_control"
                          id="email-address"
                          onChange={(e) => {
                            const c = { ...subscription }
                            c.description = e.target.value
                            setSubscription(c)
                          }}
                          value={subscription.description}
                        />
                        {emptyValidation.DescriptionEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Description is required </p> : ""}
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="password-container position-relative">
                        <label htmlfor="pwd" className="100">
                          Price
                        </label>
                        <input
                          type="number"
                          name="pwd"
                          className="form_control"
                          id="password"
                          placeholder="Enter Price"
                          onChange={(e) => {
                            const c = { ...subscription }
                            c.Price = e.target.value
                            setSubscription(c)
                          }}
                          value={subscription.Price}
                        />
                        {emptyValidation.PriceEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Price is required </p> : ""}
                      </div>
                    </div>
                    {/* <div className="form-group col-md-4">
                      <div className="password-container position-relative">
                        <label htmlfor="pwd" className="100">
                          Days
                        </label>
                        <input
                          type="number"
                          name="pwd"
                          className="form_control"
                          id="password"
                          placeholder="Enter Time Duration"
                          onChange={(e) => {
                            const c = { ...subscription }
                            c.Days = e.target.value
                            setSubscription(c)
                          }}
                          value={subscription.Days}
                        />
                        {emptyValidation.DaysEmpty ? (
                          <p style={{ marginTop: "5px", color: "red" }}>
                            Days is required{" "}
                          </p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div> */}
                    <div className="form-group col-md-4">
                      <div className="password-container position-relative">
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
                    </div>
                    <div className="form-group col-md-4">
                      <div className="password-container position-relative">
                        <label htmlfor="pwd" className="100">
                          Expiry Date
                        </label>
                        <DatePicker
                          selected={subscription.ExpiryDate}
                          minDate={moment().toDate()}
                          className="form_control"
                          onChange={(ExpiryDate) => {
                            const c = { ...subscription }
                            c.ExpiryDate = ExpiryDate
                            setSubscription(c)
                          }}
                        />
                      </div>
                    </div>
                    <div className="form-group col-md-12 formbtncontainer__outercontainer--layout3">
                      <div className="formbtncontainer">
                        <button disabled={btnLock} type="submit" className="btn_primary submitbtn">
                          Save
                          {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                        </button>
                        <Link to="ManageSubscription" className="btn_primary_outline cancelbtn">
                          Cancel
                        </Link>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AddNewSubscription
