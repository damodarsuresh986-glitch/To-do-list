const txt = document.getElementById("txt1");
const btn = document.getElementById("btn1");
const lst = document.getElementById("lst1");

window.onload = loadtasks;

btn.addEventListener("click", addtask);

function addtask() {
  const tasktxt = txt.value.trim();

  if (tasktxt === "") {
    alert("please enter a task");
    return;
  }

  const taskli = document.createElement("li");
  taskli.textContent = tasktxt;

  const editbtn = document.createElement("button");
  editbtn.textContent = "Edit";

  const delbtn = document.createElement("button");
  delbtn.textContent = "Delete";

  taskli.onclick = () => {
    taskli.classList.toggle("completed");
  };

  const btngroup = document.createElement("div");
  btngroup.appendChild(editbtn);
  btngroup.appendChild(delbtn);

  lst.appendChild(taskli);
  taskli.appendChild(btngroup);

  saveToLocalStorage(tasktxt, false);

  delbtn.addEventListener("click", delfn);

  function delfn() {
    lst.removeChild(taskli);
  }

  editbtn.addEventListener("click", editfn);

  function editfn() {
    const newtasktxt = prompt("edit your tast", taskli.firstChild.textContent);
    if (newtasktxt !== null && newtasktxt.trim() !== "") {
      taskli.firstChild.textContent = newtasktxt;
    }
  }
  txt.value = "";
}

function loadtasks() {
  const savetasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savetasks.forEach((element) => {
    const taskli = createTaskElement(element.text, element.completed);
    lst.appendChild(taskli);
  });
}

function createTaskElement(taskText, IsComplete) {
  const li = document.createElement("li");
  li.textContent = taskText;

  if (IsComplete) {
    li.style.textAlign = "underline";
  }

  const editbtn = document.createElement("button");
  editbtn.textContent = "Edit";

  const delbtn = document.createElement("button");
  delbtn.textContent = "Delete";

  const btngroup = document.createElement("div");
  btngroup.appendChild(editbtn);
  btngroup.appendChild(delbtn);
  li.appendChild(btngroup);

  // Delete task
  delbtn.addEventListener("click", () => {
    lst.removeChild(li);
    updateLocalStorage();
  });

  // Edit task
  editbtn.addEventListener("click", () => {
    const newtasktxt = prompt("Edit your task:", li.firstChild.textContent);
    if (newtasktxt !== null && newtasktxt.trim() !== "") {
      li.firstChild.textContent = newtasktxt.trim();
      updateLocalStorage();
    }
  });

  return li;
}

function saveToLocalStorage(text, completed) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text, completed });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateLocalStorage() {
  const allTasks = [];
  lst.querySelectorAll("li").forEach((li) => {
    const text = li.firstChild.textContent;
    const completed = li.classList.contains("completed");
    allTasks.push({ text, completed });
  });
  localStorage.setItem("tasks", JSON.stringify(allTasks));
}
