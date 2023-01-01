import axios from "../shared/AxiosConfig"

export default class UsersService {
  get = async () => {
    try {
      const response = await axios.get("/api/Admin/User/GetUsers")

      return response
    } catch (error) {
      return error.response
    }
  }
}