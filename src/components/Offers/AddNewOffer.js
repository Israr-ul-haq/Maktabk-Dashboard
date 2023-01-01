import React, { useState, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import Swal from "sweetalert2"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import OfferService from "../../services/OfferService"
import Loader from "../../shared/Loader"
import BusinessNameService from "../../services/BusinessNameService"
function AddNewOffer() {
  // SERVICES
  const offerService = new OfferService()
  const businessNameService = new BusinessNameService()
  //State
  const history = useHistory()
  const [offer, setOffer] = useState({
    name: "",
    address: "",
    description: "",
    date: new Date(),
    // BusinessId: 3,
    CreatedBy: 1,
  })
  const [businessName, setBusinessName] = useState([])
  const [businessInfos, setBusinessInfos] = useState({
    Name: "",
  })
  const [picture, setPicture] = useState(null)
  const [imgData, setImgData] = useState(null)
  const [btnLock, setBtnLock] = useState(false)
  const [emptyValidation, setEmptyValidation] = useState({
    imageEmpty: false,
    nameEmpty: false,
    addressEmpty: false,
    dateEmpty: false,
    descriptionEmpty: false,
    businessNameEmpty: false,
  })

  //UseEffect
  useEffect(() => {}, [emptyValidation, offer])
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
  // useEffect(() => {
  //   getBusinessName()
  // }, []) // eslint-disable-line react-hooks/exhaustive-deps
  // const getBusinessName = async () => {
  //   const response = await businessNameService.get()
  //   setBusinessName(response.data.Data)
  // }

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

    if (offer.name === "") {
      c.nameEmpty = true
      validCount++
    } else {
      c.nameEmpty = false
    }

    if (offer.date === "") {
      c.dateEmpty = true
      validCount++
    } else {
      c.dateEmpty = false
    }

    if (offer.description === "") {
      c.descriptionEmpty = true
      validCount++
    } else {
      c.descriptionEmpty = false
    }
    // if (businessInfos.Name === "") {
    //   c.businessNameEmpty = true
    //   validCount++
    // } else {
    //   c.businessNameEmpty = false
    // }
    setEmptyValidation(c)

    if (validCount > 0) {
      return
    }
    setBtnLock(true)

    const response = await offerService.save(offer)
    debugger
    if (response.data.Code === 1) {
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
                <Link to="ManageOffers" className="headertopbar_title">
                  {" "}
                  <img className="headertopbar__arrowimage" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" /> Add New Offer
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
                        <label htmlfor="username">Offer Name</label>
                        <input
                          type="text"
                          name="username"
                          className="form_control"
                          placeholder="Offer"
                          onChange={(e) => {
                            const c = { ...offer }
                            c.name = e.target.value
                            setOffer(c)
                          }}
                          value={offer.name}
                        />
                        {emptyValidation.nameEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Offer Name is Required </p> : ""}
                      </div>
                    </div>
                    {/* <div className="form-group col-md-4">
                      <div className="phone-container position-relative">
                        <label htmlfor="tel" className="number-label">
                          Business Name
                        </label>
                        <select
                          onChange={(e) => {
                            const c = { ...offer }
                            c.BusinessId = e.target.value
                            setOffer(c)
                          }}
                          className="form_control"
                        >
                          {businessName.map((item) => {
                            return <option value={item.BusinessId}>{item.Name}</option>
                          })}
                        </select>
                        {emptyValidation.businessNameEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Business Name is Required </p> : ""}
                      </div>
                    </div> */}
                    <div className="form-group col-md-4">
                      <div className="phone-container position-relative">
                        <label htmlfor="tel" className="number-label">
                          Date and Time
                        </label>
                        <DatePicker
                          selected={offer.date}
                          className="form_control"
                          onChange={(date) => {
                            const c = { ...offer }
                            c.date = date
                            setOffer(c)
                          }}
                        />
                        {emptyValidation.dateEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Date is Required </p> : ""}
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="password-container position-relative">
                        <label htmlfor="pwd" className="100">
                          Offer Details
                        </label>
                        <input
                          type="text"
                          name="pwd"
                          className="form_control"
                          id="password"
                          placeholder="Online Concert at Zoom Meeting Tomorrow"
                          onChange={(e) => {
                            const c = { ...offer }
                            c.description = e.target.value
                            setOffer(c)
                          }}
                          value={offer.description}
                        />
                        {emptyValidation.descriptionEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Detail is Required </p> : ""}
                      </div>
                    </div>
                    <div className="form-group col-md-12 formbtncontainer__outercontainer--layout3">
                      <div className="formbtncontainer">
                        <button disabled={btnLock} type="submit" className="btn_primary submitbtn">
                          Save
                          {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                        </button>
                        <Link to="ManageOffers" className="btn_primary_outline cancelbtn">
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
export default AddNewOffer
