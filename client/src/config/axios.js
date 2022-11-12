import axios from "axios";
// import router from "./router/router";

// Add a request interceptor
axios.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        Promise.reject(error);
    }
);

//Add a response interceptor

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    function (error) {
        const originalRequest = error.config;
        console.log(originalRequest);
        if (error.response.status === 401) {
            //   router.push("/login");
            console.log("ERROR");
            return Promise.reject(error);
        }
    }
);
