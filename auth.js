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

const loginSubmit = document.getElementById('login-submit');
if (loginSubmit) {
    loginSubmit.addEventListener('click', () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        auth.signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                window.location.href = 'index.html';
            })
            .catch(error => alert(error.message));
    });
}

const signupSubmit = document.getElementById('signup-submit');
if (signupSubmit) {
    signupSubmit.addEventListener('click', () => {
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        auth.createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                window.location.href = 'index.html';
            })
            .catch(error => alert(error.message));
    });
}
