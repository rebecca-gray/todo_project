import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class MenuAppBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    auth: true,
    anchorEl: null,
    filter: "all"
  };
  this.handleChange = this.handleChange.bind(this)
  this.handleMenu = this.handleMenu.bind(this)
  this.handleClose = this.handleClose.bind(this)
}

  handleChange (event, checked) {
    this.setState({ auth: checked });
  };

  handleMenu (event) {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose (event) {
    this.setState({ anchorEl: null });
  };

  handleSelect (filter) {
    this.setState({ filter })
    this.handleClose()
    this.props.filterItems(filter)
  }

  render() {
    const { classes } = this.props;
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit" className={classes.flex}>
              Task Management
            </Typography>
            {auth && (
              <div>
                Filter {this.state.filter}
                <IconButton
                  aria-owns={open ? 'menu-appbar' : null}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={open}
                  onClose={this.handleClose}
                >
                  <MenuItem onClick={this.handleSelect.bind(this, "future")}>Future Tasks</MenuItem>
                  <MenuItem onClick={this.handleSelect.bind(this, "tomorrow")}>Tomorrow's Tasks</MenuItem>
                  <MenuItem onClick={this.handleSelect.bind(this, "today")}>Today's Tasks</MenuItem>
                  <MenuItem onClick={this.handleSelect.bind(this, "overdue")}>Overdue Tasks</MenuItem>
                  <MenuItem onClick={this.handleSelect.bind(this, "complete")}>Completed Tasks</MenuItem>
                  <MenuItem onClick={this.handleSelect.bind(this, "incomplete")}>Incomplete Tasks</MenuItem>
                  <MenuItem onClick={this.handleSelect.bind(this, "all")}>All Tasks</MenuItem>
                </Menu>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MenuAppBar);