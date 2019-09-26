import React from 'react';
import { Rule } from 'slate-html-serializer';
import { InlineTag, InlineType } from '../types';

export const inlineLinkRule = (
    tag: InlineTag,
    inlineType: InlineType
): Rule => {
    return {
        deserialize(el, next) {
            if (el.tagName && el.tagName.toLowerCase() === tag) {
                return {
                    object: 'inline',
                    type: inlineType,
                    nodes: next(el.childNodes),
                    data: {
                        href: el.getAttribute('href')
                    }
                };
            }
        },
        serialize(obj, children) {
            if (obj.object === 'inline' && obj.type === inlineType) {
                const href = obj.data.get('href');

                return <a href={href}>{children}</a>;
            }
        }
    };
};
