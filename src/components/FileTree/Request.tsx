import classes from "./Request.module.css"
import { useDispatch } from "react-redux"
import { updateUrl, updateVerb, updateBody } from "../../requestSlice"

type Props = {
    request: YuubinRequest    
}


const Request = ({request}:Props) => {
    const dispatch = useDispatch();

    const onClickHandler = () => {
        dispatch(updateUrl(request.url));
        dispatch(updateVerb(request.method));
        dispatch(updateBody(request.body));
    }
    return(
    <div className={classes.request} onClick={onClickHandler}>
        <p>{request.method} {request.meta.name}</p>
    </div>
    )
}
export default Request
