import React, { useState, useEffect } from "react"
import { Link, useHistory, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import "react-datepicker/dist/react-datepicker.css"
import Loader from "../../shared/Loader"
import SlotsService from "../../services/SlotsServices"
import DatePicker from "react-datepicker"
import moment from "moment"

function AddNewSlot() {
  // SERVICES
  const slotsService = new SlotsService()

  //State
  const [data, setData] = useState([])
  const [loader, setLoader] = useState(true)
  const [dataCount, setDataCount] = useState(0)
  const { BusinessId } = useParams()
  const history = useHistory()

  const [slot, setSlot] = useState({
    BusinessId: BusinessId,
    Date: new Date(),
    Seats: "",
    StartTime: moment().format("LT"),
    EndTime: moment().format("LT"),
    IsAllDay: "",
  })

  const [btnLock, setBtnLock] = useState(false)
  const [emptyValidation, setEmptyValidation] = useState({
    DateEmpty: false,
    SeatsEmpty: false,
    StartTimeEmpty: false,
    EndTimeEmpty: false,
    BusinessNameEmpty: false,
  })
  //business owner start

  useEffect(() => {
    if (dataCount === 0) {
      getBusinesses(0)
      setDataCount(1)
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions
  const getBusinesses = async () => {
    const response = await slotsService.getBusinesses("")
    setData(response.data.Data)
    setLoader(false)
  }

  //UseEffect
  useEffect(() => {}, [emptyValidation, slot])
  //Functions
  const handleSubmit = async (e) => {
    e.preventDefault()

    let validCount = 0
    const c = { ...emptyValidation }
    if (slot.BusinessId === 0) {
      c.DateEmpty = true
      validCount++
    } else {
      c.DateEmpty = false
    }

    // if (slot.Date === "") {
    //   c.DateEmpty = true
    //   validCount++
    // } else {
    //   c.DateEmpty = false
    // }

    if (slot.Seats === "") {
      c.SeatsEmpty = true
      validCount++
    } else {
      c.SeatsEmpty = false
    }

    if (slot.StartTime === "") {
      c.StartTimeEmpty = true
      validCount++
    } else {
      c.StartTimeEmpty = false
    }
    if (slot.EndTime === "") {
      c.EndTimeEmpty = true
      validCount++
    } else {
      c.EndTimeEmpty = false
    }

    setEmptyValidation(c)

    if (validCount > 0) {
      return
    }
    setBtnLock(true)

    const response = await slotsService.save(slot)

    console.log(response)

    if (response.data.Code === 1) {
      const formData = new FormData()
      formData.append("id", response.data.Data.SlotId)
      history.push("/ManageBusinessOwner")
      setBtnLock(false)
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Slot has been saved",
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

  const IsAllDay = (e) => {
    if (e.target.value === "1") {
      const c = { ...slot }
      c.IsAllDay = true
      setSlot(c)
      document.getElementById("startTime").style.display = "none"
      document.getElementById("endTime").style.display = "none"
    } else {
      const c = { ...slot }
      c.IsAllDay = false
      setSlot(c)
      document.getElementById("startTime").style.display = "block"
      document.getElementById("endTime").style.display = "block"
    }
  }

  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <Link to="/ManageBusinessOwner" className="headertopbar_title">
                  {" "}
                  <img className="headertopbar__arrowimage" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" /> Add New Slots
                </Link>
              </div>
            </div>
            <div className="col-12 column_margin">
              <div className="card_custom">
                <form className="myform" onSubmit={handleSubmit}>
                  <div className="form-row">
                    {/* <div className="form-group col-md-4">
                      <div className="name">
                        <label htmlfor="username">Business Name</label>
                        <select
                          onChange={(e) => {
                            const c = { ...slot }
                            c.BusinessId = e.target.value
                            setSlot(c)
                          }}
                          className="form_control"
                        >
                          <option value="0" selected>
                            Select Business Name
                          </option>
                          {data.map((item) => {
                            return <option value={item.BusinessId}>{item.BusinessName}</option>
                          })}
                        </select>
                        {emptyValidation.BusinessNameEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Business name is required </p> : ""}
                      </div>
                    </div> */}
                    <div className="form-group col-md-4">
                      <div className="email-container position-relative">
                        <label htmlfor="uname" className="w-100 email-label">
                          No Of Seats
                        </label>
                        <input
                          type="number"
                          name="uname"
                          placeholder="Seats"
                          className="form_control"
                          id="email-address"
                          onChange={(e) => {
                            const c = { ...slot }
                            c.Seats = e.target.value
                            setSlot(c)
                          }}
                          value={slot.Seats}
                        />
                        {emptyValidation.SeatsEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Seats is required </p> : ""}
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="password-container position-relative">
                        <label htmlfor="pwd" className="100">
                          Date
                        </label>
                        <DatePicker
                          selected={slot.Date}
                          minDate={moment().toDate()}
                          className="form_control"
                          onChange={(date) => {
                            const c = { ...slot }
                            c.Date = date
                            setSlot(c)
                          }}
                        />
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="name">
                        <label htmlfor="username">Slot for 24 hours</label>
                        <select className="form_control" onChange={(e) => IsAllDay(e)}>
                          <option value="0" selected>
                            Select
                          </option>
                          <option value={1}>Yes</option>
                          <option value={0}>No</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="password-container position-relative">
                        <label htmlfor="pwd" className="100">
                          Start Time
                        </label>
                        <input
                          type="time"
                          name="pwd"
                          className="form_control"
                          id="startTime"
                          placeholder="Enter Time Duration"
                          onChange={(e) => {
                            const c = { ...slot }
                            c.StartTime = e.target.value
                            setSlot(c)
                          }}
                          value={slot.StartTime}
                        />
                        {emptyValidation.StartTimeEmpty ? <p style={{ marginTop: "10px", color: "red" }}>Start time is required</p> : ""}
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="password-container position-relative">
                        <label htmlfor="pwd" className="100">
                          End Time
                        </label>
                        <input
                          type="time"
                          name="pwd"
                          className="form_control"
                          id="endTime"
                          placeholder="Enter Time Duration"
                          onChange={(e) => {
                            const c = { ...slot }
                            c.EndTime = e.target.value
                            setSlot(c)
                          }}
                          value={slot.EndTime}
                        />
                        {emptyValidation.EndTimeEmpty ? <p style={{ marginTop: "10px", color: "red" }}>End time is required</p> : ""}
                      </div>
                    </div>
                    <div className="form-group col-md-12 formbtncontainer__outercontainer--layout3">
                      <div className="formbtncontainer">
                        <button disabled={btnLock} type="submit" className="btn_primary submitbtn">
                          Create
                          {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                        </button>
                        <Link to="/ManageBusinessOwner" className="btn_primary_outline cancelbtn">
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

export default AddNewSlot
