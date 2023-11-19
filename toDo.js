
const taskInput = document.querySelector('.task-input')
const filterInput = document.querySelector('.filter-input')
const addButton = document.querySelector('.add-button')
const removeButton = document.querySelector('.remove-button')
const collection = document.querySelector('.collection')


const STORAGE_KEY = 'tasks';

init()

function init() {
  document.addEventListener('DOMContentLoaded', loadTasks);
  addButton.addEventListener('click', addTask);
  removeButton.addEventListener('click', removeAllTasks);
  collection.addEventListener('click', removeTask);
  collection.addEventListener('click', editTask);
  filterInput.addEventListener('keyup', filterTask);
}

function insertTaskIntoDOM(value, index) {
  const li = document.createElement('li');
  const task = document.createElement('span');
  const removeIcon = document.createElement('i');
  const editIcon = document.createElement('i');
  const buttons = document.createElement('div');

  task.textContent = value;
  removeIcon.classList.add('fa', 'fa-trash-o', 'icon');
  editIcon.classList.add('fa', 'fa-pencil', 'icon');
  buttons.classList.add('buttons')

  buttons.append(editIcon);
  buttons.append(removeIcon);
  li.append(task);
  li.append(buttons);
  
  const tasks = getTasksFromLS();

  li.classList.add('list-item');
  console.log('index', index)
  console.log('tasks.length', tasks.length)
  console.log('index ?? tasks.length', index ?? tasks.length)
  
  li.setAttribute('data-position', index ?? tasks.length);

  collection.append(li);
}

function addTask(e) {
  const value = taskInput.value;

  if(!value || !value.trim().length) {
    taskInput.value = '';
    return;
  }
  
  insertTaskIntoDOM(value);
  addTaskToLocalStorage(value);
  
  taskInput.value = '';
}

function removeTask(e) {
  const targetElement = e.target;

  if(!targetElement.className.includes('fa-trash-o')) {
      return;
  } 
  const confirm = window.confirm("Ви справді хочете видалити завдання?")

  if (confirm == true) {

  const parentContainer = targetElement.closest('li');

  if(!parentContainer) {
    return;
  }
   parentContainer.remove();

   const position = parentContainer.dataset.position;
   console.log('position: ', position);
   removeTaskFromLS(parseInt(position));
  } else { 
    return
  }
}

function removeAllTasks(e) {
  const confirm = window.confirm("Ви справді хочете видалити всі завдання?") 
  if (confirm == true) {
  const children = collection.childNodes;

  while(collection.firstChild){
    collection.firstChild.remove();
  }

  localStorage.clear();
  } else {
    return
  }
}

function restoreTasks() {
  const tasksList = collection.querySelectorAll('li');

  Array.from(tasksList).forEach(item => {
    if (item.style.display === 'none') {
      item.style.display = 'block';
    }
  })
 }


function editTask(e) {
  const targetElement = e.target;

  if(!targetElement.className.includes('fa-pencil')) {
      return;
  }

  const divElement = targetElement.closest('div');
  const textElement = divElement.previousElementSibling;
  if(!textElement) {
    return;
  }

  const value = textElement.textContent;
  const editedValue = prompt('Редагувати завдання:', value);

  if (editedValue !== null) {
   textElement.textContent = editedValue;
}
  const tasks = getTasksFromLS();

  const listItem = targetElement.closest('li');
  console.log(listItem)
  const position = parseInt(listItem.getAttribute('data-position'))
  console.log(position)
  tasks[position].value = editedValue;

  setTasksToLS(tasks);
}

function filterTask(e) {
  const value = filterInput.value;

  if(!value || !value.trim().length ) {
    filterInput.value = '';
    restoreTasks();
    return;
  }

  const filterValue = value.toLowerCase();
  const tasksList = collection.querySelectorAll('li');
  
  Array.from(tasksList).forEach(item => {
    const textElement = item.querySelector('span');

    if(textElement) {
      const textInElement = textElement.textContent.toLowerCase();

      if (textInElement.includes(filterValue)) {
        item.style.display = 'flex ';
      } else {
        item.style.display = 'none';
      }
    }
  })

  console.log('Filter task');
}

function removeTaskFromLS(position) {
  const tasks = getTasksFromLS();
  const updatedList = tasks.filter(task => {
    console.log(task);
    console.log(position);
    return  task.id !==position
  });

  setTasksToLS(updatedList);

}

function getTasksFromLS() {
  const tasks = localStorage.getItem(STORAGE_KEY);

  if (!tasks) {
    return [];
  }

  return JSON.parse(tasks);
}

function setTasksToLS(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function addTaskToLocalStorage(value) {
    const tasks = getTasksFromLS();

    tasks.push({id: tasks.length,  value });

    setTasksToLS(tasks);
};

function loadTasks() {
  const tasks = getTasksFromLS();

  tasks.forEach( (task, index) => {
    insertTaskIntoDOM(task.value, index);
  })
}
