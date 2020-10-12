import { action, observable } from "mobx";

export default class todoItemViewModel {
  @observable editText = this.props.task.text;
  @observable isEdited = false;
  @observable isCompleted = false;
  @action.bound updateEditInputValue(evt) {
    this.editText = evt.target.value;
  }

  @action.bound editTodo() {
    this.isEdited = !this.isEdited;
  }

  @action.bound markTodo() {
    this.isCompleted = !this.isCompleted;
  }
}
