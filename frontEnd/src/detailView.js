import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Checkbox from '@material-ui/core/Checkbox';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

class DetailView extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
        open: false,
        scroll: 'paper',
        itemTitle: this.props.item.title,
        itemBody: this.props.item.body,
        itemDeadline: this.props.item.deadline,
        itemIsComplete: this.props.item.isComplete
      }
      this.handleCLose = this.handleClose.bind(this)
      this.markComplete = this.markComplete.bind(this)
  };

  handleClickOpen(scroll) {
    this.setState({ open: true, scroll });
  };
  handleCancel(item) {
    this.setState({ open: false });
     this.props.onClose(item)
  };

  markComplete(item) {
    const toggleChecked = this.state.itemIsComplete === "true" ? "false" : "true"
    this.setState({itemIsComplete: toggleChecked})
  };

  handleClose(item) {
    this.setState({ open: false });
    item.body = this.state.itemBody;
    item.title = this.state.itemTitle;
    item.deadline = this.state.itemDeadline;
    item.isComplete = this.state.itemIsComplete;
    this.props.onClose(item)
  };

  render() {
    return (
      <div>
        <Dialog
          open={this.props.open || false}
          onClose={this.handleClose}
          scroll={this.state.scroll}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit Task</DialogTitle>
          <Checkbox
                checked={this.state.itemIsComplete === "true"}
                tabIndex={-1}
                className={`isComplete_${this.props.item.id}`}
                disableRipple
                onClick={this.markComplete}
           />
           <form className="container" noValidate autoComplete="off">

            <TextField
              margin="normal"
              id="name"
              label="Title"
              type="text"
              fullWidth
              value={this.state.itemTitle}
              onChange={(e) => this.setState({ itemTitle: e.target.value })}
            />
             <TextField
              margin="normal"
              id="name"
              type="date"
              fullWidth
              value={this.state.itemDeadline}
              onChange={(e) => this.setState({ itemDeadline: e.target.value })}
            />
             <TextField
              autoFocus
              margin="normal"
              id="name"
              multiline
              rows="4"
              label="Details"
              type="text"
              fullWidth
              value={this.state.itemBody}
              onChange={(e) => this.setState({ itemBody: e.target.value })}
            />
          <DialogActions>
            <Button onClick={this.handleCancel.bind(this, this.props.item)} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose.bind(this, this.props.item)} color="primary">
              Save
            </Button>
          </DialogActions>
          </form>
        </Dialog>
      </div>
    );
  }
}

export default DetailView;