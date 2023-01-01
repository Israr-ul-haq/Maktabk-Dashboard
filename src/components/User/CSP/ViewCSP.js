import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import UsersService from "../../../services/UsersService"
import Loader from "../../../shared/Loader"
import Swal from "sweetalert2"
function ViewCSP() {
  // SERVICES
  const cspService = new UsersService()

  //State
  const [csp, setCSP] = useState({})
  const [eventCount, setEventCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const { UserId } = useParams()

  //UseEffect
  useEffect(() => {
    if (eventCount === 0) {
      getEvent()
      setEventCount(1)
    }
  }, [csp, eventCount]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions

  const getEvent = async () => {
    const response = await cspService.getById(UserId)
    if (response.data.Code === 1) {
      setCSP(response.data.Data)
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
                <Link className="arrow-container_link" to="/ManageCSP">
                  <img className="arrow-container_image" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" />
                  <h1 className="headertopbar_title">View Profile- CSP</h1>
                </Link>
                <Link to={`/EditCSP/${UserId}`} className="headertopbar_btn btn_primary">
                  Edit Profile
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
                        src={csp.ProfilePicture ? "http://18.159.202.37:81/" + csp.ProfilePicture : "/img/male-placeholder-image.jpeg"}
                      />
                    </div>
                    <div className="col-md-9">
                      <div className="row">
                        <div className="col-md-4">
                          <h3 className="view-profile-name">Full Name</h3>
                          <h4 className="view-profile-user-name">{csp.Name}</h4>
                          <div className="view-profile-pwd">
                            <h3 className="view-profile-name">Password</h3>
                            <h4 className="view-profile-user-name">*****</h4>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <h3 className="view-profile-name">Phone Number</h3>
                          <h4 className="view-profile-user-name">{csp.Phone}</h4>
                        </div>
                        <div className="col-md-4">
                          <h3 className="view-profile-name">Email</h3>
                          <h4 className="view-profile-user-name">{csp.Email}</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
export default ViewCSP
