import React from "react";
import { observer } from "mobx-react";
import { observable, action } from "mobx";

@observer
class TodoItem extends React.Component {
  @observable editText = this.props.task.text;
  @observable isEdited = false;

  @action.bound updateEditInputValue(evt) {
    this.editText = evt.target.value;
  }

  @action.bound editTodo(id) {
    const { editTodo } = this.props;
    editTodo(id, this.editText);
    this.isEdited = !this.isEdited;
  }

  render() {
    const { task, toggleBoolean, del } = this.props;
    return (
      <li className="list-item">
        <input
          type="checkbox"
          value={task.isCompleted}
          defaultChecked={task.isCompleted}
          onClick={() => toggleBoolean(task.id)}
        />
        <span className={task.isCompleted ? "completed" : ""}>{task.text}</span>
        <input
          type="text"
          defaultValue={task.text}
          onChange={(evt) => this.updateEditInputValue(evt)}
          className={this.isEdited ? "" : "none"}
        />
        <button
          onClick={() => {
            this.editTodo(task.id);
          }}
        >
          {this.isEdited ? "完成編輯" : "編輯"}
        </button>
        <button onClick={() => del(task.id)}>刪除</button>
      </li>
    );
  }
}
export default TodoItem;
