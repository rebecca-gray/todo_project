import React from "react";
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  input: {
    margin: theme.spacing.unit,
  },
  checked: {},
  size: {
    width: 40,
    height: 40,
  },
  sizeIcon: {
    fontSize: 20,
  },
});

class Inputs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "",
            body: "",
            deadline: "",
            isComplete: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

  onSubmit(e) {
    console.log("onSubmit", e.target.id)
    e.preventDefault();
    this.props.handleSubmit({
        title: this.state.title,
        body: this.state.body,
        deadline: this.state.deadline,
        isComplete: false,
    });
    this.setState({
        title: "",
        body: "",
        deadline: "",
        isComplete: ""
    })
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({ [e.target.id]: e.target.value });
  }

  render() {
    return (
        <div>
        <Input
          placeholder="Title"
          id="title"
          inputProps={{
            'aria-label': 'Title',
          }}
          value={this.state.title}
          onChange={this.handleChange}
        />
        <Input
          placeholder="Description"
          id="body"
          inputProps={{
            'aria-label': 'Description',
          }}
          value={this.state.body}
          onChange={this.handleChange}
        />
        <TextField
            id="deadline"
            label="Deadline"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
            value={this.state.deadline}
            onChange={this.handleChange}
        />
        <Button color="primary" onClick={this.onSubmit}>
            Upload
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(Inputs);
