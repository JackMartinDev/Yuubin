import { useDispatch } from "react-redux"
import { updateUrl, updateVerb } from "../../requestSlice"
import { useEffect, useState } from "react"
import styles from "./SearchBar.module.css"
import useSendRequest from "../../hooks/useSendRequest"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { Box, Button, Select, TextInput } from "@mantine/core"

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

    const onMethodChangeHander = (option) =>{
        setSelectedOption(option)
        dispatch(updateVerb(option!.value))
    }
    
    //TODO:debounce
    const onUrlChangeHandler = (url: string) =>{
        dispatch(updateUrl(url))
    }

    return(
        <Box bg="#F5F5F5">
        <form onSubmit={onSubmitHandler} className={styles.body}>
            <Select
                w={150}
                withCheckIcon={false}
                defaultValue="GET"
                allowDeselect={false}
                withScrollArea={false}
                data={['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD']}
            />
            <TextInput type="url" w="100%" onChange={(e) => onUrlChangeHandler(e.target.value)}/>
            <Button type="submit" w={100} variant="default" color="gray">Send</Button>
        </form>
        </Box>
    )
}

export default SearchBar
