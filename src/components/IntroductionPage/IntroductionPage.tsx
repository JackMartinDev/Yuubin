import { ActionIcon, Box, Group, Text, Title } from "@mantine/core"
import { IconDownload } from "@tabler/icons-react"
import { notifications } from "@mantine/notifications";
import { useTranslation } from "react-i18next";

const IntroductionPage = () => {
    const {t} = useTranslation();

    const onImportHandler = () => {
        notifications.show({
            title: t("in_development"),
            message: t("in_development_message"),
            color: 'yellow'
        })
    }

    return(
        <Box m="xs">
            <Title order={2} mb="xl">Welcome to Yuubin</Title>
            <Title order={5}>Collections</Title>
            <Group gap={8}>
                <ActionIcon variant="default" color="gray" aria-label="Import" onClick={onImportHandler}>
                    <IconDownload style={{ width: '70%', height: '70%' }} stroke={1.5} />
                </ActionIcon>
                <Text>Import from Postman</Text>
            </Group>
        </Box>
    )
}
export default IntroductionPage
