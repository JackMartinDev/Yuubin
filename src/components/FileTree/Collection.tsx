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
import { useTranslation } from "react-i18next";

type Props = {
    collection: Collection,
}

const Collection = ({ collection }: Props): JSX.Element => {
    const [isToggled, setIsToggled] = useState(false);
    const { hovered, ref } = useHover();
    const [opened, { open, close }] = useDisclosure(false);
    const { t } = useTranslation();

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
            name: isNotEmpty(t("request_name_required")),
        },
    });

    const [_submittedValues, setSubmittedValues] = useState<typeof form.values>(form.values);

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
            title: t("delete_collection"),
            children: (
                <Text size="md">
                    {t("delete_collection_warning", {name: collection.name})}
                </Text>
            ),
            labels: { confirm: t("delete_collection"), cancel: t("cancel") },
            centered: true,
            confirmProps: { color: 'red' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => deleteHandler(),
        });
    }

    const deleteHandler = () => {
        invoke<TauriResponse>('delete_directory', {collection: collection.name})
            .then((response) => {
                if(!response.error){
                    const collectionIds = collection.requests.map(req =>  req.meta.id)
                    const newTabs = activeRequests.filter(id => !collectionIds.includes(id))
                    const newCollections = files.filter(col => col.name !== collection.name)                        

                    dispatch(updatefiles(newCollections))
                    dispatch(updateRequests(newTabs))

                    if(collectionIds.includes(activeTab)){
                        dispatch(updateActiveRequest(newTabs[newTabs.length -1]))
                    }

                    notifications.show({
                        title: t("success"),
                        message: t("delete_collection_success"),
                        color: 'green'
                    })

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

        invoke<TauriResponse>('create_file', {data: JSON.stringify(newRequest), collection: collection.name})
            .then((response) => {
                if(!response.error){
                    dispatch(updatefiles(newFiles))
                    dispatch(updateRequests([...requests, id]))
                    dispatch(updateActiveRequest(id))
                    closeModal()

                    notifications.show({
                        title: t("success"),
                        message: t("create_request_success"),
                        color: 'green'
                    })

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

    return(
        <Box mb={3}>
            <Modal opened={opened} onClose={closeModal} title={t("new_request")} centered size="lg">
                <form onSubmit={form.onSubmit((values) => addRequestHandler(values))}>
                    <TextInput 
                        {...form.getInputProps('name')}
                        key={form.key('name')}
                        mb="sm" 
                        label={t("request_name")} 
                    />
                    <Flex gap={10} mb="sm">
                        <Select
                            {...form.getInputProps('method')}
                            key={form.key('method')}
                            label={t("method")}
                            w={150}
                            withCheckIcon={false}
                            allowDeselect={false}
                            withScrollArea={false}
                            data={['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD']}
                        />
                        <TextInput 
                            label={t("url")}
                            type="url"
                            w="100%" 
                            {...form.getInputProps('url')}
                            key={form.key('url')}
                        />
                    </Flex>
                    <Flex justify="right" gap="sm">
                        <Button variant="light" color="gray" onClick={closeModal}>{t("cancel")}</Button>
                        <Button variant="default" color="gray" type="submit">{t("create")}</Button>
                    </Flex>
                </form>

            </Modal>
            <Group justify="space-between" className={classes.collection} onClick={toggle} ref={ref}>
                <Flex justify="left" align="center" ml="xs">
                    <IconChevronRight size={16} stroke={2} className={cx(classes.icon, {[classes.toggle]: isToggled})}/>
                    <Text>{collection.name}</Text>
                </Flex>
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
                            {t("add_request")}
                        </Menu.Item>
                        <Menu.Item
                            leftSection={<IconBallpen style={{ width: rem(16), height: rem(16)}}/>}
                            onClick={event => renameHandler(event)}
                        >
                            {t("rename")}
                        </Menu.Item>
                        <Menu.Item
                            color="red"
                            leftSection={<IconTrash style={{ width: rem(16), height: rem(16) }} />}
                            onClick={event => {openDeleteModal(event)}}
                        >
                            {t("delete")}
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
