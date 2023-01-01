import React, { useEffect, useState } from "react"
import { useParams, Link, useHistory } from "react-router-dom"
import Loader from "../../shared/Loader"
import Swal from "sweetalert2"
import BookingService from "../../services/BookingService"
import moment from "moment"

function ViewBooking() {
  // SERVICES
  const bookingService = new BookingService()
  const [btnLock, setBtnLock] = useState()
  const [btnLockReject, setBtnLockReject] = useState()
  const history = useHistory()
  //State
  const [booking, setBooking] = useState({})
  const [slot, setSlot] = useState([])
  const [slotEmail, setSlotEmail] = useState([])
  const [eventCount, setEventCount] = useState(0)
  const [loader, setLoader] = useState(true)

  const { BookingId, Status } = useParams()

  //UseEffect
  useEffect(() => {
    if (eventCount === 0) {
      getBooking()
      status()
      setEventCount(1)
    }
  }, [booking, eventCount]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions
  let Date = moment(booking.Date).format("LL")
  const getBooking = async () => {
    const response = await bookingService.getById(BookingId)
    if (response.data.Code === 1) {
      setBooking(response.data.Data)
      setSlot(
        response.data.Data.BookingSlots.map((item) => {
          return {
            StartTime: item.StartTime,
            EndTime: item.EndTime,
          }
        })
      )
      setSlotEmail(
        response.data.Data.BookingPersons.map((item) => {
          return {
            BookingPersonEmail: item.BookingPersonEmail,
          }
        })
      )
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

  const status = () => {
    if (Status === "Accepted") {
      document.getElementById("accept").style.display = "none"
      document.getElementById("reject").style.display = "none"
    } else if (Status === "Rejected") {
      document.getElementById("accept").style.display = "none"
      document.getElementById("reject").style.display = "none"
      document.getElementById("complete").style.display = "none"
    } else if (Status === "Pending") {
      document.getElementById("complete").style.display = "none"
    } else {
      document.getElementById("accept").style.display = "none"
      document.getElementById("reject").style.display = "none"
      document.getElementById("complete").style.display = "none"
    }
  }
  const acceptBooking = async () => {
    setBtnLock(true)
    const response = await bookingService.accept(BookingId)
    if (response.data.Code === 1) {
      setBtnLock(false)
      history.push("/ManageBooking")

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Booking has been accepted!",
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

  const rejectBooking = async () => {
    setBtnLockReject(true)

    const response = await bookingService.reject(BookingId)
    if (response.data.Code === 1) {
      history.push("/ManageBooking")
      setBtnLockReject(false)
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Booking has been rejected!",
        showConfirmButton: true,
        timer: 5000,
      })
    }

    if (response.data.Code === 0) {
      setBtnLockReject(false)

      Swal.fire({
        position: "center",
        icon: "error",
        title: response.data.Data.Message,
        showConfirmButton: true,
        timer: 5000,
      })
    }
  }

  const completeBooking = async () => {
    setBtnLock(true)

    const response = await bookingService.complete(BookingId)
    if (response.data.Code === 1) {
      history.push("/ManageBooking")
      setBtnLock(false)
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Booking has been completed!",
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
                <Link className="arrow-container_link" to="/ManageBooking">
                  <img className="arrow-container_image" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" />
                  <h1 className="headertopbar_title">View Booking</h1>
                </Link>
              </div>
            </div>
            <div className="col-12 column_margin">
              <div className="card_custom">
                {loader ? (
                  Loader
                ) : (
                  <div className="row">
                    <div className="col-md-12">
                      <div className="row">
                        <div className="col-md-3">
                          <h3 className="view-profile-name">User Name</h3>
                          <h4 className="view-profile-user-name">{booking.CustomerName}</h4>
                          <div className="view-profile-pwd">
                            <h3 className="view-profile-name">No Of Persons</h3>
                            <h4 className="view-profile-user-name">{booking.Persons}</h4>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <h3 className="view-profile-name">Business Name</h3>
                          <h4 className="view-profile-user-name">{booking.BusinessName}</h4>
                        </div>
                        <div className="col-md-3">
                          <h3 className="view-profile-name">Available Slots</h3>
                          {slot.map((item) => {
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
                            return <h4 className="view-profile-user-name">{startTime + " " + endTime}</h4>
                          })}
                        </div>
                        <div className="col-md-3">
                          <h3 className="view-profile-name">Date</h3>
                          <h4 className="view-profile-user-name">{Date}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-12 column_margin">
              <div className="card_custom">
                {loader ? (
                  Loader
                ) : (
                  <div className="row">
                    <div className="col-md-12">
                      <h3 className="" style={{ paddingBottom: "10px" }}>
                        Email Addresses
                      </h3>
                      <div className="row">
                        <div className="col-md-3">
                          {slotEmail.map((item, i) => {
                            return (
                              <>
                                <h3 className="view-profile-name">Person # {++i} </h3>
                                <h4 className="view-profile-user-name">{item.BookingPersonEmail}</h4>
                              </>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-md-12">
                <div className="profile-business-buttons">
                  <button disabled={btnLock} onClick={completeBooking} id="complete" className="profile-business-accept btn btn-primary">
                    Complete {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                  </button>
                  <button disabled={btnLock} onClick={acceptBooking} id="accept" className="profile-business-accept btn btn-primary ">
                    Accepted {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                  </button>
                  <button disabled={btnLockReject} onClick={rejectBooking} id="reject" className="profile-business-reject btn btn-primary ">
                    Rejected {btnLockReject ? <div class="btnloader">{Loader}</div> : ""}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
export default ViewBooking
