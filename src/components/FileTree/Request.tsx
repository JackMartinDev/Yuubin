import classes from "./Request.module.css"
import { useDispatch, useSelector } from "react-redux"
import { updateActiveRequest, updateRequests, updatefiles } from "../../requestSlice"
import { ActionIcon, Flex, Group, Text, Tooltip } from "@mantine/core"
import { IconBallpen, IconDots, IconPlayerPlay, IconPlayerPlayFilled } from "@tabler/icons-react"
import { useHover } from "@mantine/hooks"
import { Menu,  rem } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';
import { RootState } from "../../store/store";
import { invoke } from '@tauri-apps/api/tauri';
import { notifications } from "@mantine/notifications"
import MethodIcon from "../MethodIcon"

type Props = {
    request: YuubinRequest,
    collectionName: string
}

const Request = ({ request, collectionName }:Props) => {
    const dispatch = useDispatch();
    const { hovered, ref } = useHover();
    const files = useSelector((state: RootState) => state.request.files)
    const activeRequests = useSelector((state: RootState) => state.request.activeRequests)
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
            onConfirm: ()=> deleteHandler(),
        });
    }

    const deleteHandler = () => {
        let requestName = request.meta.name;

        invoke('delete_file', {collection: collectionName, request: requestName})
            .then((res) => {
                if(!res.error){
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

                    notifications.show({
                        title: 'Success',
                        message: "Request succesfully deleted",
                        color: 'green'
                    })

                    //Add this to a config option
                    //.filter(collection => collection.requests.length > 0); // Optionally, remove collections that are empty after deletion 

                }else{
                    notifications.show({
                        title: 'Error',
                        message: res.message,
                        color: 'red'
                    })
                }
            }).catch((error) => 
                notifications.show({
                    title: 'Unexpected Error',
                    message: error,
                    color: 'red'
                })
            )
    }

    const renameHandler = (event: React.MouseEvent) => {
        event.stopPropagation()
        notifications.show({
            title: 'In development',
            message: "This feature is currently not available",
            color: 'yellow'
        })
    }
    const runHandler = (event: React.MouseEvent) => {
        event.stopPropagation()
        notifications.show({
            title: 'In development',
            message: "This feature is currently not available",
            color: 'yellow'
        })
    }

    return(
        <Flex className={classes.request} 
            onClick={onClickHandler} 
            justify="space-between" 
            align="center" 
            ref={ref} 
            style={activeTab === request.meta.id ? {backgroundColor: '#cccaca'}: {}}
        >
            <Tooltip label={request.meta.name} openDelay={300} position="right" offset={{ mainAxis: -20, crossAxis: -35 }}>
                <Text className={classes.truncate} size="sm" ><MethodIcon method={request.method}/> {request.meta.name}</Text>
            </Tooltip>
            <Menu shadow="md" width={200}>
                <Menu.Target>
                    <ActionIcon 
                        onClick={(event => (event.stopPropagation()))} 
                        variant="transparent" 
                        color="dark" 
                        style={hovered ? {visibility:"visible"}: {visibility:"hidden"}}>
                        <IconDots style={{ width: '85%', height: '85%' }} stroke={2} />
                    </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item
                        leftSection={<IconPlayerPlay style={{ width: rem(16), height: rem(16)}}/>}
                        onClick={event => {runHandler(event)}}
                    >
                        Run
                    </Menu.Item>
                    <Menu.Item
                        leftSection={<IconBallpen style={{ width: rem(16), height: rem(16)}}/>}
                        onClick={event => {renameHandler(event)}}
                    >
                        Rename
                    </Menu.Item>
                    <Menu.Item
                        color="red"
                        onClick={event => {openDeleteModal(event)}}
                        leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} />}
                    >
                        Delete
                    </Menu.Item>

                </Menu.Dropdown>
            </Menu>
        </Flex>
    )
}
export default Request
