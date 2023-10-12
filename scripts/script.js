// lisätään kuuntelija, joka kutsuu "loadTasks" -funktiota kun DOM-rakenne on ladattu
document.addEventListener("DOMContentLoaded", loadTasks);

// haetaan tarvittavat HTML-elementit (itse lomake, syöttökenttä, virheilmoitus, tehtävälista, tehtävälaskuri ja niiden filtteröijä)
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const errorMessage = document.getElementById("error-message");
const taskList = document.getElementById("task-list");
const taskCounter = document.getElementById("task-counter");
const filter = document.getElementById("filter");

// määritellään tasks-muuttuja taulukkona (tähän tallennetaan tehtävät)
let tasks = [];

// lisätään kuuntelijat lomakkeen lähettämiseen, filtteröintiin sekä tehtävien klikkauksiin
taskForm.addEventListener("submit", addTask);
filter.addEventListener("change", filterTasks);
taskList.addEventListener("click", handleCheckboxClick);
taskList.addEventListener("click", handleDeleteButtonClick);

// määritellään funktio, joka lataa tallennetut tehtävät selaimesta ja päivittää "tasks" -taulukon sen mukaan
function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = savedTasks;
    updateTaskList();
}

// määritellään funktio, joka tallentaa annetut tehtävät selaimen localstorageen JSON-muodossa
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// määritellään funktio, joka lisää uuden tehtävän ja näyttää virheilmoituksen sekä lisää punaisen reunan syöttökenttään mikäli se on tyhjä lomaketta lähettäessä. Muutoin uusi tehtävä lisätään "tasks" -taulukkoon, tallennetaan localstorageen ja tehtävälista päivittyy
function addTask(e) {
    e.preventDefault();
    const taskText = taskInput.value.trim();

    if (!taskText) {
        showError("The task cannot be empty.");
        taskInput.classList.add("error-border");
        return;
    }

    taskInput.classList.remove("error-border");

    tasks.push({ text: taskText, completed: false });
    saveTasks();
    updateTaskList();
    taskInput.value = "";
    errorMessage.textContent = "";
}

// funktio näyttää virheilmoituksen lomakkeen alapuolella
function showError(message) {
    errorMessage.textContent = message;
}

// funktio käsittelee tehtävälistan klikkailuja ja merkitsee tehtävän suoritetuksi, jos ruutu valitaan 
function handleCheckboxClick(e) {
    if (e.target.type === "checkbox") {
        const index = e.target.dataset.index;
        tasks[index].completed = e.target.checked;
        saveAndRefreshTasks();
    }
}

// kuten ylempi, tämäkin funktio käsittelee tehtävälistan klikkailuja ja poistaa tehtävän mikäli poistonappia klikataan
function handleDeleteButtonClick(e) {
    if (e.target.classList.contains("delete-button")) {
        const index = e.target.dataset.index;
        tasks.splice(index, 1);
        saveAndRefreshTasks();
    }
}

// tallentaa ja päivittää tehtävälistan kutsumalla aiemmin määriteltyjä funktioita
function saveAndRefreshTasks() {
    saveTasks();
    updateTaskList();
}

// filtteröi näytettävät tehtävät (kaikki, aktiiviset, suoritetut) riippuen mitä käyttäjä valitsee
function filterTasks() {
    const filterValue = filter.value;
    const filteredTasks = tasks.filter(task => {
        if (filterValue === "all") {
            return true;
        } else if (filterValue === "active") {
            return !task.completed;
        } else if (filterValue === "completed") {
            return task.completed;
        }
    });
    updateTaskList(filteredTasks);
}

// päivittää näytettävät tehtävät, lisää jokaisen annetun tehtävän tyhjään listaan
function updateTaskList(taskArray = tasks) {
    taskList.innerHTML = "";
    taskCounter.textContent = `You have ${taskArray.filter(task => !task.completed).length} active tasks`;
    taskArray.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
            <label class="custom-checkbox">
                <input type="checkbox" ${task.completed ? "checked" : ""} data-index="${index}">
                <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
            </label>
            <button class="delete-button" data-index="${index}">
            Delete
            </button>
        `;
        taskList.appendChild(listItem);
    });
}
