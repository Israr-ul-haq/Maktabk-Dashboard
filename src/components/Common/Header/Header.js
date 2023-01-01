import { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import ProfileService from "../../../services/ProfileService"

function Header() {
  //State
  const history = useHistory()
  const [userData, setUserData] = useState({})
  const [loader, setLoader] = useState(true)
  const [dataCount, setDataCount] = useState(0)
  //UseEffect
  // useEffect(() => {
  //   setUserData(JSON.parse(localStorage.getItem("makhtabquser")))
  // }, [])
  useEffect(() => {
    if (dataCount === 0) {
      getProfile()
      setDataCount(1)
    }
  }, [userData]) // eslint-disable-line react-hooks/exhaustive-deps
  const profileService = new ProfileService()
  const getProfile = async () => {
    const response = await profileService.getById(JSON.parse(localStorage.getItem("makhtabquserId")))
    setUserData(response.data.Data)
    setLoader(false)
  }

  const removeClass = (e) => {
    e.preventDefault()
    e.stopPropagation()
    document.querySelectorAll(".main-menu li a").forEach((item) => {
      item.closest("li").classList.remove("active")
    })
    document.querySelector(".userdropdowncontainer").closest("li").classList.remove("active")
    document.querySelector(".navbar-right .dropdown-menu-right").classList.remove("show")
    history.push("/Profile")
  }

  const logout = (evt) => {
    evt.preventDefault()
    evt.stopPropagation()
    localStorage.removeItem("makhtabquser")
    document.querySelector(".userdropdownmenu").remove()
    history.push("/account/login")
  }

  const toggleMenu = () => {
    document.querySelector(".menu .main-menu").classList.toggle("mainmenu_active")
    document.querySelector(".navbar-logo").classList.toggle("logo_active")
    document.querySelector(".userdropdownmenu").classList.toggle("userdropdownmenu_sidebaractive")
    document.querySelector("main").classList.toggle("main_sidebaractive")
  }

  return (
    <div>
      <div id="app-container" className="menu-default show-spinner">
        <nav className="navbar fixed-top">
          <div className="d-flex align-items-center navbar-left">
            <Link className="navbar-logo" to="/">
              <img className="logo d-none d-xs-block" src="./img/Logo.svg" alt="logo" />
              <img className="logo-mobile d-block d-xs-none" src="./img/Logo.svg" alt="mobile-logo" />
            </Link>
            <button onClick={toggleMenu} className="menu-button d-none d-md-block">
              <img src="./img/list.svg" alt="menu-list" />
            </button>

            <button className="menu-button-mobile d-xs-block d-sm-block d-md-none">
              <img src="./img/list.svg" alt="menu-list" />
            </button>
          </div>

          <div className="navbar-right">
            <div class="user d-inline-block">
              <button
                id="dropdownMenuButton"
                class="btn btn-empty p-0"
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span class="name">{userData.Name}</span>
                <span>
                  <img
                    alt="Profile_Picture"
                    src={userData.ProfilePicture ? "http://18.159.202.37:81" + userData.ProfilePicture : "/img/male-placeholder-image.jpeg"}
                    className="admin-pic"
                  />
                </span>
              </button>

              <div class="dropdown-menu dropdown-menu-right mt-3" aria-labelledby="dropdownMenuButton">
                <a onClick={removeClass} class="dropdown-item" href="gotoprofile">
                  Profile
                </a>
                <a onClick={logout} class="dropdown-item" href="gotologin">
                  Sign out
                </a>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}
export default Header
