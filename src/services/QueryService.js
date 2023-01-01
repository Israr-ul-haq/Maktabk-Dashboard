import axios from "../shared/AxiosConfig"

export default class QueryService {
  get = async (search, index) => {
    try {
      const response = await axios.get(`/api/Admin/Query/GetQueries?search=${search}&pageIndex=${index}`)
      return response
    } catch (error) {
      return error.response
    }
  }

  getById = async (id) => {
    try {
      const response = await axios.get("/api/Admin/Query/GetQuery?queryId=" + id)
      return response
    } catch (error) {
      return error.response
    }
  }

  replyQuery = async (id) => {
    try {
      const response = await axios.post("/api/Admin/Query/ResolveQuery?queryId=" + id)
      return response
    } catch (error) {
      return error.response
    }
  }

 

  delete = async (queryId, updatedBy) => {
    try {
      const response = await axios.delete(`/api/Admin/Query/DeleteQuery?queryId=${queryId}&updatedBy=${updatedBy}`, { queryId, updatedBy })
      return response
    } catch (error) {
      return error.response
    }
  }

}
