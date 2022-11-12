import axios from "axios";
import * as CONFIG from "../config/configUrl";

axios.defaults.withCredentials = true;

export const getData = (url, header) => {
    header = checkHeader(header);
    return axios.get(url, {
        headers: header,
    });
};
export const getDataWithResponeType = (url, header, responseType) => {
    header = checkHeader(header);
    return axios.get(url, {
        headers: header,
        responseType,
    });
};
export const getDataWithResponeTypeHaveData = (
    url,
    data,
    header,
    responseType
) => {
    header = checkHeader(header);
    return axios.get(url, data, {
        headers: header,
        responseType: responseType,
    });
};
export const postDataWithResponeTypeHaveData = (
    url,
    data,
    header,
    responseType
) => {
    header = checkHeader(header);
    return axios.post(url, data, {
        headers: header,
        responseType: responseType,
    });
};
export const getDataWithResponeTypeNotData = (url, header, responseType) => {
    header = checkHeader(header);
    return axios.get(url, {
        headers: header,
        responseType: responseType,
    });
};
export const postDataWithResponeTypeNotData = (url, header, responseType) => {
    header = checkHeader(header);
    return axios.post(url, {
        headers: header,
        responseType: responseType,
    });
};
export const postData = (url, data, header) => {
    header = checkHeader(header);
    return axios.post(url, data, {
        headers: header,
    });
};

export const putData = (url, data, header) => {
    header = checkHeader(header);
    return axios.put(url, data, {
        headers: header,
    });
};

export const deleteData = (url, data, header) => {
    header = checkHeader(header);
    return axios.delete(url, {data, headers: header});
};

const checkHeader = (header) => {
    if (typeof header === "undefined" || typeof header === "undefined")
        header = {};
    if (
        typeof window.localStorage.getItem(CONFIG.ACCESS_TOKEN) !== "undefined" &&
        window.localStorage.getItem(CONFIG.ACCESS_TOKEN) !== null
    ) {
        let token = JSON.parse(window.localStorage.getItem(CONFIG.ACCESS_TOKEN));
        header["Authorization"] = token.tokenType + " " + token.accessToken;
    }
    return header;
};

export const getAuthenHeader = () => {
    let header = {};
    if (
        typeof window.localStorage.getItem(CONFIG.ACCESS_TOKEN) !== "undefined" &&
        window.localStorage.getItem(CONFIG.ACCESS_TOKEN) !== null
    ) {
        let token = JSON.parse(window.localStorage.getItem(CONFIG.ACCESS_TOKEN));
        header = {Authorization: token.tokenType + " " + token.accessToken};
    }
    return header;
};
