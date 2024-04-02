const todoListEl = document.getElementById("todoList");
const todoInputEl = document.getElementById("todoInput");

const API_URL = "http://localhost:8080/todos";

fetch(API_URL)
  .then((response) => response.json())
  .then((data) => renderTodo(data));

const updateTodo = (todoId, newTitle) => {
  const title = newTitle;
  const date = new Date();
  const createdAt = date.toDateString();

  if (!title) return;

  const newTodo = {
    id: todoId,
    title,
    createdAt,
  };

  fetch(API_URL + "/" + todoId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTodo),
  })
    .then(() => fetch(API_URL))
    .then((response) => response.json())
    .then((data) => renderTodo(data));
};

const catchEnter = (event) => {
  if (event.key === "Enter") {
    addTodo();
  }
};

const renderTodo = (newTodos) => {
  todoListEl.innerHTML = "";
  newTodos.forEach((todo) => {
    const listEl = document.createElement("li");
    listEl.id = `todo-${todo.id}`;
    listEl.style.display = "flex";
    listEl.style.gap = "30px";

    const todoContentInput = document.createElement("input");
    todoContentInput.value = todo.title;
    todoContentInput.style.border = "none";
    todoContentInput.style.fontSize = "16px";
    todoContentInput.style.width = "100%";
    todoContentInput.addEventListener("mousedown", function (e) {
      e.preventDefault();
    });
    todoContentInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        updateTodo(todo.id, todoContentInput.value);
      }
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "10px";

    const udpateEl = document.createElement("span");
    udpateEl.style.cursor = "pointer";
    udpateEl.textContent = "✏️";
    udpateEl.onclick = () => todoContentInput.focus();

    const deleteEl = document.createElement("span");
    deleteEl.style.cursor = "pointer";
    deleteEl.textContent = "🗑️";
    deleteEl.onclick = () => deleteTodo(todo.id);

    listEl.append(todoContentInput);
    listEl.append(buttonContainer);

    buttonContainer.append(udpateEl);
    buttonContainer.append(deleteEl);
    todoListEl.append(listEl);
  });
};

const addTodo = () => {
  const title = todoInputEl.value;
  const date = new Date();
  const createdAt = date.toDateString();

  if (!title) return;

  const newTodo = {
    id: date.getTime(),
    title,
    createdAt,
  };

  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...newTodo, completed: false }),
  })
    .then((response) => response.json())
    .then(() => {
      todoInputEl.value = "";
      return fetch(API_URL);
    })
    .then((response) => response.json())
    .then((data) => renderTodo(data));
};

const deleteTodo = (todoId) => {
  console.log("first");
  fetch(API_URL + "/" + todoId, {
    method: "DELETE",
  })
    .then(() => fetch(API_URL))
    .then((response) => response.json())
    .then((data) => renderTodo(data));
};
