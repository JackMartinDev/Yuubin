import { useDispatch } from "react-redux"
import axios, { AxiosResponse, AxiosError } from "axios"
import { updateLoading } from "../responseSlice"
import prettyBytes from "pretty-bytes"
import { notifications } from "@mantine/notifications";

interface RequestParams{
    [key: string]: string
}

const useSendRequest = (paramsArray: KeyValuePair[] | undefined, url: string, method: HttpVerb, body: string | undefined) => {    
    let data:string
    let params: RequestParams

    let startTime: number;
    let endTime: number;

    const dispatch = useDispatch();

    //Investigate if setting up the interceptor in the hook is okay
    axios.interceptors.request.use(config => {
        dispatch(updateLoading(true));
        startTime = new Date().getTime();
        return config;
    }, (error: AxiosError) => {
            dispatch(updateLoading(false));
            console.log("request error", error);
            return Promise.reject(error);
        });

    axios.interceptors.response.use((response: AxiosResponse) => {
        dispatch(updateLoading(false));
        endTime = new Date().getTime();
        return response;
    }, (error: AxiosError) => {
            dispatch(updateLoading(false));
            console.log("response error", error);
            return Promise.reject(error);
        });


    const sendRequest = async () => {
        if(paramsArray){
            //remove empty key value pairs
            const filteredArray = paramsArray.filter((pair) => pair.key !== "" && pair.value !== "")
            params = filteredArray.reduce((obj, item) => (obj[item.key] = item.value, obj) ,{});
        }
        try{
            if(body && (method === "POST" || method === "PUT" || method === "PATCH")){ 
                data = JSON.parse(body);
            }
        }catch{
            //Do something meaningful here
            notifications.show({
                title: 'JSON Body Error',
                message: "JSON data is malformed",
                color: 'red'
            })
            return
        }
        try{
            const res = await axios({
                url,
                method,
                params,
                data,
            })

            const duration = endTime - startTime;

            return {
                data: res.data,
                status: res.status,
                //headers: res.headers,
                size: prettyBytes(JSON.stringify(res.data).length + JSON.stringify(res.headers).length),
                duration: duration
            };
        } catch(error) {
            if (axios.isAxiosError(error)) {
                throw {
                    message: `Status ${error.response?.status}: ${error.message}`,
                    status: error.response?.status
                };
            } else {
                throw new Error("An unexpected error occurred");
            }

        }
    }
    return sendRequest
}

export default useSendRequest
