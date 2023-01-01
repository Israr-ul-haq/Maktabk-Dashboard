import React, { useEffect, useState } from "react"
import { useParams, Link, useHistory } from "react-router-dom"

import Loader from "../../shared/Loader"
import Swal from "sweetalert2"
import QueryService from "../../services/QueryService"
function QueryReply() {
  // SERVICES
  const { id } = useParams()
  const [btnLock, setBtnLock] = useState(false)
  const [loader, setLoader] = useState(true)
  const [dataCount, setDataCount] = useState(0)
  const history = useHistory()
  const queryService = new QueryService()
  const [data, setData] = useState({})

  useEffect(() => {
    if (dataCount === 0) {
      getQueryById()
      setDataCount(1)
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  const getQueryById = async () => {
    const response = await queryService.getById(id)
    if (response.data.Code === 1) {
      setData(response.data.Data)
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

  const resolveQuery = async () => {
    setBtnLock(true)

    const response = await queryService.replyQuery(id)
    if (response.data.Code === 1) {
      history.push("/ManageQueries")
      setBtnLock(false)
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Query Resolved",
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

  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <Link className="arrow-container_link" to="/ManageQueries">
                  <img className="arrow-container_image" alt="back arrow" src="./img/Icon ionic-ios-arrow-back.png" />
                  <h1 className="headertopbar_title">Reply Query</h1>
                </Link>
              </div>
            </div>
            <div className="col-12 ">
              <div className="card_custom" style={{ padding: "55px" }}>
                <div className="row">
                  <div className="col-md-12">
                    <h5 className="dasboardstatscards_subtitle">User Query</h5>
                  </div>
                </div>
                <h4 className="view-profile-user-name">{data.Description}</h4>
                {/* <div className="row">
                                    <div className="col-md-12">
                                    <h5 className="dasboardstatscards_subtitle" style={{paddingTop: "40px", paddingBottom: "10px"}}>Reply Query</h5>
                                    </div>
                                    <div className="form-group col-md-12">
                                    <div className="phone-container position-relative">
                                        <label htmlfor="tel" className="number-label">
                                        </label>
                                        <textarea id="w3review"  rows="30" cols="50" 
                                        placeholder="here are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form."
                                        className="form_control text_area_input" style={{height: "110px"}}>
                                            </textarea>
                                    </div>
                                </div>
                                    </div> */}
              </div>
            </div>
          </div>
        </div>
        <div className="form-group col-md-12 formbtncontainer__outercontainer--layout3">
          <div className="formbtncontainer">
            <button disabled={btnLock} onClick={resolveQuery} type="submit" className="btn_primary submitbtn">
              Resolved
              {btnLock ? <div class="btnloader">{Loader}</div> : ""}
            </button>
            <Link to="/ManageQueries" className="btn_primary_outline cancelbtn">
              Cancel
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
export default QueryReply
