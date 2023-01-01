import axios from "../shared/AxiosConfig"

export default class SlotsService {
  getById = async (BusinessId,search) => {
    try {
      const response = await axios.get(`/api/Admin/slots/GetAvailableSlots?businessId=${BusinessId}&date=${search}`)
      return response
    } catch (error) {
      return error.response
    }
  }
  getBusinesses = async (search) => {
    try {
      const response = await axios.get(`/api/Admin/slots/getBusinesses?search=${search}`)
      return response
    } catch (error) {
      return error.response
    }
  }

  

  save = async (data) => {
    try {
      const response = await axios.post(`/api/Admin/slots/saveslot`,data)
      return response
    } catch (error) {
      return error.response
    }
  }

  uploadImage = async (data) => {
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    }
    try {
      const response = await axios.post("", data, config)
      return response
    } catch (error) {
      return error.response
    }
  }

  delete = async (SlotId,UpdatedBy) => {
    try {
      const response = await axios.delete(`/api/Admin/slots/deleteSlot?slotId=${SlotId}&updatedBy=${UpdatedBy}`)
      return response
    } catch (error) {
      return error.response
    }
  }

  update = async (data) => {
    try {
      const response = await axios.put(`/api/Admin/slots/updateslot` ,data)
      return response
    } catch (error) {
      return error.response
    }
  }
  getSlotById = async (BusinessSlotId) => {
    try {
      const response = await axios.get(`/api/Admin/slots/GetSlot?businessSlotId=${BusinessSlotId}`)
      return response
    } catch (error) {
      return error.response
    }
  }
}
