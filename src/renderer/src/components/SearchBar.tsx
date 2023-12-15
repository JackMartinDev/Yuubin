import type { RootState } from "@renderer/store/store"
import { useSelector, useDispatch } from "react-redux"
import { updateUrl } from "@renderer/requestSlice"

const SearchBar = () =>{
    const url = useSelector((state: RootState) => state.request.url)
    const dispatch = useDispatch();

    const Update = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(updateUrl(e.target.value))
    }

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
            <input onChange={Update} type="url" id="url" placeholder="Enter URL"/>
            <button>Send</button>
        </div>
    )
}

export default SearchBar
