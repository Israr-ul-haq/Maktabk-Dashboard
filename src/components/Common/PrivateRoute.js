import React from "react"
import { Redirect, Route } from "react-router-dom"

const PrivateRoute = ({ component: Component, ...rest }) => {
  //State
  console.log({ ...rest })

  return (
    <Route
      {...rest}
      render={(props) =>
        JSON.parse(localStorage.getItem("makhtabquserId")) ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/account/login", state: { from: props.location } }} />
        )
      }
    />
  )
}

export default PrivateRoute

// import React, { useState, useEffect } from "react"
// import { Navigate } from "react-router-dom"
// import moment from "moment"
// import { compare } from "../helpers/CompareTime"
// function PrivateRoute({ children }) {
//   //UseState
//   const [isExpiredTime, setIsExpiredTime] = useState(false)
//   //UseEffect
//   useEffect(() => {
//     checkExpiryTime()
//   }, [])
//   //Functions
//   const checkExpiryTime = () => {
//     if (JSON.parse(localStorage.getItem("makhtabquser"))) {
//       if (
//         compare(moment(new Date()).format("HH:mm:ss"), moment(JSON.parse(localStorage.getItem("makhtabquser")).token.expiration).format("HH:mm:ss")) ===
//         1
//       ) {
//         localStorage.removeItem("makhtabquser")
//         setIsExpiredTime(true)
//       }
//     } else {
//       setIsExpiredTime(true)
//     }
//   }
//   return !isExpiredTime ? children : <Navigate to="/account/login" />
// }

// export default PrivateRoute
