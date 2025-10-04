import { BASE_URL } from "@constants/api-url";
import { message } from "antd";
import axios from "axios";

export async function upload(endpointName: string, formData: FormData) {
  return axios
    .post(`${BASE_URL}/api/uploads/${endpointName}`, formData)
    .then((response) => {
      const { data } = response;
      if (data.success) {
        message.success(`File Uploaded Successfully!`);
      }
      return data.data;
    })
    .catch((err) => {
      message.error(`Failed to upload File!`);
      return err;
    });
}

