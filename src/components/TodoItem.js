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
    const {
      task: {
        isCompleted,
        isEdited,
        id,
        text,
        updateEditInputValue,
        editTodo,
        markTodo,
      },
      del,
    } = this.props;
    return (
      <li className="list-item">
        <input
          type="checkbox"
          value={isCompleted}
          defaultChecked={isCompleted}
          onClick={markTodo}
        />
        <span className={isCompleted ? "completed" : ""}>{text}</span>
        <input
          type="text"
          defaultValue={text}
          onChange={(evt) => updateEditInputValue(evt)}
          className={isEdited ? "" : "none"}
        />
        <button onClick={editTodo}>{isEdited ? "完成編輯" : "編輯"}</button>
        <button onClick={() => del(id)}>刪除</button>
      </li>
    );
  }
}
export default TodoItem;
