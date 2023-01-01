import Swal from "sweetalert2"

const deleteItem = async (id, data, service, title, setLoader, removeItem) => {
  Swal.fire({
    title: "Are you sure, you want to delete " + title + "?",
    showCancelButton: true,
    confirmButtonText: `Delete`,
    showCloseButton: true,
    closeButtonHtml: '<img src="./img/Icon material-cancel.png" alt="crossicon" className="popupcrossimage"/>',
    reverseButtons: true,
  }).then(async (result) => {
    /* Read more about isConfirmed, isDenied below */
    if (result.isConfirmed) {
      setLoader(true)
      debugger
      let removeIndex = data

        .map((item) => {
          if (removeItem === "User") {
            return item.UserId
          } else if (title === "Feature") {
            return item.FeatureId
          } else if (title === "Booking") {
            return item.BookingId
          } else if (title === "Event") {
            return item.EventId
          } else if (title === "Ad") {
            return item.Id
          } else if (title === "Subscription") {
            return item.SubscriptionId
          } else if (title === "Query") {
            return item.QueryId
          } else if (title === "Voucher") {
            return item.VoucherId
          } else if (title === "Offer") {
            return item.MaktabqOfferId
          } else if (title === "Places") {
            return item.NearByPlaceId
          }
        })
        .indexOf(id)
      data.splice(removeIndex, 1)

      const response = await service.delete(id, JSON.parse(localStorage.getItem("makhtabquserId")))

      if (response.data.Code === 1) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: title + " deleted!",
        })
        setLoader(false)
      }

      if (response.data.Code === 0) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        })
        setLoader(false)
      }
    } else if (result.isDenied) {
      Swal.fire("Changes are not saved", "", "info")
      setLoader(false)
    }
  })
}

export default deleteItem
