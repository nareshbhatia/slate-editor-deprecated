import React from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Popper from '@material-ui/core/Popper';
import CodeIcon from '@material-ui/icons/Code';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import { storiesOf } from '@storybook/react';
import { StoryDecorator } from '../stories';
import { Menu } from './Menu';
import { MenuButton } from './MenuButton';

const MenuExample = () => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
        null
    );

    const handleToggleClick = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleMenuClick = (menuAction?: string, menuValue?: any) => {
        console.log(`${menuAction}: ${menuValue}`);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'menu' : undefined;

    return (
        <Box p={10}>
            <Button variant="outlined" onClick={handleToggleClick}>
                Toggle Menu
            </Button>
            <Popper id={id} open={open} anchorEl={anchorEl} placement="top">
                <Menu>
                    <MenuButton
                        isActive={true}
                        menuAction="toggleMark"
                        menuValue="bold"
                        onMenuClick={handleMenuClick}
                    >
                        <FormatBoldIcon />
                    </MenuButton>
                    <MenuButton
                        menuAction="toggleMark"
                        menuValue="italic"
                        onMenuClick={handleMenuClick}
                    >
                        <FormatItalicIcon />
                    </MenuButton>
                    <MenuButton
                        isActive={true}
                        menuAction="toggleMark"
                        menuValue="underline"
                        onMenuClick={handleMenuClick}
                    >
                        <FormatUnderlinedIcon />
                    </MenuButton>
                    <MenuButton
                        menuAction="toggleMark"
                        menuValue="code"
                        onMenuClick={handleMenuClick}
                    >
                        <CodeIcon />
                    </MenuButton>
                </Menu>
            </Popper>
        </Box>
    );
};

storiesOf('Menu', module)
    .addDecorator(StoryDecorator)
    .add('Example', () => <MenuExample />);
