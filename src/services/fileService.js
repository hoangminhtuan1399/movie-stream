import { streamService } from "./axios";

export const fileService = {
  // Search files with keyword and type
  searchFiles: async (keyword, type, page = 1, size = 16) => {
    try {
      const response = await streamService.get("/upload/files/search", {
        params: {
          keyword,
          type,
          page: page - 1, // backend thường bắt đầu từ 0
          size,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload file
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await streamService.post("/upload/file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete file
  deleteFile: async (fileId) => {
    try {
      const response = await streamService.delete(`/upload/file`, {
        params: {
          fileId,
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default fileService;
