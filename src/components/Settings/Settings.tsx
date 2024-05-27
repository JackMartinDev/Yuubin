import { Box, Button, Checkbox, Divider, Group, Switch, Text, TextInput, useMantineColorScheme } from "@mantine/core"
import { moonIcon, sunIcon } from "./Icons"
import { invoke } from "@tauri-apps/api/tauri"
import snakecaseKeys from "snakecase-keys"
import { notifications } from "@mantine/notifications"
import { open as openTauri } from '@tauri-apps/api/dialog';
import { appDataDir } from '@tauri-apps/api/path';
import { isNotEmpty, useForm } from "@mantine/form"
import { Combobox, Image, Input, InputBase, useCombobox } from "@mantine/core";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { updateSettings } from "../../configSlice"
import { useTranslation } from "react-i18next"
import i18next from 'i18next';

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

type Props = {
    closeModal: () => void
}

const Settings = ({closeModal}: Props) => {
    const {language, theme, dataPath, preserveOpenTabs, activeTabs} = useSelector((state: RootState) => state.config)
    const dispatch = useDispatch();
    const { t } = useTranslation()
    const { setColorScheme } = useMantineColorScheme();

    const form = useForm({
        initialValues: {
            language,
            theme: theme === "dark" ? true : false,
            dataPath,
            preserveOpenTabs
        },

        validate: {
            dataPath: isNotEmpty(t("data_path_required")),
        },
    });

    const [submittedValues, setSubmittedValues] = useState<typeof form.values>(form.values);


    const selectedOption = languages.find((item) => item.value === form.getValues().language);
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const onSubmitHandler = (values: typeof form.values) => {
        setSubmittedValues(values)
        const {language, theme, dataPath, preserveOpenTabs} = form.getValues()
        const parsedTheme = theme ? "dark" : "light"

        const config: Config = {preserveOpenTabs, dataPath, language, theme: parsedTheme}

        console.log(config)
        invoke('edit_config', {data: JSON.stringify(snakecaseKeys(config))})
            .then((res) => {
                if(!res.error){
                    dispatch(updateSettings({preserveOpenTabs, dataPath, language, theme: parsedTheme}))
                    i18next.changeLanguage(language)
                    setColorScheme(parsedTheme)
                    closeModal();

                    notifications.show({
                        title: t("success"),
                        message: t("update_config_success"),
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
            form.setValues({dataPath: selected})
        }
    }

    return(
        <form onSubmit={form.onSubmit((values) => onSubmitHandler(values))}>
            <Checkbox
                {...form.getInputProps('preserveOpenTabs', { type: "checkbox" })}
                key={form.key('preserveOpenTabs')}
                label={t("preserve_open_tabs")} 
                size="md"/>
            <Group align="end" gap={4}>
                <TextInput
                    w="30%"
                    readOnly
                    miw={300}
                    {...form.getInputProps('dataPath')}
                    key={form.key('dataPath')}
                    mt="md"
                    label={t("collection_path")}
                />
                <Button onClick={selectDirectory}>
                    {t("browse")}
                </Button>
            </Group>
            <Divider mt="lg"/>
            <Text fw={500} size="lg" mt="md">{t("display_settings")}</Text>

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
                        label={t("language")}
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
                                <Input.Placeholder>{t("select_language")}</Input.Placeholder>
                            )}
                    </InputBase>
                </Combobox.Target>

                <Combobox.Dropdown>
                    <Combobox.Options>{options}</Combobox.Options>
                </Combobox.Dropdown>
            </Combobox>

            <Text size="sm" fw={500} mt={16}>{t("theme")}</Text>
            <Box w={65}>
                <Switch 
                    {...form.getInputProps('theme', { type: "checkbox" })}
                    key={form.key('theme')}
                    size="lg" 
                    color="dark.4" 
                    onLabel={sunIcon} 
                    offLabel={moonIcon} />
            </Box>
            <Button type="submit" mt={16}>{t("apply")}</Button>
        </form>
    )
}

export default Settings
