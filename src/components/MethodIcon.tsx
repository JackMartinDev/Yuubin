import { Text } from "@mantine/core";

interface Props {
  method: HttpVerb;
}

const MethodIcon = ({ method }: Props) => {
  let color;
  switch (method) {
    case "GET":
      color = "#1a752e";
      break;
    case "POST":
      color = "#6134eb";
      break;
    case "DELETE":
      color = "#b51e0d";
      break;
    default:
      color = "#ed9015";
      break;
  }

  return (
    <Text size="xs" c={color} fw={500} display="inline">
      {method}
    </Text>
  );
};

export default MethodIcon;
