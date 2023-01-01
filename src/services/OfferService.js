import axios from "../shared/AxiosConfig"

export default class OfferService {
  get = async (search, index) => {
    try {
      const response = await axios.get(`api/Admin/Offer/GetOffers?search=${search}&pageIndex=${index}`)
      return response
    } catch (error) {
      return error.response
    }
  }

  getById = async (id) => {
    try {
      const response = await axios.get("/api/Admin/Offer/GetOffer?offerId=" + id)
      return response
    } catch (error) {
      return error.response
    }
  }

  save = async (data) => {
    try {
      const response = await axios.post("/api/Admin/Offer/SaveOffer", data)
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
      const response = await axios.post("/api/Admin/Offer/UploadOfferImage", data, config)
      return response
    } catch (error) {
      return error.response
    }
  }

  delete = async (offerId, updatedBy) => {
    try {
      const response = await axios.delete(`/api/Admin/Offer/DeleteOffer?offerId=${offerId}&updatedBy=${updatedBy}`, { offerId, updatedBy })
      return response
    } catch (error) {
      return error.response
    }
  }

  update = async (data) => {
    try {
      const response = await axios.put(`/api/Admin/Offer/UpdateOffer`, data)
      return response
    } catch (error) {
      return error.response
    }
  }
}
