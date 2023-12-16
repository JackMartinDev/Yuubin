import SearchBar from "./components/SearchBar"
import QueryParams from "./components/QueryParams"
import RequestBody from "./components/RequestBody"

function App(): JSX.Element {
    return (
        <div className="container">
            <h3>REST Client</h3>
            <RequestBody/>
            <SearchBar/>
            <QueryParams/>
        </div>
    )
}

export default App
