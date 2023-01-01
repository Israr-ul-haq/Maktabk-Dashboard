import axios from "../shared/AxiosConfig"

export default class FinanceService {
  get = async () => {
    try {
      const response = await axios.get("/api/Admin/Finance/FinanceReport")

      return response
    } catch (error) {
      return error.response
    }
  }
}