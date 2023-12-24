import { useState } from "react"
import QueryParams from "../QueryParams/QueryParams"
import RequestBody from "../RequestBody/RequestBody"
import ResponseBody from "../ResponseBody/ResponseBody"
import SearchBar from "../SearchBar/SearchBar"
import styles from "./Client.module.css"
import { Resizable } from "re-resizable"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
const panels = ["Query", "Body", "Headers", "Auth"]

const Client = (): JSX.Element => {
    const [active, setActive] = useState(0);
    const status = useSelector((state:RootState) => state.response.status)

    const tabs = panels.map((panel, index) => (
        <div
            onClick={(event) => {
                event.preventDefault();
                setActive(index);
            }}
            key={panel}
            className={styles.tab}
        >
            {panel}
       </div>
       ));
    return(
        <>
            <SearchBar/>
            <div className={styles.body}>
                    <div className={styles.request}>
                        <div className={styles.tabs}>
                            {tabs}
                        </div>
                        { active === 0 && <QueryParams/> }
                        { active === 1 && <RequestBody/> }
                        { active === 2 && <p>Headers Tab</p> }
                        { active === 3 && <p>Auth Tab</p> }
                    </div>
                <Resizable 
                    defaultSize={{width: '50vw', height: 500}}
                    maxWidth={'70vw'}
                    minWidth={'30vw'}
                    enable={{ top:false, right:false, bottom:false, left:true, topRight:false, bottomRight:false, bottomLeft:false, topLeft:false }}
                >
                    <div className={styles.response}>
                        {status ? <ResponseBody/> : <p style={{textAlign: 'center'}}>Make a request using the URL bar above</p>}
                    </div>
                </Resizable>
            </div>
        </>
    )
}

export default Client
