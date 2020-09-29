import React from "react";
import "./App.css";
import TodoItem from "./components/TodoItem";
import { observer } from "mobx-react";
import { action, computed, observable, reaction, runInAction } from "mobx";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const fakeData = Array.from({ length: 15 }, (_, idx) => ({
  id: idx,
  text: Math.random().toString(36).substring(7),
  isCompleted: false,
  isEdited: false,
}));

const todosPerPage = 5;

@observer
class App extends React.Component {
  @observable todos = [];
  @observable showTodos = [];
  @observable text = "";
  @observable editText = "";
  @observable allCompleted = false;
  @observable loading = false;
  @observable pages = Math.ceil(this.todos.length / todosPerPage);

  @action.bound updateAddInputValue(evt) {
    this.text = evt.target.value;
  }

  @action.bound updateEditInputValue(evt) {
    this.editText = evt.target.value;
  }

  @action.bound addTodo() {
    const todo = {
      text: this.text,
      isCompleted: false,
      isEdited: false,
      id: new Date().getTime(),
    };
    this.todos.push(todo);
    this.text = "";
    this.pages = Math.ceil(this.todos.length / todosPerPage);
  }

  @action.bound deleteTodo(id) {
    this.todos = this.todos.filter((element) => element["id"] !== id);
    this.showTodos = this.showTodos.filter((element) => element["id"] !== id);
    this.pages = Math.ceil(this.todos.length / todosPerPage);
  }

  @action.bound editTodo(id) {
    const index = this.todos.map((element) => element["id"]).indexOf(id);
    if (this.editText) {
      this.todos[index].text = this.editText;
      this.editText = "";
    }
    this.todos[index].isEdited = !this.todos[index].isEdited;
  }
  @action.bound markTodo(id) {
    const index = this.todos.map((element) => element["id"]).indexOf(id);
    this.todos[index].isCompleted = !this.todos[index].isCompleted;
  }

  @action.bound allTodo() {
    this.allCompleted = false;
  }

  @action.bound allDoneTodo() {
    this.allCompleted = true;
  }

  @action.bound async query(page = 1) {
    const pageTodoStart = (page - 1) * todosPerPage;
    const pageTodoEnd = pageTodoStart + todosPerPage;
    const currentPageTodos = this.todos.slice(pageTodoStart, pageTodoEnd);
    this.loading = true;
    await delay(500);
    runInAction(() => {
      this.loading = false;
      this.showTodos = currentPageTodos;
    });
  }

  @computed get todoItems() {
    return this.showTodos.filter((element) =>
      this.allCompleted ? element["isCompleted"] : true
    );
  }

  renderTodoItems() {
    return this.todoItems.map((element) => {
      return (
        <TodoItem
          task={element}
          del={() => this.deleteTodo(element["id"])}
          toggleBoolean={() => this.markTodo(element["id"])}
          update={(evt) => this.updateEditInputValue(evt)}
          edit={() => this.editTodo(element["id"])}
          key={element["id"]}
        />
      );
    });
  }

  pagination = () => {
    const pageArr = [];
    for (let i = 1; i <= this.pages; i++) {
      pageArr.push(
        <button key={i} onClick={() => this.query(i)}>
          {i}
        </button>
      );
    }
    return pageArr;
  };

  componentDidMount() {
    this.todos = [...fakeData];
    this.pages = Math.ceil(this.todos.length / todosPerPage);
    this.query();
    reaction(
      () => this.todos.map((element) => element.text),
      (text) => console.log(text)
    );
  }

  render() {
    return (
      <div>
        <input
          type="text"
          value={this.text}
          onChange={(evt) => this.updateAddInputValue(evt)}
        />
        <button onClick={this.addTodo}>新增</button>
        {this.loading ? (
          <div className="loading" />
        ) : (
          <ul className="list">{this.renderTodoItems()}</ul>
        )}
        <div>{this.pagination()}</div>
        <button onClick={this.allTodo}>全部</button>
        <button onClick={this.allDoneTodo}>已完成</button>
      </div>
    );
  }
}

export default App;
