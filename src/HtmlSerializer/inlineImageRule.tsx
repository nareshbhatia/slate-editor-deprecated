import React from 'react';
import { Rule } from 'slate-html-serializer';
import { InlineTag, InlineType } from '../types';

export const inlineImageRule = (
    tag: InlineTag,
    inlineType: InlineType
): Rule => {
    return {
        deserialize(el) {
            if (el.tagName && el.tagName.toLowerCase() === tag) {
                return {
                    object: 'inline',
                    type: inlineType,
                    data: {
                        src: el.getAttribute('src'),
                    },
                };
            }
        },
        serialize(obj) {
            if (obj.object === 'inline' && obj.type === inlineType) {
                const src = obj.data.get('src');

                return <img src={src} alt="" />;
            }
        },
    };
};
