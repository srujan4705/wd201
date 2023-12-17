const todoList = () => {
    let all = [];
    const add = (todoItem) => {
      all.push(todoItem)
    }
    const markAsComplete = (index) => {
      all[index].completed = true
    }
  
    const overdue = () => {
      // Write the date check condition here and return the array
      // of overdue items accordingly.
      const todayDate  = new Date().toISOString().split("T")[0];
      return all.filter((item) => !item.completed && item.dueDate <  todayDate)
    }
  
    const dueToday = () => {
      // Write the date check condition here and return the array
      // of todo items that are due today accordingly.
      const todayDate  = new Date().toISOString().split("T")[0];
      return all.filter((item) => item.dueDate == todayDate)
    }
  
    const dueLater = () => {
      // Write the date check condition here and return the array
      // of todo items that are due later accordingly.
      const todayDate  = new Date().toISOString().split("T")[0];
      return all.filter((item) => !item.completed && item.dueDate >  todayDate)
    }
  
    const toDisplayableList = (list) => {
      // Format the To-Do list here, and return the output string
      // as per the format given above.
      return list.map(item  =>{
        const textDue = item.dueDate ? item.dueDate == new Date().toISOString().split("T")[0] ? "" : `${item.dueDate}` :"";
        const status = item.completed ? "[x]" : "[ ]";
        return `${status} ${item.title} ${textDue}`;
      })
      
    }
  
    return {
      all,
      add,
      markAsComplete,
      overdue,
      dueToday,
      dueLater,
      toDisplayableList
    };
};

module.exports = todoList;