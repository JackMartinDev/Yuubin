import { Box, Button, Checkbox, Divider, Group, Switch, Text, TextInput } from "@mantine/core"
import { moonIcon, sunIcon } from "./Icons"
import { invoke } from "@tauri-apps/api/tauri"
import snakecaseKeys from "snakecase-keys"
import { notifications } from "@mantine/notifications"
import { open as openTauri } from '@tauri-apps/api/dialog';
import { appDataDir } from '@tauri-apps/api/path';
import { isNotEmpty, useForm } from "@mantine/form"

import { Combobox, Image, Input, InputBase, useCombobox } from "@mantine/core";
import { useState } from "react";

interface Item {
    icon: string;
    value: string;
    label: string;
}

const languages: Item[] = [
    { icon: '/icons/GB.png', value: 'en', label: 'English' },
    { icon: '/icons/JP.png', value: 'jp', label: '日本語' },
];

const SelectOption = ({ icon, label }: Item) =>{
    return (
        <Group>
            <Image h="20" w="auto" src={icon}/>
            <div>
                <Text fz="sm" fw={400}>
                    {label}
                </Text>
            </div>
        </Group>
    );
}

const options = languages.map((item) => (
    <Combobox.Option value={item.value} key={item.value}>
        <SelectOption {...item} />
    </Combobox.Option>
));

const Settings = () => {
    const [selectedFolder, setSelectedFolder] = useState<string>("../data")

    //TODO have default values come from backend config file
    const form = useForm({
        initialValues: {
            language: 'en',
            theme: true,
            dataPath: selectedFolder,
            saveOnQuit: true,
            preserveOpenTabs: true
        },

        validate: {
            dataPath: isNotEmpty('Data Path is a required field'),
        },
    });

    const [submittedValues, setSubmittedValues] = useState<typeof form.values>(form.values);


    const selectedOption = languages.find((item) => item.value === form.getValues().language);
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const onSubmitHandler = (values: typeof form.values) => {
        setSubmittedValues(values)
        const formValues = form.getValues()
        const theme = formValues.theme ? "dark" : "light"

        const config: Config = {saveOnQuit: formValues.saveOnQuit, preserveOpenTabs: formValues.preserveOpenTabs, activeTabs: ["1","2"], dataPath: formValues.dataPath,language: formValues.language, theme}
        console.log(config)
        invoke('edit_config', {data: JSON.stringify(snakecaseKeys(config))})
            .then((res) => {
                if(!res.error){
                    //Update config redux state here

                    notifications.show({
                        title: 'Success',
                        message: "Config succesfully updated",
                        color: 'green'
                    })
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

    const selectDirectory = async() => {
        const selected = await openTauri({
            directory: true,
            defaultPath: await appDataDir(),
        });
        if (Array.isArray(selected)){
        }
        else if (selected === null) {
            // user cancelled the selection
            console.log("2",selected)
        } else {
            // user selected a single directory
            console.log("3",selected)
            setSelectedFolder(selected)
            form.setValues({dataPath: selected})
        }
    }

    return(
        <form onSubmit={form.onSubmit((values) => onSubmitHandler(values))}>
            <Checkbox
                {...form.getInputProps('preserveOpenTabs', { type: "checkbox" })}
                key={form.key('preserveOpenTabs')}
                label="Preserve open tabs" 
                size="md"/>
            <Checkbox 
                {...form.getInputProps('saveOnQuit', { type: "checkbox" })}
                key={form.key('saveOnQuit')}
                label="Save on quit" 
                mt="md" 
                size="md"/>
            <Group align="end" gap={4}>
                <TextInput
                    w="30%"
                    readOnly
                    miw={300}
                    {...form.getInputProps('dataPath')}
                    key={form.key('dataPath')}
                    mt="md"
                    label="Collection data path"
                />
                <Button onClick={selectDirectory}>
                    Browse
                </Button>
            </Group>
            <Divider mt="lg"/>
            <Text fw={500} size="lg" mt="md" >Display Settings</Text>

            <Combobox
                store={combobox}
                withinPortal={false}
                onOptionSubmit={(val) => {
                    form.setValues({language: val})
                    combobox.closeDropdown();
                }}
            >
                <Combobox.Target>
                    <InputBase
                        component="button"
                        label="Language"
                        type="button"
                        pointer
                        rightSection={<Combobox.Chevron />}
                        onClick={() => combobox.toggleDropdown()}
                        rightSectionPointerEvents="none"
                        multiline
                        w="30%"
                        miw={300}
                    >
                        {selectedOption ? (
                            <SelectOption {...selectedOption} />
                        ) : (
                                <Input.Placeholder>Select Language</Input.Placeholder>
                            )}
                    </InputBase>
                </Combobox.Target>

                <Combobox.Dropdown>
                    <Combobox.Options>{options}</Combobox.Options>
                </Combobox.Dropdown>
            </Combobox>

            <Text size="sm" fw={500} mt={16}>Theme</Text>
            <Box w={65}>
                <Switch 
                    {...form.getInputProps('theme', { type: "checkbox" })}
                    key={form.key('theme')}
                    size="lg" 
                    color="dark.4" 
                    onLabel={sunIcon} 
                    offLabel={moonIcon} />
            </Box>
            <Button type="submit" mt={16} >Apply Changes</Button>
        </form>
    )

}

export default Settings
