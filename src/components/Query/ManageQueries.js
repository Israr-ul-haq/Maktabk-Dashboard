import React from "react"
import DataTable from "react-data-table-component"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import moment from "moment"

import deleteItem from "../../shared/DeleteItem"
import downloadCSV from "../../shared/CSV"
import Loader from "../../shared/Loader"
import "jspdf-autotable"
import jsPDF from "jspdf"
import QueryService from "../../services/QueryService"

const ManageQueries = () => {
  // SERVICES
  const queryService = new QueryService()

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
        <img style={{ width: "25px" }} src={row.UserImage ? "http://18.159.202.37:81/" + row.UserImage : "/img/images.png"} alt="profile" />
      ),
    },
    {
      name: "User Name",
      selector: "UserName",
      sortable: true,
      grow: 0,
      width: "150px",
      minWidth: "150px",
      maxWidth: "150px",
    },
    {
      name: "Description",
      selector: "Description",
      sortable: true,
      grow: 0,
      width: "200px",
      minWidth: "200px",
      maxWidth: "200px",
    },

    {
      name: "Status",
      cell: (row) => (
        <p>
          {row.Status === "Pending" ? (
            <span style={{ color: "red" }}>Pending</span>
          ) : row.Status === "Resolved" ? (
            <span style={{ color: "green" }}>Resolved</span>
          ) : (
            "-"
          )}
        </p>
      ),
      sortable: true,
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
          <Link to={`QueryReply/${row.QueryId}`} className="TableEdit">
            <img src="./img/Reply (1).svg" alt="event" />
          </Link>
          <button
            type="button"
            data-toggle="modal"
            class="tableactions_action"
            onClick={() => deleteItem(row.QueryId, data, queryService, "Query", setLoader)}
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
      getQueries(0)
      setDataCount(1)
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions
  const getQueries = async (index) => {
    setLoader(true)
    const response = await queryService.get("", index)
    setData(response.data.Data.Queries)
    setTotalRows(response.data.Data.Total)
    setLoader(false)
  }

  const handlePageChange = (page) => {
    getQueries(page - 1)
  }

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoader(true)
    const response = await queryService.get("", page)
    setData(response.data.Data.Queries)
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

    const title = "Queries"
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
    doc.save("Queries.pdf")
  }

  const search = async (search) => {
    setLoader(true)
    const response = await queryService.get(search, 0)

    setData(response.data.Data.Queries)
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
                <h1 className="headertopbar_title">Queries</h1>
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
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => downloadCSV(data, columnNames, "Queries")}>
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

export default ManageQueries
