let tasksData = {};

const todo = document.querySelector('#todo');
const progress = document.querySelector('#progress');
const done = document.querySelector('#done');
const columns = [todo, progress, done];

let dragElement = null;

// Load tasks from localStorage on page load
if (localStorage.getItem("tasksData")) { 
    const Data = JSON.parse(localStorage.getItem("tasksData"));

    console.log(Data);


    for (const col in Data) {
        const column = document.querySelector(`#${col}`);
        
        // Create task elements for each saved task
        Data[col].forEach(task => {
            const div = document.createElement("div");

            div.classList.add("task");
            div.setAttribute("draggable", "true");
            div.innerHTML = `<h2>${task.title}</h2>
                            <p>${task.desc}</p>
                            <button class="delete-btn">Delete</button>`;
            column.appendChild(div);

            
            div.addEventListener("dragstart", (e) => {
                dragElement = div;
            });

            const deleteBtn = div.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                div.remove();
                updateLocalStorage();
            });
        });

        const taskElements = column.querySelectorAll('.task');
        const count = column.querySelector('.right');
        count.innerText = taskElements.length;
    }
}

function updateLocalStorage() {
    tasksData = {};
    
    columns.forEach(col => {
        const taskElements = col.querySelectorAll('.task');
        const count = col.querySelector('.right');
        
        // Map task elements to data objects
        tasksData[col.id] = Array.from(taskElements).map(t => {
            return {
                title: t.querySelector("h2").innerText,
                desc: t.querySelector("p").innerText
            }
        });

        count.innerText = taskElements.length;
    });
    
    localStorage.setItem("tasksData", JSON.stringify(tasksData));
}

// Function to add drag and drop events to a column
function addDragEventsOnColumn(column) {
    // When dragged element enters column
    column.addEventListener("dragenter", (e) => {
        e.preventDefault();
        column.classList.add("hover-over");
    });

    // When dragged element leaves column
    column.addEventListener("dragleave", (e) => {
        e.preventDefault();
        column.classList.remove("hover-over");
    });

    // While dragging over column
    column.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    // When element is dropped in column
    column.addEventListener("drop", (e) => {
        e.preventDefault();
        column.appendChild(dragElement);
        column.classList.remove("hover-over");
        

        updateLocalStorage();
    });
}


addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);


const toggleModalBtn = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".modal .bg");
const modal = document.querySelector(".modal");
const addTaskBtn = document.querySelector("#add-new-task");


toggleModalBtn.addEventListener("click", () => {
    modal.classList.toggle("active");
});


modalBg.addEventListener("click", () => {
    modal.classList.remove("active");
});


addTaskBtn.addEventListener("click", () => {
    const taskTitle = document.querySelector("#task-title-input").value;
    const taskDesc = document.querySelector("#task-desc-input").value;

    // Validate that title is not empty
    if (!taskTitle.trim()) {
        alert("Please enter a task title!");
        return;
    }

    // Create new task element
    const div = document.createElement("div");
    div.classList.add("task");
    div.setAttribute("draggable", "true");
    div.innerHTML = `<h2>${taskTitle}</h2>
                    <p>${taskDesc}</p>
                    <button class="delete-btn">Delete</button>`;


    todo.appendChild(div);


    div.addEventListener("dragstart", (e) => {
        dragElement = div;
    });


    const deleteBtn = div.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
        div.remove();
        updateLocalStorage();
    });


    updateLocalStorage();

    document.querySelector("#task-title-input").value = "";
    document.querySelector("#task-desc-input").value = "";
    modal.classList.remove("active");
});