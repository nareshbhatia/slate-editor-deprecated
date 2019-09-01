import React from 'react';
import Button, { ButtonProps } from '@material-ui/core/Button';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        minWidth: 'auto'
    }
}));

export interface MenuButtonProps extends ButtonProps {
    menuAction?: string;
    menuValue?: any;
    isActive?: boolean;
    onMenuClick: (menuAction?: string, menuValue?: any) => void;
}

export const MenuButton = ({
    children,
    menuAction,
    menuValue,
    isActive,
    onMenuClick,
    ...rest
}: MenuButtonProps) => {
    const classes = useStyles();

    const handleClick = () => {
        onMenuClick(menuAction, menuValue);
    };

    return (
        <Button
            className={classes.root}
            color={isActive ? 'secondary' : 'inherit'}
            onClick={handleClick}
            {...rest}
        >
            {children}
        </Button>
    );
};
