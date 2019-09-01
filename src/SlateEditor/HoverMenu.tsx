import React, { FormEvent, useEffect } from 'react';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper, { PopperProps } from '@material-ui/core/Popper';
import { createMuiTheme, Theme } from '@material-ui/core/styles';
import CodeIcon from '@material-ui/icons/Code';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { Editor as CoreEditor } from 'slate';

// Dark theme for the menu
const menuTheme = createMuiTheme({
    palette: {
        type: 'dark'
    }
});

const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        margin: '4px'
    }
}));

export interface HoverMenuProps {
    editor: CoreEditor;
}

export const HoverMenu = ({ editor }: HoverMenuProps) => {
    const classes = useStyles();
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

    const handleToggleMark = (event: FormEvent<HTMLButtonElement>) => {
        editor.toggleMark(event.currentTarget.value);
    };

    return (
        <ThemeProvider theme={menuTheme}>
            <Popper
                id={id}
                open={open}
                anchorEl={anchorEl}
                placement="top"
                transition
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Paper className={classes.paper}>
                            <ToggleButton
                                value="bold"
                                selected={isActive('bold')}
                                onChange={handleToggleMark}
                            >
                                <FormatBoldIcon />
                            </ToggleButton>
                            <ToggleButton
                                value="italic"
                                selected={isActive('italic')}
                                onChange={handleToggleMark}
                            >
                                <FormatItalicIcon />
                            </ToggleButton>
                            <ToggleButton
                                value="underline"
                                selected={isActive('underline')}
                                onChange={handleToggleMark}
                            >
                                <FormatUnderlinedIcon />
                            </ToggleButton>
                            <ToggleButton
                                value="code"
                                selected={isActive('code')}
                                onChange={handleToggleMark}
                            >
                                <CodeIcon />
                            </ToggleButton>
                        </Paper>
                    </Fade>
                )}
            </Popper>
        </ThemeProvider>
    );
};
