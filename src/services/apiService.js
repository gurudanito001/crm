import axios from "axios";
/* import { handleError } from './../error/errorFunctions'; */
import { getToken, deleteToken, getFingerprint } from "./localStorageService";
import config from "../config";

//dev
const baseUrl = `http://localhost:8080`;
//PROD
//const baseUrl = `https://kcg-crm-backend.vercel.app`;

function setHeaders(extraHeaders) {
  let token = getToken();
  //let fingerprint = getFingerprint();

  let headerData = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
  if (extraHeaders) {
    headerData = { ...headerData, ...extraHeaders };
  }
  return headerData;
}

function setBody(method, data) {
  if (method === "get" || method === "delete") {
    return { params: data };
  } else {
    return { data: data };
  }
}

function setUrl(url) {
  return `${baseUrl}${url}`;
}

function callApi(paramsObject) {
  let { url, data, method, extraHeaders, failureCallback } = paramsObject;
  let headers = setHeaders(extraHeaders);
  let body = setBody(method, data);
  let apiUrl = setUrl(url);
  return new Promise((resolve, reject) => {
    axios({ url: apiUrl, ...body, headers: headers, method: method })
      .then((data) => {
        resolve({ statusCode: data.status, ...data.data });
      })
      .catch((error) => {
        //console.log(error);
        if (error.response) {
          if (error.response.status.toString() === "401" && failureCallback) {
            deleteToken();
            failureCallback();
          }
          reject({ statusCode: error.response.status, ...error.response.data });
        } else {
          if (navigator.onLine) {
            reject({
              statusCode: 500,
              message: "oops !!! Something went Wrong.",
            });
          } else {
            reject({
              statusCode: 500,
              message: "Something Went Wrong, Check Your internet Connection.",
            });
          }
        }
      });
  });
}
export const apiGet = (paramsObject) => {
  let { url, data, failureCallback, extraHeaders } = paramsObject;
  return callApi({ url, data, method: "get", extraHeaders, failureCallback });
};
export const apiPost = (paramsObject) => {
  let { url, data, failureCallback, extraHeaders } = paramsObject;
  return callApi({ url, data, method: "post", extraHeaders, failureCallback });
};
export const apiPatch = (paramsObject) => {
  let { url, data, failureCallback, extraHeaders } = paramsObject;
  return callApi({ url, data, method: "patch", extraHeaders, failureCallback });
};
export const apiPut = (paramsObject) => {
  let { url, data, failureCallback, extraHeaders } = paramsObject;
  return callApi({ url, data, method: "put", extraHeaders, failureCallback });
};
export const apiDelete = (paramsObject) => {
  let { url, data, failureCallback, extraHeaders } = paramsObject;
  return callApi({
    url,
    data,
    method: "delete",
    extraHeaders,
    failureCallback,
  });
};
