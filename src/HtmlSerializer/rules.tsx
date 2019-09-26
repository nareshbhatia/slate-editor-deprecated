import { Rule } from 'slate-html-serializer';
import { blockPreRule } from './blockPreRule';
import { blockRule } from './blockRule';
import { inlineLinkRule } from './inlineLinkRule';
import { inlineImageRule } from './inlineImageRule';
import { markRule } from './markRule';

export const rules: Rule[] = [
    blockRule('blockquote', 'blockquote'),
    blockRule('h1', 'heading-one'),
    blockRule('h2', 'heading-two'),
    blockRule('h3', 'heading-three'),
    blockRule('h4', 'heading-four'),
    blockRule('h5', 'heading-five'),
    blockRule('h6', 'heading-six'),
    blockRule('li', 'list-item'),
    blockRule('ol', 'ordered-list'),
    blockRule('p', 'paragraph'),
    blockPreRule('pre', 'pre'),
    blockRule('ul', 'unordered-list'),
    inlineLinkRule('a', 'link'),
    inlineImageRule('img', 'image'),
    markRule('strong', 'bold'),
    markRule('code', 'code'),
    markRule('em', 'italic'),
    markRule('s', 'strikethrough'),
    markRule('u', 'underline')
];
