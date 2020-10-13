import { action, observable } from "mobx";

export default class todoItemViewModel {
  @observable text = "";
  @observable editText = "";
  @observable isEdited = false;
  @observable isCompleted = false;
  id = Math.random();
  constructor(txt) {
    this.text = txt;
  }

  @action.bound updateEditInputValue(evt) {
    this.editText = evt.target.value;
  }

  @action.bound editTodo() {
    if (this.editText) {
      this.text = this.editText;
    }
    this.isEdited = !this.isEdited;
  }

  @action.bound markTodo() {
    this.isCompleted = !this.isCompleted;
  }
}
