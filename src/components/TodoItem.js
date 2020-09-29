import React from "react";
import { observer } from "mobx-react";

const TodoItem = observer((props) => {
  const { task, toggleBoolean, update, edit, del } = props;
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
        onChange={(evt) => update(evt)}
        className={task.isEdited ? "" : "none"}
      />
      <button onClick={() => edit(task.id)}>
        {task.isEdited ? "完成編輯" : "編輯"}
      </button>
      <button onClick={() => del(task.id)}>刪除</button>
    </li>
  );
});

export default TodoItem;
