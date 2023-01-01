import axios from "../shared/AxiosConfig"

export default class CategoryService {
  get = async (search) => {
    try {
      const response = await axios.get(`/api/Admin/categories/GetCategories?search=${search}`)

      return response
    } catch (error) {
      return error.response
    }
  }
  getById = async (id) => {
    try {
      const response = await axios.get("/api/Admin/Categories/GetCategory?categoryId=" + id)
      return response
    } catch (error) {
      return error.response
    }
  }

  save = async (data) => {
    try {
      const response = await axios.post("/api/Admin/Categories/SaveCategory", data)
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
        "/api/Admin/Categories/UploadCategoryImage",
        data,
        config
      )
      return response
    } catch (error) {
      return error.response
    }
  }

  delete = async (CategoryId, updatedBy) => {
    try {
      const response = await axios.delete(
        `/api/Admin/Categories/DeleteCategory?categoryId=${CategoryId}&updatedBy=${updatedBy}`,
        { CategoryId, updatedBy }
      )
      return response
    } catch (error) {
      return error.response
    }
  }

  update = async (data) => {
    try {
      const response = await axios.put(`/api/Admin/Categories/UpdateCategory`, data)
      return response
    } catch (error) {
      return error.response
    }
  }
}

