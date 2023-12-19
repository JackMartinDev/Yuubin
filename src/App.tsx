import SearchBar from "./components/SearchBar"
import QueryParams from "./components/QueryParams"
import RequestBody from "./components/RequestBody"

function App(): JSX.Element {
    return (
        <div className="container">

            <SearchBar/>
            <RequestBody/>
            <QueryParams/>
        </div>
    )
}

export default App
