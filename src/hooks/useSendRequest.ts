import { useDispatch } from "react-redux"
import axios, { AxiosResponse, AxiosError } from "axios"
import { updateLoading } from "../responseSlice"
import prettyBytes from "pretty-bytes"
import { notifications } from "@mantine/notifications";

interface KeyValueObject{
    [key: string]: string
}

//remove empty key value pairs and convert to a single object
const ConvertArrayToObject = (array: KeyValuePair[]): KeyValueObject => {
    const filteredArray = array.filter((pair) => pair.key !== "" && pair.value !== "")
    return filteredArray.reduce((obj, item) => (obj[item.key] = item.value, obj) ,{});
}

const useSendRequest = (paramsArray: KeyValuePair[] | undefined, headersArray: KeyValuePair[] | undefined, url: string, method: HttpVerb, body: string | undefined, auth: string | undefined) => {    

    let data:string
    let params: KeyValueObject
    let headers: KeyValueObject

    let startTime: number;
    let endTime: number;

    const dispatch = useDispatch();

    //Investigate if setting up the interceptor in the hook is okay
    axios.interceptors.request.use(config => {
        startTime = new Date().getTime();
        dispatch(updateLoading(true));
        return config;
    }, (error: AxiosError) => {
            dispatch(updateLoading(false));
            console.log("request error", error);
            return Promise.reject(error);
        });

    axios.interceptors.response.use((response: AxiosResponse) => {
        endTime = new Date().getTime();
        dispatch(updateLoading(false));
        return response;
    }, (error: AxiosError) => {
            dispatch(updateLoading(false));
            console.log("response error", error);
            return Promise.reject(error);
        });


    const sendRequest = async () => {
        if(paramsArray){
            params = ConvertArrayToObject(paramsArray)
        }
        if(headersArray){
            headers = ConvertArrayToObject(headersArray)
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
            //Find out how to add bearer token etc
            const res = await axios({
                url,
                method,
                params,
                headers,
                data,
                //auth
            })

            const duration = endTime - startTime;

            return {
                data: res.data,
                status: res.status,
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
