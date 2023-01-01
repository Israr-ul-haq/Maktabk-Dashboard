import React from "react"
import DataTable from "react-data-table-component"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import OfferService from "../../services/OfferService"
import deleteItem from "../../shared/DeleteItem"
import downloadCSV from "../../shared/CSV"
import Loader from "../../shared/Loader"
import "jspdf-autotable"
import jsPDF from "jspdf"
import moment from "moment"

const ManageOffers = () => {
  // SERVICES
  const offerService = new OfferService()

  //State
  const [totalRows, setTotalRows] = useState(0)
  const [data, setData] = useState([])
  const [dataCount, setDataCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const [perPage, setPerPage] = useState(10)
  const columnNames = [
    {
      OfferId: "01",
      Name: "Offer 01",
      Description: "32 Blue Avenue, Melbourne London",
      Date: "28-02-2021",
    },
  ]
  const columns = [
    {
      name: "No#",
      cell: (row, index) => index + 1,
      sortable: true,
    },

    {
      name: "Photo",
      button: true,
      cell: (row) => <img style={{ width: "25px" }} src={row.ImagePath ? "http://18.159.202.37:81/" + row.ImagePath : ""} alt="profile" />,
    },
    {
      name: "Name",
      selector: "Name",
      sortable: true,
    },
    {
      name: "Offers Detail",
      selector: "Description",
      sortable: true,
    },

    {
      name: "Date",
      cell: (row) => {
        return moment(row.Date).format("l")
      },
    },

    {
      name: "Actions",
      button: true,
      cell: (row) => (
        <div className="tableactions">
          <Link to={`viewOffer/${row.MaktabqOfferId}`} className="TableEdit">
            <img src="./img/view.svg" alt="offer" />
          </Link>
          <Link to={`EditOffers/${row.MaktabqOfferId}`} className="TableEdit">
            <img alt="table-action" className="tableactions_image" src="./img/Edit.svg" />
          </Link>
          <button
            type="button"
            data-toggle="modal"
            class="tableactions_action"
            onClick={() => deleteItem(row.MaktabqOfferId, data, offerService, "Offer", setLoader)}
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
      getOffers(0)
      setDataCount(1)
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions
  const getOffers = async (index) => {
    debugger
    const response = await offerService.get("", index)
    setData(response.data.Data.Offers)
    setTotalRows(response.data.Data.Total)
    setLoader(false)
  }

  const handlePageChange = (page) => {
    getOffers(page - 1)
  }

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoader(true)
    const response = await offerService.get("", page)
    setData(response.data.Data)
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

    const title = "offers"
    const headers = [["Offer Name", "Description", "Date"]]

    const pdfData = data.map((elt) => {
      return [elt.Name, elt.Description, elt.Date]
    })

    let content = {
      startY: 50,
      head: headers,
      body: pdfData,
    }

    doc.text(title, marginLeft, 40)
    doc.autoTable(content)
    doc.save("Offers.pdf")
  }

  const search = async (search) => {
    setLoader(true)
    const response = await offerService.get(search, 0)
    setData(response.data.Data.Offers)
    setPerPage(response.data.Data.Total)
    setLoader(false)
  }
  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <h1 className="headertopbar_title"> Manage Offers</h1>
                <Link to="AddNewOffer" className="headertopbar_btn btn_primary">
                  Add New Offer
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
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => downloadCSV(data, columnNames, "Offers")}>
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
                {loader ? (
                  Loader
                ) : (
                  <>
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

export default ManageOffers
