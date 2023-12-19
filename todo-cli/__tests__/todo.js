
const customTodoList = require("../todo");

describe("CustomTodoList Test Suite", () => {
  let myTodo;

  beforeEach(() => {
    myTodo = customTodoList();
  });

  test("Should add a new custom todo", () => {
    myTodo.addCustomTodo({
      taskTitle: "New Custom Todo",
      isCompleted: false,
      deadline: "2023-12-31",
    });

    expect(myTodo.getList().length).toBe(1);
    expect(myTodo.getList()[0].taskTitle).toBe("New Custom Todo");
  });

  test("Should mark a custom todo as completed", () => {
    myTodo.addCustomTodo({
      taskTitle: "Incomplete Custom Todo",
      isCompleted: false,
      deadline: "2023-12-31",
    });

    myTodo.completeTask(0);

    expect(myTodo.getList()[0].isCompleted).toBe(true);
  });

  test("Should retrieve overdue custom todos", () => {
    const today = new Date().toISOString().split("T")[0];

    myTodo.addCustomTodo({
      taskTitle: "Overdue Custom Todo",
      isCompleted: false,
      deadline: "2023-01-01",
    });

    const overdueItems = myTodo.getOverdueTasks();

    expect(overdueItems.length).toBe(1);
    expect(overdueItems[0].taskTitle).toBe("Overdue Custom Todo");
  });

  test("Should retrieve custom todos due today", () => {
    const today = new Date().toISOString().split("T")[0];

    myTodo.addCustomTodo({
      taskTitle: "Due Today Custom Todo",
      isCompleted: false,
      deadline: today,
    });

    const dueTodayItems = myTodo.getTasksDueToday();

    expect(dueTodayItems.length).toBe(1);
    expect(dueTodayItems[0].taskTitle).toBe("Due Today Custom Todo");
  });

  test("Should retrieve custom todos due later", () => {
    const today = new Date().toISOString().split("T")[0];

    myTodo.addCustomTodo({
      taskTitle: "Due Later Custom Todo",
      isCompleted: false,
      deadline: "2023-12-31",
    });

    const dueLaterItems = myTodo.getTasksDueLater();

    expect(dueLaterItems.length).toBe(1);
    expect(dueLaterItems[0].taskTitle).toBe("Due Later Custom Todo");
  });
});
