import type { RootState } from "@renderer/store/store"
import { useSelector } from "react-redux"

const SearchBar = () =>{
    const params = useSelector((state: RootState) => state.request.queryParams)

    return(
        <div>
            <select name="method" id="method">
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
                <option value="OPTIONS">OPTIONS</option>
                <option value="HEAD">HEAD</option>
            </select>
            <input type="url" id="url" placeholder="Enter URL"/>
            <button onClick={() => {console.log(params)}}>Send</button>
        </div>
    )
}

export default SearchBar
