import React, { useState, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import Swal from "sweetalert2"
import FeatureService from "../../services/FeatureService"
import CategoryService from "../../services/CategoryService"
import Loader from "../../shared/Loader"
function FeaturesAdd() {
  // SERVICES
  const featureService = new FeatureService()
  const categoryservice = new CategoryService()

  //State
  const history = useHistory()
  const [feature, setFeature] = useState({
    name: "",
    CategoryId: "",
    CreatedBy: 4,
  })

  const [picture, setPicture] = useState(null)
  const [picture1, setPicture1] = useState(null)
  const [imgData, setImgData] = useState(null)
  const [img1Data, setImg1Data] = useState(null)
  const [btnLock, setBtnLock] = useState(false)
  const [categories, setCategories] = useState([])

  const [emptyValidation, setEmptyValidation] = useState({
    imageEmpty: false,
    greyiconEmpty: false,
    nameEmpty: false,
    addressEmpty: false,
    dateEmpty: false,
    descriptionEmpty: false,
    businessCategoryEmpty: false,
  })

  //UseEffect
  useEffect(() => {}, [emptyValidation, feature])
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
    setPicture1(null)
    setImg1Data(null)
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

    if (feature.name === "") {
      c.nameEmpty = true
      validCount++
    } else {
      c.nameEmpty = false
    }
    if (feature.CategoryId === "") {
      c.businessCategoryEmpty = true
      validCount++
    } else {
      c.businessCategoryEmpty = false
    }

    setEmptyValidation(c)

    if (validCount > 0) {
      return
    }
    setBtnLock(true)

    const response = await featureService.save(feature)
    if (response.data.Code === 1) {
      const formData = new FormData()

      formData.append("id", response.data.Data.FeatureId)
      formData.append("active_icon", picture)
      formData.append("inactive_icon", picture1)
      const imageResponse = await featureService.uploadImage(formData)
      if (imageResponse.data.Code === 1) {
        history.push("/Features")
        setBtnLock(false)

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Feature has been saved",
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
  useEffect(() => {
    getCategories()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  //Functions
  const getCategories = async () => {
    const response = await categoryservice.get("")
    setCategories(response.data.Data)
  }
  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <Link to="/Features" className="headertopbar_title">
                  {" "}
                  <img className="headertopbar__arrowimage" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" /> Add New Feature
                </Link>
              </div>
            </div>
            <div className="col-12 column_margin">
              <div className="card_custom">
                <form className="myform" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group col-md-2 form-group--uploadimage">
                      <div className="file-upload position-relative">
                        <div class="imagecontainer">
                          <label for="upload-image" class="upload-image-label">
                            <div className="file-pic">
                              <h5 className="upload-image-title" style={{ width: "120px" }}>
                                Upload Active Image
                              </h5>
                              <img src="/img/icon_upload_add_load@2x.png" id="image-icon" alt="upload_image" style={{ marginLeft: "15px" }} />
                            </div>
                            <img id="cross-icon" alt="delete_image" src="/img/cancel.svg" />
                          </label>
                          {imgData ? (
                            <div class="uploadedimagesfeature">
                              <img class="uploadedimage" src={imgData} alt="uploaded_image" />
                              <img onClick={deleteItem} class="delete_upload_image_feature" alt="delete_uploaded_image" src="/img/cancel.svg" />
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <input onChange={imagesPreview} id="upload-image" name="upload-image" hidden type="file" accept=".png, .jpg, .jpeg,.svg" />
                        {emptyValidation.imageEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Image is required </p> : ""}
                      </div>
                    </div>
                    <div className="form-group col-md-4 form-group--uploadimage" style={{ paddingLeft: "30px" }}>
                      <div className="file-upload position-relative">
                        <div class="imagecontainer">
                          <label for="upload-image1" class="upload-image-label">
                            <div className="file-pic">
                              <h5 className="upload-image-title">Upload In-Active Image</h5>
                              <img src="/img/icon_upload_add_load@2x.png" id="image-icon1" alt="upload_image12" style={{ marginLeft: "15px" }} />
                            </div>
                            <img id="cross-icon" alt="delete_image1" src="/img/cancel.svg" />
                          </label>
                          {img1Data ? (
                            <div class="uploadedimagesfeature" style={{ marginLeft: "-17px" }}>
                              <img class="uploadedimage" src={img1Data} alt="uploaded_image" />
                              <img onClick={deleteItem1} class="delete_upload_image_feature" alt="delete_uploaded_image" src="/img/cancel.svg" />
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                        <input
                          onChange={imagesPreview1}
                          id="upload-image1"
                          name="upload-image1"
                          class="image1"
                          type="file"
                          accept=".png, .jpg, .jpeg,.svg"
                          hidden
                        />
                        {emptyValidation.greyiconEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Image is required </p> : ""}
                      </div>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-md-4" id="formgroup">
                      <div className="name">
                        <label htmlfor="username">Feature Name</label>
                        <input
                          type="text"
                          name="username"
                          className="form_control"
                          placeholder="Feature"
                          onChange={(e) => {
                            const c = { ...feature }
                            c.name = e.target.value
                            setFeature(c)
                          }}
                          value={feature.name}
                        />
                        {emptyValidation.nameEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Feature name is required </p> : ""}
                      </div>
                    </div>
                    <div className="form-group col-md-4" id="formgroup">
                      <div className="name">
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
                          <option value="" selected>
                            Select Category
                          </option>
                          {categories.map((item) => {
                            return <option value={item.CategoryId}>{item.Name}</option>
                          })}
                        </select>
                        {emptyValidation.businessCategoryEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Category is required </p> : ""}
                      </div>
                    </div>

                    <div class="form-group col-md-4 formbtncontainer__outercontainer--layout2" id="savebutton">
                      <div class="formbtncontainer formbtncontainer--layout2 btnLinks">
                        <button type="submit" class="btn_primary submitbtn" disabled={btnLock}>
                          Save
                          {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                        </button>
                        <Link to="/Features" class="btn_primary_outline cancelbtn">
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
export default FeaturesAdd
