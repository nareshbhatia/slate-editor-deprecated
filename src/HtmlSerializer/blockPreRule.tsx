import React from 'react';
import { Rule } from 'slate-html-serializer';
import { BlockTag, BlockType } from '../types';

export const blockPreRule = (tag: BlockTag, blockType: BlockType): Rule => {
    return {
        deserialize(el, next) {
            if (el.tagName && el.tagName.toLowerCase() === tag) {
                const code: any = el.childNodes[0];
                const childNodes =
                    code && code.tagName.toLowerCase() === 'code'
                        ? code.childNodes
                        : el.childNodes;

                return {
                    object: 'block',
                    type: blockType,
                    nodes: next(childNodes)
                };
            }
        },
        serialize(obj, children) {
            if (obj.object === 'block' && obj.type === blockType) {
                return (
                    <pre>
                        <code>{children}</code>
                    </pre>
                );
            }
        }
    };
};
