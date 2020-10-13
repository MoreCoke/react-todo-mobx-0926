import { action, computed, observable, reaction, runInAction } from "mobx";
import { delay, fakeData } from "../utils";
import TodoItemViewModel from "./todoItemViewModel";

export const todosPerPage = 5;

export default class todoViewModel {
  @observable todos = [];
  @observable addText = "";
  @observable allCompleted = false;
  @observable loading = false;

  page = 1;
  logReaction = null;

  @computed get todoItems() {
    return this.todos.filter((element) =>
      this.allCompleted ? element["isCompleted"] : true
    );
  }

  @action.bound updateAddInputValue(evt) {
    this.addText = evt.target.value;
  }

  @action.bound addTodo() {
    const todo = new TodoItemViewModel(this.addText);
    this.todos.unshift(todo);
    this.addText = "";
  }

  @action.bound deleteTodo(id) {
    this.todos = this.todos.filter((element) => element["id"] !== id);
  }

  @action.bound allTodo() {
    this.allCompleted = false;
  }

  @action.bound allDoneTodo() {
    this.allCompleted = true;
  }

  @action.bound async query() {
    this.loading = true;

    const list = await delay(500).then(() => {
      const pageTodoStart = (this.page - 1) * 5;
      const pageTodoEnd = this.page * todosPerPage;
      return fakeData
        .slice(pageTodoStart, pageTodoEnd)
        .map((elemnt) => new TodoItemViewModel(elemnt.text));
    });

    if (list.length > 0) {
      this.page += 1;
    }

    runInAction(() => {
      this.todos = this.todos.concat(list);
      this.loading = false;
    });
  }

  appInit() {
    this.query();
    this.logReaction = reaction(
      () => this.todos.map((element) => element.text),
      (text) => console.log(text)
    );
  }

  appDie() {
    this.logReaction();
  }
}
