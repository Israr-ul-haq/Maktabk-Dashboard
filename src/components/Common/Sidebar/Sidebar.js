import { NavLink, useHistory } from "react-router-dom"
import React, { useEffect } from "react"
import PerfectScrollbar from "perfect-scrollbar"
function Sidebar() {
  //State

  //Functions

  const clickHandler = (e) => {
    e.stopPropagation()
    document.querySelector(".userdropdownmenu").classList.toggle("userdropdownmenu-active")
    document.querySelector(".userdropdowncontainer").classList.toggle("userdropdowncontainer-active")
    document.querySelector("html").appendChild(document.querySelector(".userdropdownmenu"))
    document.querySelector(".userdropdownmenu").style.cssText = "position: fixed; left:95px;"
    document.querySelector(".userdropdownmenu").style.top = document.querySelector(".userdropdownli").getBoundingClientRect().top + "px"
    document.querySelectorAll(".userdropdownitem").forEach((item) => {
      item.addEventListener("click", closeUserMenu)
    })
  }

  const handleScroll = (e) => {
    document.querySelector(".userdropdownmenu").style.cssText = "position: fixed; left:95px;"
    document.querySelector(".userdropdownmenu").style.top = document.querySelector(".userdropdownli").getBoundingClientRect().top + "px"
  }

  const closeUserMenu = (e) => {
    if (e.target.classList.contains("userdropdownitem") || e.target.classList.contains(".main-menu li")) {
      if (!e.target.classList.contains("userdropdownitem")) {
        if (!e.target.closest("li").classList.contains("active")) {
          if (e.target.classList.contains("active")) {
            document.querySelectorAll(".main-menu li").forEach((item) => {
              item.classList.remove("active")
            })
          }
        }
      }
      if (document.querySelector(".userdropdowncontainer").classList.contains("userdropdowncontainer-active")) {
        document.querySelectorAll(".main-menu li").forEach((item) => {
          item.classList.remove("active")
        })
        document.querySelector(".userdropdownli").classList.add("active")
        document.querySelector(".userdropdowncontainer").classList.remove("userdropdowncontainer-active")
        document.querySelector(".userdropdownmenu").classList.remove("userdropdownmenu-active")
      }
    } else {
      if (document.querySelector(".userdropdowncontainer") || document.querySelector(".userdropdownmenu")) {
        document.querySelector(".userdropdowncontainer").classList.remove("userdropdowncontainer-active")
        document.querySelector(".userdropdownmenu").classList.remove("userdropdownmenu-active")
      }
    }
  }

  const addClass = (e) => {
    document.querySelectorAll(".main-menu li a").forEach((item) => {
      item.closest("li").classList.remove("active")
    })
    document.querySelector(".userdropdowncontainer").closest("li").classList.remove("active")
    e.target.closest("li").className = "active"
  }

  //UseEffect

  useEffect(() => {
    document.querySelector("body").addEventListener("click", closeUserMenu)
    document.querySelectorAll(".main-menu li a").forEach((item) => {
      if (item.classList.contains("active")) {
        item.closest("li").classList.add("active")
      }
    })
    document.querySelectorAll(".userdropdownitem").forEach((item) => {
      if (item.classList.contains("active")) {
        document.querySelector(".userdropdowncontainer").closest("li").classList.add("active")
      }
    })
  }, [])

  useEffect(() => {
    //To initialise:

    const container = document.querySelector("#menuScroll")
    const ps = new PerfectScrollbar(container)
  })

  return (
    <div>
      <div className="menu">
        <div className="main-menu">
          <div id="menuScroll" className="scroll" onScroll={handleScroll}>
            <ul className="list-unstyled">
              <li onClick={addClass}>
                <NavLink exact to="/">
                  <img src="img/Icon-material-dashboard.svg" alt="sidebar-icon" />
                  <span>Dashboards</span>
                </NavLink>
              </li>
              <li className="userdropdownli" onClick={clickHandler}>
                <div className="userdropdowncontainer">
                  <img src="img/user.svg" alt="sidebar-icon" />
                  <div className="userdropdown">
                    <div className="arrow-down"></div>
                    <span>Users</span>
                    <div className="userdropdownmenu">
                      <NavLink onClick={closeUserMenu} to="/ManageSubAdmin" className="userdropdownitem" id="ManageSubAdmin">
                        Sub Admin
                      </NavLink>
                      <NavLink onClick={closeUserMenu} to="/ManageCSP" className="userdropdownitem" id="ManageCSP">
                        CSP
                      </NavLink>
                      <NavLink onClick={closeUserMenu} to="/ManageBusinessOwner" className="userdropdownitem" id="ManageBusinessOwner">
                        Business Owner
                      </NavLink>
                      <NavLink onClick={closeUserMenu} to="/ManageUser" className="userdropdownitem" id="ManageUser">
                        User
                      </NavLink>
                    </div>
                  </div>
                </div>
              </li>
              <li onClick={addClass}>
                <NavLink to="/Features">
                  <img src="img/feature-selection.svg" alt="sidebar-icon" />
                  <span>Features</span>
                </NavLink>
              </li>
              <li onClick={addClass}>
                <NavLink to="/ManageVerifications">
                  <img src="img/verified.svg" alt="sidebar-icon" />
                  <span>Verification</span>
                </NavLink>
              </li>
              {/* <li onClick={addClass}>
                <NavLink to="/ManageCategory">
                  <img src="img/categories.svg" alt="sidebar-icon" />
                  <span>Categories</span>
                </NavLink>
              </li> */}
              {/* <li onClick={addClass}>
                <NavLink to="/ManageSlots">
                  <img src="img/Slots.svg" alt="sidebar-icon" />
                  <span>Slots</span>
                </NavLink>
              </li> */}
              {/* <li onClick={addClass}>
                <NavLink to="/ManageBooking">
                  <img src="img/booking.svg" alt="sidebar-icon" />
                  <span>Booking</span>
                </NavLink>
              </li> */}
              {/* <li onClick={addClass}>
                <NavLink to="/ManageCheckIn">
                  <img src="img/checkins.svg" alt="sidebar-icon" />
                  <span>Check-in</span>
                </NavLink>
              </li> */}
              <li onClick={addClass}>
                <NavLink to="/ManageOffers">
                  <img src="img/offer.svg" alt="sidebar-icon" />
                  <span>Offers</span>
                </NavLink>
              </li>
              <li onClick={addClass}>
                <NavLink to="/ManagePlaces">
                  <img src="img/Nearbyplaces.svg" alt="sidebar-icon" />
                  <span>places</span>
                </NavLink>
              </li>
              <li onClick={addClass}>
                <NavLink to="/ManageEvent">
                  <img src="img/event.svg" alt="sidebar-icon" />
                  <span>Event</span>
                </NavLink>
              </li>
              <li onClick={addClass}>
                <NavLink to="/ManageSubscription">
                  <img src="img/Subscription.svg" alt="sidebar-icon" />
                  <span>Subscription</span>
                </NavLink>
              </li>
              <li onClick={addClass}>
                <NavLink to="/Finance">
                  <img src="img/Finance.svg" alt="sidebar-icon" />
                  <span>Finance</span>
                </NavLink>
              </li>
              <li onClick={addClass}>
                <NavLink to="/ManageVoucher">
                  <img src="img/voucher.svg" alt="sidebar-icon" />
                  <span>Voucher</span>
                </NavLink>
              </li>
              <li onClick={addClass}>
                <NavLink to="/ManageReport">
                  <img src="img/Report.svg" alt="sidebar-icon" />
                  <span>Report</span>
                </NavLink>
              </li>
              <li onClick={addClass}>
                <NavLink to="/ChatRoom">
                  <img src="img/Query.svg" alt="sidebar-icon" />
                  <span>Query</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
