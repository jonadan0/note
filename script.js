const firebaseConfig = {
    apiKey: "AIzaSyBll7KN5_dztD-uSGbQwKTZ79E9ZMVp_9U",
    authDomain: "noth-9ff09.firebaseapp.com",
    projectId: "noth-9ff09",
    storageBucket: "noth-9ff09.appspot.com",
    messagingSenderId: "111218786280",
    appId: "1:111218786280:web:7e2dc28424cbefc82bae5d",
    measurementId: "G-XER19X4TJL"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let notes = [];
let tasks = [];

const notesList = document.getElementById('notes-list');
const noteEditor = document.getElementById('note-editor');
const noteTitleInput = document.getElementById('note-title');
const noteContentInput = document.getElementById('note-content');
const saveNoteButton = document.getElementById('save-note');
const cancelNoteButton = document.getElementById('cancel-note');
const deleteNoteButton = document.getElementById('delete-note');
const newNoteButton = document.getElementById('new-note');
const sectionTitle = document.getElementById('section-title');

const tasksList = document.getElementById('tasks-list');
const newTaskInput = document.getElementById('new-task-input');
const addTaskButton = document.getElementById('add-task');

const calendarSection = document.getElementById('calendar-section');

const navNotes = document.getElementById('nav-notes');
const navTasks = document.getElementById('nav-tasks');
const navCalendar = document.getElementById('nav-calendar');

const loginBtn = document.getElementById('login-btn');
const signupBtn = document.getElementById('signup-btn');
const logoutBtn = document.getElementById('logout-btn');
const authSection = document.getElementById('auth-section');

function renderNotes() {
    notesList.innerHTML = '';
    notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('note');
        noteElement.innerHTML = `
            <h2>${note.title}</h2>
            <p>${note.content}</p>
        `;
        noteElement.addEventListener('click', () => editNote(note));
        notesList.appendChild(noteElement);
    });
}

function showNoteEditor() {
    noteTitleInput.value = '';
    noteContentInput.value = '';
    noteEditor.classList.remove('hidden');
    deleteNoteButton.classList.add('hidden');
}

function hideNoteEditor() {
    noteEditor.classList.add('hidden');
}

async function saveNote() {
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();

    if (!title || !content) {
        alert('Please enter both title and content.');
        return;
    }

    const newNote = {
        title,
        content,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (noteId) {
        await db.collection('notes').doc(noteId).update(newNote);
    } else {
        await db.collection('notes').add(newNote);
    }

    hideNoteEditor();
    loadNotes();
}

async function deleteNote() {
    await db.collection('notes').doc(noteId).delete();
    hideNoteEditor();
    loadNotes();
}

function editNote(note) {
    noteTitleInput.value = note.title;
    noteContentInput.value = note.content;
    noteId = note.id;
    noteEditor.classList.remove('hidden');
    deleteNoteButton.classList.remove('hidden');
}

async function loadNotes() {
    notes = [];
    const querySnapshot = await db.collection('notes').orderBy('timestamp', 'desc').get();
    querySnapshot.forEach(doc => {
        notes.push({ ...doc.data(), id: doc.id });
    });
    renderNotes();
}

function renderTasks() {
    tasksList.innerHTML = '';
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.innerHTML = `
            <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
            <label for="task-${task.id}">${task.title}</label>
        `;
        tasksList.appendChild(taskElement);

        const checkbox = taskElement.querySelector('input');
        checkbox.addEventListener('change', async () => {
            await db.collection('tasks').doc(task.id).update({
                completed: checkbox.checked
            });
            loadTasks();
        });
    });
}

async function addTask() {
    const title = newTaskInput.value.trim();
    if (!title) return;

    await db.collection('tasks').add({
        title,
        completed: false,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    newTaskInput.value = '';
    loadTasks();
}

async function loadTasks() {
    tasks = [];
    const querySnapshot = await db.collection('tasks').orderBy('timestamp', 'asc').get();
    querySnapshot.forEach(doc => {
        tasks.push({ ...doc.data(), id: doc.id });
    });
    renderTasks();
}

function renderCalendar() {
    calendarSection.innerHTML = '<p>Calendar section placeholder</p>';
}

newNoteButton.addEventListener('click', showNoteEditor);
saveNoteButton.addEventListener('click', saveNote);
cancelNoteButton.addEventListener('click', hideNoteEditor);
deleteNoteButton.addEventListener('click', deleteNote);
addTaskButton.addEventListener('click', addTask);

navNotes.addEventListener('click', () => {
    notesSection.classList.remove('hidden');
    tasksSection.classList.add('hidden');
    calendarSection.classList.add('hidden');
    sectionTitle.textContent = 'Notes';
    navNotes.classList.add('active');
    navTasks.classList.remove('active');
    navCalendar.classList.remove('active');
});

navTasks.addEventListener('click', () => {
    notesSection.classList.add('hidden');
    tasksSection.classList.remove('hidden');
    calendarSection.classList.add('hidden');
    sectionTitle.textContent = 'Tasks';
    navNotes.classList.remove('active');
    navTasks.classList.add('active');
    navCalendar.classList.remove('active');
});

navCalendar.addEventListener('click', () => {
    notesSection.classList.add('hidden');
    tasksSection.classList.add('hidden');
    calendarSection.classList.remove('hidden');
    sectionTitle.textContent = 'Calendar';
    navNotes.classList.remove('active');
    navTasks.classList.remove('active');
    navCalendar.classList.add('active');
});

logoutBtn.addEventListener('click', () => {
    auth.signOut()
        .then(() => {
            loginBtn.classList.remove('hidden');
            signupBtn.classList.remove('hidden');
            logoutBtn.classList.add('hidden');
            newNoteButton.classList.add('hidden');
            notesList.innerHTML = '';
        })
        .catch(error => alert(error.message));
});

auth.onAuthStateChanged(user => {
    if (user) {
        loginBtn.classList.add('hidden');
        signupBtn.classList.add('hidden');
        logoutBtn.classList.remove('hidden');
        newNoteButton.classList.remove('hidden');
        loadNotes();
        loadTasks(); 
    } else {
        loginBtn.classList.remove('hidden');
        signupBtn.classList.remove('hidden');
        logoutBtn.classList.add('hidden');
        newNoteButton.classList.add('hidden');
        notesList.innerHTML = '';
    }
});
