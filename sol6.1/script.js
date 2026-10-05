const eventsKey = 'sol6.1-events';
let events = [];
let editingId = null;
let activeTab = 'all';
const eventForm = document.getElementById('event-form');
const nameInput = document.getElementById('event-name');
const dateInput = document.getElementById('event-date');
const typeInput = document.getElementById('event-type');
const submitButton = document.getElementById('submit-button');
const cancelButton = document.getElementById('cancel-button');
const formHeading = document.getElementById('form-heading');
const eventList = document.getElementById('event-list');
const emptyMessage = document.getElementById('empty-message');
const tabButtons = document.querySelectorAll('.tab');

eventForm.addEventListener('submit', addEvent);
cancelButton.addEventListener('click', cancelEdit);
nameInput.addEventListener('input', clearNameError);
tabButtons.forEach(connectTab);
loadEvents();
renderEvents();

// load saved events, or start with an empty list
function loadEvents() {
  try {
    const savedEvents = localStorage.getItem(eventsKey);
    if (savedEvents !== null) {
      const savedList = JSON.parse(savedEvents);
      if (Array.isArray(savedList)) {
        events = savedList.filter(isValidEvent);
      }
    }
  } catch (error) {
    events = [];
    window.alert('Saved events could not be loaded. Check your browser storage settings.');
  }
}

// check that a saved event has the fields we need
function isValidEvent(event) {
  if (!event || typeof event.name !== 'string' || typeof event.date !== 'string') {
    return false;
  }
  const types = ['deadline', 'hackathon', 'exam', 'event'];
  return typeof event.id === 'number' && event.name.trim() !== '' &&
    /^\d{4}-\d{2}-\d{2}$/.test(event.date) &&
    !isNaN(getLocalDate(event.date).getTime()) && types.includes(event.type);
}

// save the current array in the browser
function saveEvents() {
  try {
    localStorage.setItem(eventsKey, JSON.stringify(events));
  } catch (error) {
    window.alert('Events could not be saved. Check your browser storage settings.');
  }
}

// clear the name warning when the user types again
function clearNameError() {
  nameInput.setCustomValidity('');
}

// add an event, or update the event being edited
function addEvent(event) {
  event.preventDefault();
  const eventName = nameInput.value.trim();
  const eventDate = dateInput.value;
  const eventType = typeInput.value;
  if (eventName === '') {
    nameInput.setCustomValidity('Please enter an event name.');
    nameInput.reportValidity();
    return;
  }
  if (eventDate === '') {
    dateInput.reportValidity();
    return;
  }
  if (editingId === null) {
    events.push({ id: Date.now(), name: eventName, date: eventDate, type: eventType });
  } else {
    // update only the selected event
    function updateEvent(savedEvent) {
      if (savedEvent.id === editingId) {
        savedEvent.name = eventName;
        savedEvent.date = eventDate;
        savedEvent.type = eventType;
      }
    }
    events.forEach(updateEvent);
  }
  saveEvents();
  renderEvents();
  cancelEdit();
}

// ask before deleting an event
function deleteEvent(id) {
  if (!window.confirm('Delete this event?')) {
    return;
  }
  // keep every event except the one being deleted
  function keepEvent(event) {
    return event.id !== id;
  }
  events = events.filter(keepEvent);
  saveEvents();
  renderEvents();
  if (editingId === id) {
    cancelEdit();
  }
}

// put an event back into the form for editing
function editEvent(id) {
  // find the matching event and copy its values
  function fillForm(event) {
    if (event.id === id) {
      editingId = id;
      nameInput.value = event.name;
      dateInput.value = event.date;
      typeInput.value = event.type;
    }
  }
  events.forEach(fillForm);
  clearNameError();
  formHeading.textContent = 'Edit event';
  submitButton.textContent = 'Save changes';
  cancelButton.hidden = false;
  nameInput.focus();
}

// reset the form without changing saved events
function cancelEdit() {
  editingId = null;
  eventForm.reset();
  clearNameError();
  formHeading.textContent = 'Add an event';
  submitButton.textContent = 'Add event';
  cancelButton.hidden = true;
}

// turn a date string into a date at local midnight
function getLocalDate(dateString) {
  const parts = dateString.split('-');
  return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
}

// get the number of days left for an event
function getDaysLeft(dateString) {
  const eventDate = getLocalDate(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((eventDate - today) / 86400000);
}

// connect each filter button to the tab function
function connectTab(button) {
  button.addEventListener('click', changeTab);
}

// change the filter and mark the selected button
function changeTab(event) {
  activeTab = event.currentTarget.dataset.type;
  // highlight just the selected filter
  function markTab(button) {
    button.classList.remove('active');
    if (button.dataset.type === activeTab) {
      button.classList.add('active');
    }
  }
  tabButtons.forEach(markTab);
  renderEvents();
}

// count all events, upcoming dates and overdue dates
function updateSummary() {
  let weekCount = 0;
  let overdueCount = 0;
  // count one event in the right summary group
  function countEvent(event) {
    const daysLeft = getDaysLeft(event.date);
    if (daysLeft >= 0 && daysLeft <= 7) {
      weekCount++;
    }
    if (daysLeft < 0) {
      overdueCount++;
    }
  }
  events.forEach(countEvent);
  document.getElementById('total-count').textContent = events.length;
  document.getElementById('week-count').textContent = weekCount;
  document.getElementById('overdue-count').textContent = overdueCount;
}

// make one countdown card using text and elements
function createCard(event) {
  const daysLeft = getDaysLeft(event.date);
  const card = document.createElement('article');
  card.className = 'card';
  if (daysLeft >= 0 && daysLeft <= 3) {
    card.classList.add('urgent');
  }
  if (daysLeft < 0) {
    card.classList.add('overdue');
  }
  const badge = document.createElement('span');
  badge.className = 'badge ' + event.type;
  badge.textContent = event.type;
  const heading = document.createElement('h3');
  heading.textContent = event.name;
  const date = document.createElement('p');
  date.className = 'event-date';
  date.textContent = getLocalDate(event.date).toLocaleDateString(undefined, {
    day: 'numeric', month: 'short', year: 'numeric'
  });
  const countdown = document.createElement('p');
  countdown.className = 'countdown';
  const label = document.createElement('p');
  label.className = 'countdown-label';
  if (daysLeft < 0) {
    countdown.textContent = 'OVERDUE';
    countdown.classList.add('overdue-text');
    label.textContent = 'Date has passed';
  } else if (daysLeft === 0) {
    countdown.textContent = 'Today';
    label.textContent = 'Time to show up';
  } else {
    countdown.textContent = daysLeft;
    label.textContent = 'days remaining';
    if (daysLeft === 1) {
      label.textContent = 'day remaining';
    }
  }
  const actions = document.createElement('div');
  actions.className = 'card-actions';
  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.textContent = 'Edit';
  // edit the event belonging to this card
  function editThisEvent() {
    editEvent(event.id);
  }
  editButton.addEventListener('click', editThisEvent);
  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete-button';
  deleteButton.textContent = 'Delete';
  // delete the event belonging to this card
  function deleteThisEvent() {
    deleteEvent(event.id);
  }
  deleteButton.addEventListener('click', deleteThisEvent);
  actions.append(editButton, deleteButton);
  card.append(badge, heading, date, countdown, label, actions);
  return card;
}

// clear the cards, then show the filtered dates in order
function renderEvents() {
  while (eventList.firstChild) {
    eventList.removeChild(eventList.firstChild);
  }
  // keep the events that match the selected tab
  function matchesTab(event) {
    return activeTab === 'all' || event.type === activeTab;
  }
  // compare two dates so earlier dates come first
  function compareDates(first, second) {
    return getLocalDate(first.date) - getLocalDate(second.date);
  }
  // put one finished card into the list
  function showCard(event) {
    eventList.appendChild(createCard(event));
  }
  const visibleEvents = events.filter(matchesTab);
  visibleEvents.sort(compareDates);
  visibleEvents.forEach(showCard);
  emptyMessage.hidden = visibleEvents.length > 0;
  if (events.length === 0) {
    emptyMessage.textContent = 'No events yet. Add your first date above.';
  } else {
    emptyMessage.textContent = 'No events in this category.';
  }
  updateSummary();
}
