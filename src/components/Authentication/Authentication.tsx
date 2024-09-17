import { Box, Text, TextInput } from "@mantine/core";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  auth: string | undefined;
  onAuthChange: Dispatch<SetStateAction<string | undefined>>;
}

const Authentication = ({ auth, onAuthChange }: Props) => {
  const [localAuth, setLocalAuth] = useState(auth);
  const { t } = useTranslation();

  useEffect(() => {
    onAuthChange(localAuth);
  }, [localAuth, onAuthChange]);

  return (
    <Box mr={16}>
      <Text>{t("token")}</Text>
      <TextInput
        value={localAuth}
        onChange={(e) => setLocalAuth(e.target.value)}
        mt="xs"
      />
    </Box>
  );
};

export default Authentication;
