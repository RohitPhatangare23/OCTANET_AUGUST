import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { LuClipboardEdit } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import "./App.css";
import "./todoo.css";

function Todo() {

    //add data in local storeage.
  const todokey = "reactTodo";
  const [inputValue, setInputValue] = useState({
    id: "",
    content: "",
    checked: false,
  });

  //create useState. //add data in local storeage.
  const [task, setTask] = useState(() => {
    const rawTodo = localStorage.getItem(todokey);
    if (!rawTodo) return [];
    return JSON.parse(rawTodo);
  });
  //edit usestate
  const [isEditing, setIsEditing] = useState(false);

  //date-time usestate
  const [dateTime, setDateTime] = useState("");

  const handleInputChange = (value) => {
    setInputValue({ ...inputValue, content: value });
  };

  const handelForSubmit = (event) => {
    event.preventDefault();
    const { id, content, checked } = inputValue;

    if (!content) {
      return;
    }

    const ifTodoContentMatched = task.find(
      (curTask) => curTask.content === content
    );
    if (ifTodoContentMatched && !isEditing) {
      return;
    }

    if (isEditing) {
      // Update the existing task
      const updatedTask = task.map((curTask) =>
        curTask.id === id ? { ...curTask, content } : curTask
      );
      setTask(updatedTask);
      setIsEditing(false);
    } else {
      // Add new task
      setTask((prevTask) => [
        ...prevTask,
        { id: Date.now(), content, checked },
      ]);
    }

    setInputValue({ id: "", content: "", checked: false });
  };

  // use useEffect to add date-time
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedDate = now.toLocaleDateString();
      const formattedTime = now.toLocaleTimeString();
      setDateTime(`${formattedDate} - ${formattedTime}`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  //handel localstorage
  useEffect(() => {
    localStorage.setItem("reactTodo", JSON.stringify(task));
  }, [task]);

  //handel delete functionality
  const handelDeleteTodo = (value) => {
    const updatedTask = task.filter((curTask) => curTask.id !== value.id);
    setTask(updatedTask);
  };

//handel check/uncheck task functionality
  const handleToggleCheck = (value) => {
    const updatedTask = task.map((curTask) =>
      curTask.id === value.id
        ? { ...curTask, checked: !curTask.checked }
        : curTask
    );
    setTask(updatedTask);
  };

  const handelEditbtn = (value) => {
    setInputValue({
      id: value.id,
      content: value.content,
      checked: value.checked,
    });
    setIsEditing(true);
  };

  const handelClearButton = () => {
    setTask([]);
  };

  return (
    <>
      <section className="todo-container">
        <header>
          <h1>Todo List</h1>
          <h3 className="date-time">{dateTime}</h3>
        </header>
        <section className="form">
          <form onSubmit={handelForSubmit}>
            <div>
              <input
                type="text"
                className="todo-input"
                placeholder="Add New Task"
                autoComplete="off"
                value={inputValue.content}
                onChange={(event) => handleInputChange(event.target.value)}
              />
            </div>
            <div>
              <button type="submit" className="todo-btn">
                {isEditing ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </section>
        <section className="myUnorderList">
          <ul>
            {task.map((curTask) => (
              <li key={curTask.id} className="todo-item">
                <span className={curTask.checked ? "checkList" : ""}>
                  {curTask.content}
                </span>
                <button
                  className="check-btn"
                  onClick={() => handleToggleCheck(curTask)}
                >
                  <FaCheck />
                </button>
                <button
                  className="edit-btn"
                  onClick={() => handelEditbtn(curTask)}
                >
                  <LuClipboardEdit />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handelDeleteTodo(curTask)}
                >
                  <MdDelete />
                </button>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <button className="clear-btn" onClick={handelClearButton}>
            Clear All
          </button>
        </section>
      </section>
    </>
  );
}

export default Todo;
