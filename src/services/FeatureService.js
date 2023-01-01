import axios from "../shared/AxiosConfig"

export default class FeatureService {
  get = async (search) => {
    try {
      const response = await axios.get(`/api/Admin/Features/GetFeatures?search=${search}`)

      return response
    } catch (error) {
      return error.response
    }
  }

  getById = async (id) => {
    try {
      const response = await axios.get("/api/Admin/Features/GetFeature?featureId=" + id)
      return response
    } catch (error) {
      return error.response
    }
  }

  save = async (data) => {
    try {
      const response = await axios.post("/api/Admin/Features/SaveFeature", data)
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
      const response = await axios.post(
        "/api/Admin/Features/UploadFeatureImages",
        data,
        config
      )
      
      return response
    } catch (error) {
      return error.response
    }
  }

  delete = async (featureId, updatedBy) => {
    try {
      const response = await axios.delete(
        `/api/Admin/Features/DeleteFeature?featureId=${featureId}&updatedBy=${updatedBy}`,
        { featureId, updatedBy }
      )
      return response
    } catch (error) {
      return error.response
    }
  }

  update = async (data) => {
    try {
      const response = await axios.put(`/api/Admin/Features/UpdateFeature`, data)
      return response
    } catch (error) {
      return error.response
    }
  }
}
