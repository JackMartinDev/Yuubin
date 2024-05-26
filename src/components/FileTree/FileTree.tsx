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
import { useTranslation } from "react-i18next";

interface Props {
    files: Collection[],
}

const FileTree = ({ files }: Props) => {
    const icon = <IconSearch style={{ width: rem(16), height: rem(16) }} />;
    const [opened, { open, close }] = useDisclosure(false);
    const localFiles = useSelector((state: RootState) => state.request.files)
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const form = useForm({
        initialValues: {
            name: '',
        },

        validate: {
            name: isNotEmpty(t("collection_name_required")),
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
                    notifications.show({
                        title: t("success"),
                        message: t("create_collection_success"),
                        color: 'green'
                    })

                }else{
                    notifications.show({
                        title: t("error"),
                        message: res.message,
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

    return (
        <>
            <Modal opened={opened} onClose={closeModal} title={t("new_collection")} centered size="lg">
                <form onSubmit={form.onSubmit((values) => addCollectionHandler(values))}>
                    <TextInput 
                        {...form.getInputProps('name')}
                        key={form.key('name')}
                        mb="sm" 
                        label={t("collection_name")} 

                    />
                    <Flex justify="right" gap="sm">
                        <Button variant="light" color="gray" onClick={closeModal}>{t("cancel")}</Button>
                        <Button variant="default" color="gray" type="submit">{t("create")}</Button>
                    </Flex>
                </form>
            </Modal>

            <Box>
                <Box m="xs">
                    <Title order={2}>{t("yuubin")}</Title>
                    <Button onClick={openModalHandler} variant="default" color="gray" mb="xs" w="100%">
                        {t("create_collection")}
                    </Button>
                </Box>
                {/*<TextInput placeholder="Search collections" leftSection={icon} mb="sm" m="xs"/>*/}
                {files.map(collection => (<Collection key={collection.name} collection={collection}/>))}
            </Box>
        </>
    )
}

export default FileTree
