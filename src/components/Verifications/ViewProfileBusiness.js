import React, { useState, useEffect } from "react"
import { Link, useParams, useHistory } from "react-router-dom"
import Swal from "sweetalert2"
import VerificationService from "../../services/VerificationService"
import UsersService from "../../services/UsersService"
import Loader from "../../shared/Loader"

function ViewProfileBusiness() {
  //Services
  const verificationService = new VerificationService()
  const businessOwnerService = new UsersService()

  //state
  const [feature, setFeature] = useState([])
  const [businessOwner, setBusinessOwner] = useState({})
  const [multipleImages, setMultipleImages] = useState([])
  const [eventCount, setEventCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const { UserId } = useParams()
  const [businessinfos, setBusinessInfos] = useState({})
  const [timing, setTiming] = useState([])

  const [btnLock, setBtnLock] = useState(false)
  const history = useHistory()
  //Functions
  const acceptBusiness = async () => {
    setBtnLock(true)
    const response = await verificationService.accept(businessinfos.BusinessId)
    if (response.data.Code === 1) {
      setBtnLock(false)
      history.push("/ManageVerifications")

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Business has been accepted!",
        showConfirmButton: true,
        timer: 5000,
      })
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

  const rejectBusiness = async () => {
    setLoader(true)

    const response = await verificationService.reject(businessinfos.BusinessId)
    if (response.data.Code === 1) {
      history.push("/ManageVerifications")
      setBtnLock(false)
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Business has been rejected!",
        showConfirmButton: true,
        timer: 5000,
      })
    }

    if (response.data.Code === 0) {
      setLoader(false)

      Swal.fire({
        position: "center",
        icon: "error",
        title: response.data.Data.Message,
        showConfirmButton: true,
        timer: 5000,
      })
    }
  }
  //UseEffect
  useEffect(() => {
    if (eventCount === 0) {
      getUser()
      setEventCount(1)
    }
  }, [businessOwner, eventCount, businessinfos, timing]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions

  const getUser = async () => {
    const response = await businessOwnerService.getById(UserId)
    const imageres = await businessOwnerService.getmultipleImages(response.data.Data?.BusinessInfo?.BusinessId)
    if (response.data.Code === 1) {
      setBusinessOwner(response.data.Data)
      setMultipleImages(imageres.data.Data)
      setBusinessInfos(response.data.Data.BusinessInfo)

      setTiming(
        response.data.Data.BusinessInfo.Timings.map((item) => {
          return {
            StartTime: item.StartTime,
            EndTime: item.EndTime,
            Day: item.Day,
          }
        })
      )
      setFeature(
        response.data.Data.BusinessInfo.Features.map((item) => {
          return {
            FeaturesId: item.FeatureId,
            Name: item.Name,
            Icon: item.Icon,
          }
        })
      )

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
                <Link className="arrow-container_link" to="/ManageVerifications">
                  <img className="arrow-container_image" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" />
                  <h1 className="headertopbar_title">View Profile Business</h1>
                </Link>
              </div>
            </div>
            <div className="col-12 column_margin">
              <div className="card_custom">
                {loader ? (
                  Loader
                ) : (
                  <div className="row">
                    <div className="col-md-3">
                      <img
                        style={{ width: "70%", height: "150px", borderRadius: "15px" }}
                        alt="event_image"
                        src={
                          businessOwner.ProfilePicture
                            ? "http://18.159.202.37:81/" + businessOwner.ProfilePicture
                            : "/img/male-placeholder-image.jpeg"
                        }
                      />
                    </div>
                    <div className="col-md-9">
                      <div className="row">
                        <div className="col-md-4">
                          <h3 className="view-profile-name">Full Name</h3>
                          <h4 className="view-profile-user-name">{businessOwner.Name}</h4>
                          <div className="view-profile-pwd">
                            <h3 className="view-profile-name">Password</h3>
                            <h4 className="view-profile-user-name">{businessOwner.Password}</h4>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <h3 className="view-profile-name">Phone Number</h3>
                          <h4 className="view-profile-user-name">{businessOwner.Phone}</h4>
                        </div>
                        <div className="col-md-4">
                          <h3 className="view-profile-name">Email</h3>
                          <h4 className="view-profile-user-name">{businessOwner.Email}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-12 column_margin">
              <div className="card_custom">
                <div className="row">
                  <div className="col-md-12 profile-business-information">
                    <h3 className="view-profile-payment">Business Information</h3>
                  </div>
                  <div className="col-md-12">
                    <div className="row">
                      <div className="buisness-profile-images">
                        {multipleImages.map((item) => {
                          return (
                            <>
                              {item.FilePath ? (
                                <img src={"http://18.159.202.37:81/" + item.FilePath} alt="" className="multiImage" />
                              ) : (
                                <img src="./img/business-profile-image2.png" />
                              )}
                            </>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 business-profile-content">
                    <div className="row">
                      <div className="col-md-3 card-owner">
                        <h3 className="view-profile-name">Restaurant Name</h3>
                        <h4 className="view-profile-user-name">{businessinfos.Name}</h4>
                      </div>
                      <div className="col-md-3 ">
                        <h3 className="view-profile-name">Address</h3>
                        <h4 className="view-profile-user-name">{businessinfos.Address}</h4>
                      </div>
                      <div className="col-md-3 ">
                        <h3 className="view-profile-name">Business Phone</h3>
                        <h4 className="view-profile-user-name">{businessinfos.Phone}</h4>
                      </div>
                      {/* <div className="col-md-3 ">
                        <h3 className="view-profile-name">Ratings</h3>
                        <h4 className="view-profile-user-star">
                          <span>4.6</span>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="fas fa-star"></i>
                          <i className="far fa-star"></i>
                        </h4>
                      </div> */}
                      <div className="col-md-12">
                        <div className="view-event-description">
                          <h3 className="view-profile-name">Description</h3>
                          <h4 className="view-profile-user-name">{businessinfos.Description}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-12 payment-col">
                    <div className="profile-business-features">
                      <h3 className="view-profile-payment">Features</h3>
                    </div>
                  </div>

                  <div className="view-profile-icons">
                    {feature.map((feature) => {
                      return (
                        <div className="business-icons">
                          <img
                            src={feature.Icon ? "http://18.159.202.37:81/" + feature.Icon : "/img/images.png"}
                            className="featureselect_image"
                            alt="Icon"
                          />
                          <h4 className="business-icons-content">{feature.Name}</h4>
                        </div>
                      )
                    })}
                  </div>
                  <div className="col-md-12 payment-col">
                    <div className="profile-business-timing">
                      <h3 className="view-profile-payment">Business Timings</h3>
                    </div>
                  </div>

                  {timing.map((timing) => {
                    return (
                      <div className="col-md-3 timing_day">
                        <h3 className="view-profile-name">{timing.Day}</h3>
                        <h4 className="view-profile-user-name">
                          {" "}
                          {timing.StartTime.slice(0, 5)} to {timing.EndTime.slice(0, 5)}
                        </h4>
                      </div>
                    )
                  })}
                </div>
                <div className="col-md-12">
                  <div className="profile-business-buttons">
                    <button disabled={btnLock} onClick={acceptBusiness} className="profile-business-accept btn btn-primary">
                      Accept {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                    </button>
                    <button disabled={btnLock} onClick={rejectBusiness} className="profile-business-reject btn btn-primary">
                      Reject {loader ? <div class="btnloader">{Loader}</div> : ""}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
export default ViewProfileBusiness
