import SearchBar from "./components/SearchBar"
import QueryParams from "./components/QueryParams"
import RequestBody from "./components/RequestBody"
import ResponseBody from "./components/ResponseBody"

function App(): JSX.Element {
    return (
        <div className="container">

            <SearchBar/>
            <RequestBody/>
            <QueryParams/>
            <ResponseBody/>
        </div>
    )
}

export default App
