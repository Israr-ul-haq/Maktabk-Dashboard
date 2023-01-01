import React, { useState, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import Swal from "sweetalert2"

import "react-datepicker/dist/react-datepicker.css"
import CategoryService from "../../services/CategoryService"
import Loader from "../../shared/Loader"

function AddNewCategory() {
  // SERVICES
  const categoryService = new CategoryService()

  //State
  const history = useHistory()
  const [category, setCategory] = useState({
    Name: "",
    CreatedBy: 4,
  })
  const [picture, setPicture] = useState(null)
  const [imgData, setImgData] = useState(null)
  const [btnLock, setBtnLock] = useState(false)
  const [emptyValidation, setEmptyValidation] = useState({
    imageEmpty: false,
    nameEmpty: false,
  })

  //UseEffect
  useEffect(() => {}, [emptyValidation, category])
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

    if (category.Name === "") {
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

    const response = await categoryService.save(category)
    if (response.data.Code === 1) {
      const formData = new FormData()
      formData.append("id", response.data.Data.CategoryId)
      formData.append("ImagePath", picture)
      const imageResponse = await categoryService.uploadImage(formData)
      if (imageResponse.data.Code === 1) {
        history.push("/ManageCategory")
        setBtnLock(false)

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Category has been saved",
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
                <Link to="ManageCategory" className="headertopbar_title">
                  {" "}
                  <img className="headertopbar__arrowimage" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" /> Add New Category
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
                        <label htmlfor="username">Category Name</label>
                        <input
                          type="text"
                          name="username"
                          className="form_control"
                          placeholder="Category"
                          onChange={(e) => {
                            const c = { ...category }
                            c.Name = e.target.value
                            setCategory(c)
                          }}
                          value={category.Name}
                        />
                        {emptyValidation.nameEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Category name is required </p> : ""}
                      </div>
                    </div>
                    <div className="form-group col-md-12 formbtncontainer__outercontainer--layout3">
                      <div className="formbtncontainer">
                        <button disabled={btnLock} type="submit" className="btn_primary submitbtn">
                          Save
                          {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                        </button>
                        <Link to="ManageCategory" className="btn_primary_outline cancelbtn">
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
export default AddNewCategory
