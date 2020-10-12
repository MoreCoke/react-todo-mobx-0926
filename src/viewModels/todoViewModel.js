import { action, computed, observable, reaction, runInAction } from "mobx";
import { delay, fakeData } from "./utils";

export const todosPerPage = 5;

export default class todoViewModel {
  @observable todos = [];
  @observable text = "";
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
    this.text = evt.target.value;
  }

  @action.bound addTodo() {
    const todo = {
      text: this.text,
      isCompleted: false,
      id: new Date().getTime(),
    };
    this.todos.unshift(todo);
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

  @action.bound async query() {
    this.loading = true;

    const list = await delay(500).then(() => {
      const pageTodoStart = (this.page - 1) * 5;
      const pageTodoEnd = this.page * todosPerPage;
      return fakeData.slice(pageTodoStart, pageTodoEnd).map((elemnt) => ({
        ...elemnt,
        isCompleted: false,
      }));
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
