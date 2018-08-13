import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Checkbox from '@material-ui/core/Checkbox';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

class DetailView extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
        open: false,
        scroll: 'paper',
      }
      this.handleCLose = this.handleClose.bind(this)
  };

  handleClickOpen(scroll) {
    this.setState({ open: true, scroll });
  };

  handleClose() {
    this.setState({ open: false });
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.handleClose}
          scroll={this.state.scroll}
          aria-labelledby="scroll-dialog-title"
        >
          <DialogTitle id="scroll-dialog-title">{this.props.item.title}</DialogTitle>
          <DialogTitle id="scroll-dialog-title">{this.props.item.deadline}</DialogTitle>
          {/* <Checkbox
                checked={this.props.item.isComplete === "true"}
                tabIndex={-1}
                className={`isComplete_${this.props.item.id}`}
                disableRipple
                onClick={this.markComplete.bind(this, this.props.item.id)}
           /> */}
          <DialogContentText>
              {this.props.item.body}
            </DialogContentText>
            {/* <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Details"
              type="text"
              fullWidth
              value={this.props.item.body}
            /> */}
          <DialogActions>
            <Button onClick={this.handleClose.bind(this)} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Subscribe
            </Button>
            <Button onClick={this.handleDelete.bind(this, item)}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default DetailView;