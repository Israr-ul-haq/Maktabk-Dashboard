import React from "react"
import DataTable from "react-data-table-component"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import moment from "moment"
import EventService from "../../services/EventService"
import deleteItem from "../../shared/DeleteItem"
import downloadCSV from "../../shared/CSV"
import Loader from "../../shared/Loader"
import "jspdf-autotable"
import jsPDF from "jspdf"

const ManageEvent = () => {
  // SERVICES
  const eventService = new EventService()

  //State
  const [data, setData] = useState([])
  const [dataCount, setDataCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const columnNames = [
    {
      EventId: "01",
      Name: "Event 01",
      Address: "32 Blue Avenue, Melbourne London",
      Date: "28-02-2021",
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
    },
    {
      name: "RSVP",
      selector: "RSVP",
      sortable: true,
      grow: 0,
      width: "150px",
      minWidth: "150px",
      maxWidth: "150px",
    },
    {
      name: "Event Name",
      selector: "Name",
      sortable: true,
      grow: 0,
      width: "200px",
      minWidth: "200px",
      maxWidth: "200px",
    },

    {
      name: "Address",
      selector: "Address",
      sortable: true,
      grow: 0,
      width: "150px",
      minWidth: "150px",
      maxWidth: "150px",
    },
    // {
    //   name: "Description",
    //   selector: "Description",
    //   sortable: true,
    //   grow: 0,
    //   width: "150px",
    //   minWidth: "150px",
    //   maxWidth: "150px",
    // },

    {
      name: "Date",
      cell: (row) => {
        return moment(row.Date).format("l")
      },
      grow: 0,
      width: "150px",
      minWidth: "150px",
      maxWidth: "150px",
    },

    {
      name: "Actions",
      button: true,
      cell: (row) => (
        <div className="tableactions">
          <Link to={`viewEvent/${row.EventId}`} className="TableEdit">
            <img src="./img/view.svg" alt="event" />
          </Link>
          <Link to={`EditEvent/${row.EventId}`} className="TableEdit">
            <img alt="table-action" className="tableactions_image" src="./img/Edit.svg" />
          </Link>
          <button
            type="button"
            data-toggle="modal"
            class="tableactions_action"
            onClick={() => deleteItem(row.EventId, data, eventService, "Event", setLoader)}
          >
            <img alt="table-action" class="tableactions_image" src="./img/Delete.svg" />
          </button>
        </div>
      ),
    },
  ]

  //UseEffect

  useEffect(() => {
    if (dataCount === 0) {
      getEvents(0)
      setDataCount(1)
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions
  const getEvents = async (index) => {
    setLoader(true)
    const response = await eventService.get("", index)
    setData(response.data.Data.Events)
    setTotalRows(response.data.Data.Total)
    setLoader(false)
  }

  const handlePageChange = (page) => {
    getEvents(page - 1)
  }

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoader(true)
    const response = await eventService.get("", page)
    setData(response.data.Data.Events)
    setPerPage(newPerPage)
    setLoader(false)
  }

  const exportPDF = () => {
    const unit = "pt"
    const size = "A4" // Use A1, A2, A3 or A4
    const orientation = "portrait" // portrait or landscape

    const marginLeft = 40
    const doc = new jsPDF(orientation, unit, size)

    doc.setFontSize(15)

    const title = "Events"
    const headers = [["Event Name", "Description", "Address", "Date"]]
    const pdfData = data.map((elt) => {
      return [elt.Name, elt.Description, elt.Address, elt.Date]
    })

    let content = {
      startY: 50,
      head: headers,
      body: pdfData,
    }

    doc.text(title, marginLeft, 40)
    doc.autoTable(content)
    doc.save("Events.pdf")
  }

  const search = async (search) => {
    setLoader(true)
    const response = await eventService.get(search, 0)

    setData(response.data.Data.Events)
    setTotalRows(response.data.Data.Total)
    setLoader(false)
  }

  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <h1 className="headertopbar_title"> Manage Event</h1>
                <div className="topbar_btns">
                  <Link to="/ManageAds" className="btn_primary_outline btn_primary">
                    Manage Ads
                  </Link>
                  <Link to="AddNewEvent" className="headertopbar_btn btn_primary">
                    Add New Event
                  </Link>
                </div>
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
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => downloadCSV(data, columnNames, "Events")}>
                    CSV
                  </button>
                </div>
                <input
                  className="tablesearchbox"
                  type="text"
                  placeholder="Search"
                  aria-label="Search Input"
                  onChange={(e) => search(e.target.value)}
                />
                <DataTable
                  title=""
                  columns={columns}
                  data={data}
                  progressPending={loader}
                  onChangeRowsPerPage={handlePerRowsChange}
                  onChangePage={handlePageChange}
                  pagination
                  paginationServer
                  paginationTotalRows={totalRows}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ManageEvent
