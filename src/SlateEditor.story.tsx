import React, { Fragment, useState } from 'react';
import Box from '@material-ui/core/Box';
import { HtmlView } from '@nareshbhatia/react-force';
import { storiesOf } from '@storybook/react';
import { StoryDecorator } from './stories';
import { htmlSerializer, SlateEditor, Value } from '.';

const htmlContent = `
<h1>Headline 1</h1>
<h2>Headline 2</h2>
<h3>Headline 3</h3>
<h4>Headline 4</h4>
<h5>Headline 5</h5>
<h6>Headline 6</h6>

<p>The lion is a species in the family Felidae. It is a muscular, deep-chested
 cat with a short, rounded head, a reduced neck and round ears, and a hairy
 tuft at the end of its tail.
</p>

<p><strong>Bold</strong><br />
<em>Italic</em><br />
<u>Underline</u><br />
<code>Code</code>
</p>

<p><a href="https://en.wikipedia.org/wiki/Lion">Lion</a></p>

<p><img src="https://source.unsplash.com/IPRFX7CVVoU/288x288" alt="Lion" /></p>

<ul>
<li>Bullet 1</li>
<li>Bullet 2</li>
<li>Bullet 3</li>
</ul>

<ol>
<li>Bullet 1</li>
<li>Bullet 2</li>
<li>Bullet 3</li>
</ol>

<blockquote>Ask not what your country can do for you,
 but what you can do for your country.
 - John F. Kennedy
</blockquote>

<pre>
<code>
const total = price * quantity;
const tax = total * taxRate
</code>
</pre>
`;

// TODO: pre tags don't work well with this solution
// Remove line breaks, deserialize does not handle them well
const htmlContentRaw = htmlContent.replace(/(\r\n|\n|\r)/gm, '');

const initialValue = htmlSerializer.deserialize(htmlContentRaw);

const SlateContainer = () => {
    const [value, setValue] = useState<Value>(initialValue);

    const handleChange = ({ value }: { value: Value }) => {
        setValue(value);
    };

    return (
        <Fragment>
            <Box display="flex">
                <Box flex={1} p={2}>
                    <SlateEditor value={value} onChange={handleChange} />
                </Box>
                <HtmlView
                    flex={1}
                    p={2}
                    bgcolor="#eeeeee"
                    html={htmlSerializer.serialize(value)}
                />
            </Box>
            <Box
                flex={1}
                p={2}
                bgcolor="text.secondary"
                color="background.paper"
            >
                {htmlSerializer.serialize(value)}
            </Box>
        </Fragment>
    );
};

storiesOf('Slate Editor', module)
    .addDecorator(StoryDecorator)
    .add('default', () => <SlateContainer />);
