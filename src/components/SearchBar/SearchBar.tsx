import { useDispatch } from "react-redux"
import { HttpVerb, updateUrl, updateVerb } from "../../requestSlice"
import { useState } from "react"
import styles from "./SearchBar.module.css"
import Select, { SingleValue } from "react-select"
import useSendRequest from "../../hooks/useSendRequest"

interface OptionType {
  value: HttpVerb;
  label: HttpVerb;
}

const options: OptionType[] = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'PATCH', label: 'PATCH' },
    { value: 'DELETE', label: 'DELETE' },
    { value: 'OPTIONS', label: 'OPTIONS' },
    { value: 'HEAD', label: 'HEAD' },
]

const selectStyles = {
    control: (baseStyles, state) => ({
        ...baseStyles,
        borderColor: 'gray',
        cursor: 'pointer',
        borderRadius: '2px',
        //background: 'transparent',
    }),
    indicatorSeparator: (baseStyles, state) => ({
        ...baseStyles,
        display: 'none',
    }),
    option: (baseStyles, state) => ({
        ...baseStyles,
        cursor: 'pointer',
    }),
    menu: (baseStyles, state) => ({
        ...baseStyles,
        backgroundColor: 'lightgray',
    }),
}

const SearchBar = () =>{
    const [selectedOption, setSelectedOption] = useState<OptionType>(options[0]);
    const dispatch = useDispatch()
    const sendRequest = useSendRequest();

    const onMethodChangeHander = (option: SingleValue<OptionType>) =>{
        setSelectedOption(option as OptionType)
        dispatch(updateVerb(option!.value))
    }
    
    //TODO:debounce
    const onUrlChangeHandler = (url: string) =>{
        dispatch(updateUrl(url))
    }

    return(
        <div className={styles.body}>
            <Select options={options} onChange={onMethodChangeHander} value={selectedOption}
                styles={selectStyles}/>
            <input className={styles.url} type="url" id="url" placeholder="Enter URL" onChange={(e) => onUrlChangeHandler(e.target.value)}/>
            <button className={styles.btn} onClick={sendRequest}>Send</button>
        </div>
    )
}

export default SearchBar
