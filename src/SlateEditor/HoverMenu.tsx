import React, { useEffect } from 'react';
import Popper, { PopperProps } from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import CodeIcon from '@material-ui/icons/Code';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import { Editor as CoreEditor } from 'slate';
import { Menu, MenuButton } from '../Menu';

export interface HoverMenuProps {
    editor: CoreEditor;
}

export const HoverMenu = ({ editor }: HoverMenuProps) => {
    const [anchorEl, setAnchorEl] = React.useState<PopperProps['anchorEl']>(
        null
    );

    const value = editor.value;
    const { activeMarks, fragment, selection } = value;
    const isActive = (markType: string) =>
        activeMarks.some(mark => mark!.type === markType);

    useEffect(() => {
        if (
            selection.isBlurred ||
            selection.isCollapsed ||
            fragment.text === ''
        ) {
            setAnchorEl(null);
            return;
        }

        const native = window.getSelection();
        const range = native!.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setAnchorEl({
            clientWidth: rect.width,
            clientHeight: rect.height,
            getBoundingClientRect: () => range.getBoundingClientRect()
        });
    }, [selection.isBlurred, selection.isCollapsed, fragment.text]);

    const open = Boolean(anchorEl);
    const id = open ? 'menu-popper' : undefined;

    const handleMenuClick = (menuAction?: string, menuValue?: any) => {
        switch (menuAction) {
            case 'toggleMark':
                editor.toggleMark(menuValue);
                break;
            default:
                break;
        }
    };

    return (
        <Popper
            id={id}
            open={open}
            anchorEl={anchorEl}
            placement="top"
            transition
        >
            {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                    <Menu>
                        <MenuButton
                            isActive={isActive('bold')}
                            menuAction="toggleMark"
                            menuValue="bold"
                            onMenuClick={handleMenuClick}
                        >
                            <FormatBoldIcon />
                        </MenuButton>
                        <MenuButton
                            isActive={isActive('italic')}
                            menuAction="toggleMark"
                            menuValue="italic"
                            onMenuClick={handleMenuClick}
                        >
                            <FormatItalicIcon />
                        </MenuButton>
                        <MenuButton
                            isActive={isActive('underline')}
                            menuAction="toggleMark"
                            menuValue="underline"
                            onMenuClick={handleMenuClick}
                        >
                            <FormatUnderlinedIcon />
                        </MenuButton>
                        <MenuButton
                            isActive={isActive('code')}
                            menuAction="toggleMark"
                            menuValue="code"
                            onMenuClick={handleMenuClick}
                        >
                            <CodeIcon />
                        </MenuButton>
                    </Menu>
                </Fade>
            )}
        </Popper>
    );
};
