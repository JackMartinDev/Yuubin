import { useState } from "react"
import styles from "./QueryParams.module.css"

import type { RootState } from '../store/store'
import { useSelector, useDispatch } from 'react-redux'

const QueryParams = () => {
    const [queries, setQueries] = useState([{key: "", value: ""}]);

    const url = useSelector((state: RootState) => state.request.url)
    
    const incrementQueryCount = () =>{
        setQueries([...queries, {key: "", value: ""}]);
    }

    const removeQuery = (index: number) =>{
        const newArray = [...queries];
        newArray.splice(index, 1);
        setQueries(newArray)
    }

    const queryInput = queries.map((query, index) => (
        <>
            <div className={styles.gridItem}>
                <input type="text" />
            </div>
            <div className={styles.gridItem}>
                <input type="text" />
            </div> 
            <button className={styles.gridItem} onClick={() => removeQuery(index)}>Delete</button>
        </>
    ))

    return(
        <div>
            <p>{url}</p>
            <div className={styles.grid}>
                <div className={styles.gridItem}>
                    <h4>Name</h4>
                </div>
                <div className={styles.gridItem}>
                    <h4>Value</h4>
                </div> 
                <div className={styles.gridItem}>
                </div>
                {queryInput}
            </div>
            <button onClick={incrementQueryCount}>
                + Add Param
            </button>

        </div>
    )
}

export default QueryParams
