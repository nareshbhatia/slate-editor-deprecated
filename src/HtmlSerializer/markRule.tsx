import React from 'react';
import { Rule } from 'slate-html-serializer';
import { MarkTag, MarkType } from '../types';

export const markRule = (tag: MarkTag, markType: MarkType): Rule => {
    return {
        deserialize(el, next) {
            if (el.tagName && el.tagName.toLowerCase() === tag) {
                return {
                    object: 'mark',
                    type: markType,
                    nodes: next(el.childNodes),
                };
            }
        },
        serialize(obj, children) {
            if (obj.object === 'mark' && obj.type === markType) {
                return React.createElement(tag, {}, children);
            }
        },
    };
};
