import { Link } from "react-router-dom"
import React, { useEffect, useState } from "react"
import $ from "jquery"
import { Checkbox } from "pretty-checkbox-react"

function AddNewCSP() {
  const [imageArray, setImageArray] = useState([])
  const [referenceImagesGetArray, setReferenceImagesGetArray] = useState([])
  window.deleteItem = () => {
    let imageIndex = $(this).closest(".uploadedimages").index()
    $(this).closest(".uploadedimages").remove()
    removeFileFromFileList(imageIndex - 1)
  }

  useEffect(() => {
    $(".multipleimagecontainer").on("click", ".delete_upload_image", function (e) {
      let imageIndex = $(this).closest(".uploadedimages").index()
      $(this).closest(".uploadedimages").remove()
      removeFileFromFileList(imageIndex - 1)
    })
  })
  // Multiple images preview in browser
  function imagesPreview(input, placeToInsertImagePreview) {
    if (input.files) {
      var files = $("#upload-image-multiple").get(0).files

      let filesAmount = input.files.length
      let fileAmountCount = input.files.length
      setReferenceImagesGetArray(referenceImagesGetArray.concat(Array.from(files)))

      for (let i = 0; i < filesAmount; i++) {
        let reader = new FileReader()

        ;(function (index) {
          reader.onload = (event) => {
            $(placeToInsertImagePreview).append(
              `<div class='uploadedimages'><img class="uploadedimage" src=${
                event.target.result
              } /><img onClick={deleteItem} class='delete_upload_image' data-imageid="${new Date()
                .getTime()
                .toString(16)}"  src='/img/cancel.svg' /></div>`
            )
          }
        })(fileAmountCount)

        reader.readAsDataURL(input.files[i])
        fileAmountCount--
      }
    }
  }
  function removeFileFromFileList(index) {
    for (var i = 0; i < referenceImagesGetArray.length; i++) {
      if (i == index) {
        referenceImagesGetArray.splice(index, 1)
      }
    }
  }
  $("#tick").hide()
  useEffect(() => {
    $("#eye").on("click", function () {
      if ($("#password").attr("type") === "password") {
        $("#password").attr("type", "text")
      } else {
        $("#password").attr("type", "password")
      }
    })
  })
  useEffect(() => {
    $("#tick").hide()
    $("#email-address").on("keypress", function () {
      var dInput = this.value
      console.log(dInput)
      var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/

      if (regex.test(dInput)) {
        //console.log('valid ');
        $("#tick").show()
      } else {
        $("#tick").hide()
      }
    })
  })
  useEffect(() => {
    $("#eye1").on("click", function () {
      if ($("#password-1").attr("type") === "password") {
        $("#password-1").attr("type", "text")
      } else {
        $("#password-1").attr("type", "password")
      }
    })
  })
  useEffect(() => {
    $("#tick5").hide()
    function validatePhone() {
      var a = document.getElementById("phoneinput").value
      var filter = /^((\+92)|(0092))-{0,1}\d{3}-{0,1}\d{7}$|^\d{11}$|^\d{4}-\d{7}$/
      if (filter.test(a)) {
        console.log(true)
        $("#tick5").show()
      } else {
        console.log(false)
        $("#tick5").hide()
        return false
      }
    }
  })

  return (
    <div>
      <main className="register-main">
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="arrow-container" id="border-bottom">
                <Link className="arrow-container_link" to="/account/login">
                  <img className="arrow-container_image" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" id="register-image" />
                  <h3 className="signup-register"> Sign Up</h3>
                </Link>
              </div>
            </div>

            <div className="col-12 column_margin">
              <div className="card_custom">
                <form className="myform">
                  <div className="form-row">
                    <div className="form-group col-md-12 form-group--uploadimage">
                      <p className="signup-title">Personal Information</p>
                      <div className="file-upload position-relative">
                        <div class="multipleimagecontainer">
                          <label for="upload-image-multiple" class="upload-image-label-multiple">
                            <div className="file-pic">
                              <h5 className="upload-image-title">Upload Image</h5>

                              <img src="/img/icon_upload_add_load@2x.png" id="image-icon" />
                            </div>
                            <img id="cross-icon" alt="delete-image" src="/img/cancel.svg" />
                          </label>
                        </div>
                        <input
                          name="files[]"
                          onChange={(e) => imagesPreview(e.target, ".multipleimagecontainer")}
                          id="upload-image-multiple"
                          name="upload-image-multiple"
                          hidden
                          type="file"
                          accept=".png, .jpg, .jpeg"
                          multiple
                        />
                      </div>
                    </div>

                    <div className="form-group col-md-4">
                      <div className="name">
                        <label htmlfor="username">Name</label>
                        <input type="text" name="username" className="form_control" />
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="email-container position-relative">
                        <label htmlfor="uname" className="w-100" className="email-label">
                          Email
                        </label>
                        <input type="text" name="uname" placeholder="randy.hudson@mail.com" className="form_control" id="email-address" />
                        <div className="input-icon">
                          <img className="tick" src="./img/Correct.png" id="tick" />
                        </div>
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="phone-container position-relative">
                        <label htmlfor="tel" className="number-label">
                          Phone Number
                        </label>
                        <input id="phoneinput" onkeyup="validatePhone()" type="number" name="tel" className="form_control" placeholder="" />
                        <div className="input-icon">
                          <img className="tick" src="./img/Correct.png" id="tick5" />
                        </div>
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="password-container position-relative">
                        <label htmlfor="pwd" className="100">
                          Password
                        </label>
                        <input type="password" name="pwd" className="form_control" id="password" placeholder="Enter Password" />
                        <div className="input-icon">
                          <img src="./img/visibility.png" className="eye" id="eye" />
                        </div>
                      </div>
                    </div>

                    <div className="form-group col-md-4">
                      <div className="password-container position-relative">
                        <label htmlfor="pwd" className="password-label">
                          Confirm Password
                        </label>
                        <input type="password" name="pwd" className="form_control" placeholder="" id="password-1" />
                        <div className="input-icon">
                          <img src="./img/visibility.png" className="eye" id="eye1" />
                        </div>
                      </div>
                    </div>
                    <div className="form-group col-md-12 formbtncontainer__outercontainer--layout3">
                      <div className="formbtncontainer">
                        <button type="submit" className="btn_primary submitbtn">
                          Save
                        </button>
                        <Link to="/account/login" className="btn_primary_outline cancelbtn">
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
export default AddNewCSP
