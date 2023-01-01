import React, { useState, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import ProfileService from "../../services/ProfileService"
import Loader from "../../shared/Loader"

function Profile() {
  //State
  const history = useHistory()
  const [user, setUser] = useState({})
  const [dataCount, setDataCount] = useState(0)
  const [loader, setLoader] = useState(true)
  //Fucntions
  const logout = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()
    // localStorage.removeItem("makhtabquser")
    localStorage.removeItem("makhtabquserId")
    document.querySelector(".userdropdownmenu").remove()
    history.push("/account/login")
  }
  const profileService = new ProfileService()

  useEffect(() => {
    if (dataCount === 0) {
      getProfile()
      setLoader(false)
      setDataCount(1)
    }
  }, [user]) // eslint-disable-line react-hooks/exhaustive-deps

  const getProfile = async () => {
    const response = await profileService.getById(JSON.parse(localStorage.getItem("makhtabquserId")))
    setUser(response.data.Data)
    setLoader(false)
  }
  return (
    <main>
      <div class="container-fluid">
        <div className="row">
          <div className="col-12">
            <div className="headertopbar">
              <Link to="/" className="headertopbar_title">
                {" "}
                <img className="headertopbar__arrowimage" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" /> Profile
              </Link>
              <div className="superadmin_buttons">
                <Link to="/account/login" className="btn_primary_outline btn_primary" onClick={logout}>
                  Logout
                </Link>
                <Link to="/EditProfile" class="superadmin-logout btn btn_primary">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 column_margin">
            <div className="card_custom">
              {loader ? (
                Loader
              ) : (
                <div className="row align-items-center">
                  <div className="col-md-3">
                    <img
                      alt="Profile_Picture"
                      src={user.ProfilePicture ? "http://18.159.202.37:81" + user.ProfilePicture : "/img/male-placeholder-image.jpeg"}
                      style={{ width: "65%", height: "150px", borderRadius: "15px" }}
                    />
                  </div>
                  <div className="col-md-9">
                    <div className="row">
                      <div className="col-md-4">
                        <h3 className="view-profile-name">Full Name</h3>
                        <h4 className="view-profile-user-name">{user.Name}</h4>
                      </div>
                      <div className="col-md-4">
                        <h3 className="view-profile-name">Phone Number</h3>
                        <h4 className="view-profile-user-name">{user.Phone}</h4>
                      </div>
                      <div className="col-md-4">
                        <h3 className="view-profile-name">Email</h3>
                        <h4 className="view-profile-user-name">{user.Email}</h4>
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
  )
}

export default Profile
