const txt = document.getElementById("txt1");
const btn = document.getElementById("btn1");
const lst = document.getElementById("lst1");

window.onload = function () {
  showCurrentDate();
  showCurrentTime();
  loadtasks(); // your existing function to load tasks
  updateClearButton();
};

btn.addEventListener("click", addtask);

function addtask() {
  const tasktxt = txt.value.trim();

  if (tasktxt === "") {
    alert("please enter a task");
    return;
  }

  const taskli = document.createElement("li");

  const taskSpan = document.createElement("span");
  taskSpan.textContent = tasktxt;

  const createdTime = document.createElement("small");
  const now = new Date();

  createdTime.textContent = `Created at: ${now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  taskli.appendChild(taskSpan);
  taskli.appendChild(createdTime);

  const editbtn = document.createElement("button");
  editbtn.textContent = "Edit";

  const delbtn = document.createElement("button");
  delbtn.textContent = "Delete";

  taskli.onclick = () => {
    taskli.classList.toggle("completed");
    updateLocalStorage();
  };

  const btngroup = document.createElement("div");
  btngroup.appendChild(editbtn);
  btngroup.appendChild(delbtn);

  lst.appendChild(taskli);
  taskli.appendChild(btngroup);

  saveToLocalStorage(tasktxt, false, createdTime.textContent);

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
  updateClearButton();
}

function loadtasks() {
  const savetasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savetasks.forEach((element) => {
    const taskli = createTaskElement(
      element.text,
      element.completed,
      element.createdTime
    );
    lst.appendChild(taskli);
  });
}

function createTaskElement(taskText, IsComplete, createdTimeText) {
  const li = document.createElement("li");

  const taskSpan = document.createElement("span");
  taskSpan.textContent = taskText;

  const createdTime = document.createElement("small");
  createdTime.textContent = createdTimeText || "";

  li.appendChild(taskSpan);
  li.appendChild(createdTime);

  if (IsComplete) {
    li.classList.add("completed");
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

function saveToLocalStorage(text, completed, createdTime) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({ text, completed, createdTime });
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

const search = document.getElementById("searchBox");

search.addEventListener("input", srchfn);

function srchfn() {
  const filter = search.value.toLowerCase();
  const tasks = lst.getElementsByTagName("li");

  for (let i = 0; i < tasks.length; i++) {
    const newtxt = tasks[i].firstChild.textContent.toLowerCase();
    if (newtxt.includes(filter)) {
      tasks[i].style.display = "";
    } else {
      tasks[i].style.display = "none";
    }
  }
}

function showCurrentDate() {
  const dateElement = document.getElementById("currentDate");

  const today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  const formattedDate = today.toLocaleDateString("en-IN");

  dateElement.textContent = formattedDate;
}

function showCurrentTime() {
  const timeElement = document.getElementById("currentTime");
  const time = new Date();

  const timeOptions = {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };

  const formattedTime = time.toLocaleTimeString("en-IN", timeOptions);

  const dateElement = document.getElementById("currentDate");
  const formattedDate = dateElement.textContent;

  const formattedDateTime = `${formattedTime}`;

  timeElement.textContent = formattedDateTime;
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

const clearBtn = document.getElementById("btn2");
clearBtn.addEventListener("click", clearAllTasks);

function clearAllTasks() {
  if (confirm("Are you sure you want to clear all tasks?")) {
    lst.innerHTML = "";
    localStorage.removeItem("tasks");
    updateClearButton();
  }
}

const observer = new MutationObserver(updateClearButton);
observer.observe(lst, { childList: true });

function updateClearButton() {
  clearBtn.disabled = lst.children.length === 0;
}
