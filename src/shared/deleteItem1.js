import Swal from "sweetalert2"

const deleteItem1 = async (id, data, service, title, setLoader, getBookingAds, getMaktabqAds) => {
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
      let removeIndex = data

        .map((item) => {
          if (title === "Ad") {
            return item.Id
          }
        })
        .indexOf(id)
      data.splice(removeIndex, 1)

      const response = await service.delete(id, JSON.parse(localStorage.getItem("makhtabquserId")))

      if (response.data.Code === 1) {
        getBookingAds()
        getMaktabqAds()
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

export default deleteItem1
