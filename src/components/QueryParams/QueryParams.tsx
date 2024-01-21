import { useCallback, useState } from "react"
import styles from "./QueryParams.module.css"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { updateParams } from "../../requestSlice";
import { debounce } from "../../utils/utils"
import { IconTrash } from "@tabler/icons-react";

const QueryParams = () => {
    const init = useSelector((state: RootState) => state.request.queryParams)
    const [queries, setQueries] = useState<{key: string, value: string}[]>(init);
    const dispatch = useDispatch();

    const incrementQueryCount = () =>{
        setQueries([...queries, {key: "", value: ""}]);
    }
    
    const debouncedDispatch = useCallback(debounce((value: typeof queries) => {
        dispatch(updateParams(value))
        }, 500), []);

    const inputChangeHandler = (index: number, field:string, newValue: string) => {
        const newArray = queries.map((query, queryIndex) =>
            index === queryIndex ? { ...query, [field]: newValue } : query
        );
        setQueries(newArray);
        debouncedDispatch(newArray);
    };

    //TODO: Modify so it doesnt delete all with same key
    const removeQuery = (key: string) =>{
        const newArray = queries.filter((query) => query.key !== key)
        setQueries(newArray)
        dispatch(updateParams(newArray))
    }

    const queryInput = queries.map((query, index) => (
        //Add key here by changing from a fragment
        <>
            <div className={styles.gridItem}>
                <input 
                    type="text" 
                    value={query.key} 
                    onChange={(e) => inputChangeHandler(index, "key" , e.target.value)}
                />
            </div>
            <div className={styles.gridItem}>
                <input 
                    type="text" 
                    value={query.value} 
                    onChange={(e) => inputChangeHandler(index, "value" ,e.target.value)}
                />

            </div> 
            <div className={styles.delete}>
                <IconTrash onClick={() => removeQuery(query.key)} className={styles.deleteIcon}/>
            </div>
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
