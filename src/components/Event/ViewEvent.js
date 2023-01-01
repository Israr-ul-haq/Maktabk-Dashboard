import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import moment from "moment"
import EventService from "../../services/EventService"
import Loader from "../../shared/Loader"
import Swal from "sweetalert2"
function ViewEvent() {
  // SERVICES
  const eventService = new EventService()

  //State
  const [event, setEvent] = useState({})
  const [eventCount, setEventCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const { EventId } = useParams()

  //UseEffect
  useEffect(() => {
    if (eventCount === 0) {
      getEvent()
      setEventCount(1)
    }
  }, [event, eventCount]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions

  const getEvent = async () => {
    const response = await eventService.getById(EventId)
    if (response.data.Code === 1) {
      setEvent(response.data.Data)
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
                <Link className="arrow-container_link" to="/ManageEvent">
                  <img className="arrow-container_image" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" />
                  <h1 className="headertopbar_title">View Event</h1>
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
                        style={{ width: "65%", height: "150px", borderRadius: "15px" }}
                        alt="event_image"
                        src={event.ImagePath ? "http://18.159.202.37:81/" + event.ImagePath : "/img/images.png"}
                      />
                    </div>
                    <div className="col-md-12 ">
                      <div className="row event-container">
                        <div className="col-md-4 ">
                          <h3 className="view-profile-name">Event Name</h3>
                          <h4 className="view-profile-user-name">{event.Name}</h4>
                        </div>
                        <div className="col-md-4">
                          <h3 className="view-profile-name">Address</h3>
                          <h4 className="view-profile-user-name">{event.Address}</h4>
                        </div>
                        <div className="col-md-4">
                          <h3 className="view-profile-name">Date</h3>
                          <h4 className="view-profile-user-name"> {moment(event.Date).format("L")}</h4>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="view-event-description">
                        <h3 className="view-profile-name">RSVP</h3>
                        <h4 className="view-profile-user-name">{event.RSVP}</h4>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="view-event-description">
                        <h3 className="view-profile-name">Description</h3>
                        <h4 className="view-profile-user-name">{event.Description}</h4>
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
export default ViewEvent
