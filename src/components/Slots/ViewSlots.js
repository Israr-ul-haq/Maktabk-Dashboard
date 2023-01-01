import moment from "moment"
import React, { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import Swal from "sweetalert2"
import SlotsService from "../../services/SlotsServices"
import deleteItem from "../../shared/DeleteItem"
import Loader from "../../shared/Loader"
import FullCalendar from "@fullcalendar/react" // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"
import interactionPlugin from "@fullcalendar/interaction"
import { Calendar } from "@fullcalendar/core"

function ViewSlots() {
  const [dataCount, setDataCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const { BusinessId } = useParams()
  const [slotData, setSlotData] = useState([])
  const [slotData1, setSlotData1] = useState([])

  const slotsService = new SlotsService()

  //UseEffect
  useEffect(() => {
    if (dataCount === 0) {
      getSlots()
      setDataCount(1)
    }
  }, [slotData, slotData1]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions

  const getSlots = async () => {
    setLoader(true)
    const response = await slotsService.getById(BusinessId, "")
    setLoader(false)
    setSlotData(
      response.data.Data.map((item) => {
        return {
          Date: item.Date,
          StartTime: item.StartTime,
          EndTime: item.EndTime,
          Seats: item.Seats,
          BusinessSlotId: item.BusinessSlotId,
          IsAllDay: item.IsAllDay,
        }
      })
    )

    setSlotData1(
      response.data.Data.map((item) => {
        return {
          Date: item.Date,
          StartTime: item.StartTime,
          EndTime: item.EndTime,
          Seats: item.Seats,
          BusinessSlotId: item.BusinessSlotId,
          IsAllDay: item.IsAllDay,
        }
      })
    )
  }
  const handleDateClick = async (arg) => {
    const response = await slotsService.getById(BusinessId, arg.dateStr)
    setSlotData1(
      response.data.Data.map((item) => {
        return {
          Date: item.Date,
          StartTime: item.StartTime,
          EndTime: item.EndTime,
          Seats: item.Seats,
          BusinessSlotId: item.BusinessSlotId,
          IsAllDay: item.IsAllDay,
        }
      })
    )
  }

  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <Link className="arrow-container_link" to="/ManageBusinessOwner">
                  <img className="arrow-container_image" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" />
                  <h1 className="headertopbar_title">ManageSlots</h1>
                </Link>
                <Link to={`/AddNewSlot/${BusinessId}`} className="headertopbar_btn btn_primary">
                  Create New Slots
                </Link>
              </div>
            </div>
            <div className="col-12 column_margin">
              <div className="card_custom">
                <FullCalendar
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  events={slotData.map((item) => {
                    return { title: "Availible Slot", date: moment(item.Date).format("YYYY-MM-DD") }
                  })}
                  dateClick={handleDateClick}
                />
              </div>
            </div>
            {loader
              ? Loader
              : slotData1.map((item) => {
                  let startTime = ""
                  let checkTime = ""
                  let endTime = ""
                  let checktime = ""
                  if (!item.IsAllDay) {
                    startTime = item.StartTime.substring(0, 5)
                    checkTime = parseInt(item.StartTime.substring(0, 2))
                    endTime = item.EndTime.substring(0, 5)
                    if (checkTime >= 12) {
                      startTime += "PM"
                    } else {
                      startTime += "AM"
                    }

                    if (checktime >= 12) {
                      endTime += "PM"
                    } else {
                      endTime += "AM"
                    }
                  }

                  let Date = moment(item.Date).format("LL")

                  return (
                    <div className="slotsFlex">
                      <div className="col-12">
                        <div className="timeslots">
                          <div className="timeslots_column">
                            <div className="timeslot">
                              <div className="timeslot_left">
                                <h4 className="timeslot_date">{Date}</h4>

                                {item.IsAllDay ? (
                                  <h4 className="timeslot_time">{item.IsAllDay}24 hour</h4>
                                ) : (
                                  <h4 className="timeslot_time">{startTime + " - " + endTime}</h4>
                                )}

                                {/* <Link to={`/EditSlot/${item.BusinessSlotId}/${BusinessId}`} className="TableEdit">
                                                                <img alt="table-action" className="tableactions_image" src="./img/Edit.svg" />
                                                            </Link> */}
                              </div>
                              <div className="timeslot_right">
                                <h4 className="timeslot_persons">{item.Seats} Persons</h4>
                                <button
                                  className="timeslot_deleteslot"
                                  onClick={() => deleteItem(item.BusinessSlotId, slotData, slotsService, "Slots", setLoader)}
                                >
                                  Delete Slot
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
          </div>
        </div>
      </main>
    </div>
  )
}
export default ViewSlots
