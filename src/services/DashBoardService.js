import axios from "../shared/AxiosConfig"

export default class DashBoardService {
  get = async () => {
    try {
      const response = await axios.get("/api/Admin/Dashboard/DashboardCount")

      return response
    } catch (error) {
      return error.response
    }
  }
}
