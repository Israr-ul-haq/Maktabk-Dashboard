import axios from "../shared/AxiosConfig"

export default class VoucherService {
  get = async (search) => {
    try {
      const response = await axios.get(`/api/Admin/Voucher/GetVouchers?search=${search}`)
      return response
    } catch (error) {
      return error.response
    }
  }

  getById = async (id) => {
    try {
      const response = await axios.get("/api/Admin/Voucher/GetVoucher?voucherId=" + id)
      return response
    } catch (error) {
      return error.response
    }
  }

  save = async (data) => {
    try {
      const response = await axios.post("/api/Admin/Voucher/SaveVoucher", data)
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
      const response = await axios.post("/api/Admin/Voucher/UploadVoucherImage", data, config)
      return response
    } catch (error) {
      return error.response
    }
  }

  delete = async (VoucherId, updatedBy) => {
    try {
      const response = await axios.delete(`/api/Admin/Voucher/DeleteVoucher?voucherId=${VoucherId}&updatedBy=${updatedBy}`, { VoucherId, updatedBy })
      return response
    } catch (error) {
      return error.response
    }
  }

  update = async (data) => {
    try {
      const response = await axios.put(`/api/Admin/Voucher/UpdateVoucher`, data)
      return response
    } catch (error) {
      return error.response
    }
  }
}
