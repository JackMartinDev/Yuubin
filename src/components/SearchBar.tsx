import type { RootState } from "../store/store"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { HttpVerb, updateUrl, updateVerb } from "../requestSlice"
import ResponseBody from "./ResponseBody"
import { useState } from "react"

interface RequestParams{
    [key: string]: string
}

const SearchBar = () =>{
    const [response, setResponse] = useState();
    const paramsArray = useSelector((state: RootState) => state.request.queryParams)
    const url = useSelector((state: RootState) => state.request.url)
    const method = useSelector((state: RootState) => state.request.httpVerb)
    const body = useSelector((state:RootState) => state.request.body)
    let data:string
    let params: RequestParams

    const dispatch = useDispatch()

    const sendRequest = async () => {
        console.log(paramsArray)
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
        const resData = await res.data;
        setResponse(resData)
        console.log(resData)
    }

    const onMethodChangeHander = (verb: HttpVerb) =>{
       dispatch(updateVerb(verb))
    }

    const onUrlChangeHandler = (url: string) =>{
        dispatch(updateUrl(url))
    }

    return(
        <div>
            <select name="method" id="method" onChange={(e) => onMethodChangeHander(e.target.value as HttpVerb)}>
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
            <ResponseBody value={JSON.stringify(response, null, 2)}/>
        </div>
    )
}

export default SearchBar
