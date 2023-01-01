import React, { useState, useEffect } from "react"
import FinanceService from "../../services/FinanceService"
import Loader from "../../shared/Loader"
import { Line } from "react-chartjs-2"
import "jspdf-autotable"
import jsPDF from "jspdf"
import downloadCSV from "../../shared/CSV"
import Carousel from "react-simply-carousel"
function Finance() {
  // SERVICES
  const financeService = new FinanceService()

  //State

  const subscriptionIcon = ["./img/Basic.svg", "./img/premium.svg", "./img/silver.svg", "./img/gold.svg"]

  const [data, setData] = useState([])
  const [financeCount, setFinanceCount] = useState(0)
  const [subscription, setSubscriptions] = useState([])
  const [loader, setLoader] = useState(true)
  const [financeLabels, setFinanceLabels] = useState([])
  const [financechartData, setfinanceChartData] = useState([])
  const columnNames = [
    {
      Name: "",
      Amount: "",
    },
  ]
  const financeChart = {
    labels: financeLabels,
    datasets: [
      {
        label: "Restaurant Earnings",
        data: financechartData,
        fill: false,
        backgroundColor: "#131f54",
        borderColor: "#131f5433",
      },
    ],
  }

  const options = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }

  //UseEffect

  useEffect(() => {
    if (financeCount === 0) {
      GetFinance()
      setFinanceCount(1)
    }
  }, [data]) // eslint-disable-line react-hooks/exhaustive-deps

  //Functions
  const GetFinance = async () => {
    const response = await financeService.get()
    setData(response.data.Data)
    setSubscriptions(response.data.Data.UserSubscriptions)
    let labels = response.data.Data.RestaurantEarnings.map((item) => {
      return item.Name
    })
    let financeChartData = response.data.Data.RestaurantEarnings.map((item) => {
      return item.Amount
    })
    setfinanceChartData(financeChartData)
    setFinanceLabels(labels)
    setLoader(false)
  }

  const exportPDF = () => {
    const unit = "pt"
    const size = "A4" // Use A1, A2, A3 or A4
    const orientation = "portrait" // portrait or landscape

    const marginLeft = 40
    const doc = new jsPDF(orientation, unit, size)

    doc.setFontSize(15)

    const title = "Restuarent Earnings"
    const headers = [["Restaurant Name", "Earnings"]]
    const pdfData = data.RestaurantEarnings.map((elt) => {
      return [elt.Name, elt.Amount]
    })

    let content = {
      startY: 50,
      head: headers,
      body: pdfData,
    }

    doc.text(title, marginLeft, 40)
    doc.autoTable(content)
    doc.save("Restaurant-Earnings.pdf")
  }

  return (
    <div>
      <main>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12">
              <div className="headertopbar">
                <h1 className="headertopbar_title">Manage Finance</h1>
              </div>
            </div>
            <div className="col-12 column_margin">
              <div className="card_custom">
                <div className="card_custom_titlecontainer">
                  <h2 className="card_custom_title">User Subscription</h2>
                  <div className="exportbtns">
                    <button onClick={(e) => exportPDF()} className="btn_primary exportbtn">
                      PDF
                    </button>
                    <button
                      onClick={(e) => downloadCSV(data.RestaurantEarnings, columnNames, "Restaurant-Earnings")}
                      className="btn_primary exportbtn"
                    >
                      CSV
                    </button>
                  </div>
                </div>
                <div className="dasboardstatscards">
                  {loader
                    ? Loader
                    : subscription.map((item) => {
                        const randomNumber = Math.floor(Math.random() * 3)
                        return (
                          <>
                            <div className="dasboardstatscards_column">
                              <div className="dasboardstatscards_card">
                                <div className="dasboardstatscards_left">
                                  <h5 className="dasboardstatscards_subtitle">{item.Name}</h5>
                                  <h3 className="dasboardstatscards_title">{item.TotalCount}</h3>
                                </div>
                                <div className="dasboardstatscards_right">
                                  <img className="dasboardstatscards_image" src={subscriptionIcon[randomNumber]} alt="stat-img" />
                                </div>
                              </div>
                            </div>
                          </>
                        )
                      })}
                </div>
              </div>
            </div>
            <div className="col-12">
              <div className="card_custom">
                {loader ? (
                  Loader
                ) : (
                  <>
                    <h2 className="card_custom_title">Restaurant Earnings</h2>
                    <div className="chart-container chart">
                      <Line height="100%" data={financeChart} options={options} />
                    </div>
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
export default Finance
