import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function BasicMenu({menuItems=[],menuTitle="Menu"}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (itemFunction) => {
    setAnchorEl(null);
    itemFunction();
  };

  return (
    <div>
      <Button
        id="basic-button"
        onClick={handleClick}
        sx={{
          backgroundColor:"#fff !important",
          "&:hover":{border:"none !important"},
        }
      }
      >
        {menuTitle}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={()=>handleClose(()=>{})}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {
        menuItems.map((item)=>
        <MenuItem onClick={()=>handleClose(item.handleClick)} key={item.title}>{item.title}</MenuItem>
        )
        }
      </Menu>
    </div>
  );
}