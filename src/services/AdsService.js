import axios from "../shared/AxiosConfig"

export default class AdsService {
  get = async () => {
    try {
      const response = await axios.get(`/api/Admin/Ad/GetAds`)
      return response
    } catch (error) {
      return error.response
    }
  }

  getById = async (Id) => {
    try {
      const response = await axios.get("/api/Admin/Ad/GetCommercial?id=" + Id)
      return response
    } catch (error) {
      return error.response
    }
  }
  getByTypeId = async (typeId) => {
    try {
      const response = await axios.get("/api/Admin/Ad/GetAds")
      return response
    } catch (error) {
      return error.response
    }
  }

  save = async (data) => {
    try {
      const response = await axios.post("/api/Admin/Ad/SaveAd", data)
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
      const response = await axios.post("/api/Admin/Ad/UploadAdImage", data, config)
      return response
    } catch (error) {
      return error.response
    }
  }

  delete = async (AdId, updatedBy) => {
    try {
      const response = await axios.delete(`/api/Admin/Ad/DeleteAd?adId=${AdId}&updatedBy=${updatedBy}`, { AdId, updatedBy })
      return response
    } catch (error) {
      return error.response
    }
  }

  update = async (data) => {
    try {
      const response = await axios.put(`/api/Admin/Ad/UpdateAd`, data)
      return response
    } catch (error) {
      return error.response
    }
  }
}
