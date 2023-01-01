import axios from "../shared/AxiosConfig"

export default class CheckInService {
  get = async () => {
    try {
      const response = await axios.get(`/api/Admin/CheckIn/CheckIns`)

      return response
    } catch (error) {
      return error.response
    }
  }
}
