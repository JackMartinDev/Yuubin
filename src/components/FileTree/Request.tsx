import classes from "./Request.module.css"
import { useDispatch } from "react-redux"
import { updateUrl, updateVerb, updateBody } from "../../requestSlice"
import { ActionIcon, Group, Text } from "@mantine/core"
import { IconDots } from "@tabler/icons-react"
import { useHover } from "@mantine/hooks"
import { Menu,  rem } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';

type Props = {
    request: YuubinRequest,  
    onChange: (val:string | null) => void
}

const Request = ({request, onChange}:Props) => {
    const dispatch = useDispatch();
    const { hovered, ref } = useHover();

    const onClickHandler = () => {
        dispatch(updateUrl(request.url));
        dispatch(updateVerb(request.method));
        dispatch(updateBody(request.body));
    }
    return(
        <Group className={classes.request} onClick={() => onChange(request.meta.id)} justify="space-between" ref={ref}>
            <Text>{request.method} {request.meta.name}</Text>
            <Menu shadow="md" width={200}>
                <Menu.Target>
                    <ActionIcon variant="transparent" color="dark">
                        <IconDots style={{ width: '70%', height: '70%' }} stroke={1.5} />
                    </ActionIcon>

                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item>
                        Rename
                    </Menu.Item>
                    <Menu.Item>
                        Clone
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
    )
}
export default Request
