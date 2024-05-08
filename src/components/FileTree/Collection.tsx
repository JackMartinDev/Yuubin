import React, { useState } from "react";
import classes from "./Collection.module.css" 
import cx from "clsx"
import Request from "./Request";
import { IconBallpen, IconChevronRight, IconDots, IconPlus, IconTrash } from "@tabler/icons-react"
import { ActionIcon, Box, Button, Flex, Group, Menu, Modal, Select, Text, TextInput, rem } from "@mantine/core";
import { useDisclosure, useHover } from "@mantine/hooks";
import { isNotEmpty, useForm } from '@mantine/form';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { updateActiveRequest, updatefiles, updateRequests } from "../../requestSlice";
import { invoke } from "@tauri-apps/api/tauri";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";

type Props = {
    collection: Collection,
}

const Collection = ({ collection }: Props): JSX.Element => {
    const [isToggled, setIsToggled] = useState(false);
    const { hovered, ref } = useHover();
    const [opened, { open, close }] = useDisclosure(false);

    const files = useSelector((state: RootState) => state.request.files)
    const requests = useSelector((state: RootState) => state.request.activeRequests)
    const activeRequests = useSelector((state: RootState) => state.request.activeRequests)
    const activeTab = useSelector((state: RootState) => state.request.activeRequest)

    const dispatch = useDispatch();


    const toggle = () => {
        setIsToggled(!isToggled)
    }

    const form = useForm({
        initialValues: {
            name: 'Request_',
            method: 'GET',
            url: 'https://',
        },

        validate: {
            name: isNotEmpty('Request Name is a required field'),
        },
    });

    const [submittedValues, setSubmittedValues] = useState<typeof form.values>(form.values);

    const openModalHandler = (event: React.MouseEvent) =>{
        event.stopPropagation();
        open();
    }

    const closeModal = () => {
        close();
        form.reset()
    }


    const openDeleteModal = (event: React.MouseEvent) =>{
        event.stopPropagation()

        modals.openConfirmModal({
            title: "Delete Collection",
            children: (
                <Text size="md">
                    You are about to delete a the collection {collection.name} and all of its requests. 
                    Are you sure you want to proceed?
                </Text>
            ),
            labels: { confirm: 'Delete Collection', cancel: 'Cancel' },
            centered: true,
            confirmProps: { color: 'red' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => deleteHandler(),
        });
    }

    const deleteHandler = () => {
        invoke('delete_directory', {collection: collection.name})
            .then((res) => {
                if(!res.error){
                    const collectionIds = collection.requests.map(req =>  req.meta.id)
                    const newTabs = activeRequests.filter(id => !collectionIds.includes(id))
                    const newCollections = files.filter(col => col.name !== collection.name)                        

                    dispatch(updatefiles(newCollections))
                    dispatch(updateRequests(newTabs))

                    if(collectionIds.includes(activeTab)){
                        dispatch(updateActiveRequest(newTabs[newTabs.length -1]))
                    }

                    notifications.show({
                        title: 'Success',
                        message: "Collection succesfully deleted",
                        color: 'green'
                    })

                }else{
                    notifications.show({
                        title: 'Error',
                        message: res.message,
                        color: 'red'
                    })
                }
            })
    }

    const addRequestHandler = async(values: typeof form.values) => {
        setSubmittedValues(values)
        const formValues = form.getValues()

        const id = crypto.randomUUID() as string
        const meta: MetaData = {name: formValues.name, id}
        const newRequest:YuubinRequest = {
            method: formValues.method as HttpVerb, 
            url:formValues.url,
            body: '{}',
            headers: [],
            params: [],
            meta
        }
        const newFiles = files.map(col => {
            if (col.name === collection.name) {
                return {
                    ...col,
                    requests: [...col.requests, newRequest]
                };
            }
            return col;         
        });

        invoke('create_file', {data: JSON.stringify(newRequest), collection: collection.name})
            .then((res) => {
                if(!res.error){
                    dispatch(updatefiles(newFiles))
                    dispatch(updateRequests([...requests, id]))
                    dispatch(updateActiveRequest(id))
                    closeModal()

                    notifications.show({
                        title: 'Success',
                        message: "Request succesfully created",
                        color: 'green'
                    })

                }else{
                    notifications.show({
                        title: 'Error',
                        message: res.message,
                        color: 'red'
                    })
                }
            })
    }
    const renameHandler = (event: React.MouseEvent) => {
        event.stopPropagation()
        notifications.show({
            title: 'In development',
            message: "This feature is currently not available",
            color: 'yellow'
        })
    }

    return(
        <Box mb={3}>
            <Modal opened={opened} onClose={closeModal} title="New Request" centered size="lg">
                <form onSubmit={form.onSubmit((values) => addRequestHandler(values))}>
                    <TextInput 
                        {...form.getInputProps('name')}
                        key={form.key('name')}
                        mb="sm" 
                        label="Request Name" 
                        placeholder="Request Name" 

                    />
                    <Text fw={500} size="sm">URL</Text>
                    <Flex gap={10} mb="sm">
                        <Select
                            {...form.getInputProps('method')}
                            key={form.key('method')}
                            w={150}
                            withCheckIcon={false}
                            allowDeselect={false}
                            withScrollArea={false}
                            data={['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD']}
                        />
                        <TextInput 
                            type="url"
                            w="100%" 
                            {...form.getInputProps('url')}
                            key={form.key('url')}
                        />
                    </Flex>
                    <Flex justify="right" gap="sm">
                        <Button variant="light" color="gray" onClick={closeModal}>Cancel</Button>
                        <Button variant="default" color="gray" type="submit">Create</Button>
                    </Flex>
                </form>

            </Modal>
            <Group justify="space-between" className={classes.collection} onClick={toggle} ref={ref}>
                <div className={classes.accordion}>
                    <span><IconChevronRight size={16} stroke={2} className={cx(classes.icon, {[classes.toggle]: isToggled})}/></span>
                    <p>{collection.name}</p>
                </div>
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <ActionIcon onClick={(event => (event.stopPropagation()))} variant="transparent" color="dark" style={hovered ? {visibility:"visible"}: {visibility:"hidden"}}>
                            <IconDots style={{ width: '85%', height: '85%' }} stroke={2} />
                        </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Item
                            onClick={event => openModalHandler(event)}
                            leftSection={<IconPlus style={{ width: rem(16), height: rem(16) }} />}
                        >
                            Add request
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<IconBallpen style={{ width: rem(16), height: rem(16)}}/>}
                            onClick={event => renameHandler(event)}
                        >
                            Rename
                        </Menu.Item>
                        <Menu.Item
                            color="red"
                            leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} />}
                            onClick={event => {openDeleteModal(event)}}
                        >
                            Delete
                        </Menu.Item>

                    </Menu.Dropdown>
                </Menu>
            </Group>

            <div className={cx(classes.content, {[classes.show]: isToggled})}>
                {collection.requests.map((request) => <Request key={request.meta.id} request={request} collectionName={collection.name}  />)}
            </div>

        </Box>
    )
}

export default Collection
