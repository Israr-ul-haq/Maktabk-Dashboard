import React, { useState, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import Swal from "sweetalert2"
import "react-datepicker/dist/react-datepicker.css"
import Loader from "../../shared/Loader"
import BookingService from "../../services/BookingService"
import SlotsService from "../../services/SlotsServices"
import { UserTypes } from "../../constants/UserTypes"
import UsersService from "../../services/UsersService"
import DatePicker from "react-datepicker"
import moment from "moment"
import Select from "react-select"

function AddNewBooking() {
  // SERVICES
  const bookingService = new BookingService()
  const slotService = new SlotsService()
  const userService = new UsersService()

  //State
  const history = useHistory()
  // const [businessData, setBusinessData] = useState([])
  const [userData, setUserData] = useState([])
  const [userId, setUserId] = useState({ CustomerId: "" })
  const [personNo, setPersonNo] = useState({
    Persons: "",
  })
  const [businessId, setBusinessId] = useState({
    BusinessId: "",
  })
  const [dataCount, setDataCount] = useState(0)
  const [loopItems, setLoopItems] = useState([])
  const [businessName, setBusinessName] = useState([])
  const [bookingSlotId, setBookingSlotId] = useState([])
  const [personEmails, setPersonEmails] = useState([])
  const [loader, setLoader] = useState(true)
  const [booking, setBooking] = useState({
    BusinessId: 0,
    CustomerId: 0,
    Date: new Date(),
    Persons: 0,
    BookingSlots: [],
    BookingPersons: [],
  })

  const [bookingSlot, setBookingSlot] = useState([])

  const [btnLock, setBtnLock] = useState(false)
  const [emptyValidation, setEmptyValidation] = useState({
    userNameEmpty: false,
    businessNameEmpty: false,
    personsEmpty: false,
  })

  useEffect(() => {
    if (dataCount === 0) {
      getUsers()
      getBusinesses()
      setDataCount(1)
    }
  }, [userData]) // eslint-disable-line react-hooks/exhaustive-deps

  const getUsers = async () => {
    setLoader(true)
    const response = await userService.get("", 0, UserTypes.User)
    setUserData(response.data.Data.Users)
  }
  const getBusinesses = async () => {
    const response = await slotService.getBusinesses("")
    setBusinessName(response.data.Data)
    setLoader(false)
  }
  const getAvailibleSlots = async (e) => {
    setBusinessId(e.target.value)
    const response = await slotService.getById(e.target.value, "")
    setBookingSlot(response.data.Data)
    setLoader(false)
  }
  const personValid = () => {
    // let pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
    // var email = document.getElementById("business-email-address").value
    // if (!pattern.test(email)) {
    //     document.querySelector("#tick-2").style.display = "none"
    // } else {
    //     document.querySelector("#tick-2").style.display = "block"
    // }
  }

  //UseEffect
  useEffect(() => {}, [emptyValidation])
  //Functions

  const handleSubmit = async (e) => {
    e.preventDefault()
    let pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
    let validCount = 0
    const c = { ...emptyValidation }

    if (userId.CustomerId === "") {
      c.userNameEmpty = true
      validCount++
    } else {
      c.userNameEmpty = false
    }

    if (businessId.BusinessId === "") {
      c.businessNameEmpty = true
      validCount++
    } else {
      c.businessNameEmpty = false
    }
    if (personNo.Persons === "") {
      c.personsEmpty = true
      validCount++
    } else {
      c.personsEmpty = false
    }

    setEmptyValidation(c)

    if (validCount > 0) {
      return
    }
    setBtnLock(true)

    booking.BusinessId = parseInt(businessId)
    booking.Persons = parseInt(personNo)
    booking.BookingPersons = personEmails.map((item) => {
      return { Email: item }
    })
    booking.CustomerId = parseInt(userId.CustomerId)
    booking.BookingSlots = bookingSlotId.map((item) => {
      return { BusinessSlotId: item.value }
    })
    booking.Date = moment(booking.Date).format("L")
    history.push("/ManageBooking")
    const response = await bookingService.save(booking)

    if (response.data.Code === 1) {
      setBtnLock(false)
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Booking has been saved",
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

  function input_person(e) {
    if (e.target.value < 20) {
      if (e.target.value) {
        setPersonNo(e.target.value)
        const totalItems = parseInt(e.target.value)
        const items = new Array(totalItems).fill(null)
        setLoopItems(items)
      } else {
        const totalItems = parseInt(0)
        const items = new Array(totalItems).fill(null)
        setLoopItems(items)
      }
    } else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Value must be less than 20",
        showConfirmButton: true,
        timer: 5000,
      })
    }
  }

  function addEmails(val, index) {
    let temp = personEmails
    temp[index] = val.target.value
    console.log(temp)
    setPersonEmails(temp)
  }

  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <Link to="/ManageBooking" className="headertopbar_title">
                  {" "}
                  <img className="headertopbar__arrowimage" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" /> Create Booking
                </Link>
              </div>
            </div>
            <div className="col-12 column_margin">
              <div className="card_custom">
                <form className="myform" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group col-md-4">
                      <div className="name">
                        <label htmlfor="username">User Name</label>
                        <select
                          className="form_control"
                          onChange={(e) => {
                            const c = { ...userId }

                            if (e.target.value === "") {
                              c.CustomerId = ""
                              setUserId(c)
                            } else {
                              c.CustomerId = e.target.value
                              setUserId(c)
                            }
                          }}
                        >
                          <option value="" selected>
                            Select User Name
                          </option>

                          {userData.map((item) => {
                            return <option value={item.UserId}>{item.Name}</option>
                          })}
                        </select>
                        {emptyValidation.userNameEmpty ? <p style={{ marginTop: "5px", color: "red" }}>User name is required </p> : ""}
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="email-container position-relative">
                        <label htmlfor="uname" className="w-100 email-label">
                          Business Name
                        </label>
                        <select onChange={getAvailibleSlots} className="form_control">
                          <option value="" selected>
                            Select Business Name
                          </option>
                          {businessName.map((item) => {
                            return <option value={item.BusinessId}>{item.BusinessName}</option>
                          })}
                        </select>
                        {emptyValidation.businessNameEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Business name is required </p> : ""}
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="password-container position-relative">
                        <label htmlfor="pwd" className="100">
                          Date
                        </label>
                        <DatePicker
                          selected={booking.Date}
                          minDate={moment().toDate()}
                          className="form_control"
                          onChange={(date) => {
                            const c = { ...booking }
                            c.Date = date
                            setBooking(c)
                          }}
                        />
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="password-container position-relative">
                        <label htmlfor="pwd" className="100">
                          Available Slots
                        </label>
                        <Select
                          isMulti
                          name="colors"
                          options={
                            bookingSlot.length === 0
                              ? [
                                  {
                                    value: "",
                                    label: "Loading...",
                                  },
                                ]
                              : bookingSlot.map(function (item) {
                                  if (!item.IsAllDay) {
                                    let startTime = item.StartTime.substring(0, 5)
                                    let checkTime = parseInt(item.StartTime.substring(0, 2))
                                    if (checkTime >= 12) {
                                      startTime += "PM"
                                    } else {
                                      startTime += "AM"
                                    }

                                    let endTime = item.EndTime.substring(0, 5)
                                    let checktime = parseInt(item.EndTime.substring(0, 2))
                                    if (checktime >= 12) {
                                      endTime += "PM"
                                    } else {
                                      endTime += "AM"
                                    }
                                    return {
                                      value: item.BusinessSlotId,
                                      label: endTime + " " + startTime,
                                    }
                                  } else {
                                    return {
                                      value: item.BusinessSlotId,
                                      label: "24 hours",
                                    }
                                  }
                                })
                          }
                          isSearchable
                          required
                          onChange={(option) => setBookingSlotId(option)}
                          className="basic-multi-select"
                          classNamePrefix="select"
                        />
                      </div>
                    </div>

                    <div className="form-group col-md-4">
                      <div className="email-container position-relative">
                        <label htmlfor="uname" className="w-100 email-label">
                          No Of Persons
                        </label>
                        <input
                          type="number"
                          name="uname"
                          placeholder="Persons"
                          className="form_control"
                          id="no_Of_Persons"
                          onChange={input_person}
                          // value={booking.Persons}
                        />
                        {emptyValidation.personsEmpty ? <p style={{ marginTop: "5px", color: "red" }}>No of persons is required </p> : ""}
                      </div>
                    </div>

                    {loopItems.length > 0 ? (
                      <div className="email_person_header col-md-12">
                        <p className="person_heading">Please Enter their Email Address</p>
                      </div>
                    ) : (
                      ""
                    )}

                    {loopItems.map((v, i) => {
                      return (
                        <>
                          <div className="form-group col-md-4" id="container">
                            <div className="email-container position-relative">
                              <label htmlfor="uname" className="w-100 email-label">
                                Person {++i}
                              </label>
                              <div>
                                <div className="position_relative">
                                  <input
                                    onKeyUp={personValid}
                                    onChange={(val) => addEmails(val, i - 1)}
                                    required
                                    type="email"
                                    placeholder="Enter Email Address"
                                    className="form_control"
                                    name={"business-email-address-" + i}
                                    id={"business-email-address-" + i}
                                  />

                                  <img className="tick_icon_email" src="./img/CorrectSvg.svg" id="tick-2" alt="tickicon" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    })}

                    <div className="form-group col-md-12 formbtncontainer__outercontainer--layout3">
                      <div className="formbtncontainer">
                        <button disabled={btnLock} type="submit" className="btn_primary submitbtn">
                          Create
                          {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                        </button>
                        <Link to="/ManageBooking" className="btn_primary_outline cancelbtn">
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

export default AddNewBooking
