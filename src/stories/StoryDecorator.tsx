import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@react-force/core';
import { theme } from './theme';

export const StoryDecorator = (story: any) => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        {story()}
    </ThemeProvider>
);
