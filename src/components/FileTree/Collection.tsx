import { useState } from "react";
import classes from "./Collection.module.css" 
import cx from "clsx"
import Request from "./Request";
type Props = {
    collection: Collection 
}

const Collection = ({collection}: Props): JSX.Element => {
    const [isToggled, setIsToggled] = useState(false);
    
    const toggle = () => {
        setIsToggled(!isToggled)
    }

    //TODO: On click set the values of this request to redux of the current }
    return(
        <>
            <p className={classes.accordion} onClick={toggle}>{collection.name}</p>
            <div className={cx(classes.content, {[classes.show]: isToggled})}>
                {collection.requests.map((request) => <Request request={request}/>)}
            </div>
        </>
    )
}

export default Collection
