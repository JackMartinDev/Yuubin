import { useDispatch } from "react-redux"
import { updateUrl, updateVerb } from "../../requestSlice"
import { useEffect, useState } from "react"
import styles from "./SearchBar.module.css"
import Select, { SingleValue } from "react-select"
import useSendRequest from "../../hooks/useSendRequest"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"

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
        boxShadow: state.isFocused ? 'none': 'none',
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
    
    const url = useSelector((state: RootState) => state.request.url)
    const method = useSelector((state: RootState) => state.request.httpVerb)

    useEffect(() => {
        const httpVerb: OptionType = {value: method, label: method}
        setSelectedOption(httpVerb)
    },[method])

    const onSubmitHandler = (e:React.FormEvent) => {
        e.preventDefault(); 
        sendRequest();
    }

    const onMethodChangeHander = (option: SingleValue<OptionType>) =>{
        setSelectedOption(option as OptionType)
        dispatch(updateVerb(option!.value))
    }
    
    //TODO:debounce
    const onUrlChangeHandler = (url: string) =>{
        dispatch(updateUrl(url))
    }

    return(
        <form onSubmit={onSubmitHandler} className={styles.body}>
            <Select options={options} onChange={onMethodChangeHander} value={selectedOption} styles={selectStyles}/>
            <input className={styles.url} type="url" id="url" defaultValue={url} placeholder="Enter URL" onChange={(e) => onUrlChangeHandler(e.target.value)}/>
            <button className={styles.btn} type="submit">Send</button>
        </form>
    )
}

export default SearchBar
