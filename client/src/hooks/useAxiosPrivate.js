import {axiosPrivate} from "../api/axios"
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/userReducer";
import { setCurrentToken } from "../redux/accessTokenReducer";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const accessToken = useSelector((state)=> state?.token?.token);
    console.log("accessToken",accessToken)
    const dispatch = useDispatch()

    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    prevRequest.sent = true;
                    const newAccessToken = await refresh();

                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest);
                }

                dispatch(setCurrentToken(null))
                dispatch(logout());

                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [accessToken, refresh])

    return axiosPrivate;
}

export default useAxiosPrivate;