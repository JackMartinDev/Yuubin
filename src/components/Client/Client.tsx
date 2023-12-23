import QueryParams from "../QueryParams"
import RequestBody from "../RequestBody"
import ResponseBody from "../ResponseBody"
import SearchBar from "../SearchBar/SearchBar"
import styles from "./Client.module.css"

const Client = (): JSX.Element => {
    return(
        <>
            <SearchBar/>
            <div className={styles.body}>
                <div className={styles.request}>
                    <QueryParams/>
                    <RequestBody/>
                </div>
                <div className={styles.response}>
                    <ResponseBody/>
                </div>
            </div>
        </>
    )
}

export default Client
