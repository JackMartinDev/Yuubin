import { useState } from "react";
import classes from "./Collection.module.css" 
import cx from "clsx"
type Props = {
    collection: Collection 
}

const Collection = ({collection}: Props): JSX.Element => {
    const [isToggled, setIsToggled] = useState(false);
    
    const toggle = () => {
        setIsToggled(!isToggled)
    }

    return(
        <div className={classes.accordion} onClick={toggle}>
            <p>{collection.name}</p>
            <div className={cx(classes.content, {[classes.show]: isToggled})}>
                {collection.requests.map((request) => (<li>{request.url}</li>))}
            </div>
        </div>
    )
}

export default Collection
