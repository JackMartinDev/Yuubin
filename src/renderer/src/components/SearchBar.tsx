
const SearchBar = () =>{
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
            <button>Send</button>
        </div>
    )
}

export default SearchBar
