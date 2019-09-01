import React from 'react';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        margin: '4px',
        color: theme.palette.common.white,
        backgroundColor: theme.palette.grey.A400,
        borderRadius: 4
    }
}));

export const Menu: React.FC = ({ children }) => {
    const classes = useStyles();
    return <div className={classes.root}>{children}</div>;
};
