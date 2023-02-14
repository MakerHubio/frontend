import { Box, Button, ButtonProps, Menu } from '@mantine/core';
import { IoChevronDown } from 'react-icons/io5';
import { PropsWithChildren } from 'react';

export default function DropdownButton(props: PropsWithChildren<ButtonProps>) {
  return <Box sx={() => ({
    display: 'flex',
  })}
  >
    <Button sx={() => ({
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
    })}
    >
      {props.children}
    </Button>
    <Menu>
      <Menu.Target>
        <Button sx={theme => ({
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          borderWidth: 0,
          borderLeftColor: theme.colors.blue[8],
          borderLeftWidth: 1,
          paddingLeft: theme.spacing.xs,
          paddingRight: theme.spacing.xs,
        })}
        ><IoChevronDown/></Button>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item>Download selected</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  </Box>;
}
