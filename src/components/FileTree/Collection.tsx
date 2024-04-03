import { useState } from "react";
import classes from "./Collection.module.css" 
import cx from "clsx"
import Request from "./Request";
import { IconChevronRight } from "@tabler/icons-react"
import { Box } from "@mantine/core";

type Props = {
    collection: Collection 
    onChange: (val:string | null) => void
}

const Collection = ({collection, onChange}: Props): JSX.Element => {
    const [isToggled, setIsToggled] = useState(false);
    
    const toggle = () => {
        setIsToggled(!isToggled)
    }

    //TODO: On click set the values of this request to redux of the current }
    return(
        <Box mb={3}>
            <div className={classes.accordion} onClick={toggle}>
                <span><IconChevronRight size={16} stroke={2} className={cx(classes.icon, {[classes.toggle]: isToggled})}/></span>
                <p>{collection.name}</p>
            </div>
            <div className={cx(classes.content, {[classes.show]: isToggled})}>
                {collection.requests.map((request) => <Request request={request} onChange={onChange}/>)}
            </div>
        </Box>
    )
}

export default Collection
