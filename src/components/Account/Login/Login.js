import React, { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import Swal from "sweetalert2"
import AuthService from "../../../services/AuthService"
import Loader from "../../../shared/Loader"

const Login = () => {
  //Services
  const authservice = new AuthService()

  //State
  const [login, setLogin] = useState({
    Email: "",
    Password: "",
  })
  const [loader, setloader] = useState(true)
  const [btnLock, setBtnLock] = useState(false)
  const history = useHistory()
  const [emptyValidation, setEmptyValidation] = useState({
    emailEmpty: "",
    passwordEmpty: false,
  })

  // UseEffect
  useEffect(() => {
    // empty dependency array means this effect will only run once (like componentDidMount in classes)
    if (JSON.parse(localStorage.getItem("user"))) {
      history.push("/")
    } else {
      setloader(false)
    }
  }, [])
  const passwordhandler = () => {
    const password = document.querySelector("#password")
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

  //Functions
  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    let pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
    let validCount = 0
    const c = { ...emptyValidation }

    if (login.Email === "") {
      c.emailEmpty = "Email is required"
      validCount++
    } else if (!pattern.test(login.Email)) {
      validCount++
      c.emailEmpty = "Email should be valid"
    } else {
      c.emailEmpty = ""
    }

    if (login.Password === "") {
      c.passwordEmpty = true
      validCount++
    } else {
      c.passwordEmpty = false
    }

    setEmptyValidation(c)

    if (validCount > 0) {
      return
    }

    setBtnLock(true)
    const response = await authservice.login(login)
    if (response.data.Code === 1) {
      setBtnLock(false)
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Logged In",
        showConfirmButton: true,
        timer: 5000,
      })
      // localStorage.setItem("makhtabquser", JSON.stringify(response.data.Data))
      localStorage.setItem("makhtabquserId", JSON.stringify(response.data.Data.UserId))
      localStorage.setItem("maqtabkemail", JSON.stringify(response.data.Data.Email))
      // localStorage.setItem("makhtabquserImage", JSON.stringify(response.data.Data.ProfilePicture))
      history.push("/")
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
    <>
      {loader ? (
        <div className="loadercontainer">
          <div class="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <section className="login">
        <div className="login-content">
          <div className="row align-items-center">
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
              <div className="login-header">
                <h3 className="login-header_title">Login</h3>
              </div>
              <form className="form-login" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group col-12">
                    <label htmlFor="uname" className="w-100">
                      Email
                    </label>
                    <div>
                      <div className="position_relative">
                        <input
                          onKeyUp={emailValid}
                          type="text"
                          name="uname"
                          placeholder="randy.hudson@mail.com"
                          className="form_control"
                          onChange={(e) => {
                            const c = { ...login }
                            c.Email = e.target.value
                            setLogin(c)
                          }}
                          id="email-address"
                        />
                        <img className="tick_icon_email" src="./img/CorrectSvg.svg" id="tick-1" alt="tickicon" />
                      </div>
                    </div>
                    {emptyValidation.emailEmpty.length !== 0 ? <p style={{ marginTop: "5px", color: "red" }}>{emptyValidation.emailEmpty} </p> : ""}
                  </div>
                  <div className="form-group col-md-12">
                    <label htmlFor="pwd">Password</label>
                    <div>
                      <div className="position_relative">
                        <input
                          type="password"
                          name="uname"
                          className="form_control"
                          placeholder="Enter Password"
                          onChange={(e) => {
                            const c = { ...login }
                            c.Password = e.target.value
                            setLogin(c)
                          }}
                          id="password"
                        />

                        <div className="eye-icon">
                          <img alt="eye" src="/img/visibilitySvg.svg" className="eye_Icon" id="toggle-password" onClick={passwordhandler} />
                        </div>
                      </div>
                    </div>
                    {emptyValidation.passwordEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Password is required </p> : ""}
                  </div>
                </div>
                <div className="login-button">
                  <button disabled={btnLock} type="submit" className="btn btn-primary ">
                    Login
                    {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                  </button>
                </div>
                {/* <div className="sign">
                  <p>
                    Don’t have an account?{" "}
                    <span>
                      <Link to="/account/register">Sign Up</Link>
                    </span>
                  </p>
                </div> */}
              </form>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 col-xs-12 ">
              <div className="logo1">
                <img alt="logo" src="/img/logo.png" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Login
