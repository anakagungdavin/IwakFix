import axios from "axios";

export const getAuthorization = async () => {
    try {
      const value = await sessionStorage.getItem("authToken");
      return value ? `Bearer ${value}` : null;
    } catch (error) {
      console.log('err', error);
      return null;
    }
}

const API = async options => {
    const axiosInstance = axios.create({});
    const token = await getAuthorization();
    if (token) {
      options['headers'] = {
        Authorization: token,
        Accept: 'application/json',
        "Access-Control-Allow-Origin": "*",
        crossorigin: true,
        ...options?.headers
      };
    } else {
      options['headers'] = {
        Accept: 'application/json',
        "Access-Control-Allow-Origin": "*",
        crossorigin: true,
        ...options?.headers
      };
    }

    const onSuccess = response => response;
    const onError = async error => {
        return Promise.reject(error.response || error.message);
    }
    
    return axiosInstance(options)
    .then(onSuccess)
    .catch(onError)
}

export default API