import axios from "../shared/AxiosConfig"

export default class UsersService {
  get = async (search, index, UserTypes) => {
    try {
      const response = await axios.get(`/api/Admin/User/GetUsers?search=${search}&pageIndex=${index}&userTypeId=${UserTypes}`)
      return response
    } catch (error) {
      return error.response
    }
  }
  getPlaces = async () => {
    try {
      const response = await axios.get(`/api/admin/NearByPlaces/get`)
      return response
    } catch (error) {
      return error.response
    }
  }

  getById = async (id) => {
    try {
      const response = await axios.get("/api/Admin/User/GetUser?userId=" + id)
      return response
    } catch (error) {
      return error.response
    }
  }

  save = async (data) => {
    try {
      const response = await axios.post("/api/Admin/User/SaveUser", data)
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
      const response = await axios.post("/api/Admin/User/UploadImages", data, config)
      return response
    } catch (error) {
      return error.response
    }
  }

  delete = async (userId, updatedBy) => {
    try {
      const response = await axios.delete(`/api/Admin/User/DeleteUser?userId=${userId}&updatedBy=${updatedBy}`, { userId, updatedBy })
      return response
    } catch (error) {
      return error.response
    }
  }

  update = async (data) => {
    try {
      const response = await axios.put(`/api/Admin/User/UpdateUser`, data)
      return response
    } catch (error) {
      return error.response
    }
  }
  multipleImages = async (data) => {
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    }
    try {
      const response = await axios.post("/api/Admin/User/UploadBusinessImages", data, config)
      return response
    } catch (error) {
      return error.response
    }
  }
  getmultipleImages = async (id) => {
    try {
      const response = await axios.get(`/api/Admin/User/GetBusinessImages?businessId=${id}`)
      return response
    } catch (error) {
      return error.response
    }
  }
}
