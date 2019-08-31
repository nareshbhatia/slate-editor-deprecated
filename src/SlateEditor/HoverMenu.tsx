import React, { useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Popper, { PopperProps } from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import CodeIcon from '@material-ui/icons/Code';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import { Editor as CoreEditor } from 'slate';

export interface HoverMenuProps {
    editor: CoreEditor;
}

export const HoverMenu = ({ editor }: HoverMenuProps) => {
    const [anchorEl, setAnchorEl] = React.useState<PopperProps['anchorEl']>(
        null
    );

    useEffect(() => {
        const value = editor.value;

        const { fragment, selection } = value;

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
    }, [editor.value]);

    const open = Boolean(anchorEl);
    const id = open ? 'menu-popper' : undefined;

    const handleBoldClicked = () => {
        editor.toggleMark('bold');
    };

    const handleItalicClicked = () => {
        editor.toggleMark('italic');
    };

    const handleUnderlineClicked = () => {
        editor.toggleMark('underline');
    };

    const handleCodeClicked = () => {
        editor.toggleMark('code');
    };

    return (
        <div>
            <Popper
                id={id}
                open={open}
                anchorEl={anchorEl}
                placement="top"
                transition
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper>
                            <IconButton
                                size="small"
                                onClick={handleBoldClicked}
                            >
                                <FormatBoldIcon />
                            </IconButton>

                            <IconButton
                                size="small"
                                onClick={handleItalicClicked}
                            >
                                <FormatItalicIcon />
                            </IconButton>

                            <IconButton
                                size="small"
                                onClick={handleUnderlineClicked}
                            >
                                <FormatUnderlinedIcon />
                            </IconButton>

                            <IconButton
                                size="small"
                                onClick={handleCodeClicked}
                            >
                                <CodeIcon />
                            </IconButton>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </div>
    );
};
