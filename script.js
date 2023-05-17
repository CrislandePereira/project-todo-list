let salvaTarefas = [];
const listaTarefas = document.querySelector('#lista-tarefas');

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

Array.prototype.swap = function (x, y) {
  var b = this[x];
  this[x] = this[y];
  this[y] = b;
  return this;
};

// localStorage

function saveLocalStorage(value) {
  localStorage.setItem('tarefas', JSON.stringify(value));
}

function getLocalStorage() {
  const tarefasStorage = localStorage.getItem('tarefas');
  if (tarefasStorage) return JSON.parse(tarefasStorage);
  return null;
}

function removeAllSelectionsButThis(element) {
  const taks = document.querySelectorAll('.list-group-item');
  taks.forEach((task) => {
    const idTask = task.getAttribute('js-id');
    const idElement = element.getAttribute('js-id');
    if (idTask !== idElement) task.classList.remove('selected');
  });
}

function selectTarefa(event) {
  const { target } = event;
  removeAllSelectionsButThis(target);
  target.classList.toggle('selected');
}

function doubleClick(event) {
  const { target } = event;
  target.classList.remove('selected');
  target.classList.toggle('completed');

  if (target.classList.contains('completed')) {
    const id = target.getAttribute('js-id');
    const index = salvaTarefas.map((e) => e.id).indexOf(id);
    salvaTarefas[index] = {
      ...salvaTarefas[index],
      completed: true,
    };
    //saveLocalStorage(salvaTarefas);
  } else {
    const id = target.getAttribute('js-id');
    const index = salvaTarefas.map((e) => e.id).indexOf(id);
    salvaTarefas[index] = {
      ...salvaTarefas[index],
      completed: false,
    };
    //saveLocalStorage(salvaTarefas);
  }
}

function fillTask(tarefa, selected = false) {
  const tarefaElement = document.createElement('li');
  tarefaElement.className = 'list-group-item';
  tarefaElement.setAttribute('js-id', tarefa.id);
  tarefaElement.innerHTML = tarefa.value;

  if (selected === true) {
    tarefaElement.classList.add('selected');
  }

  if (tarefa.completed) {
    tarefaElement.classList.add('completed');
  }

  tarefaElement.addEventListener('click', selectTarefa);
  tarefaElement.addEventListener('dblclick', doubleClick);
  listaTarefas.append(tarefaElement);
}

function loadTasks() {
  const tarefas = getLocalStorage();
  listaTarefas.innerHTML = '';

  if (!tarefas) return;
  tarefas.forEach((tarefa) => {
    fillTask(tarefa);
    salvaTarefas.push(tarefa);
  });
}

// final localStorage

const textoDigitado = document.querySelector('#texto-tarefa');

const btnAdd = document.querySelector('#criar-tarefa');
const btnLimpaLista = document.querySelector('#apaga-tudo');
const btnRemoveCompleted = document.querySelector('#remover-finalizados');
const btnSalvaTarefasLocal = document.querySelector('#salvar-tarefas');
const btnUp = document.querySelector('#mover-cima');
const btnDown = document.querySelector('#mover-baixo');
const btnDelete = document.querySelector('#remover-selecionado');

// cria tarefas
function criaTarefa() {
  const taskObj = {
    value: textoDigitado.value,
    completed: false,
    id: uid(),
  };
  fillTask(taskObj);
  salvaTarefas.push(taskObj);
  textoDigitado.value = '';
}

function criaTarefaByEnter(event) {
  const { target } = event;

  if (event.key === 'Enter') {
    event.preventDefault();
    const taskObj = {
      value: target.value,
      completed: false,
      id: uid(),
    };
    fillTask(taskObj);
    salvaTarefas.push(taskObj);
    target.value = '';
    target.focus();
  }
}

function limpaLista() {
  listaTarefas.innerHTML = '';
  salvaTarefas = [];
  //localStorage.clear('tarefas');
}

function removerFinalizados() {
  salvaTarefas = salvaTarefas.filter((item) => item.completed !== true);
  listaTarefas.innerHTML = '';
  salvaTarefas.forEach((tarefa) => {
    fillTask(tarefa);
  });
}

function removeItem(id) {
  salvaTarefas = salvaTarefas.filter((item) => !(item.id === id));
}

function deleteSelect() {
  const selecionados = document.querySelectorAll('.selected');
  for (let i = 0; i < selecionados.length; i += 1) {
    const item = selecionados[i];
    const id = item.getAttribute('js-id');
    removeItem(id);
    item.remove();
  }
}

function salvaTarefasLocal() {
  saveLocalStorage(salvaTarefas);
}

function Up() {
  const selectElement = document.querySelector('.selected');
  if (!selectElement) return;
  const id = selectElement.getAttribute('js-id');
  const index = salvaTarefas.map((e) => e.id).indexOf(id);
  if (index <= 0) return;
  salvaTarefas = salvaTarefas.swap(index, index - 1);
  listaTarefas.innerHTML = '';
  salvaTarefas.forEach((tarefa, indexEach) => {
    fillTask(tarefa, indexEach === index - 1);
  });
}

function Down() {
  const selectElement = document.querySelector('.selected');
  if (!selectElement) return;
  const id = selectElement.getAttribute('js-id');
  const index = salvaTarefas.map((e) => e.id).indexOf(id);
  if (index === salvaTarefas.length - 1) return;
  salvaTarefas = salvaTarefas.swap(index, index + 1);
  listaTarefas.innerHTML = '';
  salvaTarefas.forEach((tarefa, indexEach) => {
    fillTask(tarefa, indexEach === index + 1);
  });
}

btnAdd.addEventListener('click', criaTarefa);
textoDigitado.addEventListener('keypress', criaTarefaByEnter);
btnLimpaLista.addEventListener('click', limpaLista);
btnRemoveCompleted.addEventListener('click', removerFinalizados);
btnSalvaTarefasLocal.addEventListener('click', salvaTarefasLocal);
btnUp.addEventListener('click', Up);
btnDown.addEventListener('click', Down);
btnDelete.addEventListener('click', deleteSelect);
(function main() {
  loadTasks();
})();
