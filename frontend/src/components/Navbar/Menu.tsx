import React, { useState, MouseEvent } from 'react';
import { Link } from 'react-router-dom';

import { IconButton, Menu as MenuUi, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import routes, { MyRouteProps } from '../../routes';

interface ListRoutesType {
  [key: string]: string;
}
const Menu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const listRoutes: ListRoutesType = {
    dashboard: 'Dashboard',
    'categories.list': 'Categorias',
    'cast_members.list': 'Membros de elenco',
    'genres.list': 'Gêneros',
    'videos.list': 'Vídeos',
  };

  const menuRoutes = routes.filter(route =>
    Object.keys(listRoutes).includes(route.name),
  );

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="open drawer"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MenuIcon />
      </IconButton>

      <MenuUi
        id="menu-appbar"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        getContentAnchorEl={null}
      >
        {Object.keys(listRoutes).map((routeName, key) => {
          const route = menuRoutes.find(
            routeElement => routeElement.name === routeName,
          ) as MyRouteProps;

          return (
            <MenuItem
              key={key}
              component={Link}
              to={route.path as string}
              onClick={handleClose}
            >
              {listRoutes[routeName]}
            </MenuItem>
          );
        })}
      </MenuUi>
    </>
  );
};

export default Menu;
