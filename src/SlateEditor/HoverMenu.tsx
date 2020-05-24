import React, { FormEvent, Fragment, useEffect, useState } from 'react';
import Fade from '@material-ui/core/Fade';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import Popper, { PopperProps } from '@material-ui/core/Popper';
import {
    createMuiTheme,
    makeStyles,
    Theme,
    ThemeProvider,
} from '@material-ui/core/styles';
import CodeIcon from '@material-ui/icons/Code';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import FormatListNumberedIcon from '@material-ui/icons/FormatListNumbered';
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import LinkIcon from '@material-ui/icons/Link';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { Editor as CoreEditor, Selection } from 'slate';
import { Heading1Icon, Heading2Icon } from '../Icons';
import { BlockType } from '../types';

// Dark theme for the menu
const menuTheme = createMuiTheme({
    palette: {
        type: 'dark',
        background: {
            paper: '#303030',
        },
    },
});

const useStyles = makeStyles((theme: Theme) => ({
    paper: {
        margin: '4px',
    },
    input: {
        padding: theme.spacing(1),
        width: 300,
    },
}));

const wrapLink = (editor: CoreEditor, selection: Selection, href: string) => {
    editor.wrapInlineAtRange(selection, {
        type: 'link',
        data: { href },
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
    linkHref: '',
};

export const HoverMenu = ({ editor }: HoverMenuProps) => {
    const classes = useStyles();
    const [menuState, setMenuState] = useState<MenuState>(noSelectionState);

    const value = editor.value;
    const {
        activeMarks,
        document,
        blocks,
        fragment,
        inlines,
        selection,
    } = value;

    const computeAnchorEl = () => {
        const native = window.getSelection();
        const range = native!.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        return {
            clientWidth: rect.width,
            clientHeight: rect.height,
            getBoundingClientRect: () => range.getBoundingClientRect(),
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
                linkHref: '',
            });
        } else if (menuState.substate === 'selection' && noSelection) {
            setMenuState(noSelectionState);
        }
    }, [
        menuState.substate,
        selection.isBlurred,
        selection.isCollapsed,
        fragment.text,
    ]);

    const hasMark = (type: string) =>
        activeMarks.some((mark) => mark!.type === type);

    const hasInline = (type: string) =>
        inlines.some((inline) => inline!.type === type);

    const hasBlock = (type: string) =>
        blocks.some((node) => node!.type === type);

    // Is the parent of the current block an ordered-list or unordered-list
    const hasListBlock = (type: string) => {
        if (blocks.size > 0) {
            const parent: any = document.getParent(blocks.first().key);
            return hasBlock('list-item') && parent && parent.type === type;
        }
        return false;
    };

    const handleToggleMark = (event: FormEvent<HTMLButtonElement>) => {
        // preventDefault() makes sure that the selection does not go away
        // onMouseDown. This makes the menu stick.
        // Note: Don't use onClick() or onChange(). onMouseDown() is needed
        // for this mechanism to work.
        event.preventDefault();
        editor.toggleMark(event.currentTarget.value);
    };

    // For blocks 'heading-five', 'heading-six' and 'blockquote'
    const handleToggleBlock = (
        event: FormEvent<HTMLButtonElement>,
        type: BlockType
    ) => {
        event.preventDefault();

        const isActive = hasBlock(type);
        const isList = hasBlock('list-item');

        if (isList) {
            editor
                .setBlocks(isActive ? 'paragraph' : type)
                .unwrapBlock('unordered-list')
                .unwrapBlock('ordered-list');
        } else {
            editor.setBlocks(isActive ? 'paragraph' : type);
        }
    };

    // For blocks 'ordered-list' and 'unordered-list'
    const handleToggleListBlock = (
        event: FormEvent<HTMLButtonElement>,
        type: BlockType
    ) => {
        event.preventDefault();

        const isList = hasBlock('list-item');
        const isType = blocks.some((block) => {
            return !!document.getClosest(
                block!.key,
                (parent: any) => parent.type === type
            );
        });

        if (isList && isType) {
            editor
                .setBlocks('paragraph')
                .unwrapBlock('unordered-list')
                .unwrapBlock('ordered-list');
        } else if (isList) {
            editor
                .unwrapBlock(
                    type === 'unordered-list'
                        ? 'ordered-list'
                        : 'unordered-list'
                )
                .wrapBlock(type);
        } else {
            editor.setBlocks('list-item').wrapBlock(type);
        }
    };

    const handleToggleH5Block = (event: FormEvent<HTMLButtonElement>) => {
        handleToggleBlock(event, 'heading-five');
    };

    const handleToggleH6Block = (event: FormEvent<HTMLButtonElement>) => {
        handleToggleBlock(event, 'heading-six');
    };

    const handleToggleQuoteBlock = (event: FormEvent<HTMLButtonElement>) => {
        handleToggleBlock(event, 'blockquote');
    };

    const handleToggleOrderedListBlock = (
        event: FormEvent<HTMLButtonElement>
    ) => {
        handleToggleListBlock(event, 'ordered-list');
    };

    const handleToggleUnorderedListBlock = (
        event: FormEvent<HTMLButtonElement>
    ) => {
        handleToggleListBlock(event, 'unordered-list');
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
                linkHref: '',
            });
        }
    };

    const handleHrefChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { linkHref, ...rest } = menuState;
        setMenuState({
            linkHref: event.target.value,
            ...rest,
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
                                    <ToggleButton
                                        value="heading-five"
                                        selected={hasBlock('heading-five')}
                                        onMouseDown={handleToggleH5Block}
                                    >
                                        <Heading1Icon />
                                    </ToggleButton>
                                    <ToggleButton
                                        value="heading-six"
                                        selected={hasBlock('heading-six')}
                                        onMouseDown={handleToggleH6Block}
                                    >
                                        <Heading2Icon />
                                    </ToggleButton>
                                    <ToggleButton
                                        value="blockquote"
                                        selected={hasBlock('blockquote')}
                                        onMouseDown={handleToggleQuoteBlock}
                                    >
                                        <FormatQuoteIcon />
                                    </ToggleButton>

                                    <ToggleButton
                                        value="unordered-list"
                                        selected={hasListBlock(
                                            'unordered-list'
                                        )}
                                        onMouseDown={
                                            handleToggleUnorderedListBlock
                                        }
                                    >
                                        <FormatListBulletedIcon />
                                    </ToggleButton>
                                    <ToggleButton
                                        value="ordered-list"
                                        selected={hasListBlock('ordered-list')}
                                        onMouseDown={
                                            handleToggleOrderedListBlock
                                        }
                                    >
                                        <FormatListNumberedIcon />
                                    </ToggleButton>
                                </Paper>
                            )}
                            {menuState.substate === 'editLink' && (
                                <Paper className={classes.paper}>
                                    <Input
                                        className={classes.input}
                                        value={menuState.linkHref}
                                        placeholder="Paste or type a link..."
                                        onChange={handleHrefChanged}
                                        onKeyDown={handleHrefKeyDown}
                                        autoFocus
                                        disableUnderline
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
