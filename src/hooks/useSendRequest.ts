import axios, { AxiosResponse, AxiosError } from "axios"
import prettyBytes from "pretty-bytes"
import { notifications } from "@mantine/notifications";

interface KeyValueObject{
    [key: string]: string
}

//remove empty/unchecked key value pairs and convert to a single object
const ConvertArrayToObject = (array: KeyValuePair[]): KeyValueObject => {
    const filteredArray = array.filter((pair) => pair.key !== "" && pair.value !== "" && pair.checked === true)
    return filteredArray.reduce<KeyValueObject>((obj, item) => (obj[item.key] = item.value, obj) ,{});
}

const useSendRequest = (paramsArray: KeyValuePair[] | undefined, headersArray: KeyValuePair[] | undefined, url: string, method: HttpVerb, body: string | undefined, _auth: string | undefined) => {    

    let data:string
    let params: KeyValueObject
    let headers: KeyValueObject

    let startTime: number;
    let endTime: number;

    //Investigate if setting up the interceptor in the hook is okay
    axios.interceptors.request.use(config => {
        startTime = new Date().getTime();
        return config;
    }, (error: AxiosError) => {
            console.log("request error", error);
            return Promise.reject(error);
        });

    axios.interceptors.response.use((response: AxiosResponse) => {
        endTime = new Date().getTime();
        return response;
    }, (error: AxiosError) => {
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
                    message: error.message,
                    status: error.response?.status
                };
            } else {
                throw {
                    message:"An unexpected error occurred",
                    status: 400
                }
            }
        }
    }
    return sendRequest
}

export default useSendRequest
