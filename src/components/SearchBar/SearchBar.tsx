import type { RootState } from "../../store/store"
import { useSelector, useDispatch } from "react-redux"
import axios, { AxiosResponse } from "axios"
import { HttpVerb, updateUrl, updateVerb } from "../../requestSlice"
import { updateElapsed, updateHeaders, updateResponse, updateSize, updateStatus } from "../../responseSlice"
import prettyBytes from "pretty-bytes"
import styles from "./SearchBar.module.css"

interface RequestParams{
    [key: string]: string
}

declare module 'axios' {
    export interface AxiosRequestConfig {
        metadata?: { startTime: number };
    }
}

const SearchBar = () =>{
    const paramsArray = useSelector((state: RootState) => state.request.queryParams)
    const url = useSelector((state: RootState) => state.request.url)
    const method = useSelector((state: RootState) => state.request.httpVerb)
    const body = useSelector((state:RootState) => state.request.body)
    let data:string
    let params: RequestParams

    const dispatch = useDispatch()

axios.interceptors.request.use(config => {
    config.metadata = { startTime: new Date().getTime() };
    return config;
}, (error: any) => {
        return Promise.reject(error);
});

    axios.interceptors.response.use((response: AxiosResponse) => {
        const endTime = new Date().getTime();
        const duration = response.config.metadata ? endTime - response.config.metadata.startTime : null;

        if (duration !== null) {
            dispatch(updateElapsed(duration));
        }

        return response;
    }, (error: any) => {
            if (error.config && error.config.metadata) {
                const endTime = new Date().getTime();
                const duration = endTime - error.config.metadata.startTime;
                dispatch(updateElapsed(duration));
            }
            return Promise.reject(error);
        });


    const sendRequest = async () => {
        if(paramsArray){
            params = paramsArray.reduce((obj, item) => (obj[item.key] = item.value, obj) ,{});
        }
        try{
            if(body){ 
                data = JSON.parse(body);
            }
        }catch{
            console.log("JSON data is malformed");
            return
        }

        const res = await axios({
            url,
            method,
            params,
            data,
        })

        dispatch(updateResponse(res.data));
        dispatch(updateStatus(res.status));
        dispatch(updateSize(prettyBytes(JSON.stringify(res.data).length + JSON.stringify(res.headers).length)));
        dispatch(updateHeaders(JSON.stringify(res.headers)));
        const resData = await res.data;
        console.log(resData)
    }

    const onMethodChangeHander = (verb: HttpVerb) =>{
       dispatch(updateVerb(verb))
    }

    const onUrlChangeHandler = (url: string) =>{
        dispatch(updateUrl(url))
    }

    return(
        <div className={styles.body}>
            <select className={styles.dropdown} name="method" id="method" onChange={(e) => onMethodChangeHander(e.target.value as HttpVerb)}>
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
                <option value="OPTIONS">OPTIONS</option>
                <option value="HEAD">HEAD</option>
            </select>
            <input type="url" id="url" placeholder="Enter URL" onChange={(e) => onUrlChangeHandler(e.target.value)}/>
            <button onClick={sendRequest}>Send</button>
        </div>
    )
}

export default SearchBar