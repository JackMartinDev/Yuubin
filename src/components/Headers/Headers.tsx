import { useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { updateParams } from "../../requestSlice";
import { debounce } from "../../utils/utils"
import { IconTrash } from "@tabler/icons-react";
import { ActionIcon, Button, Checkbox, Flex, Grid, TextInput } from "@mantine/core";

const Headers = () => {
    const init = useSelector((state: RootState) => state.request.queryParams)
    const [headers, setHeaders] = useState<{key: string, value: string}[]>(init);
    const dispatch = useDispatch();

    const incrementheaderCount = () =>{
        setHeaders([...headers, {key: "", value: ""}]);
    }

    const debouncedDispatch = useCallback(debounce((value: typeof headers) => {
        dispatch(updateParams(value))
    }, 500), []);

    const inputChangeHandler = (index: number, field:string, newValue: string) => {
        const newArray = headers.map((header, headerIndex) =>
            index === headerIndex ? { ...header, [field]: newValue } : header
        );
        setHeaders(newArray);
        debouncedDispatch(newArray);
    };

    //TODO: Modify so it doesnt delete all with same key
    const removeheader = (key: string) =>{
        const newArray = headers.filter((header) => header.key !== key)
        setHeaders(newArray)
        dispatch(updateParams(newArray))
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
                        defaultChecked
                    />
                    <ActionIcon
                        variant="default" 
                        aria-label="Delete"
                        onClick={() => removeheader(header.key)}

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