import React, { useEffect, useState } from "react"
import { Link, useParams, useHistory } from "react-router-dom"
import Swal from "sweetalert2"
import FeatureService from "../../services/FeatureService"
import CategoryService from "../../services/CategoryService"
import Loader from "../../shared/Loader"
function EditFeature() {
  //State

  const [startDate, setStartDate] = useState(new Date())
  const { FeatureId } = useParams()
  const [feature, setFeature] = useState({})
  const history = useHistory()
  const [featureCount, setFeatureCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const [picture, setPicture] = useState(null)
  const [picture1, setPicture1] = useState(null)
  const [imgData, setImgData] = useState(null)
  const [img1Data, setImg1Data] = useState(null)
  const [btnLock, setBtnLock] = useState(false)
  const [categories, setCategories] = useState([])
  const [emptyValidation, setEmptyValidation] = useState({
    imageEmpty: false,
    nameEmpty: false,
    addressEmpty: false,
    dateEmpty: false,
    descriptionEmpty: false,
    greyiconEmpty: false,
  })
  // SERVICES
  const featureService = new FeatureService()
  const categoryservice = new CategoryService()

  //UseEffect
  useEffect(() => {
    if (featureCount === 0) {
      getEvent()
      getCategories()
      setFeatureCount(1)
    }
  }, [feature, featureCount, imgData, img1Data, startDate]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const imagesPreview1 = (e) => {
    if (e.target.files[0]) {
      console.log("picture1: ", e.target.files)
      setPicture1(e.target.files[0])
      const reader = new FileReader()
      reader.addEventListener("load", () => {
        setImg1Data(reader.result)
      })
      reader.readAsDataURL(e.target.files[0])
    }
  }

  const deleteItem = () => {
    setPicture(null)
    setImgData(null)
  }
  const deleteItem1 = () => {
    setImg1Data(null)
    setPicture1(null)
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
    if (img1Data === null) {
      c.greyiconEmpty = true
      validCount++
    } else {
      c.greyiconEmpty = false
    }

    if (feature.Name === "") {
      c.nameEmpty = true
      validCount++
    } else {
      c.nameEmpty = false
    }
    setEmptyValidation(c)

    if (validCount > 0) {
      return
    }
    setBtnLock(true)
    feature.updatedBy = 4
    const response = await featureService.update(feature)

    if (response.data.Code === 1) {
      if (!(picture === null)) {
        const formData = new FormData()
        formData.append("id", response.data.Data.FeatureId)
        formData.append("ImagePath", picture)
        formData.append("GreyIcon", picture1)
        const imageResponse = await featureService.uploadImage(formData)
        if (imageResponse.data.Code === 1) {
          history.push("/Features")
          setBtnLock(false)

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Feature has been Updated",
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
        history.push("/Features")
        setBtnLock(false)

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Feature has been updated",
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
    const response = await featureService.getById(FeatureId)
    if (response.data.Code === 1) {
      setFeature(response.data.Data)
      setImgData(response.data.Data.ImagePath)
      setImg1Data(response.data.Data.GreyIcon)
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
  const getCategories = async () => {
    const response = await categoryservice.get("")
    setCategories(response.data.Data)
  }

  return (
    <div>
      <main>
        <div class="container-fluid">
          <div class="row">
            <div class="col-12">
              <div class="headertopbar">
                <Link to="/Features" class="headertopbar_title">
                  {" "}
                  <img class="headertopbar__arrowimage" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" /> Edit Feature
                </Link>
              </div>
            </div>
            <div class="col-12">
              <div class="card_custom">
                {loader ? (
                  Loader
                ) : (
                  <form class="myform" onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group col-md-3 form-group--uploadimage">
                        <div className="file-upload position-relative">
                          <div class="imagecontainer">
                            <label for="upload-image" class="upload-image-label">
                              <div className="file-pic">
                                <h5 className="upload-image-title">Upload Active Image</h5>

                                <img src="/img/icon_upload_add_load@2x.png" id="image-icon" alt="upload_image" />
                              </div>
                              <img id="cross-icon" alt="delete_image" src="/img/cancel.svg" />
                            </label>
                            {imgData ? (
                              <div class="uploadedimagesfeature">
                                <img class="uploadedimage" src={picture ? imgData : "http://18.159.202.37:81" + imgData} alt="uploaded_image" />
                                <img onClick={deleteItem} class="delete_upload_image_feature" alt="delete_uploaded_image" src="/img/cancel.svg" />
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                          <input onChange={imagesPreview} id="upload-image" name="upload-image" hidden type="file" accept=".png, .jpg, .jpeg" />
                          {emptyValidation.imageEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Image is required </p> : ""}
                        </div>
                      </div>

                      <div className="form-group col-md-4 form-group--uploadimage">
                        <div className="file-upload position-relative">
                          <div class="imagecontainer">
                            <label for="upload-image1" class="upload-image-label">
                              <div className="file-pic">
                                <h5 className="upload-image-title">Upload In-Active Image</h5>

                                <img src="/img/icon_upload_add_load@2x.png" id="image-icon1" alt="upload_image1" />
                              </div>
                              <img id="cross-icon" alt="delete_image" src="/img/cancel.svg" />
                            </label>
                            {img1Data ? (
                              <div class="uploadedimagesfeature" style={{ marginLeft: "-17px" }}>
                                <img class="uploadedimage" src={picture1 ? img1Data : "http://18.159.202.37:81" + img1Data} alt="uploaded_image" />
                                <img onClick={deleteItem1} class="delete_upload_image_feature" alt="delete_uploaded_image" src="/img/cancel.svg" />
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                          <input onChange={imagesPreview1} id="upload-image1" name="upload-image" hidden type="file" accept=".png, .jpg, .jpeg" />
                          {emptyValidation.greyiconEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Image is required </p> : ""}
                        </div>
                      </div>
                    </div>
                    <div className="form-row feature-save-btn">
                      <div className="form-group col-md-4" id="formgroup">
                        <label htmlfor="Featurename">Feature Name</label>
                        <input
                          type="text"
                          name="eventname"
                          className="form_control"
                          placeholder="Enter Event Name"
                          value={feature.Name}
                          onChange={(e) => {
                            const x = { ...feature }
                            x.Name = e.target.value
                            setFeature(x)
                          }}
                        />
                        {emptyValidation.nameEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Feature name is required </p> : ""}
                      </div>
                      <div className="form-group col-md-4">
                        <div className="phone-container position-relative">
                          <label htmlfor="tel" className="number-label">
                            Categories
                          </label>
                          <select
                            onChange={(e) => {
                              const c = { ...feature }
                              c.CategoryId = e.target.value
                              setFeature(c)
                            }}
                            className="form_control"
                          >
                            {categories.map((item) => {
                              if (item.Name === feature.CategoryName) {
                                return (
                                  <option selected value={item.CategoryId}>
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

                      <div class="form-group col-md-4 formbtncontainer__outercontainer--layout2" id="savebutton">
                        <div class="formbtncontainer formbtncontainer--layout2">
                          <button type="submit" class="btn_primary submitbtn" disabled={btnLock}>
                            Update
                            {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                          </button>
                          <Link to="/Features" class="btn_primary_outline cancelbtn">
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
export default EditFeature
