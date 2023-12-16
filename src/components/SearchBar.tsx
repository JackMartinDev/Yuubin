import type { RootState } from "../store/store"
import { useSelector, useDispatch } from "react-redux"
import axios from "axios"
import { HttpVerb, updateUrl, updateVerb } from "../requestSlice"

const SearchBar = () =>{
    const params = useSelector((state: RootState) => state.request.queryParams)
    const url = useSelector((state: RootState) => state.request.url)
    const method = useSelector((state: RootState) => state.request.httpVerb)
    const dispatch = useDispatch()

    const sendRequest = async () => {
        const res = await axios({
            url,
            method,
        })
        const data = await res.data;
        console.log(data)
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
        </div>
    )
}

export default SearchBar
