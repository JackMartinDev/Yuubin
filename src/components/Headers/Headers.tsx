import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { IconTrash } from "@tabler/icons-react";
import { ActionIcon, Button, Checkbox, Flex, Grid, TextInput } from "@mantine/core";

type Props = {
    header: KeyValuePair[] | undefined, 
    onHeaderChange: Dispatch<SetStateAction<KeyValuePair[]>>,
}


const Headers = ( {header, onHeaderChange}:Props) => {
    const [headers, setHeaders] = useState<KeyValuePair[]>(header ? header : []);

    useEffect(() => {
        onHeaderChange(headers);
    }, [headers, onHeaderChange]);


    const incrementheaderCount = () =>{
        setHeaders([...headers, {key: "", value: "", checked: true}]);
    }

    const inputChangeHandler = (index: number, field:string, newValue: string) => {
        const newArray = headers.map((header, headerIndex) =>
            index === headerIndex ? { ...header, [field]: newValue } : header
        );
        setHeaders(newArray);
    };

    const checkChangeHandler = (index: number, checked: boolean) => {
        const newArray = headers.map((header, headerIndex) =>
            index === headerIndex ? { ...header, checked } : header
        );
        setHeaders(newArray);
    }


    const removeheader = (index: number) =>{
        const newArray = headers.filter((_header, i) => i !== index)
        setHeaders(newArray)
    }

    const headerInput = headers.map((header, index) => (
        <>
            <Grid.Col span={4}>
                <TextInput value={header.key} onChange={(e) => inputChangeHandler(index, "key" , e.target.value)}/>
            </Grid.Col>

            <Grid.Col span={6}>
                <TextInput value={header.value} onChange={(e) => inputChangeHandler(index, "value" ,e.target.value)}/>
            </Grid.Col>
            <Grid.Col span={2}>
                <Flex align="center" direction="row" justify="space-evenly" wrap="wrap" h="100%">
                    <Checkbox size="xs"
                        checked={headers[index].checked}
                        onChange={(event) => checkChangeHandler(index, event.target.checked)}
                    />
                    <ActionIcon
                        variant="default" 
                        aria-label="Delete"
                        onClick={() => removeheader(index)}
                    >
                        <IconTrash style={{ width: '80%', height: '70%' }} stroke={1.5} />
                    </ActionIcon>
                </Flex>

            </Grid.Col>
        </>
    ))

    return(
        <div>
            <Grid mb={16} gutter={8}>
                <Grid.Col span={4}>
                    Name
                </Grid.Col>

                <Grid.Col span={6}>
                    Value
                </Grid.Col>

                <Grid.Col span={2} >
                </Grid.Col>
                {headerInput}
            </Grid>

            <Button onClick={incrementheaderCount} variant="default" color="gray">
                + Add Header
            </Button>
        </div>
    )
}

export default Headers
