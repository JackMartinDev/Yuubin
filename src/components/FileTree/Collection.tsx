import React, { useState } from "react";
import classes from "./Collection.module.css" 
import cx from "clsx"
import Request from "./Request";
import { IconChevronRight } from "@tabler/icons-react"
import { Box } from "@mantine/core";

type Props = {
    collection: Collection,
   }

const Collection = ({ collection }: Props): JSX.Element => {
    const [isToggled, setIsToggled] = useState(false);
    
    const toggle = () => {
        setIsToggled(!isToggled)
    }

    return(
        <Box mb={3}>
            <div className={classes.accordion} onClick={toggle}>
                <span><IconChevronRight size={16} stroke={2} className={cx(classes.icon, {[classes.toggle]: isToggled})}/></span>
                <p>{collection.name}</p>
            </div>
            <div className={cx(classes.content, {[classes.show]: isToggled})}>
                {collection.requests.map((request) => <Request key={request.meta.id} request={request} />)}
            </div>
        </Box>
    )
}

export default React.memo(Collection)
