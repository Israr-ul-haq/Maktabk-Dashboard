import React from "react"
import DataTable from "react-data-table-component"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import CategoryService from "../../services/CategoryService"
import deleteItem from "../../shared/DeleteItem"
import downloadCSV from "../../shared/CSV"
import Loader from "../../shared/Loader"
import "jspdf-autotable"
import jsPDF from "jspdf"

const ManageCategory = () => {
  // SERVICES
  const categoryService = new CategoryService()

  //State
  const [data, setData] = useState([])
  const [dataCount, setDataCount] = useState(0)
  const [loader, setLoader] = useState(true)
  const columnNames = [
    {
      CategoryId: "01",
      Name: "Event 01",
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
      cell: (row) => <img style={{ width: "25px" }} src={row.ImagePath ? "http://18.159.202.37:81/" + row.ImagePath : ""} alt="profile" />,
    },
    {
      name: "Name",
      selector: "Name",
      sortable: true,
      grow: 0,
      width: "200px",
      minWidth: "200px",
      maxWidth: "200px",
    },

    {
      name: "Actions",
      button: true,
      cell: (row) => (
        <div className="tableactions">
          <Link to={`viewCategory/${row.CategoryId}`} className="TableEdit">
            <img src="./img/view.svg" alt="event" />
          </Link>
          <Link to={`EditCategory/${row.CategoryId}`} className="TableEdit">
            <img alt="table-action" className="tableactions_image" src="./img/Edit.svg" />
          </Link>
          <button
            type="button"
            data-toggle="modal"
            class="tableactions_action"
            onClick={() => deleteItem(row.CategoryId, data, categoryService, "Category", setLoader)}
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
      getCategory()
      setDataCount(1)
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions
  const getCategory = async () => {
    const response = await categoryService.get("")
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

    const title = "Category"
    const headers = [["Category Name"]]
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
    doc.save("Category.pdf")
  }
  const search = async (search) => {
    setLoader(true)
    const response = await categoryService.get(search)
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
                <h1 className="headertopbar_title"> Manage Category</h1>
                <Link to="/AddNewCategory" className="headertopbar_btn btn_primary">
                  Add New Category
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
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => downloadCSV(data, columnNames, "Category")}>
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

export default ManageCategory
