import classes from "./Request.module.css"
import { useDispatch, useSelector } from "react-redux"
import { updateActiveRequest, updateRequests, updatefiles } from "../../requestSlice"
import { ActionIcon, Group, Text } from "@mantine/core"
import { IconDots } from "@tabler/icons-react"
import { useHover } from "@mantine/hooks"
import { Menu,  rem } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { RootState } from "../../store/store"

type Props = {
    request: YuubinRequest,  
}

const Request = ({ request }:Props) => {
    const dispatch = useDispatch();
    const { hovered, ref } = useHover();
    const activeRequests = useSelector((state: RootState) => state.request.activeRequests)
    const files = useSelector((state: RootState) => state.request.files)
    const activeTab = useSelector((state: RootState) => state.request.activeRequest)

    const onClickHandler = () => {
        const opened = activeRequests.includes(request.meta.id)

        if(!opened) {
            const newTabs = [...activeRequests, request.meta.id]
            dispatch(updateRequests(newTabs))
        }

        if(activeTab != request.meta.id){
            dispatch(updateActiveRequest(request.meta.id));
        }
    }

    const deleteHandler = (event: React.MouseEvent) => {
        event.stopPropagation()
        const newTabs = activeRequests.filter(id => id!== request.meta.id)
        const newCollections = files.map(collection => {
            // Filter out the request with the given ID from each collection
            const filteredRequests = collection.requests.filter(req => req.meta.id !== request.meta.id);

            // Return a new collection object with the updated requests array
            return {
                ...collection,
                requests: filteredRequests
            };
        })
        dispatch(updatefiles(newCollections))
        dispatch(updateRequests(newTabs))

        if(activeTab === request.meta.id){
            dispatch(updateActiveRequest(newTabs[newTabs.length -1]))
        }

        console.log(newCollections)
        //.filter(collection => collection.requests.length > 0); // Optionally, remove collections that are empty after deletion 
    }

    return(
        <Group className={classes.request} onClick={onClickHandler} justify="space-between" ref={ref}>
            <Text>{request.method} {request.meta.name}</Text>
            <Menu shadow="md" width={200}>
                <Menu.Target>
                    <ActionIcon onClick={(event => (event.stopPropagation()))} variant="transparent" color="dark">
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
                        onClick={event => {deleteHandler(event)}}
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
