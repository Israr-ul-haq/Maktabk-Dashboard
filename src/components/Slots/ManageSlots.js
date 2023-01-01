import React from "react"
import DataTable from "react-data-table-component"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import SlotsService from "../../services/SlotsServices"
import downloadCSV from "../../shared/CSV"
import Loader from "../../shared/Loader"
import "jspdf-autotable"
import jsPDF from "jspdf"
import deleteItem from "../../shared/DeleteItem"
import moment from "moment"


const ManageSlots = () => {
  // SERVICES
  const slotsService = new SlotsService()

  //State
  const [data, setData] = useState([])
  const [loader, setLoader] = useState(true)
  
  const [dataCount, setDataCount] = useState(0)

  
  const columnNames = [
    {
      Date: "",
      Seats: "",
      StartTime: "",
      EndTime: "",
    },
  ]
  const columns = [
    {
      name: "No#",
      cell: (row, index) => index + 1,
      sortable: true,
      grow:0
    },

    {
      name: "User Name",
      selector: "Username",
      sortable: true,
    },

    {
      name: "Business Name",
      selector: "BusinessName",
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: "Phone",
      sortable: true,
    },
    {
      name: "Address",
      selector: "Address",
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => (
        <p>
          {row.Status ? (
            row.Status === "Approved" ? (
              <span style={{ color: "green" }}>Accepted</span>
            ) : (
              <span style={{ color: "red" }}>Rejected</span>
            )
          ) : (
            "-"
          )}
        </p>
      ),
      sortable: true,
    
    },

    {
      name: "Actions",
      button: true,
      cell: (row) => (
        <div className="tableactions">
          <Link to={`ViewSlots/${row.BusinessId}`} className="TableEdit">
            <img src="./img/view.svg" alt="event" />
          </Link>
          {/* <Link to={`EditSubscription/${row.SubscriptionId}`} className="TableEdit">
            <img alt="table-action" className="tableactions_image" src="./img/Edit.svg" />
          </Link>
          <button
            type="button"
            data-toggle="modal"
            class="tableactions_action"
            onClick={() => deleteItem(row.SlotId, data, slotsService, "Slots", setLoader)}
          >
            <img alt="table-action" class="tableactions_image" src="./img/Delete.svg" />
          </button> */}
        </div>
      ),
    },
  ]

  //UseEffect
  useEffect(() => {
    if (dataCount === 0) {
      getBusinesses()
      setDataCount(1)
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions
  const getBusinesses = async () => {
    const response = await slotsService.getBusinesses("")
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

    const title = "Vouchers"
    const headers = [["Business Name", "Date", "StartTime", "EndTime"]]

    const pdfData = data.map((elt) => {
      return [elt.BusinessName, elt.Date, elt.StartTime, elt.EndTime]
    })

    let content = {
      startY: 50,
      head: headers,
      body: pdfData,
    }

    doc.text(title, marginLeft, 40)
    doc.autoTable(content)
    doc.save("Subscription.pdf")
  }
    const search = async (search) => {
      setLoader(true)
      const response = await slotsService.getBusinesses(search)
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
                <h1 className="headertopbar_title"> Manage Slots</h1>
                <Link to="/AddNewSlot" className="headertopbar_btn btn_primary">
                  Create New Slots
                </Link>
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
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => downloadCSV(data, columnNames, "Slots")}>
                    CSV
                  </button>
                </div>
                <input className="tablesearchbox" type="text" placeholder="Search" aria-label="Search Input" onChange={(e) => search(e.target.value)} />
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

export default ManageSlots
