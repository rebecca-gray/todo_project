import React from "react";
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import moment from "moment"
import DetailView from "./detailView";

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});

class TodoList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedItem: null,
      modalOpen: {},
    };
    // initialize with modals closed
    props.items.forEach((item) => {
      this.state.modalOpen[item.id] = false;
    })
    this.hideDetails = this.hideDetails.bind(this)
  }

  handleClick() {
    this.setState(state => ({ open: !state.open }));
  };

  handleChange (id) {
      console.log("change", id)
    // this.setState({
    //   expanded: this.state.expanded ? this.panel : false,
    // });
    // const index = this.props.items.findIndex(x => x.id === this.key)
    // console.log("STUFF", {
    //     id: this.panel.key,
    //     title: document.querySelector(`.{title_${this.panel.key}}`)
    // })
  };

  handleDelete (item) {
    console.log("delete", item.id)
    this.props.handleDelete(item)
  }

  markComplete(id) {
    console.log("markComplete")
    // this.props.items.map(item => {
    //     if (item.id === id) {
    //       const isComplete = item.isComplete === "false" ? "true" : "false"
    //       item.isComplete = isComplete;
    //       this.props.markComplete(item, isComplete)
    //     }
    // })
  };

  displayDetails(item) {
    if (this.state.selectedItem) {
       return this.hideDetails(item)
    }
    console.log("displaydetails", item.id)
    this.props.getDetails("detail", "", item.id)
    .then((data) => {
      console.log("data from fetch", data)
      // item = data;
      const modalOpen = this.state.modalOpen;
      modalOpen[item.id] = true;
      this.setState({
        selectedItem: data,
        modalOpen
      });
    })
  }

  hideDetails(item) {
    console.log("hideDetails", item)
    const modalOpen = this.state.modalOpen;
    modalOpen[item.id] = false;
    this.setState({
      selectedItem: null,
      modalOpen
    });
  }

  render() {
    const today = moment()
    const tomorrow = moment().add(1, "d")
    const { selectedItem } = this.state;

    if (this.props.items.length < 1) {
      return (
        <ListItem
          key='empty_element'
          primaryText='No Tasks Yet'
        />
      )
    }
    return (
      <div className={this.props.items.root}>
          <List>
          {this.props.items.map(item => (
            <ListItem
              divider={true}
              key={item.id}
              role={undefined}
              dense
              button
              onClick={this.displayDetails.bind(this, item)}
             className={item.id.toString()}
            >
              {selectedItem && (
                <DetailView
                  open={this.state.modalOpen[item.id]}
                  markComplete={this.markComplete}
                  item={selectedItem}
                />
              )}
              {(moment(item.deadline, ["MM-DD-YYYY", "YYYY-MM-DD"]).isBefore(today) && item.isComplete === "false") &&
                  <ListItemText secondary={"OverDue"} />
              }
              {moment(item.deadline, ["MM-DD-YYYY", "YYYY-MM-DD"]).isAfter(today) &&
                  <ListItemText secondary={"-------------"} />
              }
              <Checkbox
                checked={item.isComplete === "true"}
                tabIndex={-1}
                className={`isComplete_${item.id}`}
                disableRipple
                onClick={this.markComplete.bind(this, item.id)}
              />
            <ListItemText primary={item.title} />
              {moment(item.deadline, ["MM-DD-YYYY", "YYYY-MM-DD"]).isSame(today, "day") &&
                  <ListItemText className={`deadline_${item.id}`}>Today</ListItemText>
              }
              {moment(item.deadline, ["MM-DD-YYYY", "YYYY-MM-DD"]).isSame(tomorrow, "day") &&
                  <ListItemText className={`deadline_${item.id}`}>Tomorrow</ListItemText>
              }
              {(!moment(item.deadline, ["MM-DD-YYYY", "YYYY-MM-DD"]).isSame(today, "day") && !moment(item.deadline, ["MM-DD-YYYY", "YYYY-MM-DD"]).isSame(tomorrow, "day")) &&
                  <ListItemText secondary={item.deadline} />
              }
            <ListItemSecondaryAction>
                 <IconButton aria-label="Delete">
                  <Delete onClick={this.handleDelete.bind(this, item)} />
                 </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    );
  }
}
TodoList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TodoList);
