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
import BookingService from "../../services/BookingService"

const ManageBooking = () => {
    // SERVICES
    const bookingService = new BookingService()

    //State
    const [data, setData] = useState([])
    const [dataCount, setDataCount] = useState(0)
    const [loader, setLoader] = useState(true)
    const [totalRows, setTotalRows] = useState(0)
    const [perPage, setPerPage] = useState(10)
    const columnNames = [
        {
            //   EventId: "01",
            //   Name: "Event 01",
            //   Address: "32 Blue Avenue, Melbourne London",
            //   Date: "28-02-2021",
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
            name: "User Name",
            selector: "Username",
            sortable: true,
            grow: 0,
            width: "200px",
            minWidth: "200px",
            maxWidth: "200px",
        },
        {
            name: "Business Name",
            selector: "Name",
            sortable: true,
            grow: 0,
            width: "200px",
            minWidth: "200px",
            maxWidth: "200px",
        },
        {
            name: "Date",
            cell: (row) => {
                let startDate = moment(row.date).format('LL')
                return startDate
            },
            sortable: true,
            grow: 0,
            width: "200px",
            minWidth: "200px",
            maxWidth: "200px",
        },

        {
            name: "Time",
            cell: (row) => {

                let startTime = row.StartTime.substring(0, 5)
                let checkTime = parseInt(row.StartTime.substring(0, 2))

                if (checkTime >= 12) {
                    startTime += "PM";
                }
                else {
                    startTime += "AM";
                }

                let EndTime = row.EndTime.substring(0, 5)
                let checkEndTime = parseInt(row.EndTime.substring(0, 2))

                if (checkEndTime >= 12) {
                    EndTime += "PM";
                }
                else {
                    EndTime += "AM";
                }
                return startTime + " - " + EndTime
            },

            sortable: true,
            grow: 0,
            width: "200px",
            minWidth: "200px",
            maxWidth: "200px",
        },



        {
            name: "No Of Person",
            selector: "Persons",
            grow: 0,
            width: "200px",
            minWidth: "200px",
            maxWidth: "200px",
        },

        {
            name: "Status",
            cell: (row) => (
                <p>
                    {row.Status === "Pending" ? (<span style={{ color: "black" }}>Pending</span>
                    ) : row.Status === "Completed" ? (
                        <span style={{ color: "#FFA500" }}>Completed</span>
                    ) : row.Status === "Accepted" ? (
                        <span style={{color: "green" }}>Accepted</span>
                    ): row.Status === "Rejected" ? (
                        <span style={{color: "red"}}>Rejected</span>
                    ): ('-')}
                </p>
            ),
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
                    <Link to={`ViewBooking/${row.BookingId}/${row.Status}`} className="TableEdit">
                        <img src="./img/view.svg" alt="event" />
                    </Link>
                    {/* <Link to={`EditBooking/${row.BookingId}`} className="TableEdit">
                        <img alt="table-action" className="tableactions_image" src="./img/Edit.svg" />
                    </Link> */}
                    <button
                        type="button"
                        data-toggle="modal"
                        class="tableactions_action"
                        onClick={() => deleteItem(row.BookingId, data, bookingService, "Booking", setLoader)}
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
            getBookings(0)
            setDataCount(1)
        }
    }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

    //Functions
    const getBookings = async (index) => {
        setLoader(true)
        const response = await bookingService.get(index, "")
        setData(response.data.Data)
        setLoader(false)
    }

    const handlePageChange = (page) => {
        getBookings(page - 1)
      }
    
      const handlePerRowsChange = async (newPerPage, page) => {
        setLoader(true)
        const response = await bookingService.get("", page)
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

        const title = "Bookings"
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
        doc.save("Booking.pdf")
    }

    const search = async (search) => {
        setLoader(true)
        const response = await bookingService.get(search, 0)
    
        setData(response.data.Data)
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
                                <h1 className="headertopbar_title"> Manage Bookings</h1>
                                <Link to="/AddNewBooking" className="headertopbar_btn btn_primary">
                                    Create New Booking
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
                                    <button className="btn btn-secondary datatablebuttons" onClick={(e) => downloadCSV(data, columnNames, "Bookings")}>
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

export default ManageBooking
