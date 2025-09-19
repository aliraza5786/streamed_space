import { useMutation } from "@tanstack/vue-query";
import api from "../libs/api";

export const uploadFile = (formData: FormData) => {
  return api
    .post("/upload/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => res.data);
};

export const useUploadFile = (options = {}) => {
  return useMutation({
    mutationKey: ["upload-file"],
    mutationFn: uploadFile,
    ...options,
  });
};
