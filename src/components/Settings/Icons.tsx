import { rem } from "@mantine/core";
import { IconMoonStars, IconSun } from "@tabler/icons-react";

export const sunIcon = (
    <IconSun
        style={{ width: rem(16), height: rem(16) }}
        stroke={2.5}
        color="#FFD43B"
    />
);

export const moonIcon = (
    <IconMoonStars
        style={{ width: rem(16), height: rem(16) }}
        stroke={2.5}
        color="#228BE6"
    />
);
