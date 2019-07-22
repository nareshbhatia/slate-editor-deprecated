import React from 'react';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@nareshbhatia/react-force';
import { theme } from './theme';

export const StoryDecorator = (story: any) => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        {story()}
    </ThemeProvider>
);
