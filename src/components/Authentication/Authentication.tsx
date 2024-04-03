import { Box, Text, TextInput } from "@mantine/core"

interface Props {
    token: string
}

const Authentication = ({token}:Props) => {

    //Adjust this to state
    return(
        <Box mr={16}>
            <Text>Bearer Token</Text>
            <TextInput defaultValue={token} mt="xs"/>
        </Box>
    )
}

export default Authentication
