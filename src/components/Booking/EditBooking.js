import React, { useState, useEffect } from "react"
import { Link, useHistory, useParams } from "react-router-dom"
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

function EditBooking() {
  // SERVICES
  const bookingService = new BookingService()
  const slotService = new SlotsService()
  const userService = new UsersService()

  const { BookingId } = useParams()

  //State
  const history = useHistory()
  // const [businessData, setBusinessData] = useState([])
  const [userData, setUserData] = useState([])
  const [userId, setUserId] = useState({})
  const [personNo, setPersonNo] = useState({})
  const [businessId, setBusinessId] = useState({})
  const [dataCount, setDataCount] = useState(0)
  const [loopItems, setLoopItems] = useState([])
  const [businessName, setBusinessName] = useState([])
  const [bookingSlotId, setBookingSlotId] = useState([])
  const [personEmails, setPersonEmails] = useState([])
  const [bookingData, setBookingData] = useState([])
  const [bookingSlotsData, setBookingSlotsData] = useState([])
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
      getBooking()

      setDataCount(1)
    }
  }, [userData, bookingSlot, bookingData, bookingSlotsData]) // eslint-disable-line react-hooks/exhaustive-deps

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

  ///single slot
  const getBooking = async (e) => {
    const response = await bookingService.getById(BookingId)

    setBookingSlotsData(response.data.Data.BookingSlots)
    getAvailibleSlotsData(response.data.Data)

    setBookingData(response.data.Data)
  }

  //multiple slots
  const getAvailibleSlotsData = async (business) => {
    // setBusinessId(e.target.value)
    const response = await slotService.getById(business.BusinessId, "")
    const finalArray = response.data.Data.map((item) => {
      return {
        BusinessId: item.BookingId,
        StartTime: item.StartTime,
        EndTime: item.EndTime,
      }
    })
    setBookingSlot(finalArray.concat(business.BookingSlots))
    setLoader(false)
  }

  const getAvailibleSlots = async (e) => {
    setBusinessId(e.target.value)
    const response = await slotService.getById(e.target.value, "")

    setBookingSlot(response.data.Data)
    setLoader(false)
  }

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

    const response = await bookingService.update(booking)
    if (response.data.Code === 1) {
      setBtnLock(false)
      history.push("/ManageBooking")

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Booking has been updated ",
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
        title: "Value must me less than 20",
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
                  <img className="headertopbar__arrowimage" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" /> Edit Booking
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
                          {userData.map((item) => {
                            return (
                              <option selected={bookingData.CustomerId === item.UserId ? true : false} value={item.UserId}>
                                {item.Name}
                              </option>
                            )
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
                          {businessName.map((item) => {
                            return (
                              <option selected={bookingData.BusinessId === item.BusinessId ? true : false} value={item.BusinessId}>
                                {item.BusinessName}
                              </option>
                            )
                          })}
                        </select>
                        {emptyValidation.businessNameEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Business name is required </p> : ""}
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
                          options={bookingSlot.map(function (item) {
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
                          })}
                          value={bookingSlotsData.map(function (item) {
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
                              value: item.BookingSlotId,
                              label: endTime + " " + startTime,
                            }
                          })}
                          onChange={(option) => setBookingSlot(option)}
                          className="basic-multi-select"
                          classNamePrefix="select"
                        />
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
                          value={bookingData.Persons}
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
                                Person # {++i}
                              </label>
                              <div>
                                <input
                                  onChange={(val) => addEmails(val, i - 1)}
                                  required
                                  type="email"
                                  placeholder="Enter Email Address"
                                  className="form_control"
                                  name={"business-email-address-" + i}
                                  id={"business-email-address-" + i}
                                />
                                <div className="tick-icon-absolute">
                                  <img className="tick-email" src="./img/Correct.png" id="tick-2" alt="tickicon" />
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
                          Save
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

export default EditBooking
