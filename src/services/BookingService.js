import axios from "../shared/AxiosConfig"

export default class BookingService {
  get = async (index, search) => {
    try {
      const response = await axios.get(`/api/Admin/booking/GetBookings?pageIndex=${index}&search=${search}`)
      return response
    } catch (error) {
      return error.response
    }
  }
  save = async (data) => {
    try {
      const response = await axios.post(`/api/Admin/booking/SaveBooking`,data)
      return response
    } catch (error) {
      return error.response
    }
  }

  delete = async (BookingId, updatedBy) => {
    try {
      const response = await axios.delete(
        `/api/Admin/booking/DeleteBooking?bookingId=${BookingId}&updatedBy=${updatedBy}`,
        { BookingId, updatedBy }
      )
      return response
    } catch (error) {
      return error.response
    }
  }
  update = async (data) => {
    try {
      const response = await axios.put(`/api/Admin/booking/UpdateBooking`, data)
      return response
    } catch (error) {
      return error.response
    }
  }
  getById = async (BookingId) => {
    try {
      const response = await axios.get(`/api/Admin/booking/ViewBooking?bookingId=${BookingId}`)
      return response
    } catch (error) {
      return error.response
    }
  }
   reject = async (id) => {
    try {
      const response = await axios.post("/api/Admin/booking/rejectBooking?bookingId=" + id,)
      return response
    } catch (error) {
      return error.response
    }
  }
  
  accept = async (id) => {
    try {
      const response = await axios.post("/api/Admin/booking/acceptBooking?bookingId=" + id)
      return response
    } catch (error) {
      return error.response
    }
  }
  complete = async (id) => {
    try {
      const response = await axios.post("/api/Admin/booking/completeBooking?bookingId=" + id)
      return response
    } catch (error) {
      return error.response
    }
  }
}