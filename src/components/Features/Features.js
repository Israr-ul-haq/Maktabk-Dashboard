import React from "react"
import DataTable from "react-data-table-component"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import FeatureService from "../../services/FeatureService"
import deleteItem from "../../shared/DeleteItem"
import downloadCSV from "../../shared/CSV"
import Loader from "../../shared/Loader"
import "jspdf-autotable"
import jsPDF from "jspdf"

const Features = () => {
  // SERVICES
  const featureService = new FeatureService()

  //State
  const [data, setData] = useState([])
  const [loader, setLoader] = useState(true)
  const [dataCount, setDataCount] = useState(0)
  const columnNames = [
    {
      FeatureId: "01",
      Name: "Feature 01",
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
      name: "Feature Name",
      selector: "Name",
      sortable: true,
      grow: 0,
      width: "150px",
      minWidth: "150px",
      maxWidth: "150px",
    },

    {
      name: "Active icons",
      button: true,
      cell: (row) => (
        <img style={{ width: "25px" }} src={row.ImagePath ? "http://18.159.202.37:81/" + row.ImagePath : "/img/images.png"} alt="profile" />
      ),
      grow: 0,
    },
    {
      name: "In-active icons",
      button: true,
      cell: (row) => (
        <img style={{ width: "25px" }} src={row.GreyIcon ? "http://18.159.202.37:81/" + row.GreyIcon : "/img/images.png"} alt="profile" />
      ),
      grow: 0,
    },
    {
      name: "Category Name",
      selector: "CategoryName",
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
          <Link to={`ViewFeature/${row.FeatureId}`} className="TableEdit">
            <img src="./img/view.svg" alt="event" />
          </Link>
          <Link to={`EditFeature/${row.FeatureId}`} className="TableEdit">
            <img alt="table-action" className="tableactions_image" src="./img/Edit.svg" />
          </Link>
          <button
            type="button"
            data-toggle="modal"
            class="tableactions_action"
            onClick={() => deleteItem(row.FeatureId, data, featureService, "Feature", setLoader)}
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
      getFeature()
      setDataCount(1)
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions
  const getFeature = async () => {
    const response = await featureService.get("")
    setData(response.data.Data)
    setLoader(false)
  }

  const search = async (search) => {
    setLoader(true)
    const response = await featureService.get(search)
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

    const title = "Features"
    const headers = [["Feature Name"]]
    const pdfData = data.map((elt) => {
      return [elt.Name]
    })

    let content = {
      startY: 50,
      head: headers,
      body: pdfData,
    }

    doc.text(title, marginLeft, 40)
    doc.autoTable(content)
    doc.save("Features.pdf")
  }

  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <h1 className="headertopbar_title">Manage Feature List</h1>
                <Link to="/FeaturesAdd" className="headertopbar_btn btn_primary">
                  Add New Feature
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
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => downloadCSV(data, columnNames, "Featues")}>
                    CSV
                  </button>
                </div>
                <input
                  className="tablesearchbox"
                  type="text"
                  placeholder="Search"
                  onChange={(e) => search(e.target.value)}
                  aria-label="Search Input"
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

export default Features
