import { useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { updateParams } from "../../requestSlice";
import { debounce } from "../../utils/utils"
import { IconTrash } from "@tabler/icons-react";
import { ActionIcon, Button, Checkbox, Flex, Grid, Group, TextInput } from "@mantine/core";

const QueryParams = () => {
    const init = useSelector((state: RootState) => state.request.queryParams)
    const [queries, setQueries] = useState<{key: string, value: string}[]>(init);
    const dispatch = useDispatch();

    const incrementQueryCount = () =>{
        setQueries([...queries, {key: "", value: ""}]);
    }

    const debouncedDispatch = useCallback(debounce((value: typeof queries) => {
        dispatch(updateParams(value))
    }, 500), []);

    const inputChangeHandler = (index: number, field:string, newValue: string) => {
        const newArray = queries.map((query, queryIndex) =>
            index === queryIndex ? { ...query, [field]: newValue } : query
        );
        setQueries(newArray);
        debouncedDispatch(newArray);
    };

    //TODO: Modify so it doesnt delete all with same key
    const removeQuery = (key: string) =>{
        const newArray = queries.filter((query) => query.key !== key)
        setQueries(newArray)
        dispatch(updateParams(newArray))
    }

    const queryInput = queries.map((query, index) => (
        <>
            <Grid.Col span={4}>
                <TextInput value={query.key} onChange={(e) => inputChangeHandler(index, "key" , e.target.value)}/>
            </Grid.Col>

            <Grid.Col span={6}>
                <TextInput value={query.value} onChange={(e) => inputChangeHandler(index, "value" ,e.target.value)}/>
            </Grid.Col>
            <Grid.Col span={2}>
                <Flex align="center" direction="row" justify="space-evenly" wrap="wrap" h="100%">
                <Checkbox size="xs"
                    defaultChecked
                />
                <ActionIcon
                    variant="default" 
                    aria-label="Delete"
                    onClick={() => removeQuery(query.key)}

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
                {queryInput}
            </Grid>

            <Button onClick={incrementQueryCount} variant="default" color="gray">
                + Add Param
            </Button>
        </div>
    )
}

export default QueryParams
