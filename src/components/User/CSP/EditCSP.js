import React, { useEffect, useState } from "react"
import { Link, useParams, useHistory } from "react-router-dom"
import Swal from "sweetalert2"
import UsersService from "../../../services/UsersService"
import Loader from "../../../shared/Loader"
function EditCSP() {
  //State
  const { UserId } = useParams()
  const [csp, setCSP] = useState({})
  const history = useHistory()
  const [subAdminCount, setSubAdminCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const [picture, setPicture] = useState(null)
  const [imgData, setImgData] = useState(null)
  const [btnLock, setBtnLock] = useState(false)
  const [emptyValidation, setEmptyValidation] = useState({
    imageEmpty: false,
    NameEmpty: false,
    EmailEmpty: "",
    PhoneEmpty: false,
    PasswordEmpty: false,
  })
  // SERVICES
  const cspService = new UsersService()

  //UseEffect
  useEffect(() => {
    if (subAdminCount === 0) {
      getEvent()
      setSubAdminCount(1)
    }
  }, [csp, subAdminCount, imgData]) // eslint-disable-line react-hooks/exhaustive-deps

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
  const [confirmPassword, setConfirmPassword] = useState("")
  const deleteItem = () => {
    setPicture(null)
    setImgData(null)
  }
  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(0, object.target.maxLength)
    }
  }
  const passwordhandler = () => {
    const password = document.querySelector("#password")
    // toggle the type attribute
    const type = password.getAttribute("type") === "password" ? "text" : "password"
    password.setAttribute("type", type)
  }

  const passwordhandlerconfirm = () => {
    const password = document.querySelector("#confirm-password")
    // toggle the type attribute
    const type = password.getAttribute("type") === "password" ? "text" : "password"
    password.setAttribute("type", type)
  }
  const emailValid = () => {
    let pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
    var email = document.getElementById("email-address").value
    if (!pattern.test(email)) {
      document.querySelector("#tick-1").style.display = "none"
    } else {
      document.querySelector("#tick-1").style.display = "block"
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/

    let validCount = 0
    const c = { ...emptyValidation }
    if (imgData === null) {
      c.imageEmpty = true
      validCount++
    } else {
      c.imageEmpty = false
    }

    if (csp.Name === "") {
      c.NameEmpty = true
      validCount++
    } else {
      c.NameEmpty = false
    }

    if (csp.Email === "") {
      c.EmailEmpty = "Email is required"
      validCount++
    } else if (!pattern.test(csp.Email)) {
      validCount++
      c.EmailEmpty = "Email should be valid"
    } else {
      c.EmailEmpty = ""
    }

    if (csp.Phone === "") {
      c.PhoneEmpty = true
      validCount++
    } else {
      c.PhoneEmpty = false
    }

    if (csp.Password === "") {
      c.PasswordEmpty = true
      validCount++
    } else {
      c.PasswordEmpty = false
    }

    if (csp.Password !== confirmPassword) {
      c.confirmPasswordEmpty = true
      validCount++
    } else {
      c.confirmPasswordEmpty = false
    }

    setEmptyValidation(c)

    if (validCount > 0) {
      return
    }
    setBtnLock(true)
    const finalSubAdmin = {
      Name: "",
      Email: "",
      Phone: "",
      Password: "",
      UserTypeId: 3,
      ProfilePicture: "",
      UpdatedBy: 4,
      UserId: UserId,
    }
    finalSubAdmin.Name = csp.Name
    finalSubAdmin.Email = csp.Email
    finalSubAdmin.Phone = csp.Phone
    finalSubAdmin.Password = csp.Password
    finalSubAdmin.ProfilePicture = csp.ProfilePicture
    const response = await cspService.update(finalSubAdmin)

    if (response.data.Code === 1) {
      if (!(picture === null)) {
        const formData = new FormData()
        formData.append("id", response.data.Data.UserId)
        formData.append("profile_picture", picture)
        const imageResponse = await cspService.uploadImage(formData)
        if (imageResponse.data.Code === 1) {
          history.push("/ManageCSP")
          setBtnLock(false)

          Swal.fire({
            position: "center",
            icon: "success",
            title: "SubAdmin has been saved",
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
        history.push("/ManageCSP")
        setBtnLock(false)

        Swal.fire({
          position: "center",
          icon: "success",
          title: "CSP has been saved",
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
    const response = await cspService.getById(UserId)
    console.log(response)
    if (response.data.Code === 1) {
      setCSP(response.data.Data)
      setImgData(response.data.Data.ProfilePicture)
      setConfirmPassword(response.data.Data.Password)
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
                <Link to="/ManageCSP" className="headertopbar_title">
                  {" "}
                  <img className="headertopbar__arrowimage" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" /> Edit Profile CSP
                </Link>
              </div>
            </div>
            <div className="col-12 column_margin">
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
                        <div className="name">
                          <label htmlfor="username">Full Name</label>
                          <input
                            type="text"
                            name="username"
                            className="form_control"
                            placeholder="Enter Name"
                            value={csp.Name}
                            onChange={(e) => {
                              const x = { ...csp }
                              x.Name = e.target.value
                              setCSP(x)
                            }}
                          />
                          {emptyValidation.NameEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Name is required </p> : ""}
                        </div>
                      </div>
                      <div className="form-group col-md-4">
                        <div className="email-container position-relative">
                          <label htmlfor="uname" className="w-100 email-label">
                            Email
                          </label>
                          <div>
                            <div className="position_relative">
                              <input
                                onKeyUp={emailValid}
                                type="text"
                                name="uname"
                                placeholder="Enter Email Address"
                                className="form_control"
                                id="email-address"
                                onChange={(e) => {
                                  const x = { ...csp }
                                  x.Email = e.target.value
                                  setCSP(x)
                                }}
                                value={csp.Email}
                              />

                              <img className="tick_icon_email" src="./img/CorrectSvg.svg" id="tick-1" alt="tickicon" />
                            </div>
                          </div>
                          {emptyValidation.EmailEmpty.length !== 0 ? (
                            <p style={{ marginTop: "5px", color: "red" }}>{emptyValidation.EmailEmpty} </p>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                      <div className="form-group col-md-4">
                        <div className="phone-container position-relative">
                          <label htmlfor="tel" className="number-label">
                            Phone Number
                          </label>
                          <input
                            type="number"
                            maxLength="11"
                            onInput={maxLengthCheck}
                            placeholder="Enter PhoneNumber"
                            selected={csp.Phone}
                            className="form_control"
                            onChange={(e) => {
                              const x = { ...csp }
                              x.Phone = e.target.value
                              setCSP(x)
                            }}
                            value={csp.Phone}
                          />
                          {emptyValidation.PhoneEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Phone number is required </p> : ""}
                        </div>
                      </div>
                      <div className="form-group col-md-4">
                        <div className="password-container position-relative">
                          <label htmlfor="pwd" className="100">
                            Password
                          </label>
                          <div>
                            <div className="position_relative">
                              <input
                                type="password"
                                name="pwd"
                                className="form_control"
                                id="password"
                                placeholder="Enter Password"
                                onChange={(e) => {
                                  const x = { ...csp }
                                  x.Password = e.target.value
                                  setCSP(x)
                                }}
                                value={csp.Password}
                              />

                              <div className="eye-icon">
                                <img alt="eye" src="/img/visibilitySvg.svg" className="eye_Icon" id="toggle-password" onClick={passwordhandler} />
                              </div>
                            </div>
                          </div>
                          {emptyValidation.PasswordEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Password is required </p> : ""}
                        </div>
                      </div>
                      <div className="form-group col-md-4">
                        <div className="password-container position-relative">
                          <label htmlfor="pwd" className="100">
                            Confirm Password
                          </label>
                          <div>
                            <div className="position_relative">
                              <input
                                type="password"
                                name="pwd"
                                className="form_control"
                                id="confirm-password"
                                placeholder="Enter Password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                value={confirmPassword}
                              />

                              <div className="eye-icon">
                                <img
                                  alt="eye"
                                  src="/img/visibilitySvg.svg"
                                  className="eye_Icon"
                                  id="toggle-password"
                                  onClick={passwordhandlerconfirm}
                                />
                              </div>
                            </div>
                          </div>
                          {emptyValidation.confirmPasswordEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Password not matching </p> : ""}
                        </div>
                      </div>
                      <div className="form-group col-md-12 formbtncontainer__outercontainer--layout3">
                        <div className="formbtncontainer">
                          <button disabled={btnLock} type="submit" className="btn_primary submitbtn">
                            Save
                            {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                          </button>
                          <Link to="/ManageCSP" className="btn_primary_outline cancelbtn">
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
export default EditCSP