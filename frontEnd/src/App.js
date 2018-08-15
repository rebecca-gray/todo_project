import React from "react";
import ReactDOM from "react-dom";
import Input from "./input";
import MenuAppBar from "./MenuAppBar"
import 'whatwg-fetch'
import TodoList from "./todoList"
import ErrorBar from "./errorBar"

const divStyle = {
  padding: '100px',
  margin: '20px',
  border: '5px solid gray',
  borderRadius: '10px',
  backgroundColor: '#dee2e8',
};

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      error: "",
      isLoaded: false,
      showError: false
    };
    this.BASE_URL = `http://localhost:5000`;
    this.createTask = this.createTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.getTodos = this.getTodos.bind(this)
    this.getDetails = this.getDetails.bind(this)
    this.closeError = this.closeError.bind(this)
  }

  fetch(url, body, method) {
    console.log("FETCH", url)
    return fetch(`${this.BASE_URL}/${url}`, {
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        "content-type": "application/json",
      },
      method,
      mode: "cors",
    }).then((resp) => {
        if (resp.status === 404) {
          this.setState({
            isLoaded: true,
            error: "There was a problem connecting to the server.",
            showError: true
          });
        }
        if (resp.status >= 400) {
          return resp.json()
            this.setState({
              isLoaded: true,
              error: "The connection to the server is not authorized.",
              showError: true
            });
        }
        return resp.json();
    }).catch((error) => {
        this.setState({
          isLoaded: true,
          error,
          showError: true
        });
    })
  }

  getTodos(url = "all", body = "") {
    this.fetch(url, body, "GET")
    .then((todos) => {
        if (todos === undefined) {
          this.setState({
            isLoaded: true,
            todos: [],
            error: "Unable to connect to server",
            showError: true
          });
          return;
        }
        this.setState({
          isLoaded: true,
          todos,
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error,
          showError: true
        });
    })
  }

  getDetails(url = "detail", body = "", id) {
    if (!id) {
      this.setState({
        isLoaded: true,
        error: "Unable to get details for this item.",
        showError: true
      });
    }
    return this.fetch(`${url}?id=${id}`, body, "GET")
    .then((todos) => {
        return todos
      },
      (error) => {
          this.setState({
            isLoaded: true,
            error,
            showError: true
          });
      });
  }

  deleteTask(id, url = "delete", body = "") {
    if (!id) {
      this.setState({
        isLoaded: true,
        error: "Unable to get details for this item.",
        showError: true
      });
    }
    return this.fetch(`${url}?id=${id}`, body, "put")
    .then((res) => {
      this.setState({ todos: res })
    },
    (error) => {
        this.setState({
          isLoaded: true,
          error,
          showError: true
        });
    });
  }

  updateTask(id, url = "todo", body = "") {
    if (!id || !body) {
      this.setState({
        isLoaded: true,
        error: "Not able to fetch details for this item.",
        showError: true
      });
      return;
    }
    return this.fetch(`${url}?id=${id}`, body, "PUT")
    .then((res) => {
      this.setState({ todos: res })
    },
    (error) => {
        this.setState({
          isLoaded: true,
          error,
          showError: true
        });
    });
  }

  createTask(url = "todo", body = "") {
    if (!body) {
      this.setState({
        isLoaded: true,
        error: "Not able to fetch details for this item.",
        showError: true
      });
    }
    return this.fetch(`${url}`, body, "POST")
    .then((res) => {
      this.setState({ todos: res })
    },
    (error) => {
        this.setState({
          isLoaded: true,
          error,
          showError: true
        });
    });
  }

  handleDelete(item) {
    console.log("handleDelete", item)
    return this.deleteTask(item.id)
  }

  handleUpdate(item) {
    console.log("handleUpdate", item)
    return this.updateTask(item.id, "todo", item)
  }

  handleCreate(item) {
    console.log("handleCreate", item)
    return this.createTask("todo", item)
  }

  closeError() {
    this.setState({ showError: false })
  }

  componentDidMount() {
    this.getTodos()
  }

  render() {
    // const { error, isLoaded, todos } = this.state;
    if (!this.state.isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="app" style={divStyle}>
          <MenuAppBar filterItems={this.getTodos} />
          <ErrorBar open={this.state.showError} error={this.state.error} onClose={this.closeError}/>
          <Input handleSubmit={this.handleCreate} />
          <TodoList
              items={this.state.todos}
              getDetails={this.getDetails}
              handleDelete={this.handleDelete}
              handleUpdate={this.handleUpdate}
              className="todos"
          />
        </div>
      );
    }
  }
}

ReactDOM.render(<TodoApp />, document.getElementById('app'));