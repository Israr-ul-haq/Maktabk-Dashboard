import axios from "../shared/AxiosConfig"

export default class SubscriptionService {
  get = async (search) => {
    try {
      const response = await axios.get(`/api/Admin/Subscription/GetSubscriptions?search=${search}`)
      return response
    } catch (error) {
      return error.response
    }
  }

  getById = async (id) => {
    try {
      const response = await axios.get("/api/Admin/Subscription/GetSubscription?subscriptionId=" + id)
      return response
    } catch (error) {
      return error.response
    }
  }

  save = async (data) => {
    try {
      const response = await axios.post("/api/Admin/Subscription/SaveSubscription", data)
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
        "",
        data,
        config
      )
      return response
    } catch (error) {
      return error.response
    }
  }

  delete = async (subscriptionId, updatedBy) => {
    try {
      const response = await axios.delete(
        `/api/Admin/Subscription/DeleteSubscription?subscriptionId=${subscriptionId}&updatedBy=${updatedBy}`,
        { subscriptionId, updatedBy }
      )
      return response
    } catch (error) {
      return error.response
    }
  }

  update = async (data) => {
    try {
      const response = await axios.put(`/api/Admin/Subscription/UpdateSubscription`, data)
      return response
    } catch (error) {
      return error.response
    }
  }
}
