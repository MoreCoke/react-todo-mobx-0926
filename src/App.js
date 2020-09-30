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
}));

const todosPerPage = 5;

// fakeData 把 isComplete 移出來 別改ＡＰＩ資料

@observer
class App extends React.Component {
  @observable todos = [];
  @observable text = "";
  @observable allCompleted = false;
  @observable loading = false;
  @observable page = 1;

  @computed get todoItems() {
    return this.showTodos.filter((element) =>
      this.allCompleted ? element["isCompleted"] : true
    );
  }

  @computed get totoalPage() {
    return Math.ceil(this.todos.length / todosPerPage);
  }

  @computed get showTodos() {
    const pageTodoEnd = this.page * todosPerPage;
    const currentPageTodos = this.todos.slice(0, pageTodoEnd);
    return currentPageTodos;
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
    this.todos.push(todo);
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

  @action.bound async query(init = false) {
    this.loading = true;
    await delay(500).then(() => {
      runInAction(() => {
        if (init) {
          this.todos = [...fakeData];
        }
        if (!init && this.page <= this.totoalPage) {
          this.page += 1;
        }
        this.loading = false;
      });
    });
  }

  renderTodoItems() {
    return this.todoItems.map((element) => {
      return (
        <TodoItem
          task={element}
          del={() => this.deleteTodo(element["id"])}
          toggleBoolean={() => this.markTodo(element["id"])}
          editTodo={this.editTodo}
          key={element["id"]}
        />
      );
    });
  }

  componentDidMount() {
    this.query(true);
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
        <button onClick={this.allTodo}>全部</button>
        <button onClick={this.allDoneTodo}>已完成</button>
        <button onClick={() => this.query()}>載入更多</button>
      </div>
    );
  }
}

export default App;
