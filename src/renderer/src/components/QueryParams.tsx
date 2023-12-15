import { useState } from "react"
import styles from "./QueryParams.module.css"
import { useDispatch } from "react-redux";
import { updateParams } from "@renderer/requestSlice";

const QueryParams = () => {
    const [queries, setQueries] = useState([{key: "", value: ""}]);
    const dispatch = useDispatch();


    const incrementQueryCount = () =>{
        setQueries([...queries, {key: "", value: ""}]);
    }

    const inputChangeHandler = (index: number, field:string, newValue: string) => {
        const newArray = queries.map((query, queryIndex) =>
            index === queryIndex ? { ...query, [field]: newValue } : query
        );
        setQueries(newArray);
        dispatch(updateParams(newArray))
    };

    //TODO: Modify so it doesnt delete all with same key
    const removeQuery = (key: string) =>{
        setQueries((prev) => prev.filter((query) => query.key !== key))
        //This delete doesnt work due to late state update
        dispatch(updateParams(queries))
    }

    const queryInput = queries.map((query, index) => (
        //Add key here by changing from a fragment
        <>
            <div className={styles.gridItem}>
                <input 
                    type="text" 
                    value={query.key} 
                    onChange={(e) => inputChangeHandler(index, "key" , e.target.value)}/>
            </div>
            <div className={styles.gridItem}>
                <input 
                    type="text" 
                    value={query.value} 
                    onChange={(e) => inputChangeHandler(index, "value" ,e.target.value)}/>
            </div> 
            <button 
                className={styles.gridItem} 
                onClick={() => removeQuery(query.key)}>Delete</button>
        </>
    ))

    return(
        <div>
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
