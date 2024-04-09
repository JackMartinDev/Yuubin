import type { RootState } from "../store/store"
import { useSelector, useDispatch } from "react-redux"
import axios, { AxiosResponse, AxiosError } from "axios"
import { updateElapsed, updateHeaders, updateResponse, updateSize, updateStatus, updateLoading, updateError } from "../responseSlice"
import prettyBytes from "pretty-bytes"

interface RequestParams{
    [key: string]: string
}

declare module 'axios' {
    export interface AxiosRequestConfig {
        metadata?: { startTime: number };
    }
}

const useSendRequest = (paramsArray: KeyValuePair[] | undefined, url: string, method: HttpVerb, body: string | undefined) => {    
    let data:string
    let params: RequestParams

    const dispatch = useDispatch();

    axios.interceptors.request.use(config => {
        dispatch(updateLoading(true));
        config.metadata = { startTime: new Date().getTime() };
        return config;
    }, (error: AxiosError) => {
            dispatch(updateError(true));
            dispatch(updateStatus(400));
            dispatch(updateLoading(false));
            console.log("request error");
            return Promise.reject(error);
        });

    axios.interceptors.response.use((response: AxiosResponse) => {
        dispatch(updateLoading(false));
        const endTime = new Date().getTime();
        const duration = response.config.metadata ? endTime - response.config.metadata.startTime : null;

        if (duration !== null) {
            dispatch(updateElapsed(duration));
        }

        return response;
    }, (error: AxiosError) => {
            dispatch(updateError(true));
            if (error.config && error.config.metadata) {
                const endTime = new Date().getTime();
                const duration = endTime - error.config.metadata.startTime;
                dispatch(updateElapsed(duration));
            }
            const status = error.response ? error.response.status : null;

            console.log(status)
            dispatch(updateLoading(false));
            status ? dispatch(updateStatus(status)) : dispatch(updateStatus("Error"));
            error.response ? dispatch(updateResponse(error.response.data as string)) : dispatch(updateResponse(null));
            error.response ? dispatch(updateSize(prettyBytes(JSON.stringify(error.response.data).length + JSON.stringify(error.response.headers).length))) : dispatch(updateSize("0 B"));
            return Promise.reject(error);
        });


    const sendRequest = async () => {
        if(paramsArray){
            //remove empty key value pairs
            const filteredArray = paramsArray.filter((pair) => pair.key !== "" && pair.value !== "")
            params = filteredArray.reduce((obj, item) => (obj[item.key] = item.value, obj) ,{});
        }
        try{
            if(body){ 
                data = JSON.parse(body);
            }
        }catch{
            //Do something meaningful here
            console.log("JSON data is malformed");
            return
        }

        //Add try catch which returns the data on success and returns an error on fail
        const res = await axios({
            url,
            method,
            params,
            data,
        })

        //Return all of this response data and display in client
        dispatch(updateError(false));
        dispatch(updateResponse(res.data));
        dispatch(updateStatus(res.status));
        dispatch(updateSize(prettyBytes(JSON.stringify(res.data).length + JSON.stringify(res.headers).length)));
        dispatch(updateHeaders(JSON.stringify(res.headers)));
        const resData = await res.data;
        console.log(resData)
    }
    return sendRequest
}

export default useSendRequest
