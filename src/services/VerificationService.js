import axios from "../shared/AxiosConfig"

export default class VerificationService {
  get = async (search) => {
    try {
      const response = await axios.get(`/api/Admin/Verifications/GetVerifications?search=${search}`)
      return response
    } catch (error) {
      return error.response
    }
  }

  accept = async (id) => {
    try {
      const response = await axios.post("/api/Admin/Verifications/AcceptBusiness?businessId=" + id)
      return response
    } catch (error) {
      return error.response
    }
  }

  reject = async (id) => {
    try {
      const response = await axios.post("/api/Admin/Verifications/RejectBusiness?businessId=" + id, id)
      return response
    } catch (error) {
      return error.response
    }
  }
}
