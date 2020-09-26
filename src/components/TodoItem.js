import React from 'react';


export default function TodoItem(props) {
  const {task, toggleBoolean, update, edit, del, editText} = props;
  return (
    <li className="list-item">
        <input
          type="checkbox"
          value={task.isCompleted}
          onClick={() => toggleBoolean(task.id)}
        />
        <span className={task.isCompleted ? 'completed' : ''}>
          {task.text}
        </span>
        <input type="text"
               value={editText}
               onChange={(evt) => update(evt)}
               className={task.isEdited ? '' : 'none'} />
        <button onClick={() => edit(task.id)}>{task.isEdited ? '完成編輯' : '編輯'}</button>
        <button onClick={() => del(task.id)}>刪除</button>
      </li>
  )
}