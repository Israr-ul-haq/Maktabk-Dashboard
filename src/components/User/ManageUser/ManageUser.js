import React from "react"
import DataTable from "react-data-table-component"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import UsersService from "../../../services/UsersService"
import deleteItem from "../../../shared/DeleteItem"
import downloadCSV from "../../../shared/CSV"
import Loader from "../../../shared/Loader"
import "jspdf-autotable"
import jsPDF from "jspdf"
import { UserTypes } from "../../../constants/UserTypes"
import axios from "axios"

const ManageUser = () => {
  // SERVICES
  const userService = new UsersService()

  //State
  const [data, setData] = useState([])
  const [loader, setLoader] = useState(false)
  const [dataCount, setDataCount] = useState(0)
  const [totalRows, setTotalRows] = useState(0)
  const [perPage, setPerPage] = useState(10)
  const columnNames = [
    {
      UserId: 14,
      Name: "jan",
      Email: "jan@gmail.com",
      Phone: "35688",
      Password: "123",
      UserTypeId: 5,
      UserType: "User",
      DeviceId: "1122",
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
      name: "Photo",
      button: true,
      cell: (row) => (
        <img
          className="data_Table_img"
          src={row.ProfilePicture ? "http://18.159.202.37:81/" + row.ProfilePicture : "/img/images.png"}
          alt="profile"
        />
      ),
      grow: 0,
      width: "150px",
      maxWidth: "150px",
    },
    {
      name: "Name",
      selector: "Name",
      sortable: true,
    },
    {
      name: "Email",
      selector: "Email",
      sortable: true,
      grow: 0,
      width: "350px",
      maxWidth: "350px",
    },
    {
      name: "Phone Number",
      selector: "Phone",
      sortable: true,
    },

    {
      name: "Actions",
      button: true,
      cell: (row) => (
        <div className="tableactions">
          <Link to={`ViewUser/${row.UserId}`} className="TableEdit">
            <img src="./img/view.svg" alt="event" />
          </Link>
          <Link to={`EditUser/${row.UserId}`} className="TableEdit">
            <img alt="table-action" className="tableactions_image" src="./img/Edit.svg" />
          </Link>
          <button
            type="button"
            data-toggle="modal"
            class="tableactions_action"
            onClick={() => deleteItem(row.UserId, data, userService, "User", setLoader, "User")}
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
      getUsers(0)
      setDataCount(1)
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions
  const getUsers = async (index) => {
    setLoader(true)
    const response = await userService.get("", index, UserTypes.User)
    const finalAdmins = []

    response.data.Data.Users.forEach((element) => {
      if (element.UserTypeId === UserTypes.User) {
        finalAdmins.push(element)
      }
    })
    setData(finalAdmins)
    setTotalRows(response.data.Data.Total)
    setLoader(false)
  }

  const handlePageChange = (page) => {
    getUsers(page - 1)
  }

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoader(true)
    const response = await userService.get("", page, UserTypes.User)
    const finalAdmins = []

    response.data.Data.Users.forEach((element) => {
      if (element.UserTypeId === UserTypes.User) {
        finalAdmins.push(element)
      }
    })
    setData(finalAdmins)
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

    const title = "Users"
    const headers = [["User Name", "Email", "Phone", "Password"]]
    const pdfData = data.map((elt) => {
      return [elt.Name, elt.Email, elt.Phone, elt.Password]
    })

    let content = {
      startY: 50,
      head: headers,
      body: pdfData,
    }

    doc.text(title, marginLeft, 40)
    doc.autoTable(content)
    doc.save("User.pdf")
  }

  const search = async (search) => {
    setLoader(true)
    const response = await userService.get(search, 0, UserTypes.User)
    const finalAdmins = []
    response.data.Data.Users.forEach((element) => {
      if (element.UserTypeId === UserTypes.User) finalAdmins.push(element)
    })
    setData(finalAdmins)
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
                <h1 className="headertopbar_title"> Manage Users</h1>
                <Link to="/AddNewUser" className="headertopbar_btn btn_primary">
                  Add New User
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
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => downloadCSV(data, columnNames)}>
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

export default ManageUser
