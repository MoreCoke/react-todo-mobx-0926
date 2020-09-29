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

// showtodo 用 computed 做
// marktodo 放進 todoItem
// fakeData 把 isComplete 移出來 別改ＡＰＩ資料
// pagination 改成載入更多

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

  @computed get pages() {
    return Math.ceil(this.todos.length / todosPerPage);
  }

  @computed get showTodos() {
    const pageTodoStart = (this.page - 1) * todosPerPage;
    const pageTodoEnd = pageTodoStart + todosPerPage;
    const currentPageTodos = this.todos.slice(pageTodoStart, pageTodoEnd);
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

  @action.bound async query(page = 1) {
    this.loading = true;
    await delay(500).then(() => {
      runInAction(() => {
        this.page = page;
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
