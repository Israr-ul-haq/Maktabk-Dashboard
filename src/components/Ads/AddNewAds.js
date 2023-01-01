import React, { useState, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import Swal from "sweetalert2"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Loader from "../../shared/Loader"
import { AdsTypes } from "../../constants/AdsTypes"
import moment from "moment"
import AdsService from "../../services/AdsService"

function AddNewAd() {
  // SERVICES
  const adsService = new AdsService()

  //State
  const history = useHistory()
  const [data, setData] = useState({
    Title: "",
    Description: "",
    Date: new Date(),
    AdTypeId: 0,
    CreatedBy: JSON.parse(localStorage.getItem("makhtabquserId")),
  })
  const [picture, setPicture] = useState(null)
  const [imgData, setImgData] = useState(null)
  const [btnLock, setBtnLock] = useState(false)
  const [emptyValidation, setEmptyValidation] = useState({
    imageEmpty: false,
    TitleEmpty: false,
    DescriptionEmpty: false,
    dateEmpty: false,
  })

  //UseEffect
  useEffect(() => {}, [emptyValidation, data])
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

    if (data.Title === "") {
      c.TitleEmpty = true
      validCount++
    } else {
      c.nameEmpty = false
    }

    if (data.Date === "") {
      c.dateEmpty = true
      validCount++
    } else {
      c.dateEmpty = false
    }

    if (data.Description === "") {
      c.DescriptionEmpty = true
      validCount++
    } else {
      c.DescriptionEmpty = false
    }

    setEmptyValidation(c)

    if (validCount > 0) {
      return
    }
    setBtnLock(true)

    const response = await adsService.save(data)
    if (response.data.Code === 1) {
      const formData = new FormData()
      formData.append("id", response.data.Data.Id)
      formData.append("ImagePath", picture)
      const imageResponse = await adsService.uploadImage(formData)
      if (imageResponse.data.Code === 1) {
        history.push("/ManageAds")
        setBtnLock(false)

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Ad has been saved",
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

  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <Link to="/ManageAds" className="headertopbar_title">
                  {" "}
                  <img className="headertopbar__arrowimage" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" /> Generate New Ads
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
                        <label htmlfor="username">Title</label>
                        <input
                          type="text"
                          name="username"
                          className="form_control"
                          placeholder="Title"
                          onChange={(e) => {
                            const c = { ...data }
                            c.Title = e.target.value
                            setData(c)
                          }}
                          value={data.Title}
                        />
                        {emptyValidation.TitleEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Title is required </p> : ""}
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="phone-container position-relative">
                        <label htmlfor="tel" className="number-label">
                          Date
                        </label>
                        <DatePicker
                          selected={data.Date}
                          minDate={moment().toDate()}
                          className="form_control"
                          onChange={(date) => {
                            const c = { ...data }
                            c.Date = date
                            setData(c)
                          }}
                        />
                        {emptyValidation.dateEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Date is required </p> : ""}
                      </div>
                    </div>
                    {/* <div className="form-group col-md-4">
                      <div className="phone-container position-relative">
                        <label htmlfor="tel" className="number-label">
                          Ad Type
                        </label>
                        <select
                          onChange={(e) => {
                            const c = { ...data }
                            c.AdTypeId = e.target.value
                            setData(c)
                          }}
                          className="form_control"
                        >
                          <option value="" selected>
                            Select Category
                          </option>
                          <option value={AdsTypes.booking}>Booking</option>
                          <option value={AdsTypes.checkIn}>Check In</option>
                          <option value={AdsTypes.maktabqUpdates}>Maktabk Updates</option>
                        </select>
                        {emptyValidation.businessCategoryEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Category is required </p> : ""}
                      </div>
                    </div> */}
                    <div className="form-group col-md-12">
                      <div className="password-container position-relative">
                        <label htmlfor="pwd" className="100">
                          Description
                        </label>
                        <textarea
                          style={{ height: "160px", paddingTop: "10px" }}
                          rows="40"
                          className="form_control"
                          placeholder="Online Concert at Zoom Meeting Tomorrow"
                          onChange={(e) => {
                            const c = { ...data }
                            c.Description = e.target.value
                            setData(c)
                          }}
                          value={data.Description}
                        ></textarea>
                        {emptyValidation.DescriptionEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Description is required </p> : ""}
                      </div>
                    </div>

                    <div className="form-group col-md-12 formbtncontainer__outercontainer--layout3">
                      <div className="formbtncontainer">
                        <button disabled={btnLock} type="submit" className="btn_primary submitbtn">
                          Save
                          {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                        </button>
                        <Link to="/ManageAds" className="btn_primary_outline cancelbtn">
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
export default AddNewAd
