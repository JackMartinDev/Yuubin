import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { IconTrash } from "@tabler/icons-react";
import { ActionIcon, Button, Checkbox, Flex, Grid, TextInput } from "@mantine/core";

type Props = {
    queryParams: KeyValuePair[] | undefined, 
    onParamsChange: Dispatch<SetStateAction<KeyValuePair[] | undefined>>,
}

const QueryParams = ({queryParams, onParamsChange}: Props) => {
    const [queries, setQueries] = useState<KeyValuePair[]>(queryParams ? queryParams : []);

    const incrementQueryCount = () =>{
        setQueries([...queries, {key: "", value: ""}]);
    }

    useEffect(() => {
        onParamsChange(queries);
    }, [queries, onParamsChange]);


    const inputChangeHandler = (index: number, field:string, newValue: string) => {
        const newArray = queries.map((query, queryIndex) =>
            index === queryIndex ? { ...query, [field]: newValue } : query
        );
        setQueries(newArray);
    };

    const removeQuery = (index: number) =>{
        const newArray = queries.filter((_query, i) => i !== index)
        setQueries(newArray)
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
                        onClick={() => removeQuery(index)}

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
