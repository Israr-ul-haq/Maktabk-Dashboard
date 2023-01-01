import React, { useState, useEffect } from "react"
import { Link, useParams, useHistory } from "react-router-dom"
import Swal from "sweetalert2"
import "react-datepicker/dist/react-datepicker.css"
import { Checkbox } from "pretty-checkbox-react"
import UsersService from "../../../services/UsersService"
import FeatureService from "../../../services/FeatureService"
import CategoryService from "../../../services/CategoryService"
import Loader from "../../../shared/Loader"
import { placeData } from "../../../constants/NearByPlaces"
import GooglePlacesAutocomplete from "react-google-places-autocomplete"
import { geocodeByAddress, geocodeByPlaceId, getLatLng } from "react-places-autocomplete"
import PlacesAutocomplete from "react-places-autocomplete"
import "react-phone-number-input/style.css"
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input"

function EditBusinessOwener() {
  // SERVICES
  const businessOwnerService = new UsersService()
  const featureService = new FeatureService()
  const categoryservice = new CategoryService()

  //State
  const [feature, setFeature] = useState([])
  const [nearByPlace, setNearByPlace] = useState([])
  const [businessNearByPlace, setBusinessNearByPlace] = useState([])
  const [data, setData] = useState([])
  const [categories, setCategories] = useState([])
  const [businessCount, setBusinessCount] = useState(0)
  const [businessfeatures, setBusinessFeatures] = useState([])
  const [categoryId, setCategoryId] = useState(0)
  const history = useHistory()

  const [businessOwner, setBusinessOwner] = useState({
    UserId: 0,
    Name: "",
    Email: "",
    Phone: "",
    Password: "",
    UserTypeId: 4,
    UpdatedBy: JSON.parse(localStorage.getItem("makhtabquserId")),
    ProfilePicture: "",
    BusinessInfoes: [],
  })

  const [businessInfos, setBusinessInfos] = useState({})

  const [businesstiming, setBusinessTiming] = useState([])
  const [picture, setPicture] = useState(null)
  const [imgData, setImgData] = useState(null)
  const [btnLock, setBtnLock] = useState(false)
  const { UserId } = useParams()
  const [emptyValidation, setEmptyValidation] = useState({
    imageEmpty: false,
    nameEmpty: false,
    emailEmpty: "",
    passwordEmpty: false,
    PhoneEmpty: false,
    confirmPasswordEmpty: false,
    businessNameEmpty: false,
    businessCategoryEmpty: false,
    businessDescriptionEmpty: false,
    businessPhoneEmpty: false,
    businessAreaEmpty: false,
    businessPriceEmpty: false,
    businessAddressEmpty: false,
    businessLongitudeEmpty: false,
    businessPrivacyPolicyEmpty: false,
    businessBookingTypeEmpty: false,
    SeatsEmpty: false,
  })
  const [confirmPassword, setConfirmPassword] = useState("")
  let [address, setAddress] = useState()

  //UseEffect
  useEffect(() => {}, [emptyValidation, businessOwner])
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
  const businessemailValid = () => {
    let pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
    var email = document.getElementById("business_email-address").value
    if (!pattern.test(email)) {
      document.querySelector("#tick-2").style.display = "none"
    } else {
      document.querySelector("#tick-2").style.display = "block"
    }
  }

  const deleteItem = () => {
    setPicture(null)
    setImgData(null)
  }

  useEffect(() => {
    getCategories()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (businessCount === 0) {
      getBusinessOwner()
      setBusinessCount(1)
    }
  }, [businessOwner, businessInfos]) // eslint-disable-line react-hooks/exhaustive-deps
  //Functions

  const getCategories = async () => {
    const response = await categoryservice.get("")
    setCategories(response.data.Data)
  }

  const getBusinessOwner = async () => {
    const response = await businessOwnerService.getById(UserId)

    if (response.data.Code === 1) {
      businessOwner.Name = response.data.Data.Name
      businessOwner.UserId = response.data.Data.UserId
      businessOwner.Email = response.data.Data.Email
      businessOwner.Phone = response.data.Data.Phone
      businessOwner.Password = response.data.Data.Password

      setImgData(response.data.Data.ProfilePicture)
      setBusinessInfos(response.data.Data.BusinessInfo)
      setAddress(response.data.Data.BusinessInfo.Address)
      setConfirmPassword(response.data.Data.Password)
      const getFeatures = response.data.Data.BusinessInfo.Features.map((item) => {
        return {
          FeatureId: item.FeatureId,
        }
      })

      const getPlaces = response.data.Data.BusinessInfo.NearByPlaces.map((item) => {
        return {
          NearByPlaceId: item.NearByPlaceId,
        }
      })

      const getTimings = response.data.Data.BusinessInfo.Timings.map((item) => {
        return {
          Day: item.Day,
          StartTime: item.StartTime,
          EndTime: item.EndTime,
        }
      })

      // const filteredPlaces = response.data.Data.BusinessInfo.NearbyPlaces.split(",")
      // const place = placeData.filter((item) => {
      //   let placetitle = filteredPlaces.filter((innerItem) => {
      //     return innerItem.toLowerCase().trim() === item.title.toLowerCase().trim()
      //   })
      //   return placetitle.length !== 0
      // })

      // place.forEach((item) => {
      //   document
      //     .getElementById("nearbyPlaces" + item.id)
      //     .closest(".featureselect_column")
      //     .querySelector(".featureselect_feature")
      //     .classList.add("featureselect_feature-active")
      //   document.getElementById("nearbyPlaces" + item.id).click()

      //   document
      //     .getElementById("nearbyPlaces" + item.id)
      //     .closest(".featureselect_column")
      //     .querySelector(".featureselect_feature .featureselect_image").src = item.activeImg
      //   const filteredPlaces = nearByPlace.split(",")
      //   const finalFilteredPlaces = filteredPlaces.filter((item) => {
      //     return item !== place.title
      //   })

      //   let JoinArray = finalFilteredPlaces.join(", ")
      //   setNearByPlace(JoinArray)
      // })

      getTimings.forEach((item) => {
        let day = ""

        switch (item.Day) {
          case "Monday":
            day = 1
            break
          case "Tuesday":
            day = 2
            break
          case "Wednesday":
            day = 3
            break
          case "Thursday":
            day = 4
            break
          case "Friday":
            day = 5
            break
          case "Saturday":
            day = 6
            break
          case "Sunday":
            day = 7
            break
          case "monday":
            day = 1
            break
          case "tuesday":
            day = 2
            break
          case "wednesday":
            day = 3
            break
          case "thursday":
            day = 4
            break
          case "friday":
            day = 5
            break
          case "saturday":
            day = 6
            break
          case "sunday":
            day = 7
            break
          default:
            break
        }
        document.getElementById("timingcheckboxes" + day).click()
        document
          .getElementById("timingcheckboxes" + day)
          .closest(".timing")
          .querySelector("#startingtime").textContent = item.StartTime.slice(0, 5)

        document
          .getElementById("timingcheckboxes" + day)
          .closest(".timing")
          .querySelector("#endingtime").textContent = item.EndTime.slice(0, 5)
      })

      setBusinessTiming(getTimings)

      const featureRes = await featureService.get("")
      setFeature(featureRes.data.Data)
      getFeatures.forEach(async (item) => {
        document
          .getElementById("featureselect-" + item.FeatureId)
          .closest(".featureselect_column")
          .querySelector(".featureselect_feature")
          .classList.add("featureselect_feature-active")
        document.getElementById("featureselect-" + item.FeatureId).click()
        feature.forEach((featureItem) => {
          if (featureItem.FeatureId === item.FeatureId) {
            document
              .getElementById("featureselect-" + item.FeatureId)
              .closest(".featureselect_column")
              .querySelector(".featureselect_feature .featureselect_image").src = "http://18.159.202.37:81" + featureItem.ImagePath
          }
        })
      })
      setBusinessFeatures(getFeatures)

      const placesRes = await businessOwnerService.getPlaces()

      setNearByPlace(placesRes.data.Data)

      getPlaces.forEach(async (item) => {
        document
          .getElementById("placeselect-" + item.NearByPlaceId)
          .closest(".featureselect_column")
          .querySelector(".featureselect_feature")
          .classList.add("featureselect_feature-active")
        document.getElementById("placeselect-" + item.NearByPlaceId).click()
        nearByPlace.forEach((placesItem) => {
          if (placesItem.NearByPlaceId === item.NearByPlaceId) {
            document
              .getElementById("placeselect-" + item.NearByPlaceId)
              .closest(".featureselect_column")
              .querySelector(".featureselect_feature .featureselect_image").src = "http://18.159.202.37:81" + placesItem.ActiveImage
          }
        })
      })
      setBusinessNearByPlace(getPlaces)
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

  const handleSubmit = async (e) => {
    let pattern = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
    e.preventDefault()
    let validCount = 0

    const c = { ...emptyValidation }
    if (imgData === null) {
      c.imageEmpty = true
      validCount++
    } else {
      c.imageEmpty = false
    }

    if (businessOwner.Name === "") {
      c.nameEmpty = true
      validCount++
    } else {
      c.nameEmpty = false
    }

    if (businessOwner.Email === "") {
      c.emailEmpty = "Email is required"
      validCount++
    } else if (!pattern.test(businessOwner.Email)) {
      validCount++
      c.emailEmpty = "Email should be valid"
    } else {
      c.emailEmpty = ""
    }
    debugger
    if (businessOwner?.Phone === "") {
      c.PhoneEmpty = "Phone number is required"
      validCount++
    } else if (businessOwner?.Phone && isValidPhoneNumber(businessOwner?.Phone)) {
      c.PhoneEmpty = false
    } else {
      validCount++
      c.PhoneEmpty = "Invalid phone number"
    }

    if (businessOwner.Password === "") {
      c.passwordEmpty = true
      validCount++
    } else {
      c.passwordEmpty = false
    }

    if (businessOwner.Password !== confirmPassword) {
      c.confirmPasswordEmpty = true
      validCount++
    } else {
      c.confirmPasswordEmpty = false
    }

    if (businessInfos.Name === "") {
      c.businessNameEmpty = true
      validCount++
    } else {
      c.businessNameEmpty = false
    }
    if (businessInfos.Address === "") {
      c.businessAddressEmpty = true
      validCount++
    } else {
      c.businessAddressEmpty = false
    }
    if (businessInfos.Description === "") {
      c.businessDescriptionEmpty = true
      validCount++
    } else {
      c.businessDescriptionEmpty = false
    }
    debugger
    if (businessInfos?.Phone === "") {
      c.businessPhoneEmpty = "Phone number is required"
      validCount++
    } else if (businessInfos?.Phone && isValidPhoneNumber(businessInfos?.Phone)) {
      c.businessPhoneEmpty = false
    } else {
      validCount++
      c.businessPhoneEmpty = "Invalid phone number"
    }
    if (businessInfos.Area === "") {
      c.businessAreaEmpty = true
      validCount++
    } else {
      c.businessAreaEmpty = false
    }
    // if (businessInfos.Price === 0) {
    //   c.businessPriceEmpty = true
    //   validCount++
    // } else {
    //   c.businessPriceEmpty = false
    // }
    // if (businessInfos.Latitude === "") {
    //   c.businessLatitudeEmpty = true
    //   validCount++
    // } else {
    //   c.businessLatitudeEmpty = false
    // }
    // if (businessInfos.Longitude === "") {
    //   c.businessLongitudeEmpty = true
    //   validCount++
    // } else {
    //   c.businessLongitudeEmpty = false
    // }
    if (businessInfos.PrivacyPolicy === "") {
      c.businessPrivacyPolicyEmpty = true
      validCount++
    } else {
      c.businessPrivacyPolicyEmpty = false
    }
    if (businessInfos.Seats === "") {
      c.SeatsEmpty = true
      validCount++
    } else {
      c.SeatsEmpty = false
    }
    // if (businessInfos.BookingTypeId === "") {
    //   c.businessBookingTypeEmpty = true
    //   validCount++
    // } else {
    //   c.businessBookingTypeEmpty = false
    // }
    if (businessInfos.Email === "") {
      c.emailEmpty = "Email is required"
      validCount++
    } else if (!pattern.test(businessInfos.Email)) {
      validCount++
      c.emailEmpty = "Email should be valid"
    } else {
      c.emailEmpty = ""
    }

    if (businesstiming.length === 0) {
      validCount++
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Business Timings should not be empty!",
        showConfirmButton: true,
        timer: 5000,
      })
    }

    if (businessfeatures.length === 0) {
      validCount++
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Business Features should not be empty!",
        showConfirmButton: true,
        timer: 5000,
      })
    }

    setEmptyValidation(c)

    if (validCount > 0) {
      return
    }
    setBtnLock(true)
    const newBusinessInfoes = {}
    debugger
    newBusinessInfoes.BusinessTimings = businesstiming
    newBusinessInfoes.BusinessFeatures = businessfeatures
    newBusinessInfoes.BusinessNearByPlaces = businessNearByPlace
    categories.forEach((item) => {
      if (item.CategoryId === Number(businessInfos.Category)) {
        newBusinessInfoes.CategoryId = item.CategoryId
      } else if (item.Name === businessInfos.Category) {
        newBusinessInfoes.CategoryId = item.CategoryId
      }
    })
    // categories.forEach((item) => {
    //
    //   if (businessInfos.Category) {
    //     newBusinessInfoes.CategoryId = item.CategoryId
    //   }

    // })

    // if (businessInfos.BookingType === "Booking") {
    //   newBusinessInfoes.BookingTypeId = 1
    // }

    // if (businessInfos.BookingType === "Check In") {
    //   newBusinessInfoes.BookingTypeId = 2
    // }

    newBusinessInfoes.Name = businessInfos.Name
    newBusinessInfoes.Description = businessInfos.Description
    newBusinessInfoes.Area = businessInfos.Area
    newBusinessInfoes.Phone = businessInfos.Phone
    newBusinessInfoes.Price = businessInfos.Price
    newBusinessInfoes.Address = businessInfos.Address
    newBusinessInfoes.Latitude = businessInfos.Latitude
    newBusinessInfoes.Longitude = businessInfos.Longitude
    newBusinessInfoes.Distance = 200
    newBusinessInfoes.PrivacyPolicy = businessInfos.PrivacyPolicy
    newBusinessInfoes.Email = businessInfos.Email
    newBusinessInfoes.RSVP = businessInfos.RSVP
    newBusinessInfoes.Seats = businessInfos.Seats

    // newBusinessInfoes.NearbyPlaces = nearByPlace + finalNearByplace
    // newBusinessInfoes.NearbyPlaces = finalNearByplace

    businessOwner.BusinessInfoes = []

    businessOwner.BusinessInfoes.push(newBusinessInfoes)
    debugger
    const response = await businessOwnerService.update(businessOwner)
    if (response.data.Code === 1) {
      const formData = new FormData()
      formData.append("id", response.data.Data.UserId)
      formData.append("profile_picture", picture)
      const imageResponse = await businessOwnerService.uploadImage(formData)
      if (imageResponse.data.Code === 1) {
        history.push("/ManageBusinessOwner")
        setBtnLock(false)
        Swal.fire({
          position: "center",
          icon: "success",
          title: "BusinessOwner has been saved",
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

  const handleFeature = (e) => {
    const filteredFeature = feature.filter((item) => {
      return item.FeatureId === Number(e.target.value)
    })

    if (document.getElementById(e.target.id).checked === true) {
      document
        .getElementById(e.target.id)
        .closest(".featureselect_column")
        .querySelector(".featureselect_feature")
        .classList.add("featureselect_feature-active")
      document.getElementById(e.target.id).closest(".featureselect_column").querySelector(".featureselect_feature .featureselect_image").src =
        "http://18.159.202.37:81" + filteredFeature[0].ImagePath
      debugger
      businessfeatures.push({
        FeatureId: e.target.value,
      })
      console.log(businessfeatures)
    } else {
      document
        .getElementById(e.target.id)
        .closest(".featureselect_column")
        .querySelector(".featureselect_feature")
        .classList.remove("featureselect_feature-active")
      document.getElementById(e.target.id).closest(".featureselect_column").querySelector(".featureselect_feature .featureselect_image").src =
        "http://18.159.202.37:81" + filteredFeature[0].GreyIcon
      const filteredFeatures = businessfeatures.filter((item) => Number(e.target.value) !== item.FeatureId)
      debugger
      const removeIndex = businessfeatures
        .map((item) => {
          return item.FeatureId
        })
        .indexOf(e.target.value)
      businessfeatures.splice(removeIndex, 1)
      console.log(businessfeatures)
    }
  }
  const handlePlaces = (e) => {
    const fileteredPlaces = nearByPlace.filter((item) => {
      return item.NearByPlaceId === Number(e.target.value)
    })

    if (document.getElementById(e.target.id).checked === true) {
      document
        .getElementById(e.target.id)
        .closest(".featureselect_column")
        .querySelector(".featureselect_feature")
        .classList.add("featureselect_feature-active")
      document.getElementById(e.target.id).closest(".featureselect_column").querySelector(".featureselect_feature .featureselect_image").src =
        "http://18.159.202.37:81" + fileteredPlaces[0].ActiveImage
      businessNearByPlace.push({
        NearByPlaceId: e.target.value,
      })
    } else {
      document
        .getElementById(e.target.id)
        .closest(".featureselect_column")
        .querySelector(".featureselect_feature")
        .classList.remove("featureselect_feature-active")
      document.getElementById(e.target.id).closest(".featureselect_column").querySelector(".featureselect_feature .featureselect_image").src =
        "http://18.159.202.37:81" + fileteredPlaces[0].InActiveImage
      const filteredPlaces = businessNearByPlace.filter((item) => Number(e.target.value) !== item.NearByPlaceId)
      // setBusinessNearByPlace(filteredPlaces)
      const removeIndex = businessNearByPlace
        .map((item) => {
          return item.NearByPlaceId
        })
        .indexOf(e.target.value)
      businessNearByPlace.splice(removeIndex, 1)
    }
  }

  const handleTiming = (e) => {
    let day = ""
    switch (e.target.value) {
      case "1":
        day = "Monday"
        break
      case "2":
        day = "Tuesday"
        break
      case "3":
        day = "Wednesday"
        break
      case "4":
        day = "Thursday"
        break
      case "5":
        day = "Friday"
        break
      case "6":
        day = "Saturday"
        break
      case "7":
        day = "Sunday"
        break
      default:
        break
    }
    if (document.getElementById(e.target.id).checked === true) {
      document.getElementById(e.target.id).closest(".timing").querySelector(".timing_timepicker").style.pointerEvents = "unset"
      document.getElementById(e.target.id).closest(".timing").querySelector(".timing_timepicker").style.opacity = "1"
      businesstiming.push({
        Day: day,
        StartTime: document.getElementById(e.target.id).closest(".timing").querySelector("#startingtime").textContent.trim(),
        EndTime: document.getElementById(e.target.id).closest(".timing").querySelector("#endingtime").textContent.trim(),
      })
    } else {
      document.getElementById(e.target.id).closest(".timing").querySelector(".timing_timepicker").style.pointerEvents = " none"
      document.getElementById(e.target.id).closest(".timing").querySelector(".timing_timepicker").style.opacity = ".5"
      const filteredTiming = businesstiming.filter((item) => day !== item.Day)
      setBusinessTiming(filteredTiming)
    }
  }

  const maxLengthCheck = (object) => {
    if (object.target.value.length > object.target.maxLength) {
      object.target.value = object.target.value.slice(0, object.target.maxLength)
    }
  }

  const handleTime = (e) => {
    e.preventDefault()

    let minutesNum = Number(document.getElementById(e.target.id).parentElement.children[0].innerHTML.split(":")[1])
    let hourNum = Number(document.getElementById(e.target.id).parentElement.children[0].innerHTML.split(":")[0])
    let getCheckboxValue = document.getElementById(e.target.id).closest(".timing").querySelector(".timingcheckboxes").value
    let day = ""
    switch (getCheckboxValue) {
      case "1":
        day = "Monday"
        break
      case "2":
        day = "Tuesday"
        break
      case "3":
        day = "Wednesday"
        break
      case "4":
        day = "Thursday"
        break
      case "5":
        day = "Friday"
        break
      case "6":
        day = "Saturday"
        break
      case "7":
        day = "Sunday"
        break
      default:
        break
    }

    if (e.target.classList[1].toString() === "timing_timeupbtn--down") {
      minutesNum -= 15

      if (minutesNum === 0) {
        minutesNum = "0" + 0
      }

      if (minutesNum === -15) {
        minutesNum = 45
        hourNum = hourNum - 1
      }

      if (hourNum === 0) {
        hourNum = 12
      }

      if (hourNum < 10) {
        hourNum = "0" + hourNum
      }
      document.getElementById(e.target.id).parentElement.children[0].innerHTML = `${String(hourNum)}:${String(minutesNum)}`

      var item = businesstiming.find((x) => {
        return x.Day === day
      })
      if (item) {
        const filteredTiming = businesstiming.filter((item) => day !== item.Day)
        setBusinessTiming(filteredTiming)
        item.EndTime = document.getElementById(e.target.id).closest(".timing").querySelector("#endingtime").textContent.trim()
        item.StartTime = document.getElementById(e.target.id).closest(".timing").querySelector("#startingtime").textContent.trim()
        setBusinessTiming((oldArray) => [...oldArray, item])
        console.log(businesstiming)
      }
    }

    if (e.target.classList[1].toString() === "timing_timeupbtn--up") {
      minutesNum += 15

      if (minutesNum === 60) {
        minutesNum = "0" + 0
        hourNum = hourNum + 1
      }

      if (hourNum > 12) {
        hourNum = "0" + 1
      }

      if (hourNum < 10) {
        hourNum = "0" + hourNum
      }

      document.getElementById(e.target.id).parentElement.children[0].innerHTML = `${String(hourNum)}:${String(minutesNum)}`
    }
  }

  // const handlePlacesChange = (id) => {
  //   const filterplacesImage = placeData.filter((item) => {
  //     return item.id === id
  //   })
  //   if (document.getElementById("nearbyPlaces" + id).checked === true) {
  //     document
  //       .getElementById("nearbyPlaces" + id)
  //       .closest(".featureselect_column")
  //       .querySelector(".featureselect_feature")
  //       .classList.add("featureselect_feature-active")
  //     document
  //       .getElementById("nearbyPlaces" + id)
  //       .closest(".featureselect_column")
  //       .querySelector(".featureselect_feature .featureselect_image").src = filterplacesImage[0].activeImg
  //     let addText = finalNearByplace + filterplacesImage[0].title + ","
  //     setFinalNearByPlace(addText)
  //   } else {
  //     document
  //       .getElementById("nearbyPlaces" + id)
  //       .closest(".featureselect_column")
  //       .querySelector(".featureselect_feature")
  //       .classList.remove("featureselect_feature-active")

  //     document
  //       .getElementById("nearbyPlaces" + id)
  //       .closest(".featureselect_column")
  //       .querySelector(".featureselect_feature .featureselect_image").src = filterplacesImage[0].inactiveImg
  //     const filteredPlaces = finalNearByplace.split(",")
  //     const finalFilteredPlaces = filteredPlaces.filter((item) => {
  //       return item !== filterplacesImage[0].title
  //     })

  //     let JoinArray = finalFilteredPlaces.join(", ")
  //     setFinalNearByPlace(JoinArray)
  //   }
  // }

  const handleChange = async (myaddress) => {
    const m = { ...businessInfos }
    m.Address = myaddress

    geocodeByAddress(myaddress)
      .then((results) => getLatLng(results[0]))
      .then(({ lat, lng }) => {
        m.Latitude = lat
        m.Longitude = lng
      })
    setBusinessInfos(m)
    console.log(m)
  }

  return (
    <div>
      <main style={{ marginBottom: "10px" }}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <Link to="/ManageBusinessOwner" className="headertopbar_title">
                  {" "}
                  <img className="headertopbar__arrowimage" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" /> Edit Business Owner
                </Link>
              </div>
            </div>
            <div className="col-12 column_margin">
              <div className="card_custom">
                <p className="signup-title">Personal Information</p>
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
                          onChange={(e) => {
                            const c = { ...businessOwner }
                            c.Name = e.target.value
                            setBusinessOwner(c)
                          }}
                          value={businessOwner.Name}
                        />
                        {emptyValidation.nameEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Name is Required </p> : ""}
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
                                const c = { ...businessOwner }
                                c.Email = e.target.value
                                setBusinessOwner(c)
                              }}
                              value={businessOwner.Email}
                            />
                            <img className="tick_icon_email" src="./img/CorrectSvg.svg" id="tick-1" alt="tickicon" />
                          </div>
                        </div>
                        {emptyValidation.emailEmpty.length !== 0 ? (
                          <p style={{ marginTop: "5px", color: "red" }}>{emptyValidation.emailEmpty} </p>
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

                        <PhoneInput
                          international
                          value={businessOwner?.Phone}
                          className="form_control"
                          onChange={(e) => {
                            const c = { ...businessOwner }
                            c.Phone = e
                            setBusinessOwner(c)
                          }}
                        />
                        {emptyValidation.PhoneEmpty ? <p style={{ marginTop: "5px", color: "red" }}>{emptyValidation.PhoneEmpty}</p> : ""}
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
                                const c = { ...businessOwner }
                                c.Password = e.target.value
                                setBusinessOwner(c)
                              }}
                              value={businessOwner.Password}
                            />

                            <div className="eye-icon">
                              <img alt="eye" src="/img/visibilitySvg.svg" className="eye_Icon" id="toggle-password" onClick={passwordhandler} />
                            </div>
                          </div>
                        </div>
                        {emptyValidation.passwordEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Password is Required </p> : ""}
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
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div>
        <div className="main_businessowner">
          <div className="container-fluid">
            <div className="col-12">
              <div className="card_custom">
                <p className="signup-title">Business Information</p>
                <form className="myform" onSubmit={handleSubmit}>
                  <div className="form-row">
                    {/* <div className="form-group col-md-12 form-group--uploadimage">
                    <div className="file-upload position-relative">
                      <div class="imagecontainer">
                        <label for="upload-image" class="upload-image-label">
                          <div className="file-pic">
                            <h5 className="upload-image-title">Upload Image</h5>

                            <img
                              src="/img/icon_upload_add_load@2x.png"
                              id="image-icon"
                              alt="upload_image"
                            />
                          </div>
                          <img
                            id="cross-icon"
                            alt="delete_image"
                            src="/img/cancel.svg"
                          />
                        </label>
                        {imgData ? (
                          <div class="uploadedimages">
                            <img
                              class="uploadedimage"
                              src={imgData}
                              alt="uploaded_image"
                            />
                            <img
                              onClick={deleteItem}
                              class="delete_upload_image"
                              alt="delete_uploaded_image"
                              src="/img/cancel.svg"
                            />
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                      <input
                        onChange={imagesPreview}
                        id="upload-image"
                        name="upload-image"
                        hidden
                        type="file"
                        accept=".png, .jpg, .jpeg"
                      />
                      {emptyValidation.imageEmpty ? (
                        <p style={{ marginTop: "5px", color: "red" }}>
                          Image is required{" "}
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div> */}

                    <div className="form-group col-md-4">
                      <div className="name">
                        <label htmlfor="username">Business Name</label>
                        <input
                          type="text"
                          name="username"
                          className="form_control"
                          placeholder="Enter Name"
                          onChange={(e) => {
                            const c = { ...businessInfos }
                            c.Name = e.target.value
                            setBusinessInfos(c)
                          }}
                          value={businessInfos.Name}
                        />
                        {emptyValidation.businessNameEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Business Name is Required </p> : ""}
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="email-container position-relative">
                        <label htmlfor="uname" className="w-100 email-label">
                          Description
                        </label>
                        <input
                          type="text"
                          name="uname"
                          placeholder="Enter Description"
                          className="form_control"
                          id="email-address"
                          onChange={(e) => {
                            const c = { ...businessInfos }
                            c.Description = e.target.value
                            setBusinessInfos(c)
                          }}
                          value={businessInfos.Description}
                        />
                        {emptyValidation.businessDescriptionEmpty ? (
                          <p style={{ marginTop: "5px", color: "red" }}>Business Description is Required </p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    {/* <div className="form-group col-md-4">
                      <div className="phone-container position-relative">
                        <label htmlfor="tel" className="number-label">
                          Address
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Address"
                          value={businessInfos.Address}
                          className="form_control"
                          onChange={(e) => {
                            const c = { ...businessInfos }
                            c.Address = e.target.value
                            setBusinessInfos(c)
                          }}
                        />
                        {emptyValidation.businessAddressEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Business Address is Required </p> : ""}
                      </div>

                    </div> */}
                    <div className="form-group col-md-4">
                      <div className="phone-container position-relative">
                        <label htmlfor="tel" className="number-label">
                          Address
                        </label>
                        {/* <GooglePlacesAutocomplete
                          selectProps={{
                            onChange: handleChange,
                            // onInputChange: handleChangeInput,
                            placeholder: "Enter Address...",
                            inputValue: address,
                          }}
                        /> */}
                        <PlacesAutocomplete value={businessInfos.Address} onChange={handleChange}>
                          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                            <div>
                              <input
                                {...getInputProps({
                                  placeholder: "Search Places ...",
                                  className: "form-control input-md",
                                  autoFocus: true,
                                })}
                                className="form_control"
                              />
                              <div className="autocomplete-dropdown-container">
                                {loading && <div>Loading...</div>}
                                {suggestions.map((suggestion) => {
                                  const className = suggestion.active ? "suggestion-item--active" : "suggestion-item"
                                  // inline style for demonstration purpose
                                  const style = suggestion.active
                                    ? { backgroundColor: "#fafafa", cursor: "pointer" }
                                    : { backgroundColor: "#ffffff", cursor: "pointer" }
                                  return (
                                    <div
                                      {...getSuggestionItemProps(suggestion, {
                                        className,
                                        style,
                                      })}
                                    >
                                      <span>{suggestion.description}</span>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}
                        </PlacesAutocomplete>
                        {emptyValidation.businessAddressEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Business Address is Required </p> : ""}
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="phone-container position-relative">
                        <label htmlfor="tel" className="number-label">
                          Business Phone
                        </label>

                        <PhoneInput
                          international
                          value={businessInfos?.Phone}
                          className="form_control"
                          onChange={(e) => {
                            const c = { ...businessInfos }
                            c.Phone = e
                            setBusinessInfos(c)
                          }}
                        />
                        {emptyValidation.businessPhoneEmpty ? (
                          <p style={{ marginTop: "5px", color: "red" }}>{emptyValidation.businessPhoneEmpty}</p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="phone-container position-relative">
                        <label htmlfor="tel" className="number-label">
                          Categories
                        </label>
                        <select
                          onChange={(e) => {
                            const c = { ...businessInfos }
                            c.Category = e.target.value
                            setBusinessInfos(c)
                          }}
                          className="form_control"
                        >
                          {categories.map((item) => {
                            if (item.Name === businessInfos.Category) {
                              return (
                                <option selected value={item.Name}>
                                  {item.Name}
                                </option>
                              )
                            } else {
                              return <option value={item.CategoryId}>{item.Name}</option>
                            }
                          })}
                        </select>
                        {emptyValidation.businessCategoryEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Category is required </p> : ""}
                      </div>
                    </div>
                    {/* <div className="form-group col-md-4">
                    <div className="phone-container position-relative">
                      <label htmlfor="tel" className="number-label">
                        Booking Type
                      </label>
                      <select
                        onChange={(e) => {
                          
                          const c = { ...businessInfos }
                          c.BookingTypeId = e.target.value
                          setBusinessInfos(c)
                        }}
                        className="form_control"
                      >
                        <option value="">Select Booking</option>

                        <option selected={businessInfos.BookingType === "Booking" ? "true" : "false"} value="1">
                          Booking
                        </option>
                        <option selected={businessInfos.BookingType === "Check In" ? "true" : "false"} value="2">
                          Check In
                        </option>
                      </select>
                      {emptyValidation.businessBookingTypeEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Booking is required </p> : ""}
                    </div>
                  </div> */}
                    {/* <div className="form-group col-md-4">
                    <div className="phone-container position-relative">
                      <label htmlfor="tel" className="number-label">
                        Price
                      </label>
                      <input
                        type="number"
                        placeholder="Enter Address"
                        value={businessInfos.Price}
                        className="form_control"
                        onChange={(e) => {
                          const c = { ...businessInfos }
                          c.Price = e.target.value
                          setBusinessInfos(c)
                        }}
                      />
                      {emptyValidation.businessPriceEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Business price is required </p> : ""}
                    </div>
                  </div> */}
                    <div className="form-group col-md-4">
                      <div className="email-container position-relative">
                        <label htmlfor="uname" className="w-100 email-label">
                          Business Email
                        </label>
                        <div>
                          <div className="position_relative">
                            <input
                              onKeyUp={businessemailValid}
                              type="text"
                              name="uname"
                              placeholder="Enter Email Address"
                              className="form_control"
                              id="business_email-address"
                              onChange={(e) => {
                                const c = { ...businessInfos }
                                c.Email = e.target.value
                                setBusinessInfos(c)
                              }}
                              value={businessInfos.Email}
                            />
                            <img className="tick_icon_email" src="./img/CorrectSvg.svg" id="tick-2" alt="tickicon" />
                          </div>
                        </div>
                        {emptyValidation.emailEmpty.length !== 0 ? (
                          <p style={{ marginTop: "5px", color: "red" }}>{emptyValidation.emailEmpty} </p>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <div className="phone-container position-relative">
                        <label htmlfor="tel" className="number-label">
                          Area
                        </label>
                        <input
                          type="text"
                          placeholder="Enter Address"
                          value={businessInfos.Area}
                          className="form_control"
                          onChange={(e) => {
                            const c = { ...businessInfos }
                            c.Area = e.target.value
                            setBusinessInfos(c)
                          }}
                        />
                        {emptyValidation.businessAreaEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Business Area is Required </p> : ""}
                      </div>
                    </div>
                    {/* <div className="form-group col-md-4">
                    <div className="phone-container position-relative">
                      <label htmlfor="tel" className="number-label">
                        Latitude
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Address"
                        value={businessInfos.Latitude}
                        className="form_control"
                        onChange={(e) => {
                          const c = { ...businessInfos }
                          c.Latitude = e.target.value
                          setBusinessInfos(c)
                        }}
                      />
                      {emptyValidation.businessLatitudeEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Business Latitude is Required </p> : ""}
                    </div>
                  </div>
                  <div className="form-group col-md-4">
                    <div className="phone-container position-relative">
                      <label htmlfor="tel" className="number-label">
                        Longitude
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Address"
                        value={businessInfos.Longitude}
                        className="form_control"
                        onChange={(e) => {
                          const c = { ...businessInfos }
                          c.Longitude = e.target.value
                          setBusinessInfos(c)
                        }}
                      />
                      {emptyValidation.businessLongitudeEmpty ? (
                        <p style={{ marginTop: "5px", color: "red" }}>Business Longitude is Required </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div> */}
                    <div className="form-group col-md-4">
                      <div className="phone-container position-relative">
                        <label htmlfor="tel" className="number-label">
                          RSVP
                        </label>
                        <input
                          type="text"
                          placeholder="Enter RSVP"
                          value={businessInfos.RSVP}
                          className="form_control"
                          onChange={(e) => {
                            const c = { ...businessInfos }
                            c.RSVP = e.target.value
                            setBusinessInfos(c)
                          }}
                        />
                        {emptyValidation.RSVPEmpty ? <p style={{ marginTop: "5px", color: "red" }}>RSVP is required </p> : ""}
                      </div>
                    </div>

                    <div className="form-group col-md-4">
                      <div className="phone-container position-relative">
                        <label htmlfor="tel" className="number-label">
                          Seats
                        </label>
                        <input
                          type="number"
                          placeholder="Enter no of seats"
                          value={businessInfos.Seats}
                          className="form_control"
                          onChange={(e) => {
                            const c = { ...businessInfos }
                            c.Seats = e.target.value
                            setBusinessInfos(c)
                          }}
                        />
                        {emptyValidation.SeatsEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Seats are required </p> : ""}
                      </div>
                    </div>
                    <div className="form-group col-md-12">
                      <div className="email-container position-relative">
                        <label htmlfor="uname" className="w-100 email-label">
                          Privacy Policy Details
                        </label>
                        <textarea
                          type="text"
                          name="uname"
                          placeholder="Make Policy"
                          className="form_control_policy"
                          id="email-address"
                          onChange={(e) => {
                            const c = { ...businessInfos }
                            c.PrivacyPolicy = e.target.value
                            setBusinessInfos(c)
                          }}
                          value={businessInfos.PrivacyPolicy}
                        />
                        {emptyValidation.businessPrivacyPolicyEmpty ? <p style={{ marginTop: "5px", color: "red" }}>Policy is Required </p> : ""}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="main_businessowner" style={{ marginBottom: "70px" }}>
        <form className="myform" onSubmit={handleSubmit}>
          <div className="container-fluid">
            <div className="col-12">
              <div className="card_custom">
                <div className="form-row ">
                  <div className="col-md-12 mb-0">
                    <p className="signup-title">Business Timings</p>
                  </div>
                  <div className="form-group col-md-12">
                    <div className="timings">
                      <div className="timing">
                        <div className="pretty timing_pretty p-image p-plain">
                          <Checkbox
                            type="checkbox"
                            name="timingcheckboxes7"
                            id="timingcheckboxes7"
                            class="timingcheckboxes"
                            value="7"
                            onChange={(e) => {
                              handleTiming(e)
                            }}
                          >
                            <div>Sunday</div>
                          </Checkbox>
                        </div>
                        <div className="timing_timepicker">
                          <div className="timing_timeboxcontainer">
                            <div className="timing_timebox">
                              <span id="startingtime" className="timing_time">
                                09:00{" "}
                              </span>
                              <a id="timingupbtn12" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--up">
                                <img className="timing_timeupimage" src="./img/triangular-filled-up-arrow (1).svg" alt="img" />
                              </a>
                              <a id="timingdownbtn12" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--down">
                                <img className="timing_timeupimage" src="./img/sort-down.svg" alt="btn down" />
                              </a>
                            </div>
                            {/* <div className="timing_modes">
                              <a className="timing_mode timing_mode-active">
                                AM
                              </a>
                              <a className="timing_mode">PM</a>
                            </div> */}
                          </div>
                          <span className="timing_to">To</span>
                          <div className="timing_timeboxcontainer">
                            <div className="timing_timebox">
                              <span id="endingtime" className="timing_time">
                                02:15
                              </span>
                              <a id="timingupbtn13" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--up">
                                <img className="timing_timeupimage" src="./img/triangular-filled-up-arrow (1).svg" alt="arrow" />
                              </a>
                              <a id="timingdownbtn13" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--down">
                                <img className="timing_timeupimage" src="./img/sort-down.svg" alt="timeup" />
                              </a>
                            </div>
                            {/* <div className="timing_modes">
                              <a className="timing_mode timing_mode-active">
                                AM
                              </a>
                              <a className="timing_mode">PM</a>
                            </div> */}
                          </div>
                        </div>{" "}
                      </div>
                      <div className="timing">
                        <div className="pretty timing_pretty p-image p-plain">
                          <Checkbox
                            type="checkbox"
                            name="timingcheckboxes1"
                            class="timingcheckboxes"
                            id="timingcheckboxes1"
                            onChange={(e) => {
                              handleTiming(e)
                            }}
                            value="1"
                          >
                            <div>Monday</div>
                          </Checkbox>
                        </div>

                        <div className="timing_timepicker">
                          <div className="timing_timeboxcontainer">
                            <div className="timing_timebox">
                              <span id="startingtime" className="timing_time">
                                09:00{" "}
                              </span>
                              <a id="timingupbtn1" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--up">
                                <img className="timing_timeupimage" src="./img/triangular-filled-up-arrow (1).svg" alt="img" />
                              </a>
                              <a id="timingdownbtn1" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--down">
                                <img className="timing_timeupimage" src="./img/sort-down.svg" alt="btn down" />
                              </a>
                            </div>
                            {/* <div className="timing_modes">
                              <a className="timing_mode timing_mode-active">
                                AM
                              </a>
                              <a className="timing_mode">PM</a>
                            </div> */}
                          </div>
                          <span className="timing_to">To</span>
                          <div className="timing_timeboxcontainer">
                            <div className="timing_timebox">
                              <span id="endingtime" className="timing_time">
                                02:15
                              </span>
                              <a id="timingupbtn2" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--up">
                                <img className="timing_timeupimage" src="./img/triangular-filled-up-arrow (1).svg" alt="arrow" />
                              </a>
                              <a id="timingdownbtn2" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--down">
                                <img className="timing_timeupimage" src="./img/sort-down.svg" alt="timeup" />
                              </a>
                            </div>
                            {/* <div className="timing_modes">
                              <a className="timing_mode timing_mode-active">
                                AM
                              </a>
                              <a className="timing_mode">PM</a>
                            </div> */}
                          </div>
                        </div>
                      </div>
                      <div className="timing">
                        <div className="pretty timing_pretty p-image p-plain">
                          <Checkbox
                            type="checkbox"
                            name="timingcheckboxes2"
                            class="timingcheckboxes"
                            onChange={(e) => {
                              handleTiming(e)
                            }}
                            id="timingcheckboxes2"
                            value="2"
                          >
                            <div>Tuesday</div>
                          </Checkbox>
                        </div>
                        <div className="timing_timepicker">
                          <div className="timing_timeboxcontainer">
                            <div className="timing_timebox">
                              <span id="startingtime" className="timing_time">
                                09:00{" "}
                              </span>
                              <a id="timingupbtn3" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--up">
                                <img className="timing_timeupimage" src="./img/triangular-filled-up-arrow (1).svg" alt="img" />
                              </a>
                              <a id="timingdownbtn3" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--down">
                                <img className="timing_timeupimage" src="./img/sort-down.svg" alt="btn down" />
                              </a>
                            </div>
                            {/* <div className="timing_modes">
                              <a className="timing_mode timing_mode-active">
                                AM
                              </a>
                              <a className="timing_mode">PM</a>
                            </div> */}
                          </div>
                          <span className="timing_to">To</span>
                          <div className="timing_timeboxcontainer">
                            <div className="timing_timebox">
                              <span id="endingtime" className="timing_time">
                                02:15
                              </span>
                              <a id="timingupbtn4" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--up">
                                <img className="timing_timeupimage" src="./img/triangular-filled-up-arrow (1).svg" alt="arrow" />
                              </a>
                              <a id="timingdownbtn4" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--down">
                                <img className="timing_timeupimage" src="./img/sort-down.svg" alt="timeup" />
                              </a>
                            </div>
                            {/* <div className="timing_modes">
                              <a className="timing_mode timing_mode-active">
                                AM
                              </a>
                              <a className="timing_mode">PM</a>
                            </div> */}
                          </div>
                        </div>
                      </div>
                      <div className="timing">
                        <div className="pretty timing_pretty p-image p-plain">
                          <Checkbox
                            type="checkbox"
                            name="timingcheckboxes3"
                            class="timingcheckboxes"
                            id="timingcheckboxes3"
                            value="3"
                            onChange={(e) => {
                              handleTiming(e)
                            }}
                          >
                            <div>Wednesday</div>
                          </Checkbox>
                        </div>
                        <div className="timing_timepicker">
                          <div className="timing_timeboxcontainer">
                            <div className="timing_timebox">
                              <span id="startingtime" className="timing_time">
                                09:00{" "}
                              </span>
                              <a id="timingupbtn5" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--up">
                                <img className="timing_timeupimage" src="./img/triangular-filled-up-arrow (1).svg" alt="img" />
                              </a>
                              <a id="timingdownbtn5" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--down">
                                <img className="timing_timeupimage" src="./img/sort-down.svg" alt="btn down" />
                              </a>
                            </div>
                            {/* <div className="timing_modes">
                              <a className="timing_mode timing_mode-active">
                                AM
                              </a>
                              <a className="timing_mode">PM</a>
                            </div> */}
                          </div>
                          <span className="timing_to">To</span>
                          <div className="timing_timeboxcontainer">
                            <div className="timing_timebox">
                              <span id="endingtime" className="timing_time">
                                02:15
                              </span>
                              <a id="timingupbtn6" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--up">
                                <img className="timing_timeupimage" src="./img/triangular-filled-up-arrow (1).svg" alt="arrow" />
                              </a>
                              <a id="timingdownbtn6" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--down">
                                <img className="timing_timeupimage" src="./img/sort-down.svg" alt="timeup" />
                              </a>
                            </div>
                            {/* <div className="timing_modes">
                              <a className="timing_mode timing_mode-active">
                                AM
                              </a>
                              <a className="timing_mode">PM</a>
                            </div> */}
                          </div>
                        </div>{" "}
                      </div>
                      <div className="timing">
                        <div className="pretty timing_pretty p-image p-plain">
                          <Checkbox
                            type="checkbox"
                            name="timingcheckboxes4"
                            id="timingcheckboxes4"
                            class="timingcheckboxes"
                            value="4"
                            onChange={(e) => {
                              handleTiming(e)
                            }}
                          >
                            <div>Thursday</div>
                          </Checkbox>
                        </div>
                        <div className="timing_timepicker">
                          <div className="timing_timeboxcontainer">
                            <div className="timing_timebox">
                              <span id="startingtime" className="timing_time">
                                09:00{" "}
                              </span>
                              <a id="timingupbtn7" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--up">
                                <img className="timing_timeupimage" src="./img/triangular-filled-up-arrow (1).svg" alt="img" />
                              </a>
                              <a id="timingdownbtn7" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--down">
                                <img className="timing_timeupimage" src="./img/sort-down.svg" alt="btn down" />
                              </a>
                            </div>
                            {/* <div className="timing_modes">
                              <a className="timing_mode timing_mode-active">
                                AM
                              </a>
                              <a className="timing_mode">PM</a>
                            </div> */}
                          </div>
                          <span className="timing_to">To</span>
                          <div className="timing_timeboxcontainer">
                            <div className="timing_timebox">
                              <span id="endingtime" className="timing_time">
                                02:15
                              </span>
                              <a id="timingupbtn8" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--up">
                                <img className="timing_timeupimage" src="./img/triangular-filled-up-arrow (1).svg" alt="arrow" />
                              </a>
                              <a id="timingdownbtn8" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--down">
                                <img className="timing_timeupimage" src="./img/sort-down.svg" alt="timeup" />
                              </a>
                            </div>
                            {/* <div className="timing_modes">
                              <a className="timing_mode timing_mode-active">
                                AM
                              </a>
                              <a className="timing_mode">PM</a>
                            </div> */}
                          </div>
                        </div>{" "}
                      </div>
                      <div className="timing">
                        <div className="pretty timing_pretty p-image p-plain">
                          <Checkbox
                            type="checkbox"
                            name="timingcheckboxes5"
                            id="timingcheckboxes5"
                            class="timingcheckboxes"
                            value="5"
                            onChange={(e) => {
                              handleTiming(e)
                            }}
                          >
                            <div>Friday</div>
                          </Checkbox>
                        </div>
                        <div className="timing_timepicker">
                          <div className="timing_timeboxcontainer">
                            <div className="timing_timebox">
                              <span id="startingtime" className="timing_time">
                                09:00{" "}
                              </span>
                              <a id="timingupbtn9" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--up">
                                <img className="timing_timeupimage" src="./img/triangular-filled-up-arrow (1).svg" alt="img" />
                              </a>
                              <a id="timingdownbtn9" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--down">
                                <img className="timing_timeupimage" src="./img/sort-down.svg" alt="btn down" />
                              </a>
                            </div>
                            {/* <div className="timing_modes">
                              <a className="timing_mode timing_mode-active">
                                AM
                              </a>
                              <a className="timing_mode">PM</a>
                            </div> */}
                          </div>
                          <span className="timing_to">To</span>
                          <div className="timing_timeboxcontainer">
                            <div className="timing_timebox">
                              <span id="endingtime" className="timing_time">
                                02:15
                              </span>
                              <a id="timingupbtn10" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--up">
                                <img className="timing_timeupimage" src="./img/triangular-filled-up-arrow (1).svg" alt="arrow" />
                              </a>
                              <a id="timingdownbtn10" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--down">
                                <img className="timing_timeupimage" src="./img/sort-down.svg" alt="timeup" />
                              </a>
                            </div>
                            {/* <div className="timing_modes">
                              <a className="timing_mode timing_mode-active">
                                AM
                              </a>
                              <a className="timing_mode">PM</a>
                            </div> */}
                          </div>
                        </div>{" "}
                      </div>
                      <div className="timing">
                        <div className="pretty timing_pretty p-image p-plain">
                          <Checkbox
                            type="checkbox"
                            name="timingcheckboxes6"
                            id="timingcheckboxes6"
                            class="timingcheckboxes"
                            value="6"
                            onChange={(e) => {
                              handleTiming(e)
                            }}
                          >
                            <div>Saturday</div>
                          </Checkbox>
                        </div>
                        <div className="timing_timepicker">
                          <div className="timing_timeboxcontainer">
                            <div className="timing_timebox">
                              <span id="startingtime" className="timing_time">
                                09:00{" "}
                              </span>
                              <a id="timingupbtn11" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--up">
                                <img className="timing_timeupimage" src="./img/triangular-filled-up-arrow (1).svg" alt="img" />
                              </a>
                              <a id="timingdownbtn11" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--down">
                                <img className="timing_timeupimage" src="./img/sort-down.svg" alt="btn down" />
                              </a>
                            </div>
                            {/* <div className="timing_modes">
                              <a className="timing_mode timing_mode-active">
                                AM
                              </a>
                              <a className="timing_mode">PM</a>
                            </div> */}
                          </div>
                          <span className="timing_to">To</span>
                          <div className="timing_timeboxcontainer">
                            <div className="timing_timebox">
                              <span id="endingtime" className="timing_time">
                                02:15
                              </span>
                              <a id="timingupbtn12" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--up">
                                <img className="timing_timeupimage" src="./img/triangular-filled-up-arrow (1).svg" alt="arrow" />
                              </a>
                              <a id="timingdownbtn12" onClick={handleTime} href="timingbtn" className="timing_timeupbtn timing_timeupbtn--down">
                                <img className="timing_timeupimage" src="./img/sort-down.svg" alt="timeup" />
                              </a>
                            </div>
                            {/* <div className="timing_modes">
                              <a className="timing_mode timing_mode-active">
                                AM
                              </a>
                              <a className="timing_mode">PM</a>
                            </div> */}
                          </div>
                        </div>{" "}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="form-row ">
                  <div className="col-md-12 mb-0">
                    <p className="signup-title">Features</p>
                  </div>
                  <div className="form-group col-md-12 mb-0">
                    <div className="featureselect">
                      {feature.map((item) => (
                        <div className="featureselect_column">
                          <label for={"featureselect-" + item.FeatureId}>
                            <div className="featureselect_feature">
                              <img src={"http://18.159.202.37:81" + item.GreyIcon} className="featureselect_image" alt="" />
                              <h4 className="featureselect_title">{item.Name}</h4>
                            </div>
                          </label>
                          <input
                            className="featurecheckbox"
                            hidden
                            onChange={(e) => {
                              handleFeature(e)
                            }}
                            type="checkbox"
                            id={"featureselect-" + item.FeatureId}
                            name={"featureselect-" + item.FeatureId}
                            value={item.FeatureId}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-12 mb-0">
                    <p className="signup-title">Near By Places</p>
                  </div>
                  <div className="form-group col-md-12 mb-0">
                    <div className="featureselect">
                      {nearByPlace.map((item) => (
                        <div className="featureselect_column">
                          <label for={"placeselect-" + item.NearByPlaceId}>
                            <div className="featureselect_feature">
                              <img src={"http://18.159.202.37:81" + item.InActiveImage} className="featureselect_image" alt="" />
                              <h4 className="featureselect_title">{item.Title}</h4>
                            </div>
                          </label>
                          <input
                            className="featurecheckbox"
                            hidden
                            onChange={(e) => {
                              handlePlaces(e)
                            }}
                            type="checkbox"
                            id={"placeselect-" + item.NearByPlaceId}
                            name={"placeselect-" + item.NearByPlaceId}
                            value={item.NearByPlaceId}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* <div className="col-md-12 mb-0">
                    <p className="signup-title">Near By Places</p>
                  </div>

                  <div className="form-group col-md-12 mb-0">
                    <div className="featureselect">
                      {placeData?.map(({ id, title, activeImg, inactiveImg }) => {
                        return (
                          <>
                            <div className="featureselect_column">
                              <label for={"nearbyPlaces" + id}>
                                <div className="featureselect_feature">
                                  <img src={inactiveImg} className="featureselect_image" alt="" />
                                  <h4 className="featureselect_title">{title}</h4>
                                </div>
                              </label>
                              <input
                                onChange={() => {
                                  handlePlacesChange(id)
                                }}
                                id={"nearbyPlaces" + id}
                                name={"nearbyPlaces" + id}
                                className="nearPlace"
                                type="checkbox"
                              />
                            </div>
                          </>
                        )
                      })}
                    </div>
                  </div> */}
                  <div className="form-group col-md-4 formbtncontainer__outercontainer--layout3">
                    <div className="formbtncontainer">
                      <button disabled={btnLock} type="submit" className="btn_primary submitbtn">
                        Save
                        {btnLock ? <div class="btnloader">{Loader}</div> : ""}
                      </button>
                      <Link to="/ManageBusinessOwner" className="btn_primary_outline cancelbtn">
                        Cancel
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditBusinessOwener
