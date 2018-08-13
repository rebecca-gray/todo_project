import React from "react";
import ReactDOM from "react-dom";
import Input from "./input";
import MenuAppBar from "./MenuAppBar"
import 'whatwg-fetch'
import TodoList from "./todoList"
import _ from "underscore"

class TodoApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      error: null,
      isLoaded: false
    };
    this.BASE_URL = `http://localhost:5000`;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.getTodos = this.getTodos.bind(this)
    this.getDetails = this.getDetails.bind(this)
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

  getDetails(url = "todo", body = "", id) {
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

  deleteRecord(url = "todo", body = "", id) {
    if (!id) {
      console.log("ERR no id provided to getDetails")
      return;
    }
    return this.fetch(`${url}?id=${item.id}`, body, "DELETE")
    .then((res) => {
      console.log("res", res)
      return id
    },
    (error) => {
        return "error"
    });
  }


  handleSubmit(e) {
    console.log("handleSubmit", e)
  }

  handleDelete(item) {
    console.log("handleSubmit", item)
    let todos = this.state.todos;
    const itemIndex = _.findIndex(todos, {
      id: item.id
    });
    if (itemIndex < 1) return;
    todos = todos.slice(itemIndex, itemIndex + 1)
    this.setState({ todos })
    return this.deleteRecord(item.id)
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

  /**
   *
   */
  markComplete(id, isComplete) {
    console.log("handleSubmit", id, isComplete)
    // this.setState(prevState => ({
    //   todos: prevState.todos.concat(e),
    // }));
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
        <div className="app">
          <MenuAppBar filterItems={this.getTodos}/>
          <Input handleSubmit={this.handleSubmit} todos={this.state.todos}/>
          <TodoList items={this.state.todos} markComplete={this.markComplete} getDetails={this.getDetails} handleDelete={this.handleDelete} className="todos"/>
        </div>
      );
    }

  }
}

ReactDOM.render(<TodoApp />, document.getElementById('app'));