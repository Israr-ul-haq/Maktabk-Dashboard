import React, { useState, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import Swal from "sweetalert2"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import EventService from "../../services/EventService"
import Loader from "../../shared/Loader"
import moment from "moment"
import { geocodeByAddress, geocodeByPlaceId, getLatLng } from "react-places-autocomplete"
import PlacesAutocomplete from "react-places-autocomplete"
import CategoryService from "../../services/CategoryService"
function AddNewEvent() {
  // SERVICES
  const eventService = new EventService()
  const categoryservice = new CategoryService()

  //State
  const history = useHistory()
  const [event, setEvent] = useState({
    Name: "",
    Address: "",
    Description: "",
    Date: new Date(),
    Lat: "",
    Lng: "",
    RSVP: "",
    CreatedBy: JSON.parse(localStorage.getItem("makhtabquserId")),
    CategoryId: "",
  })
  const [picture, setPicture] = useState(null)
  const [categories, setCategories] = useState([])
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
    categoryEmpty: false,
  })

  //UseEffect
  useEffect(() => {}, [emptyValidation, event])
  //Functions
  const imagesPreview = (e) => {
    if (e.target.files[0]) {
      console.log("picture: ", e.target.files)
      setPicture(e.target.files[0])
      const reader = new FileReader()
      reader.addEventListener("load", () => {
        setImgData(reader.result)
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }
  useEffect(() => {
    getCategories()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
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

    if (event.CategoryId === "") {
      c.latEmpty = true
      validCount++
    } else {
      c.latEmpty = false
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

    const response = await eventService.save(event)
    if (response.data.Code === 1) {
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

  const handleChange = async (myaddress) => {
    const m = { ...event }
    m.Address = myaddress

    geocodeByAddress(myaddress)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        m.Lat = lat
        m.Lng = lng
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
                <Link to="ManageEvent" className="headertopbar_title">
                  {" "}
                  <img className="headertopbar__arrowimage" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" /> Add New Event
                </Link>
              </div>
            </div>
            <div className="col-12 column_margin">
              <div className="card_custom">
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
                          {imgData ? (
                            <div class="uploadedimages">
                              <img class="uploadedimage" src={imgData} alt="uploaded_image" />
                              <img onClick={deleteItem} class="delete_upload_image" alt="delete_uploaded_image" src="/img/cancel.svg" />
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <input onChange={imagesPreview} id="upload-image" name="upload-image" hidden type="file" accept=".png, .jpg, .jpeg" />
                        {emptyValidation.imageEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Image is required </p> : ""}
                      </div>
                    </div>

                    <div className="form-group col-md-4">
                      <div className="name">
                        <label htmlfor="username">Event Name</label>
                        <input
                          type="text"
                          name="username"
                          className="form_control"
                          placeholder="Event"
                          onChange={(e) => {
                            const c = { ...event }
                            c.Name = e.target.value
                            setEvent(c)
                          }}
                          value={event.Name}
                        />
                        {emptyValidation.nameEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Event name is required </p> : ""}
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="email-container position-relative">
                        <label htmlfor="uname" className="w-100 email-label">
                          Address
                        </label>
                        {/* <input
                          type="text"
                          name="uname"
                          placeholder="32 Blue Avenue, Melbourne London"
                          className="form_control"
                          id="email-address"
                          onChange={(e) => {
                            const c = { ...event }
                            c.Address = e.target.value
                            setEvent(c)
                          }}
                          value={event.Address}
                        /> */}
                        {/* <GooglePlacesAutocomplete
                          selectProps={{
                            onChange: handleChange,
                            placeholder: "Enter Address...",
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
                    </div>
                    <div className="form-group col-md-4">
                      <div className="phone-container position-relative">
                        <label htmlfor="tel" className="number-label">
                          Date
                        </label>
                        <DatePicker
                          selected={event.Date}
                          minDate={moment().toDate()}
                          className="form_control"
                          onChange={(date) => {
                            const c = { ...event }
                            c.Date = date
                            setEvent(c)
                          }}
                        />
                        {emptyValidation.dateEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Date is required </p> : ""}
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="password-container position-relative">
                        <label htmlfor="pwd" className="100">
                          Description
                        </label>
                        <input
                          type="text"
                          name="pwd"
                          className="form_control"
                          id="password"
                          placeholder="Online Concert at Zoom Meeting Tomorrow"
                          onChange={(e) => {
                            const c = { ...event }
                            c.Description = e.target.value
                            setEvent(c)
                          }}
                          value={event.Description}
                        />
                        {emptyValidation.descriptionEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Description is required </p> : ""}
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
                            c.CategoryId = e.target.value
                            setEvent(c)
                          }}
                          className="form_control"
                        >
                          <option value="" selected>
                            Select Category
                          </option>
                          {categories.map((item) => {
                            return <option value={item.CategoryId}>{item.Name}</option>
                          })}
                        </select>
                        {emptyValidation.categoryEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Category is required </p> : ""}
                      </div>
                    </div>

                    <div className="form-group col-md-4">
                      <div className="phone-container position-relative">
                        <label htmlfor="tel" className="number-label">
                          RSVP
                        </label>
                        <input
                          type="text"
                          placeholder="Enter RSVP"
                          selected={event.RSVP}
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
                    <div className="form-group col-md-12 formbtncontainer__outercontainer--layout3">
                      <div className="formbtncontainer">
                        <button disabled={btnLock} type="submit" className="btn_primary submitbtn">
                          Save
                          {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                        </button>
                        <Link to="ManageEvent" className="btn_primary_outline cancelbtn">
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
export default AddNewEvent
