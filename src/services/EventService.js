import axios from "../shared/AxiosConfig"

export default class EventService {
  get = async (search, index) => {
    try {
      const response = await axios.get(`/api/Admin/Event/GetEvents?search=${search}&pageIndex=${index}`)
      return response
    } catch (error) {
      return error.response
    }
  }

  getById = async (id) => {
    try {
      const response = await axios.get("/api/Admin/Event/GetEvent?eventId=" + id)
      return response
    } catch (error) {
      return error.response
    }
  }

  save = async (data) => {
    try {
      const response = await axios.post("/api/Admin/Event/SaveEvent", data)
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
      const response = await axios.post("/api/Admin/Event/UploadEventImage", data, config)
      return response
    } catch (error) {
      return error.response
    }
  }

  delete = async (eventId, updatedBy) => {
    try {
      const response = await axios.delete(`/api/Admin/Event/DeleteEvent?eventId=${eventId}&updatedBy=${updatedBy}`, { eventId, updatedBy })
      return response
    } catch (error) {
      return error.response
    }
  }

  update = async (data) => {
    try {
      const response = await axios.put(`/api/Admin/Event/UpdateEvent`, data)
      return response
    } catch (error) {
      return error.response
    }
  }
}
