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
import { Editor as CoreEditor, Selection } from 'slate';

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

const wrapLink = (editor: CoreEditor, selection: Selection, href: string) => {
    editor.wrapInlineAtRange(selection, {
        type: 'link',
        data: { href }
    });

    editor.moveToEnd();
};

const unwrapLink = (editor: CoreEditor) => {
    editor.unwrapInline('link');
};

type Substate = 'noSelection' | 'selection' | 'editLink';

export interface MenuState {
    substate: Substate;
    anchorEl: PopperProps['anchorEl'];
    linkSelection: Selection | null;
    linkHref: string;
}

export interface HoverMenuProps {
    editor: CoreEditor;
}

const noSelectionState: MenuState = {
    substate: 'noSelection',
    anchorEl: null,
    linkSelection: null,
    linkHref: ''
};

export const HoverMenu = ({ editor }: HoverMenuProps) => {
    const classes = useStyles();
    const [menuState, setMenuState] = useState<MenuState>(noSelectionState);

    const value = editor.value;
    const { activeMarks, fragment, inlines, selection } = value;

    const computeAnchorEl = () => {
        const native = window.getSelection();
        const range = native!.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        return {
            clientWidth: rect.width,
            clientHeight: rect.height,
            getBoundingClientRect: () => range.getBoundingClientRect()
        };
    };

    useEffect(() => {
        const noSelection =
            selection.isBlurred ||
            selection.isCollapsed ||
            fragment.text === '';

        if (menuState.substate === 'noSelection' && !noSelection) {
            setMenuState({
                substate: 'selection',
                anchorEl: computeAnchorEl(),
                linkSelection: null,
                linkHref: ''
            });
        } else if (menuState.substate === 'selection' && noSelection) {
            setMenuState(noSelectionState);
        }
    }, [
        menuState.substate,
        selection.isBlurred,
        selection.isCollapsed,
        fragment.text
    ]);

    const hasMark = (type: string) =>
        activeMarks.some(mark => mark!.type === type);

    const hasInline = (type: string) =>
        inlines.some(inline => inline!.type === type);

    const handleToggleMark = (event: FormEvent<HTMLButtonElement>) => {
        // preventDefault() makes sure that the selection does not go away
        // onMouseDown. This makes the menu stick.
        // Note: Don't use onClick() or onChange(). onMouseDown() is needed
        // for this mechanism to work.
        event.preventDefault();
        editor.toggleMark(event.currentTarget.value);
    };

    const handleLinkClicked = (event: FormEvent<HTMLButtonElement>) => {
        if (hasInline('link')) {
            unwrapLink(editor);
        } else {
            event.preventDefault();
            setMenuState({
                substate: 'editLink',
                anchorEl: menuState.anchorEl,
                linkSelection: selection,
                linkHref: ''
            });
        }
    };

    const handleHrefChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { linkHref, ...rest } = menuState;
        setMenuState({
            linkHref: event.target.value,
            ...rest
        });
    };

    const handleHrefKeyDown = (event: React.KeyboardEvent) => {
        // Create link when Enter key is pressed
        if (event.key === 'Enter' && menuState.linkSelection) {
            wrapLink(editor, menuState.linkSelection, menuState.linkHref);
            setMenuState(noSelectionState);
        } else if (event.key === 'Escape') {
            // Abort edit when ESC is pressed
            setMenuState(noSelectionState);
        }
    };

    if (!menuState.anchorEl) {
        return null;
    }

    return (
        <ThemeProvider theme={menuTheme}>
            <Popper
                id="menu-popper"
                open={true}
                anchorEl={menuState.anchorEl}
                placement="top"
                transition
            >
                {({ TransitionProps }) => (
                    <Fade {...TransitionProps} timeout={350}>
                        <Fragment>
                            {menuState.substate === 'selection' && (
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
                                        value="link"
                                        selected={hasInline('link')}
                                        onMouseDown={handleLinkClicked}
                                    >
                                        <LinkIcon />
                                    </ToggleButton>
                                </Paper>
                            )}
                            {menuState.substate === 'editLink' && (
                                <Paper className={classes.paper}>
                                    <TextField
                                        value={menuState.linkHref}
                                        onChange={handleHrefChanged}
                                        onKeyDown={handleHrefKeyDown}
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
