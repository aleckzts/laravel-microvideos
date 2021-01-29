import React from 'react';
import { Box, Button, makeStyles, Theme } from '@material-ui/core';
import { ButtonProps } from '@material-ui/core/Button/Button';

const useStyles = makeStyles((theme: Theme) => {
  return {
    submit: {
      margin: theme.spacing(1),
    },
  };
});

interface SubmitActionsProps {
  disableButtons?: boolean;
  handleSave: () => void;
}

const SubmitActions: React.FC<SubmitActionsProps> = ({
  disableButtons,
  handleSave,
}) => {
  const classes = useStyles();

  const buttonProps: ButtonProps = {
    className: classes.submit,
    color: 'secondary',
    variant: 'contained',
    disabled: disableButtons === undefined ? false : disableButtons,
  };

  return (
    <Box dir="rtl">
      <Button {...buttonProps} onClick={handleSave}>
        Salvar
      </Button>
      <Button {...buttonProps} type="submit">
        Salvar e Continuar editando
      </Button>
    </Box>
  );
};

export default SubmitActions;
