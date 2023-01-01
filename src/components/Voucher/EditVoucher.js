import React, { useEffect, useState } from "react"
import { Link, useParams, useHistory } from "react-router-dom"
import Swal from "sweetalert2"
import VoucherService from "../../services/VoucherService"
import Loader from "../../shared/Loader"
function EditVoucher() {
  //State

  const { VoucherId } = useParams()
  const [voucher, setVoucher] = useState({})
  const history = useHistory()
  const [voucherCount, setVoucherCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const [picture, setPicture] = useState(null)
  const [imgData, setImgData] = useState(null)
  const [btnLock, setBtnLock] = useState(false)
  const [emptyValidation, setEmptyValidation] = useState({
    imageEmpty: false,
    NameEmpty: false,
    CodeEmpty: false,
    descriptionEmpty: false,
  })
  // SERVICES
  const voucherService = new VoucherService()

  //UseEffect
  useEffect(() => {
    if (voucherCount === 0) {
      getEvent()
      setVoucherCount(1)
    }
  }, [voucher, voucherCount, imgData]) // eslint-disable-line react-hooks/exhaustive-deps

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
    const c = { ...emptyValidation }
    if (imgData === null) {
      c.imageEmpty = true
      validCount++
    } else {
      c.imageEmpty = false
    }

    if (voucher.Name === "") {
      c.NameEmpty = true
      validCount++
    } else {
      c.NameEmpty = false
    }

    if (voucher.Code === "") {
      c.CodeEmpty = true
      validCount++
    } else {
      c.CodeEmpty = false
    }

    if (voucher.Description === "") {
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
    voucher.updatedBy = 4
    const response = await voucherService.update(voucher)

    if (response.data.Code === 1) {
      if (!(picture === null)) {
        const formData = new FormData()
        formData.append("id", response.data.Data.VoucherId)
        formData.append("ImagePath", picture)
        const imageResponse = await voucherService.uploadImage(formData)
        if (imageResponse.data.Code === 1) {
          history.push("/Managevoucher")
          setBtnLock(false)

          Swal.fire({
            position: "center",
            icon: "success",
            title: "Voucher has been saved",
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
        history.push("/ManageVoucher")
        setBtnLock(false)

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Voucher has been saved",
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
    const response = await voucherService.getById(VoucherId)
    if (response.data.Code === 1) {
      setVoucher(response.data.Data)
      setImgData(response.data.Data.ImagePath)
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
                <Link to="/ManageVoucher" className="headertopbar_title">
                  {" "}
                  <img className="headertopbar__arrowimage" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" /> Edit Voucher
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
                          <label htmlfor="username">Voucher Name</label>
                          <input
                            type="text"
                            name="username"
                            className="form_control"
                            placeholder="Voucher Name"
                            onChange={(e) => {
                              const c = { ...voucher }
                              c.Name = e.target.value
                              setVoucher(c)
                            }}
                            value={voucher.Name}
                          />
                          {emptyValidation.NameEmpty ? <p style={{ marginTop: "5px", color: "red" }}>voucher Name is Required </p> : ""}
                        </div>
                      </div>
                      <div className="form-group col-md-4">
                        <div className="email-container position-relative">
                          <label htmlfor="uname" className="w-100 email-label">
                            Voucher Code
                          </label>
                          <input
                            type="text"
                            name="uname"
                            placeholder="Code"
                            className="form_control"
                            id="email-address"
                            onChange={(e) => {
                              const c = { ...voucher }
                              c.Code = e.target.value
                              setVoucher(c)
                            }}
                            value={voucher.Code}
                          />
                          {emptyValidation.codeEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Voucher Code is Required </p> : ""}
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
                              const c = { ...voucher }
                              c.Description = e.target.value
                              setVoucher(c)
                            }}
                            value={voucher.Description}
                          />
                          {emptyValidation.descriptionEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Description is Required </p> : ""}
                        </div>
                      </div>
                      <div className="form-group col-md-12 formbtncontainer__outercontainer--layout3">
                        <div className="formbtncontainer">
                          <button disabled={btnLock} type="submit" className="btn_primary submitbtn">
                            Save
                            {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                          </button>
                          <Link to="/ManageVoucher" className="btn_primary_outline cancelbtn">
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
export default EditVoucher
