import React from "react";
import ReactDOM from "react-dom";
import Input from "./input";
import MenuAppBar from "./MenuAppBar"
import 'whatwg-fetch'
import TodoList from "./todoList"

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
      error: null,
      isLoaded: false
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
    }).then(
      (resp) => {
        if (resp.status === 404) {
          return Promise.reject(new RouterError());
      }
      if (resp.status >= 400) {
          return resp.json()
              .catch(() => Promise.reject(new ServerError()))
              .then(json => Promise.reject(new ServerError(json)));
      }
      console.log("RESP.status", resp.status)
      return resp.json();
    })
  }

  getTodos(url = "all", body = "") {
    this.fetch(url, body, "GET")
    .then((todos) => {
      console.log("todos", todos)
      this.setState({
          isLoaded: true,
          todos
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
    })
  }

  getDetails(url = "detail", body = "", id) {
    if (!id) {
      console.log("ERR no id provided to getDetails")
      return;
    }
    return this.fetch(`${url}?id=${id}`, body, "GET")
    .then((todos) => {
      console.log("todos", todos)
        return todos
      },
      (error) => {
          return "error"
      });
  }

  deleteTask(id, url = "", body = "") {
    if (!id) {
      console.log("ERR no id provided to getDetails")
      return;
    }
    return this.fetch(`${url}?id=${id}`, body, "DELETE")
    .then((res) => {
      console.log("res", res)
      return id
    },
    (error) => {
        return "error"
    });
  }

  updateTask(id, url = "todo", body = "") {
    if (!id || !body) {
      console.log("ERR no id provided to getDetails")
      return;
    }
    return this.fetch(`${url}?id=${id}`, body, "PUT")
    .then((res) => {
      console.log("res", res)
      return id
    },
    (error) => {
        return "error"
    });
  }

  createTask(url = "todo", body = "") {
    if (!body) {
      console.log("ERR no id provided to getDetails")
      return;
    }
    return this.fetch(`${url}`, body, "POST")
    .then((res) => {
      console.log("res", res)
      return id
    },
    (error) => {
        return "error"
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

  componentDidMount() {
    this.getTodos()
  }

  render() {
    const { error, isLoaded, todos } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="app" style={divStyle}>
          <MenuAppBar filterItems={this.getTodos} />
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