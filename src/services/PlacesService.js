import axios from "../shared/AxiosConfig"

export default class PlacesService {
  get = async () => {
    try {
      const response = await axios.get(`/api/admin/NearByPlaces/get`)
      return response
    } catch (error) {
      return error.response
    }
  }

  getById = async (id) => {
    try {
      const response = await axios.get("/api/admin/NearByPlaces/GetNearByPlace?nearByPlaceId=" + id)
      return response
    } catch (error) {
      return error.response
    }
  }

  save = async (data) => {
    try {
      const response = await axios.post("/api/admin/NearByPlaces/SaveNearByPlace", data)
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
      const response = await axios.post("/api/Admin/NearByPlaces/UploadNearByPlacesImages", data, config)
      return response
    } catch (error) {
      return error.response
    }
  }

  delete = async (placeId, updatedBy) => {
    try {
      const response = await axios.delete(`/api/admin/NearByPlaces/DeleteNearByPlace?nearByPlaceId=${placeId}&updatedBy=${updatedBy}`, {
        placeId,
        updatedBy,
      })
      return response
    } catch (error) {
      return error.response
    }
  }

  update = async (data) => {
    try {
      const response = await axios.put(`/api/admin/NearByPlaces/UpdateNearByPlace`, data)
      return response
    } catch (error) {
      return error.response
    }
  }
}
