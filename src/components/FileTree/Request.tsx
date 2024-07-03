import classes from "./Request.module.css"
import { useDispatch, useSelector } from "react-redux"
import { updateActiveRequest, updateRequests, updatefiles } from "../../requestSlice"
import { ActionIcon, Flex, Text, Tooltip, useMantineColorScheme } from "@mantine/core"
import { IconBallpen, IconDots, IconPlayerPlay } from "@tabler/icons-react"
import { useHover } from "@mantine/hooks"
import { Menu,  rem } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';
import { RootState } from "../../store/store";
import { invoke } from '@tauri-apps/api/tauri';
import { notifications } from "@mantine/notifications"
import MethodIcon from "../MethodIcon"
import { useTranslation } from "react-i18next"

type Props = {
    request: YuubinRequest,
    collectionName: string
}

const Request = ({ request, collectionName }:Props) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { hovered, ref } = useHover();
    const { colorScheme } = useMantineColorScheme();
    const files = useSelector((state: RootState) => state.request.files)
    const activeRequests = useSelector((state: RootState) => state.request.activeRequests)
    const activeTab = useSelector((state: RootState) => state.request.activeRequest)

    const onClickHandler = () => {
        const opened = activeRequests.includes(request.meta.id)
        console.log(activeRequests)

        if(!opened){
            if(activeRequests.length >= 6){
                const newTabs = [...activeRequests.slice(0, -1), request.meta.id]
                localStorage.setItem("activeTabs", JSON.stringify(newTabs))
                dispatch(updateRequests(newTabs))
            }else{
                const newTabs = [...activeRequests, request.meta.id]
                localStorage.setItem("activeTabs", JSON.stringify(newTabs))
                dispatch(updateRequests(newTabs))
            }
        }

        if(activeTab != request.meta.id){
            dispatch(updateActiveRequest(request.meta.id));
        }
    }

    const openDeleteModal = (event: React.MouseEvent) =>{
        event.stopPropagation()

        modals.openConfirmModal({
            title: t("delete_request"),
            children: (
                <Text size="md">
                   {t("delete_request_warning", {name: collectionName})}
                </Text>
            ),
            labels: { confirm: t("delete_request"), cancel: t("cancel") },
            centered: true,
            confirmProps: { color: 'red' },
            onConfirm: ()=> deleteHandler(),
        });
    }

    const deleteHandler = () => {
        let requestName = request.meta.name;

        invoke<TauriResponse>('delete_file', {collection: collectionName, request: requestName})
            .then((response) => {
                if(!response.error){
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
                        title: t("success"),
                        message: t("delete_request_success"),
                        color: 'green'
                    })

                    //Add this to a config option
                    //.filter(collection => collection.requests.length > 0); // Optionally, remove collections that are empty after deletion 

                    //go through and change all error messages to be defined on the front end.
                }else{
                    notifications.show({
                        title: t("error"),
                        message: response.message,
                        color: 'red'
                    })
                }
            }).catch((error) => 
                notifications.show({
                    title: t("unexpected_error"),
                    message: error,
                    color: 'red'
                })
            )
    }

    const renameHandler = (event: React.MouseEvent) => {
        event.stopPropagation()
        notifications.show({
            title: t("in_development"),
            message: t("in_development_message"),
            color: 'yellow'
        })
    }
    const runHandler = (event: React.MouseEvent) => {
        event.stopPropagation()
        notifications.show({
            title: t("in_development"),
            message: t("in_development_message"),
            color: 'yellow'
        })
    }

    const getRequestClassName = () => {
        const isSelected = activeTab === request.meta.id; 
        const isDarkMode = colorScheme === "dark";

        if (isSelected) {
            return isDarkMode ? classes.darkSelected : classes.lightSelected
        }

        return isDarkMode ? classes.dark : classes.light
    }

    return(
        <Flex 
            pl="lg"  
            onClick={onClickHandler} 
            justify="space-between" 
            align="center" 
            ref={ref} 
            className={getRequestClassName()}
        >
            <Tooltip label={request.meta.name} openDelay={300} position="right" offset={{ mainAxis: -20, crossAxis: -35 }}>
                <Text className={classes.truncate} size="sm" ml="xs"><MethodIcon method={request.method}/> {request.meta.name}</Text>
            </Tooltip>
            <Menu shadow="md" width={200}>
                <Menu.Target>
                    <ActionIcon 
                        onClick={(event => (event.stopPropagation()))} 
                        variant="transparent" 
                        color="dark" 
                        style={hovered ? {visibility:"visible"}: {visibility:"hidden"}}>
                        <IconDots style={{ width: '85%', height: '85%' }} stroke={2}/>
                    </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item
                        leftSection={<IconPlayerPlay style={{ width: rem(16), height: rem(16)}}/>}
                        onClick={event => {runHandler(event)}}
                    >
                        {t("run")}
                    </Menu.Item>
                    <Menu.Item
                        leftSection={<IconBallpen style={{ width: rem(16), height: rem(16)}}/>}
                        onClick={event => {renameHandler(event)}}
                    >
                        {t("rename")}
                    </Menu.Item>
                    <Menu.Item
                        color="red"
                        onClick={event => {openDeleteModal(event)}}
                        leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} />}
                    >
                        {t("delete")}
                    </Menu.Item>

                </Menu.Dropdown>
            </Menu>
        </Flex>
    )
}
export default Request
