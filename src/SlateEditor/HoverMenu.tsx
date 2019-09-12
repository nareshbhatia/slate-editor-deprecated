import React, { FormEvent, Fragment, useEffect, useState } from 'react';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Popper, { PopperProps } from '@material-ui/core/Popper';
import { createMuiTheme, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CodeIcon from '@material-ui/icons/Code';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import LinkIcon from '@material-ui/icons/Link';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { Editor as CoreEditor } from 'slate';

// Dark theme for the menu
const menuTheme = createMuiTheme({
    palette: {
        type: 'dark',
        background: {
            paper: '#303030'
        }
    }
});

const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        margin: '4px'
    }
}));

const wrapAnchor = (editor: CoreEditor, href: string) => {
    editor.wrapInline({
        type: 'anchor',
        data: { href }
    });

    editor.moveToEnd();
};

const unwrapAnchor = (editor: CoreEditor) => {
    editor.unwrapInline('anchor');
};

type MenuState = 'initial' | 'enterHref';

export interface HoverMenuProps {
    editor: CoreEditor;
}

export const HoverMenu = ({ editor }: HoverMenuProps) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<PopperProps['anchorEl']>(null);
    const [menuState, setMenuState] = useState<MenuState>('initial');
    const [href, setHref] = useState('');

    const value = editor.value;
    const { activeMarks, fragment, inlines, selection } = value;

    const hasMark = (type: string) =>
        activeMarks.some(mark => mark!.type === type);

    const hasInline = (type: string) =>
        inlines.some(inline => inline!.type === type);

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
        setMenuState('initial');
    }, [selection.isBlurred, selection.isCollapsed, fragment.text]);

    const open = Boolean(anchorEl);
    const id = open ? 'menu-popper' : undefined;

    const handleToggleMark = (event: FormEvent<HTMLButtonElement>) => {
        // preventDefault() makes sure that the selection does not go away
        // onMouseDown. This makes the menu stick.
        // Note: Don't use onClick() or onChange(). onMouseDown() is needed
        // for this mechanism to work.
        event.preventDefault();
        editor.toggleMark(event.currentTarget.value);
    };

    const handleAnchorClicked = (event: FormEvent<HTMLButtonElement>) => {
        if (hasInline('anchor')) {
            unwrapAnchor(editor);
        } else {
            event.preventDefault();
            setMenuState('enterHref');
        }
    };

    const handleHrefChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHref(event.target.value);
        // wrapAnchor(editor, 'http://archfirst.org');
        // setMenuState('initial');
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
                        <Fragment>
                            {menuState === 'initial' && (
                                <Paper className={classes.paper}>
                                    <ToggleButton
                                        value="bold"
                                        selected={hasMark('bold')}
                                        onMouseDown={handleToggleMark}
                                    >
                                        <FormatBoldIcon />
                                    </ToggleButton>
                                    <ToggleButton
                                        value="italic"
                                        selected={hasMark('italic')}
                                        onMouseDown={handleToggleMark}
                                    >
                                        <FormatItalicIcon />
                                    </ToggleButton>
                                    <ToggleButton
                                        value="underline"
                                        selected={hasMark('underline')}
                                        onMouseDown={handleToggleMark}
                                    >
                                        <FormatUnderlinedIcon />
                                    </ToggleButton>
                                    <ToggleButton
                                        value="code"
                                        selected={hasMark('code')}
                                        onMouseDown={handleToggleMark}
                                    >
                                        <CodeIcon />
                                    </ToggleButton>
                                    <ToggleButton
                                        value="anchor"
                                        selected={hasInline('anchor')}
                                        onMouseDown={handleAnchorClicked}
                                    >
                                        <LinkIcon />
                                    </ToggleButton>
                                </Paper>
                            )}
                            {menuState === 'enterHref' && (
                                <Paper className={classes.paper}>
                                    <TextField
                                        value={href}
                                        onChange={handleHrefChanged}
                                        variant="outlined"
                                    />
                                </Paper>
                            )}
                        </Fragment>
                    </Fade>
                )}
            </Popper>
        </ThemeProvider>
    );
};
