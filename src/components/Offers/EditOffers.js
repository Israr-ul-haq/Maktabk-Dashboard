import React, { useEffect, useState } from "react"
import { Link, useParams, useHistory } from "react-router-dom"
import Swal from "sweetalert2"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import OfferService from "../../services/OfferService"
import Loader from "../../shared/Loader"
function EditOffers() {
  //State
  const [startDate, setStartDate] = useState(new Date())
  const { OfferId } = useParams()
  const [offer, setOffer] = useState({})
  const history = useHistory()
  const [offerCount, setOfferCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const [picture, setPicture] = useState(null)
  const [imgData, setImgData] = useState(null)
  const [btnLock, setBtnLock] = useState(false)
  const [emptyValidation, setEmptyValidation] = useState({
    imageEmpty: false,
    nameEmpty: false,
    addressEmpty: false,
    dateEmpty: false,
    descriptionEmpty: false,
  })
  // SERVICES
  const offerService = new OfferService()

  //UseEffect
  useEffect(() => {
    if (offerCount === 0) {
      getEvent()
      setOfferCount(1)
    }
  }, [offer, offerCount, imgData, startDate]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const deleteItem = () => {
    setPicture(null)
    setImgData(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let validCount = 0
    offer.date = startDate
    const c = { ...emptyValidation }
    if (imgData === null) {
      c.imageEmpty = true
      validCount++
    } else {
      c.imageEmpty = false
    }

    if (offer.Name === "") {
      c.nameEmpty = true
      validCount++
    } else {
      c.nameEmpty = false
    }

    if (offer.BusinessName === "") {
      c.addressEmpty = true
      validCount++
    } else {
      c.addressEmpty = false
    }

    if (offer.Date === "") {
      c.dateEmpty = true
      validCount++
    } else {
      c.dateEmpty = false
    }

    if (offer.Description === "") {
      c.descriptionEmpty = true
      validCount++
    } else {
      c.descriptionEmpty = false
    }
    setEmptyValidation(c)

    if (validCount > 0) {
      return
    }
    setBtnLock(true)
    offer.updatedBy = 4
    const response = await offerService.update(offer)

    if (response.data.Code === 1) {
      if (!(picture === null)) {
        const formData = new FormData()
        formData.append("id", response.data.Data.MaktabqOfferId)
        formData.append("ImagePath", picture)
        const imageResponse = await offerService.uploadImage(formData)
        if (imageResponse.data.Code === 1) {
          history.push("/ManageOffers")
          setBtnLock(false)

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Offer has been saved",
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
        history.push("/ManageOffers")
        setBtnLock(false)

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Offer has been saved",
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
    const response = await offerService.getById(OfferId)
    if (response.data.Code === 1) {
      setOffer(response.data.Data)
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

  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <Link className="arrow-container_link" to="/ManageOffers">
                  <img className="arrow-container_image" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" />
                  <h1 className="headertopbar_title">Edit Offer</h1>
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
                            {imgData ? (
                              <div class="uploadedimages">
                                <img class="uploadedimage" src={picture ? imgData : "http://18.159.202.37:81" + imgData} alt="uploaded_image" />
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
                        <label htmlfor="eventname">Offer Name</label>
                        <input
                          type="text"
                          name="eventname"
                          className="form_control"
                          placeholder="Enter Offer Name"
                          value={offer.Name}
                          onChange={(e) => {
                            const x = { ...offer }
                            x.Name = e.target.value
                            setOffer(x)
                          }}
                        />
                        {emptyValidation.nameEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Offer Name is Required </p> : ""}
                      </div>

                      <div className="form-group col-md-4">
                        <label htmlfor="date">Date</label>
                        <DatePicker selected={startDate} className="form_control" onChange={(date) => setStartDate(date)} />
                        {emptyValidation.dateEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Date is Required </p> : ""}
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlfor="description">Offer Details</label>
                        <input
                          type="text"
                          name="description"
                          className="form_control"
                          placeholder="Enter Offer Detail"
                          value={offer.Description}
                          onChange={(e) => {
                            const x = { ...offer }
                            x.Description = e.target.value
                            setOffer(x)
                          }}
                        />
                        {emptyValidation.descriptionEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Detail is Required </p> : ""}
                      </div>
                      <div className="form-group col-md-12 formbtncontainer__outercontainer">
                        <div className="formbtncontainer">
                          <button type="submit" disabled={btnLock} className="btn_primary submitbtn">
                            Update
                            {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                          </button>
                          <Link to="/ManageOffers" className="btn_primary_outline cancelbtn">
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
export default EditOffers
