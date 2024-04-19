import React, { useState } from "react";
import classes from "./Collection.module.css" 
import cx from "clsx"
import Request from "./Request";
import { IconChevronRight, IconDots, IconTrash } from "@tabler/icons-react"
import { ActionIcon, Box, Button, Flex, Group, Menu, Modal, Select, Text, TextInput, rem } from "@mantine/core";
import { useDisclosure, useHover } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { updateActiveRequest, updatefiles, updateRequests } from "../../requestSlice";

type Props = {
    collection: Collection,
}

const Collection = ({ collection }: Props): JSX.Element => {
    const [isToggled, setIsToggled] = useState(false);
    const { hovered, ref } = useHover();
    const [opened, { open, close }] = useDisclosure(false);

    const [requestName, setRequestName] = useState<string>("");
    const [url, setUrl] = useState<string>("");
    const [method, setMethod] = useState<HttpVerb>("GET");

    const files = useSelector((state: RootState) => state.request.files)
    const requests = useSelector((state: RootState) => state.request.activeRequests)
    const dispatch = useDispatch();


    const toggle = () => {
        setIsToggled(!isToggled)
    }

    const openModalHandler = (event: React.MouseEvent) =>{
        event.stopPropagation();
        open();
    }

    const addRequestHandler = async() => {
        const id = crypto.randomUUID()
        const meta = {name: requestName, id}
        const newRequest = {method, url, meta}
        const newFiles = files.map(col => {
            if (col.name === collection.name) {
                return {
                    ...col,
                    requests: [...col.requests, newRequest]
                };
            }
            return col;         
        });
        dispatch(updatefiles(newFiles))
        dispatch(updateRequests([...requests, id]))
        dispatch(updateActiveRequest(id))
        close()
    }

    return(
        <Box mb={3}>
            <Modal opened={opened} onClose={close} title="New Request" centered size="md">
                <TextInput mb="sm" label="Request Name" value={requestName} onChange={(e) => setRequestName(e.target.value)}/>
                <Text fw={500} size="sm">URL</Text>
                <Flex gap={10} mb="sm">
                    <Select
                        w={150}
                        withCheckIcon={false}
                        value={method}
                        onChange={(value, _option) => setMethod(value as HttpVerb)}
                        allowDeselect={false}
                        withScrollArea={false}
                        data={['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD']}
                    />
                    <TextInput type="url" w="100%" value={url} onChange={(e) => setUrl(e.target.value)}/>
                </Flex>
                <Flex justify="right" gap="sm">
                    <Button variant="light" color="gray" onClick={close}>Cancel</Button>
                    <Button variant="default" color="gray" onClick={addRequestHandler}>Create</Button>
                </Flex>

            </Modal>
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
                        <Menu.Item
                            onClick={event => openModalHandler(event)}
                        >
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
