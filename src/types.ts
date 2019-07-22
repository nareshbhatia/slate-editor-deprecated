export type BlockTag =
    | 'blockquote'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'li'
    | 'ol'
    | 'p'
    | 'pre'
    | 'ul';

export type BlockType =
    | 'blockquote'
    | 'heading-one'
    | 'heading-two'
    | 'heading-three'
    | 'heading-four'
    | 'heading-five'
    | 'heading-six'
    | 'list-item'
    | 'ordered-list'
    | 'paragraph'
    | 'pre'
    | 'unordered-list';

export type InlineTag = 'a' | 'img';

export type InlineType = 'anchor' | 'image';

export type MarkTag = 'strong' | 'code' | 'em' | 's' | 'u';

export type MarkType =
    | 'bold'
    | 'code'
    | 'italic'
    | 'strikethrough'
    | 'underline';
