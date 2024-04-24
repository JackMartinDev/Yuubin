import classes from "./Request.module.css"
import { useDispatch, useSelector } from "react-redux"
import { updateActiveRequest, updateRequests, updatefiles } from "../../requestSlice"
import { ActionIcon, Group, Text } from "@mantine/core"
import { IconDots } from "@tabler/icons-react"
import { useHover } from "@mantine/hooks"
import { Menu,  rem } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';
import { RootState } from "../../store/store";
import { invoke } from '@tauri-apps/api/tauri';

type Props = {
    request: YuubinRequest,
    collectionName: string
}

const Request = ({ request, collectionName }:Props) => {
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

    const openDeleteModal = (event: React.MouseEvent) =>{
        event.stopPropagation()

        modals.openConfirmModal({
            title: "Delete Request",
            children: (
                <Text size="md">
                    You are about to delete a request from the {collectionName} collection. 
                    Are you sure you want to proceed?
                </Text>
            ),
            labels: { confirm: 'Delete Request', cancel: 'Cancel' },
            centered: true,
            confirmProps: { color: 'red' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => deleteHandler(),
        });
    }

    const deleteHandler = () => {
        let requestName = request.meta.name;

        invoke('delete_file', {collection: collectionName, request: requestName})
            .then((message) => {
                if(message === "Success"){
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
                }else{
                    console.log(message) 
                }
            })
    }

    return(
        <Group className={classes.request} onClick={onClickHandler} justify="space-between" ref={ref}>
            <Text>{request.method} {request.meta.name}</Text>
            <Menu shadow="md" width={200}>
                <Menu.Target>
                    <ActionIcon onClick={(event => (event.stopPropagation()))} variant="transparent" color="dark" style={hovered ? {visibility:"visible"}: {visibility:"hidden"}}>
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
                    <Menu.Item
                        color="red"
                        onClick={event => {openDeleteModal(event)}}
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
