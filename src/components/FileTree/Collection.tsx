import React, { useState } from "react";
import classes from "./Collection.module.css" 
import cx from "clsx"
import Request from "./Request";
import { IconChevronRight, IconDots, IconTrash } from "@tabler/icons-react"
import { ActionIcon, Box, Group, Menu, rem } from "@mantine/core";
import { useHover } from "@mantine/hooks";

type Props = {
    collection: Collection,
   }

const Collection = ({ collection }: Props): JSX.Element => {
    const [isToggled, setIsToggled] = useState(false);
    const { hovered, ref } = useHover();
    
    const toggle = () => {
        setIsToggled(!isToggled)
    }

    return(
        <Box mb={3}>
            <Group justify="space-between" className={classes.collection} onClick={toggle} ref={ref}>
            <div className={classes.accordion}>
                <span><IconChevronRight size={16} stroke={2} className={cx(classes.icon, {[classes.toggle]: isToggled})}/></span>
                <p>{collection.name}</p>
            </div>
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <ActionIcon onClick={(event => (event.stopPropagation()))} variant="transparent" color="dark" style={hovered ? {visibility:"visible"}: {visibility:"hidden"}}>
                            <IconDots style={{ width: '70%', height: '70%' }} stroke={1.5} />
                        </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Item>
                            Add request
                        </Menu.Item>
                        <Menu.Item>
                            Rename
                        </Menu.Item>
                        <Menu.Item>
                            Run
                        </Menu.Item>
                        <Menu.Item
                            color="red"
                            leftSection={<IconTrash style={{ width: rem(14), height: rem(14) }} />}
                        >
                            Delete
                        </Menu.Item>

                    </Menu.Dropdown>
                </Menu>
            </Group>

            <div className={cx(classes.content, {[classes.show]: isToggled})}>
                {collection.requests.map((request) => <Request key={request.meta.id} request={request} />)}
            </div>

        </Box>
    )
}

export default React.memo(Collection)
