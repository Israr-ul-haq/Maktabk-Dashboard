import React, { useState, useEffect } from "react"
import { Link, useHistory } from "react-router-dom"
import Swal from "sweetalert2"
import "react-datepicker/dist/react-datepicker.css"
import Loader from "../../shared/Loader"
import "react-tabs/style/react-tabs.css"
import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import AdsService from "../../services/AdsService"
import { AdsTypes } from "../../constants/AdsTypes"
import moment from "moment"
import deleteItem from "../../shared/DeleteItem"
import deleteItem1 from "../../shared/deleteItem1"

function ManageAds() {
  const [data, setData] = useState()
  const [dataCount, setDataCount] = useState(0)
  const [bookingData, setBookingData] = useState()
  const [maktabkData, setMaktabkData] = useState()
  const [loader, setLoader] = useState(true)
  const adsService = new AdsService()
  useEffect(() => {
    if (dataCount === 0) {
      getMaktabqAds(0)

      setDataCount(1)
    }
  }, [data, loader, bookingData, maktabkData]) // eslint-disable-line react-hooks/exhaustive-deps

  const getCheckInAds = async () => {
    setLoader(true)
    const response = await adsService.getByTypeId(AdsTypes.checkIn)
    setData(response.data.Data)
    setLoader(false)
  }
  const getBookingAds = async () => {
    setLoader(true)
    const response = await adsService.getByTypeId(AdsTypes.booking)
    setBookingData(response.data.Data)
    setLoader(false)
  }
  const getMaktabqAds = async () => {
    setLoader(true)
    const response = await adsService.getByTypeId()
    setMaktabkData(response.data.Data)
    setLoader(false)
  }

  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <Link to="ManageEvent" className="headertopbar_title">
                  {" "}
                  <img className="headertopbar__arrowimage" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" /> Manage Ads
                </Link>
                <Link to="/AddNewAd" className="headertopbar_btn btn_primary">
                  Generate New Ads
                </Link>
              </div>
            </div>
            <div className="col-12 column_margin">
              <Tabs>
                <TabList>
                  {/* <Tab onClick={getCheckInAds}>Check In</Tab>
                  <Tab onClick={getBookingAds}>Booking</Tab> */}
                  <Tab onClick={getMaktabqAds}>Maktabq Updates</Tab>
                </TabList>
                {/* <TabPanel>
                  {loader
                    ? Loader
                    : data?.map((item) => {
                        let newDate = moment(item.Date).format("LL")
                        return (
                          <>
                            <div className="cardtab" style={{ marginBottom: "60px" }}>
                              <h4 style={{ paddingBottom: "40px" }} className="checkinsHeading">
                                Check-in Ad
                              </h4>
                              <div className="row">
                                <div className="col-md-3">
                                  <img
                                    style={{ width: "70%", height: "150px", borderRadius: "15px" }}
                                    alt="event_image"
                                    src={item.Image ? "http://18.159.202.37:81/" + item.Image : "./img/placeHolderImage.jpg"}
                                  />
                                </div>
                                <div className="col-md-9">
                                  <div className="row">
                                    <div className="col-md-4">
                                      <h3 className="view-profile-name">Title</h3>
                                      <h4 className="view-profile-user-name">{item.Title}</h4>
                                    </div>
                                    <div className="col-md-8">
                                      <h3 className="view-profile-name">Date</h3>
                                      <h4 className="view-profile-user-name">{newDate}</h4>
                                    </div>
                                    <div className="col-md-12">
                                      <div className="view-profile-pwd">
                                        <h3 className="view-profile-name">Description</h3>
                                        <h4 className="view-profile-user-name">{item.Description}</h4>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="form-group col-md-12 formbtncontainer__outercontainer--layout3">
                                <div className="formbtncontainer">
                                  <button
                                    type="submit"
                                    className="btn_Ads submitbtn"
                                    onClick={() => deleteItem1(item.Id, data, adsService, "Ad", setLoader, getBookingAds, getMaktabqAds)}
                                  >
                                    Delete Offer
                                  </button>
                                  <Link to={`/EditAds/${item.Id}`} className="btn_Edit_Ads submitbtn">
                                    Edit Offer
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      })}
                </TabPanel>

                <TabPanel>
                  {loader
                    ? Loader
                    : bookingData?.map((item) => {
                        let newDate = moment(item.Date).format("LL")
                        return (
                          <>
                            <div className="cardtab" style={{ marginBottom: "60px" }}>
                              <h4 style={{ paddingBottom: "40px" }} className="checkinsHeading">
                                Booking Ad
                              </h4>
                              <div className="row">
                                <div className="col-md-3">
                                  <img
                                    style={{ width: "70%", height: "150px", borderRadius: "15px" }}
                                    alt="event_image"
                                    src={item.Image ? "http://18.159.202.37:81/" + item.Image : "./img/placeHolderImage.jpg"}
                                  />
                                </div>
                                <div className="col-md-9">
                                  <div className="row">
                                    <div className="col-md-4">
                                      <h3 className="view-profile-name">Title</h3>
                                      <h4 className="view-profile-user-name">{item.Title}</h4>
                                    </div>
                                    <div className="col-md-8">
                                      <h3 className="view-profile-name">Date</h3>
                                      <h4 className="view-profile-user-name">{newDate}</h4>
                                    </div>
                                    <div className="col-md-12">
                                      <div className="view-profile-pwd">
                                        <h3 className="view-profile-name">Description</h3>
                                        <h4 className="view-profile-user-name">{item.Description}</h4>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="form-group col-md-12 formbtncontainer__outercontainer--layout3">
                                <div className="formbtncontainer">
                                  <button
                                    type="submit"
                                    className="btn_Ads submitbtn"
                                    onClick={() => deleteItem1(item.Id, data, adsService, "Ad", setLoader, getBookingAds, getMaktabqAds)}
                                  >
                                    Delete Offer
                                  </button>
                                  <Link to={`/EditAds/${item.Id}`} className="btn_Edit_Ads submitbtn">
                                    Edit Offer
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      })}
                </TabPanel> */}

                <TabPanel>
                  {loader
                    ? Loader
                    : maktabkData?.map((item) => {
                        let newDate = moment(item.Date).format("LL")
                        return (
                          <>
                            <div className="cardtab" style={{ marginBottom: "60px" }}>
                              <h4 style={{ paddingBottom: "40px" }} className="checkinsHeading">
                                Maqtabq Updates Ads
                              </h4>
                              <div className="row">
                                <div className="col-md-3">
                                  <img
                                    style={{ width: "70%", height: "150px", borderRadius: "15px" }}
                                    alt="event_image"
                                    src={item.Image ? "http://18.159.202.37:81/" + item.Image : "./img/placeHolderImage.jpg"}
                                  />
                                </div>
                                <div className="col-md-9">
                                  <div className="row">
                                    <div className="col-md-4">
                                      <h3 className="view-profile-name">Title</h3>
                                      <h4 className="view-profile-user-name">{item.Title}</h4>
                                    </div>
                                    <div className="col-md-8">
                                      <h3 className="view-profile-name">Date and Time</h3>
                                      <h4 className="view-profile-user-name">{newDate}</h4>
                                    </div>
                                    <div className="col-md-12">
                                      <div className="view-profile-pwd">
                                        <h3 className="view-profile-name">Description</h3>
                                        <h4 className="view-profile-user-name">{item.Description}</h4>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="form-group col-md-12 formbtncontainer__outercontainer--layout3" style={{ paddingLeft: "0px" }}>
                                <div className="formbtncontainer">
                                  <button
                                    type="submit"
                                    className="btn_Ads submitbtn"
                                    onClick={() => deleteItem1(item.Id, data, adsService, "Ad", setLoader, getBookingAds, getMaktabqAds)}
                                  >
                                    Delete Offer
                                  </button>
                                  <Link to={`/EditAds/${item.Id}`} className="btn_Edit_Ads submitbtn">
                                    Edit Offer
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      })}
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
export default ManageAds
