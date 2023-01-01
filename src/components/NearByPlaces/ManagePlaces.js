import React from "react"
import DataTable from "react-data-table-component"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

import downloadCSV from "../../shared/CSV"
import Loader from "../../shared/Loader"
import "jspdf-autotable"
import jsPDF from "jspdf"
import PlacesService from "../../services/PlacesService"
import deleteItem from "../../shared/DeleteItem"

const ManagePlaces = () => {
  // SERVICES
  const placesService = new PlacesService()
  //State
  const [data, setData] = useState([])
  const [loader, setLoader] = useState(true)
  const [dataCount, setDataCount] = useState(0)
  const columnNames = [
    {
      Title: "",
    },
  ]
  const columns = [
    {
      name: "No#",
      cell: (row, index) => index + 1,
      sortable: true,

      grow: 0,
      width: "50px",
      maxWidth: "50px",
    },

    {
      name: "Active Image",
      button: true,
      cell: (row) => (
        <img className="data_Table_img" src={row.ActiveImage ? "http://18.159.202.37:81/" + row.ActiveImage : "/img/images.png"} alt="profile" />
      ),
      grow: 0,
      width: "150px",
      maxWidth: "150px",
    },
    {
      name: "InActive Image",
      button: true,
      cell: (row) => (
        <img className="data_Table_img" src={row.InActiveImage ? "http://18.159.202.37:81/" + row.InActiveImage : "/img/images.png"} alt="profile" />
      ),
      grow: 0,
      width: "150px",
      maxWidth: "150px",
    },
    {
      name: "Title",
      selector: "Title",
      sortable: true,
    },

    {
      name: "Actions",
      button: true,
      cell: (row) => (
        <div className="tableactions">
          <Link to={`ViewPlaces/${row.NearByPlaceId}`} className="TableEdit">
            <img src="./img/view.svg" alt="event" />
          </Link>
          <Link to={`EditPlaces/${row.NearByPlaceId}`} className="TableEdit">
            <img alt="table-action" className="tableactions_image" src="./img/Edit.svg" />
          </Link>
          <button
            type="button"
            data-toggle="modal"
            class="tableactions_action"
            onClick={() => deleteItem(row.NearByPlaceId, data, placesService, "Places", setLoader)}
          >
            <img alt="table-action" class="tableactions_image" src="./img/Delete.svg" />
          </button>
        </div>
      ),
      grow: 0,
    },
  ]

  //UseEffect

  useEffect(() => {
    if (dataCount === 0) {
      getPlaces()
      setDataCount(1)
    }
  }, [data, loader]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions
  const getPlaces = async () => {
    setLoader(true)
    const response = await placesService.get()

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

    const title = "Places"
    const headers = [["Title"]]
    const pdfData = data.map((elt) => {
      return [elt.Title]
    })

    let content = {
      startY: 50,
      head: headers,
      body: pdfData,
    }

    doc.text(title, marginLeft, 40)
    doc.autoTable(content)
    doc.save("places.pdf")
  }

  //   const search = async (search) => {
  //     setLoader(true)
  //     const response = await subAdminService.get(search, 0, UserTypes.SubAdmin)
  //     const finalAdmins = []

  //     response.data.Data.Users.forEach((element) => {
  //       if (element.UserTypeId === UserTypes.SubAdmin) finalAdmins.push(element)
  //     })
  //     setData(finalAdmins)
  //     setTotalRows(response.data.Data.Total)
  //     setLoader(false)
  //   }
  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <h1 className="headertopbar_title"> Manage Places</h1>
                <Link to="/AddPlaces" className="headertopbar_btn btn_primary">
                  Add New Place
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
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => downloadCSV(data, columnNames, "Sub-Admin")}>
                    CSV
                  </button>
                </div>
                <input
                  className="tablesearchbox"
                  type="text"
                  placeholder="Search"
                  //   onChange={(e) => search(e.target.value)}
                  aria-label="Search Input"
                />
                <DataTable title="" columns={columns} data={data} progressPending={loader} pagination />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ManagePlaces
