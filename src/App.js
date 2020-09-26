import React from 'react';
import './App.css';
import TodoItem from './components/TodoItem';
import {observer} from 'mobx-react';
import {observable} from 'mobx';

@observer
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [],
      text: '',
      isCompleted: false,
      test: 123
    };
  }

  addTodo = () => {
    const { todos, text } = this.state;
    this.setState({
      text: '',
      editText: '',
      currentTodoText:'',
      todos: [
        ...todos,
        {
          text: text,
          isCompleted: false,
          isEdited: false,
          id: new Date().getTime(),
        },
      ],
    });
  }
  deleteTodo = (id) => {
    const { todos } = this.state;
    this.setState({
      todos: todos.filter((element) => element['id'] !== id),
    });
  }
  editTodo = (id) => {
    const { todos, editText } = this.state;
    let data = '';
    this.setState({
      todos: todos.map((element) => {
        if (element['id'] !== id) {
          return element;
        }
        if(editText) {
          return {
            ...element,
            text: editText,
            isEdited: !element.isEdited,
          };
        }
        return {
          ...element,
          isEdited: !element.isEdited,
        };
      }),
      editText: '',
      currentTodoText: data,
    });
  }
  updateAddInputValue = (evt) => {
    this.setState({
      text: evt.target.value,
    });
  }
  updateEditInputValue = (evt) => {
    this.setState({
        editText: evt.target.value,
    })
  }
  doneTodo = (id) => {
    const { todos } = this.state;
    this.setState({
      todos: todos.map((element) => {
        if (element['id'] !== id) {
          return element;
        }
        return {
          ...element,
          isCompleted: !element.isCompleted,
        };
      }),
    });
  }

  allTodo = () => {
    this.setState({
      isCompleted: false,
    });
  }

  allDoneTodo = () => {
    this.setState({
      isCompleted: true,
    });
  }

  renderTodoItems() {
    const { todos, isCompleted} = this.state;
    
    return (
      todos
      .filter((element) => {
        return isCompleted ? element['isCompleted']: true;
      })
      .map((element) => {
        return (
          <TodoItem
            task={element}
            del={() => this.deleteTodo(element['id'])}
            toggleBoolean={() => this.doneTodo(element['id'])}
            update={(evt) => this.updateEditInputValue(evt)}
            edit={() => this.editTodo(element['id'])}
            editText={this.state.editText}
            key={element['id']}
          />
        );
      })
    )
  }

  render() {
    const { text } = this.state;
    return (
      <div>
        <input
          type="text"
          value={text}
          onChange={(evt) => this.updateAddInputValue(evt)}
        />
        <button onClick={this.addTodo}>新增</button>
        <ul className="list">
          {this.renderTodoItems()}
        </ul>
        <button onClick={this.allTodo}>全部</button>
        <button onClick={this.allDoneTodo}>已完成</button>
      </div>
    );
  }
}

export default App;
