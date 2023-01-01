import React, { useEffect, useState } from "react"
import { Link, useParams, useHistory } from "react-router-dom"
import Swal from "sweetalert2"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import EventService from "../../services/EventService"
import Loader from "../../shared/Loader"
import moment from "moment"
import { geocodeByAddress, geocodeByPlaceId, getLatLng } from "react-places-autocomplete"
import PlacesAutocomplete from "react-places-autocomplete"
import CategoryService from "../../services/CategoryService"
function EditEvent() {
  //State
  const categoryservice = new CategoryService()
  const [startDate, setStartDate] = useState(new Date())
  const { EventId } = useParams()
  const [event, setEvent] = useState({})
  const history = useHistory()
  const [eventCount, setEventCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const [categories, setCategories] = useState([])
  const [picture, setPicture] = useState(null)
  const [imgData, setImgData] = useState(null)
  const [btnLock, setBtnLock] = useState(false)
  const [emptyValidation, setEmptyValidation] = useState({
    imageEmpty: false,
    nameEmpty: false,
    addressEmpty: false,
    dateEmpty: false,
    descriptionEmpty: false,
    latEmpty: false,
    lngEmpty: false,
    RSVPEmpty: false,
  })
  // SERVICES
  const eventService = new EventService()

  //UseEffect
  useEffect(() => {
    if (eventCount === 0) {
      getEvent()
      getCategories()
      setEventCount(1)
    }
  }, [event, eventCount, imgData, startDate]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions
  const imagesPreview = (e) => {
    if (e.target.files[0]) {
      setPicture(e.target.files[0])
      const reader = new FileReader()
      reader.addEventListener("load", () => {
        setImgData(reader.result)
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }
  const getCategories = async () => {
    const response = await categoryservice.get("")
    setCategories(response.data.Data)
  }

  const deleteItem = () => {
    setPicture(null)
    setImgData(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let validCount = 0
    event.Date = startDate
    const c = { ...emptyValidation }
    if (imgData === null) {
      c.imageEmpty = true
      validCount++
    } else {
      c.imageEmpty = false
    }

    if (event.Name === "") {
      c.nameEmpty = true
      validCount++
    } else {
      c.nameEmpty = false
    }

    if (event.Address === "") {
      c.addressEmpty = true
      validCount++
    } else {
      c.addressEmpty = false
    }

    if (event.Date === "") {
      c.dateEmpty = true
      validCount++
    } else {
      c.dateEmpty = false
    }

    if (event.Description === "") {
      c.descriptionEmpty = true
      validCount++
    } else {
      c.descriptionEmpty = false
    }
    if (event.Lat === "") {
      c.latEmpty = true
      validCount++
    } else {
      c.latEmpty = false
    }
    if (event.Lng === "") {
      c.lngEmpty = true
      validCount++
    } else {
      c.lngEmpty = false
    }
    if (event.RSVP === "") {
      c.RSVPEmpty = true
      validCount++
    } else {
      c.RSVPEmpty = false
    }

    setEmptyValidation(c)

    if (validCount > 0) {
      return
    }
    setBtnLock(true)
    event.updatedBy = JSON.parse(localStorage.getItem("makhtabquserId"))
    const response = await eventService.update(event)

    if (response.data.Code === 1) {
      if (!(picture === null)) {
        const formData = new FormData()
        formData.append("id", response.data.Data.EventId)
        formData.append("ImagePath", picture)
        const imageResponse = await eventService.uploadImage(formData)
        if (imageResponse.data.Code === 1) {
          history.push("/ManageEvent")
          setBtnLock(false)

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Event has been saved",
            showConfirmButton: true,
            timer: 5000,
          })
        }

        if (imageResponse.data.Code === 0) {
          setBtnLock(false)
          Swal.fire({
            position: "center",
            icon: "error",
            title: imageResponse.data.Data.Message,
            showConfirmButton: true,
            timer: 5000,
          })
        }
      } else {
        history.push("/ManageEvent")
        setBtnLock(false)

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Event has been saved",
          showConfirmButton: true,
          timer: 5000,
        })
      }
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
    const response = await eventService.getById(EventId)
    if (response.data.Code === 1) {
      setEvent(response.data.Data)
      setImgData(response.data.Data.ImagePath)
      setStartDate(new Date(response.data.Data.Date))

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
  const handleChange = async (myaddress) => {
    const m = { ...event }
    m.Address = myaddress

    geocodeByAddress(myaddress)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        m.Latitude = lat
        m.Longitude = lng
      })
    setEvent(m)
    console.log(m)
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
                  <h1 className="headertopbar_title">Edit Event</h1>
                </Link>
              </div>
            </div>
            <div className="col-12">
              <div className="card_custom">
                {loader ? (
                  Loader
                ) : (
                  <form className="myform" onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group col-md-12 form-group--uploadimage">
                        <div className="file-upload position-relative">
                          <div class="imagecontainer">
                            <label for="upload-image" class="upload-image-label">
                              <div className="file-pic">
                                <h5 className="upload-image-title">Upload Image</h5>

                                <img src="/img/icon_upload_add_load@2x.png" id="image-icon" alt="upload_image" />
                              </div>
                              <img id="cross-icon" alt="delete_image" src="/img/cancel.svg" />
                            </label>

                            <div class="uploadedimages">
                              <img class="uploadedimage" src={picture ? imgData : "http://18.159.202.37:81" + imgData} alt="uploaded_image" />
                              <img onClick={deleteItem} class="delete_upload_image" alt="delete_uploaded_image" src="/img/cancel.svg" />
                            </div>
                          </div>
                          <input onChange={imagesPreview} id="upload-image" name="upload-image" hidden type="file" accept=".png, .jpg, .jpeg" />
                          {emptyValidation.imageEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Image is required </p> : ""}
                        </div>
                      </div>

                      <div className="form-group col-md-4">
                        <label htmlfor="eventname">Event Name</label>
                        <input
                          type="text"
                          name="eventname"
                          className="form_control"
                          placeholder="Enter Event Name"
                          value={event.Name}
                          onChange={(e) => {
                            const x = { ...event }
                            x.Name = e.target.value
                            setEvent(x)
                          }}
                        />
                        {emptyValidation.nameEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Event name is required </p> : ""}
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlfor="eventaddress">Address</label>
                        {/* <input
                          type="text"
                          name="eventaddress"
                          className="form_control"
                          placeholder="Enter Address"
                          value={event.Address}
                          onChange={(e) => {
                            const x = { ...event }
                            x.Address = e.target.value
                            setEvent(x)
                          }}
                        /> */}
                        <PlacesAutocomplete value={event.Address} onChange={handleChange}>
                          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div>
                              <input
                                {...getInputProps({
                                  placeholder: "Search Places ...",
                                  className: "form-control input-md",
                                  autoFocus: true,
                                })}
                                className="form_control"
                              />
                              <div className="autocomplete-dropdown-container">
                                {loading && <div>Loading...</div>}
                                {suggestions.map((suggestion) => {
                                  const className = suggestion.active ? "suggestion-item--active" : "suggestion-item"
                                  // inline style for demonstration purpose
                                  const style = suggestion.active
                                    ? { backgroundColor: "#fafafa", cursor: "pointer" }
                                    : { backgroundColor: "#ffffff", cursor: "pointer" }
                                  return (
                                    <div
                                      {...getSuggestionItemProps(suggestion, {
                                        className,
                                        style,
                                      })}
                                    >
                                      <span>{suggestion.description}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </PlacesAutocomplete>
                        {emptyValidation.addressEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Address is required </p> : ""}
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlfor="date">Date</label>
                        <DatePicker
                          minDate={moment().toDate()}
                          selected={startDate}
                          className="form_control"
                          onChange={(date) => setStartDate(date)}
                        />
                        {emptyValidation.dateEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Date is required </p> : ""}
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlfor="description">Description</label>
                        <input
                          type="text"
                          name="description"
                          className="form_control"
                          placeholder="Enter Description"
                          value={event.Description}
                          onChange={(e) => {
                            const x = { ...event }
                            x.Description = e.target.value
                            setEvent(x)
                          }}
                        />
                        {emptyValidation.descriptionEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Description is required </p> : ""}
                      </div>
                      {/* <div className="form-group col-md-4">
                        <div className="phone-container position-relative">
                          <label htmlfor="tel" className="number-label">
                            latitude
                          </label>
                          <input
                            type="number"
                            placeholder="Enter Latitude"
                            value={event.Lat}
                            className="form_control"
                            onChange={(e) => {
                              const x = { ...event }
                              x.Lat = e.target.value
                              setEvent(x)
                            }}
                          />
                          {emptyValidation.latEmpty ? <p style={{ marginTop: "5px", color: "red" }}>latitude is required </p> : ""}
                        </div>
                      </div>
                      <div className="form-group col-md-4">
                        <div className="phone-container position-relative">
                          <label htmlfor="tel" className="number-label">
                            longitude
                          </label>
                          <input
                            type="number"
                            placeholder="Enter Longitude"
                            value={event.Lng}
                            className="form_control"
                            onChange={(e) => {
                              const x = { ...event }
                              x.Lng = e.target.value
                              setEvent(x)
                            }}
                          />
                          {emptyValidation.lngEmpty ? <p style={{ marginTop: "5px", color: "red" }}>longitude is required </p> : ""}
                        </div> */}
                      {/* </div> */}
                      <div className="form-group col-md-4">
                        <div className="phone-container position-relative">
                          <label htmlfor="tel" className="number-label">
                            RSVP
                          </label>
                          <input
                            type="text"
                            placeholder="Enter RSVP"
                            value={event.RSVP}
                            className="form_control"
                            onChange={(e) => {
                              const c = { ...event }
                              c.RSVP = e.target.value
                              setEvent(c)
                            }}
                          />
                          {emptyValidation.RSVPEmpty ? <p style={{ marginTop: "5px", color: "red" }}>RSVP is required </p> : ""}
                        </div>
                      </div>
                      <div className="form-group col-md-4">
                        <div className="phone-container position-relative">
                          <label htmlfor="tel" className="number-label">
                            Categories
                          </label>
                          <select
                            onChange={(e) => {
                              const c = { ...event }
                              c.Category = e.target.value
                              setEvent(c)
                            }}
                            className="form_control"
                          >
                            {categories.map((item) => {
                              if (item.Name === event.CategoryId) {
                                return (
                                  <option selected value={item.Name}>
                                    {item.Name}
                                  </option>
                                )
                              } else {
                                return <option value={item.CategoryId}>{item.Name}</option>
                              }
                            })}
                          </select>
                          {emptyValidation.businessCategoryEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Category is required </p> : ""}
                        </div>
                      </div>
                      <div className="form-group col-md-12 formbtncontainer__outercontainer">
                        <div className="formbtncontainer">
                          <button type="submit" disabled={btnLock} className="btn_primary submitbtn">
                            Save
                            {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                          </button>
                          <Link to="/ManageEvent" className="btn_primary_outline cancelbtn">
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
export default EditEvent
