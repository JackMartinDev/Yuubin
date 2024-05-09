import { Combobox, Group, Image, Input, InputBase, Text, useCombobox } from "@mantine/core";
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

const LanguageSelect = () => {
    const [value, setValue] = useState<string | null>(null);
    const selectedOption = languages.find((item) => item.value === value);

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });


    return(
        <Combobox
            store={combobox}
            withinPortal={false}
            onOptionSubmit={(val) => {
                setValue(val);
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
    );
}
export default LanguageSelect
