import React from 'react';
import { Rule } from 'slate-html-serializer';
import { BlockTag, BlockType } from '../types';

export const blockRule = (tag: BlockTag, blockType: BlockType): Rule => {
    return {
        deserialize(el, next) {
            if (el.tagName && el.tagName.toLowerCase() === tag) {
                return {
                    object: 'block',
                    type: blockType,
                    nodes: next(el.childNodes),
                };
            }
        },
        serialize(obj, children) {
            if (obj.object === 'block' && obj.type === blockType) {
                return React.createElement(tag, {}, children);
            }
        },
    };
};
