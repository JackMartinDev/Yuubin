import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IconTrash } from "@tabler/icons-react";
import {
  ActionIcon,
  Button,
  Checkbox,
  Flex,
  Grid,
  ScrollArea,
  TextInput,
} from "@mantine/core";
import { useTranslation } from "react-i18next";

type Props = {
  queryParams: KeyValuePair[];
  onParamsChange: Dispatch<SetStateAction<KeyValuePair[]>>;
};

const QueryParams = ({ queryParams, onParamsChange }: Props) => {
  const [queries, setQueries] = useState<KeyValuePair[]>(
    queryParams ? queryParams : [],
  );
  const { t } = useTranslation();

  const incrementQueryCount = () => {
    setQueries([...queries, { key: "", value: "", checked: true }]);
  };

  useEffect(() => {
    onParamsChange(queries);
  }, [queries, onParamsChange]);

  const inputChangeHandler = (
    index: number,
    field: string,
    newValue: string,
  ) => {
    const newArray = queries.map((query, queryIndex) =>
      index === queryIndex ? { ...query, [field]: newValue } : query,
    );
    setQueries(newArray);
  };

  const checkChangeHandler = (index: number, checked: boolean) => {
    const newArray = queries.map((query, queryIndex) =>
      index === queryIndex ? { ...query, checked } : query,
    );
    setQueries(newArray);
  };

  const removeQuery = (index: number) => {
    const newArray = queries.filter((_query, i) => i !== index);
    setQueries(newArray);
  };

  const queryInput = queries.map((query, index) => (
    <>
      <Grid.Col span={4}>
        <TextInput
          value={query.key}
          onChange={(e) => inputChangeHandler(index, "key", e.target.value)}
        />
      </Grid.Col>

      <Grid.Col span={6}>
        <TextInput
          value={query.value}
          onChange={(e) => inputChangeHandler(index, "value", e.target.value)}
        />
      </Grid.Col>
      <Grid.Col span={2}>
        <Flex
          align="center"
          direction="row"
          justify="space-evenly"
          wrap="wrap"
          h="100%"
        >
          <Checkbox
            size="xs"
            checked={queries[index].checked}
            onChange={(event) =>
              checkChangeHandler(index, event.target.checked)
            }
          />
          <ActionIcon
            variant="default"
            aria-label="Delete"
            onClick={() => removeQuery(index)}
          >
            <IconTrash style={{ width: "80%", height: "70%" }} stroke={1.5} />
          </ActionIcon>
        </Flex>
      </Grid.Col>
    </>
  ));

  return (
    <ScrollArea scrollbars="y" h="70vh" offsetScrollbars>
      <Grid mb={16} gutter={8}>
        <Grid.Col span={4}>{t("key")}</Grid.Col>

        <Grid.Col span={6}>{t("value")}</Grid.Col>

        <Grid.Col span={2}>
          <Flex justify="center">
            <Button
              onClick={incrementQueryCount}
              variant="default"
              color="gray"
              size="xs"
              p={8}
            >
              + {t("add")}
            </Button>
          </Flex>
        </Grid.Col>
        {queryInput}
      </Grid>
    </ScrollArea>
  );
};

export default QueryParams;
