import React from "react";
import "./App.css";
import TodoItem from "./components/TodoItem";
import { observer } from "mobx-react";
import { action, computed, observable } from "mobx";

@observer
class App extends React.Component {
  @observable todos = [];
  @observable text = "";
  @observable editText = "";
  @observable allCompleted = false;

  @action.bound
  updateAddInputValue(evt) {
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
  }

  @action.bound deleteTodo(id) {
    this.todos = this.todos.filter((element) => element["id"] !== id);
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

  @computed get todoItems() {
    return this.todos.filter((element) =>
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
        <button onClick={this.allTodo}>全部</button>
        <button onClick={this.allDoneTodo}>已完成</button>
      </div>
    );
  }
}

export default App;
