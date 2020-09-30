import React from "react";
import { observer } from "mobx-react";

import TodoItem from "./components/TodoItem";
import TodoViewModel from "./todoViewModel";

import "./App.css";

const todoViewModel = new TodoViewModel();

@observer
class App extends React.Component {
  renderTodoItems() {
    return todoViewModel.todoItems.map((element) => (
      <TodoItem
        task={element}
        del={() => todoViewModel.deleteTodo(element["id"])}
        toggleBoolean={() => todoViewModel.markTodo(element["id"])}
        editTodo={todoViewModel.editTodo}
        key={element["id"]}
      />
    ));
  }

  componentDidMount() {
    todoViewModel.appInit();
  }

  componentWillUnmount() {
    todoViewModel.appDie();
  }

  render() {
    return (
      <div>
        <input
          type="text"
          value={todoViewModel.text}
          onChange={(evt) => todoViewModel.updateAddInputValue(evt)}
        />
        <button onClick={todoViewModel.addTodo}>新增</button>

        <ul className="list">{this.renderTodoItems()}</ul>

        {todoViewModel.loading ? <div className="loading" /> : null}
        <button onClick={todoViewModel.allTodo}>全部</button>
        <button onClick={todoViewModel.allDoneTodo}>已完成</button>
        <button onClick={todoViewModel.query}>載入更多</button>
      </div>
    );
  }
}

export default App;
