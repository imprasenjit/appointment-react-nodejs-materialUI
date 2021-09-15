import axios from "axios";
import { authAPI } from "../config";

export const httpCall = (requestConfig) => {
    const Auth = JSON.parse(localStorage.getItem("Auth"));
    if (Auth.access_token !== "") {
        const requestHeaders = {
            "Authorization": `Bearer ${Auth.token}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
        };
        console.log(requestHeaders);
        let reqConfig;
        if (requestConfig.method === "get") {
            reqConfig = {
                url: requestConfig.url,
                method: requestConfig.method,
                headers: requestHeaders,
            };
        } else {
            reqConfig = {
                url: requestConfig.url,
                method: requestConfig.method,
                data: requestConfig.data,
                headers: requestHeaders,
            };
        }

        return axios(reqConfig);
    } else {
        return false;
    }
};
export const getClientCredientials = async (props) => {
    await axios
        .post(
            authAPI,
        )
        .then((res) => {
            console.log(res.data);
            // localStorage.setItem("Auth", JSON.stringify(res.data));
        })
        .then(() => {
            // props.setLoading(false);
        });
};