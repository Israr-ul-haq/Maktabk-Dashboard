import React from "react"
import DataTable from "react-data-table-component"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import VoucherService from "../../services/VoucherService"
import deleteItem from "../../shared/DeleteItem"
import downloadCSV from "../../shared/CSV"
import Loader from "../../shared/Loader"
import "jspdf-autotable"
import jsPDF from "jspdf"

const ManageVoucher = () => {
  // SERVICES
  const voucherService = new VoucherService()

  //State
  const [data, setData] = useState([])
  const [loader, setLoader] = useState(true)
  const [dataCount, setDataCount] = useState(0)
  const columnNames = [
    {
      VoucherId: "01",
      Name: "Voucher 01",
      Code: "123",
      Description: "32 Blue Avenue, Melbourne London",
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
      name: "Voucher Name",
      selector: "Name",
      sortable: true,
    },
    {
      name: "Description",
      selector: "Description",
      sortable: true,
    },
    {
      name: "Voucher Code",
      selector: "Code",
      sortable: true,
    },

    {
      name: "Actions",
      button: true,
      cell: (row) => (
        <div className="tableactions">
          <Link to={`ViewVoucherDetail/${row.VoucherId}`} className="TableEdit">
            <img src="./img/view.svg" alt="offer" />
          </Link>
          <Link to={`EditVoucher/${row.VoucherId}`} className="TableEdit">
            <img alt="table-action" className="tableactions_image" src="./img/Edit.svg" />
          </Link>
          <button
            type="button"
            data-toggle="modal"
            class="tableactions_action"
            onClick={() => deleteItem(row.VoucherId, data, voucherService, "Voucher", setLoader)}
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
      getVouchers()
      setDataCount(1)
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  // Functions
  const getVouchers = async () => {
    const response = await voucherService.get("")
    setData(response.data.Data)
    setLoader(false)
  }
  // const getVouchers = async () => {
  //   const response = await voucherService.get()
  //   switch (response.data.Data) {
  //     case 1

  //       break;

  //     default:
  //       break;
  //   }
  //   setData(response.data.Data)
  //   setLoader(false)
  // }

  const exportPDF = () => {
    const unit = "pt"
    const size = "A4" // Use A1, A2, A3 or A4
    const orientation = "portrait" // portrait or landscape

    const marginLeft = 40
    const doc = new jsPDF(orientation, unit, size)

    doc.setFontSize(15)

    const title = "Vouchers"
    const headers = [["Voucher Name", "Voucher Code", "Description"]]

    const pdfData = data.map((elt) => {
      return [elt.Name, elt.Code, elt.Description]
    })

    let content = {
      startY: 50,
      head: headers,
      body: pdfData,
    }

    doc.text(title, marginLeft, 40)
    doc.autoTable(content)
    doc.save("Vouchers.pdf")
  }

  const search = async (search) => {
    setLoader(true)
    const response = await voucherService.get(search)
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
                <h1 className="headertopbar_title"> Manage Vouchers</h1>
                <Link to="/AddNewVoucher" className="headertopbar_btn btn_primary">
                  Add New Voucher
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
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => downloadCSV(data, columnNames, "Voucher")}>
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

export default ManageVoucher
