import React from 'react';
import { Editor as CoreEditor } from 'slate';
import {
    Editor,
    EditorProps,
    RenderBlockProps,
    RenderInlineProps,
    RenderMarkProps,
} from 'slate-react';
import { BlockType, InlineType, MarkType } from '../types';
import { HoverMenu } from './HoverMenu';

export const SlateEditor = (props: EditorProps) => {
    const renderEditor = (
        props: EditorProps,
        editor: CoreEditor,
        next: () => any
    ) => {
        const children = next();
        return (
            <React.Fragment>
                {children}
                <HoverMenu editor={editor} />
            </React.Fragment>
        );
    };

    const renderBlock = (
        props: RenderBlockProps,
        editor: CoreEditor,
        next: () => any
    ) => {
        const { attributes, children, node } = props;
        const blockType: BlockType = node.type as BlockType;

        switch (blockType) {
            case 'blockquote':
                return <blockquote {...attributes}>{children}</blockquote>;
            case 'heading-one':
                return <h1 {...attributes}>{children}</h1>;
            case 'heading-two':
                return <h2 {...attributes}>{children}</h2>;
            case 'heading-three':
                return <h3 {...attributes}>{children}</h3>;
            case 'heading-four':
                return <h4 {...attributes}>{children}</h4>;
            case 'heading-five':
                return <h5 {...attributes}>{children}</h5>;
            case 'heading-six':
                return <h6 {...attributes}>{children}</h6>;
            case 'list-item':
                return <li {...attributes}>{children}</li>;
            case 'ordered-list':
                return <ol {...attributes}>{children}</ol>;
            case 'paragraph':
                return <p {...attributes}>{children}</p>;
            case 'pre':
                return (
                    <pre>
                        <code {...attributes}>{children}</code>
                    </pre>
                );
            case 'unordered-list':
                return <ul {...attributes}>{children}</ul>;
            default:
                return next();
        }
    };

    const renderInline = (
        props: RenderInlineProps,
        editor: CoreEditor,
        next: () => any
    ) => {
        const { attributes, children, node } = props;
        const inlineType: InlineType = node.type as InlineType;

        switch (inlineType) {
            case 'link':
                // TODO: How to add target="_blank"
                const href = node.data.get('href');
                return (
                    <a href={href} {...attributes}>
                        {children}
                    </a>
                );
            case 'image':
                const src = node.data.get('src');
                return <img src={src} alt="" {...attributes} />;
            default:
                return next();
        }
    };

    const renderMark = (
        props: RenderMarkProps,
        editor: CoreEditor,
        next: () => any
    ) => {
        const { children, mark, attributes } = props;
        const markType: MarkType = mark.type as MarkType;

        switch (markType) {
            case 'bold':
                return <strong {...attributes}>{children}</strong>;
            case 'code':
                return <code {...attributes}>{children}</code>;
            case 'italic':
                return <em {...attributes}>{children}</em>;
            case 'strikethrough':
                return <s {...attributes}>{children}</s>;
            case 'underline':
                return <u {...attributes}>{children}</u>;
            default:
                return next();
        }
    };

    return (
        <Editor
            renderEditor={renderEditor}
            renderBlock={renderBlock}
            renderInline={renderInline}
            renderMark={renderMark}
            {...props}
        />
    );
};
