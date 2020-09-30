import React from "react";
import { observer } from "mobx-react";
import { action, computed, observable, reaction, runInAction } from "mobx";

import TodoItem from "./components/TodoItem";

import "./App.css";

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const fakeData = Array.from({ length: 15 }, (_, idx) => ({
  id: idx,
  text: Math.random().toString(36).substring(7),
}));

const todosPerPage = 5;

@observer
class App extends React.Component {
  @observable todos = [];
  @observable text = "";
  @observable allCompleted = false;
  @observable loading = false;

  page = 1;
  logReaction = null;

  @computed get todoItems() {
    return this.todos.filter((element) =>
      this.allCompleted ? element["isCompleted"] : true
    );
  }

  @action.bound updateAddInputValue(evt) {
    this.text = evt.target.value;
  }

  @action.bound addTodo() {
    const todo = {
      text: this.text,
      isCompleted: false,
      id: new Date().getTime(),
    };
    this.todos.unshift(todo);
    this.text = "";
  }

  @action.bound deleteTodo(id) {
    this.todos = this.todos.filter((element) => element["id"] !== id);
  }

  @action.bound editTodo(id, text) {
    const index = this.todos.map((element) => element["id"]).indexOf(id);
    this.todos[index].text = text;
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

  @action.bound async query() {
    this.loading = true;

    const list = await delay(500).then(() => {
      const pageTodoStart = (this.page - 1) * 5;
      const pageTodoEnd = this.page * todosPerPage;
      return fakeData
        .slice(pageTodoStart, pageTodoEnd)
        .map((elemnt) => ({
          ...elemnt,
          isCompleted: false
        }));
    });

    if (list.length > 0) {
      this.page += 1;
    }

    runInAction(() => {
      this.todos.concat(list);
      this.loading = false;
    });
  }

  renderTodoItems() {
    return this.todoItems.map((element) => (
      <TodoItem
        task={element}
        del={() => this.deleteTodo(element["id"])}
        toggleBoolean={() => this.markTodo(element["id"])}
        editTodo={this.editTodo}
        key={element["id"]}
      />
    ));
  }

  componentDidMount() {
    this.query();
    this.logReaction = reaction(
      () => this.todos.map((element) => element.text),
      (text) => console.log(text)
    );
  }

  componentWillUnmount() {
    this.logReaction();
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

        <ul className="list">{this.renderTodoItems()}</ul>

        {this.loading ? (<div className="loading" />) : null}
        <button onClick={this.allTodo}>全部</button>
        <button onClick={this.allDoneTodo}>已完成</button>
        <button onClick={this.query}>載入更多</button>
      </div>
    );
  }
}

export default App;
