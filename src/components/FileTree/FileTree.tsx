import { isNotEmpty, useForm } from "@mantine/form";
import Collection from "./Collection";
import { Box, Button, Flex, Modal, TextInput, Title, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { invoke } from "@tauri-apps/api/tauri";
import { updatefiles } from "../../requestSlice";
import { notifications } from "@mantine/notifications";

interface Props {
    files: Collection[],
}

//TODO Add an indicator for the selected request
const FileTree = ({ files }: Props) => {
    const icon = <IconSearch style={{ width: rem(16), height: rem(16) }} />;
    const [opened, { open, close }] = useDisclosure(false);
    const localFiles = useSelector((state: RootState) => state.request.files)
    const dispatch = useDispatch();

    const form = useForm({
        initialValues: {
            name: '',
        },

        validate: {
            name: isNotEmpty('Collection Name is a required field'),
        },
    });

    const [submittedValues, setSubmittedValues] = useState<typeof form.values>(form.values);

    const openModalHandler = (event: React.MouseEvent) =>{
        open();
    }

    const closeModal = () => {
        close();
        form.reset()
    }

    const addCollectionHandler = async(values: typeof form.values) => {
        setSubmittedValues(values)
        const formValues = form.getValues()

        const newCollection: Collection = {name: formValues.name, requests: []}
        const newFiles = [...localFiles, newCollection]

        invoke('create_directory', {collection: formValues.name})
            .then((res) => {
                if(!res.error){
                    dispatch(updatefiles(newFiles))
                    closeModal()
                }else{
                    notifications.show({
                        title: 'Error',
                        message: res.message,
                        color: 'red'
                    })
                }
            })
    }

    return (
        <>
            <Modal opened={opened} onClose={closeModal} title="New Collection" centered size="lg">
                <form onSubmit={form.onSubmit((values) => addCollectionHandler(values))}>
                    <TextInput 
                        {...form.getInputProps('name')}
                        key={form.key('name')}
                        mb="sm" 
                        label="Collection Name" 
                        placeholder="Collection Name" 

                    />
                    <Flex justify="right" gap="sm">
                        <Button variant="light" color="gray" onClick={closeModal}>Cancel</Button>
                        <Button variant="default" color="gray" type="submit">Create</Button>
                    </Flex>
                </form>

            </Modal>

            <Box bg="#F5F5F5" h="100%">
                <Title order={1}>Collections</Title>
                <Button onClick={openModalHandler} variant="default" color="gray">
                    Add collection
                </Button>
                <TextInput placeholder="Search collections" leftSection={icon} mb="sm" m="xs"/>
                {files.map(collection => (<Collection key={collection.name} collection={collection}/>))}
            </Box>
        </>
    )
}

export default FileTree
