import React from "react"
import DataTable from "react-data-table-component"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import SubscriptionService from "../../services/SubscriptionService"
import downloadCSV from "../../shared/CSV"
import Loader from "../../shared/Loader"
import "jspdf-autotable"
import jsPDF from "jspdf"
import deleteItem from "../../shared/DeleteItem"
import moment from "moment"

const ManageSubscription = () => {
  // SERVICES
  const subscriptionService = new SubscriptionService()

  //State
  const [data, setData] = useState([])
  const [loader, setLoader] = useState(true)
  const [dataCount, setDataCount] = useState(0)
  const columnNames = [
    {
      subscriptionServiceId: "01",
      Name: "Voucher 01",
      Description: "32 Blue Avenue, Melbourne London",
      Price: "123",
      Days: 0,
    },
  ]
  const columns = [
    {
      name: "No#",
      cell: (row, index) => index + 1,
      sortable: true,
    },

    {
      name: "Subscription Plan",
      selector: "Name",
      sortable: true,
    },

    {
      name: "Price",
      selector: "Price",
      sortable: true,
    },
    // {
    //   name: "Description",
    //   selector: "Description",
    //   sortable: true,
    // },
    {
      name: "Limits",
      selector: "Limits",
      sortable: true,
    },
    {
      name: "Expiry Date",
      cell: (row) => {
        let startDate = moment(row.ExpiryDate).format("LL")
        return startDate
      },
      sortable: true,
    },

    {
      name: "Actions",
      button: true,
      cell: (row) => (
        <div className="tableactions">
          <Link to={`ViewSubscription/${row.SubscriptionId}`} className="TableEdit">
            <img src="./img/view.svg" alt="event" />
          </Link>
          <Link to={`EditSubscription/${row.SubscriptionId}`} className="TableEdit">
            <img alt="table-action" className="tableactions_image" src="./img/Edit.svg" />
          </Link>
          <button
            type="button"
            data-toggle="modal"
            class="tableactions_action"
            onClick={() => deleteItem(row.SubscriptionId, data, subscriptionService, "Subscription", setLoader)}
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
      getSubscription()
      setDataCount(1)
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions
  const getSubscription = async () => {
    const response = await subscriptionService.get("")
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
    const headers = [["Subscription Plan", "Description", "price"]]

    const pdfData = data.map((elt) => {
      return [elt.Name, elt.Description, elt.price]
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

  //search api
  const search = async (search) => {
    setLoader(true)
    const response = await subscriptionService.get(search)
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
                <h1 className="headertopbar_title"> Manage Subscription</h1>
                <Link to="/AddNewSubscription" className="headertopbar_btn btn_primary">
                  Add New Subscription
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
                  <button className="btn btn-secondary datatablebuttons" onClick={(e) => downloadCSV(data, columnNames, "Subscriptions")}>
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

export default ManageSubscription
