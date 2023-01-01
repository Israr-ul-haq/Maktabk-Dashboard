import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import VoucherService from "../../services/VoucherService"
import Loader from "../../shared/Loader"
import Swal from "sweetalert2"
function ViewVoucherDetail() {
  // SERVICES
  const voucherService = new VoucherService()

  //State
  const [voucher, setVoucher] = useState({})
  const [eventCount, setEventCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const { VoucherId } = useParams()

  //UseEffect
  useEffect(() => {
    if (eventCount === 0) {
      getEvent()
      setEventCount(1)
    }
  }, [voucher, eventCount]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions

  const getEvent = async () => {
    const response = await voucherService.getById(VoucherId)
    if (response.data.Code === 1) {
      setVoucher(response.data.Data)
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
                <Link className="arrow-container_link" to="/ManageVoucher">
                  <img className="arrow-container_image" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" />
                  <h1 className="headertopbar_title">View voucher</h1>
                </Link>
              </div>
            </div>
            <div className="col-12 column_margin">
              <div className="card_custom">
                {loader ? (
                  Loader
                ) : (
                  <div className="row">
                    <div>
                      <img
                        style={{ width: "100%", height: "150px", borderRadius: "15px" }}
                        alt="event_image"
                        src={voucher.ImagePath ? "http://18.159.202.37:81/" + voucher.ImagePath : "/img/images.png"}
                      />
                    </div>
                    <div className="col-md-12 ">
                      <div className="row event-container">
                        <div className="col-md-4 ">
                          <h3 className="view-profile-name">Voucher Name</h3>
                          <h4 className="view-profile-user-name">{voucher.Name}</h4>
                        </div>

                        <div className="col-md-4">
                          <h3 className="view-profile-name">Voucher Code</h3>
                          <h4 className="view-profile-user-name">{voucher.Code}</h4>
                        </div>

                        <div className="col-md-4">
                          <h3 className="view-profile-name">Description</h3>
                          <h4 className="view-profile-user-name">{voucher.Description}</h4>
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
export default ViewVoucherDetail
