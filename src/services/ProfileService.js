import axios from "../shared/AxiosConfig"

export default class ProfileService {
  getById = async (id) => {
    try {
      const response = await axios.get("/api/Admin/Profile/GetProfile?userId=" + id)
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
      const response = await axios.post("/api/Admin/Voucher/UploadVoucherImage", data, config)
      return response
    } catch (error) {
      return error.response
    }
  }

  update = async (data) => {
    try {
      const response = await axios.post(`/api/Admin/Account/UpdateProfile`, data)
      return response
    } catch (error) {
      return error.response
    }
  }
}
