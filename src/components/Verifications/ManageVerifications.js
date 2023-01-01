import React from "react"
import DataTable from "react-data-table-component"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import VerificationService from "../../services/VerificationService"
import downloadCSV from "../../shared/CSV"
import Loader from "../../shared/Loader"
import "jspdf-autotable"
import jsPDF from "jspdf"

const ManageVerification = () => {
  // SERVICES
  const verificationService = new VerificationService()

  //State
  const [data, setData] = useState([])
  const [loader, setLoader] = useState(true)
  const [dataCount, setDataCount] = useState(0)
  const columnNames = [
    {
      Username: "Cycle Owner",
      Email: "Blue Avenue",
      Phone: "123-124-122128",
      Address: "Peco Road",
      UserId: "",
      // UserTypeId: 4,
      status: "",
    },
  ]
  const columns = [
    {
      name: "No#",
      cell: (row, index) => index + 1,
      sortable: true,
      grow: 0,
    },

    {
      name: "Photo",
      button: true,
      cell: (row) => (
        <img className="data_Table_img" src={row.ImagePath ? "http://18.159.202.37:81/" + row.ImagePath : "/img/images.png"} alt="profile" />
      ),
      grow: 0,
    },
    {
      name: "Full Name",
      selector: "Username",
      sortable: true,
      grow: 0,
      width: "150px",
      minWidth: "150px",
      maxWidth: "150px",
    },
    {
      name: "Business Name",
      selector: "BusinessName",
      sortable: true,
      grow: 0,
      width: "150px",
      minWidth: "150px",
      maxWidth: "150px",
    },

    {
      name: "Phone Number",
      selector: "Phone",
      sortable: true,
      grow: 0,
      width: "150px",
      minWidth: "150px",
      maxWidth: "150px",
    },
    {
      name: "Address",
      selector: "Address",
      sortable: true,
      grow: 0,
      width: "200px",
      minWidth: "150px",
      maxWidth: "150px",
    },

    {
      name: "Status",
      cell: (row) => (
        // <p>

        //     {row.Status === "Approved" ? (
        //       <span style={{ color: "green" }}>Accepted</span>
        //     ) : row.Status === "Pending" (
        //       <span style={{ color: "black" }}>Pending</span>

        //     ) (<span style={{ color: "red"}}>Rejected</span>)

        //   }
        // </p>

        <p>
          {row.Status === "Pending" ? (
            <span style={{ color: "black" }}>Pending</span>
          ) : row.Status === "Completed" ? (
            <span style={{ color: "#FFA500" }}>Completed</span>
          ) : row.Status === "Approved" ? (
            <span style={{ color: "green" }}>Approved</span>
          ) : row.Status === "Rejected" ? (
            <span style={{ color: "red" }}>Rejected</span>
          ) : (
            "-"
          )}
        </p>
      ),
      sortable: true,
      grow: 0,
    },

    {
      name: "Actions",
      button: true,
      cell: (row) => (
        <div className="tableactions">
          <Link to={`/ViewProfileBusiness/${row.UserId}`} className="TableEdit">
            <img src="./img/view.svg" alt="event" />
          </Link>
        </div>
      ),
      grow: 0,
    },
  ]

  //UseEffect

  useEffect(() => {
    if (dataCount === 0) {
      getVerification()
      setDataCount(1)
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions
  const getVerification = async () => {
    const response = await verificationService.get("")

    setData(response.data.Data)
    setLoader(false)
  }

  const exportPDF = () => {
    const unit = "pt"
    const size = "A4" // Use A1, A2, A3 or A4
    const orientation = "portrait" // portrait or landscape

    const marginLeft = 40
    const doc = new jsPDF(orientation, unit, size)

    doc.setFontSize(15)

    const title = "Verification"
    const headers = [["Username", "BusinessName", "Phone Number", "Address"]]
    const pdfData = data.map((elt) => {
      return [elt.Username, elt.BusinessName, elt.Phone, elt.Address]
    })

    let content = {
      startY: 50,
      head: headers,
      body: pdfData,
    }

    doc.text(title, marginLeft, 40)
    doc.autoTable(content)
    doc.save("Verification.pdf")
  }
  const search = async (search) => {
    setLoader(true)
    const response = await verificationService.get(search)
    setData(response.data.Data)
    setLoader(false)
  }

  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <h1 className="headertopbar_title"> Manage Verifications</h1>
              </div>
            </div>
            <div className="col-12 column_margin">
              <div className="card_custom">
                {" "}
                <div className="datatableheading">Export to:</div>
                <div>
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => exportPDF()}>
                    PDF
                  </button>
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => downloadCSV(data, columnNames, "Verification")}>
                    CSV
                  </button>
                </div>{" "}
                <input
                  className="tablesearchbox"
                  type="text"
                  placeholder="Search"
                  aria-label="Search Input"
                  onChange={(e) => search(e.target.value)}
                />
                {loader ? (
                  Loader
                ) : (
                  <>
                    <DataTable title="" columns={columns} data={data} pagination />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ManageVerification
