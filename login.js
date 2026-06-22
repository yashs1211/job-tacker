import { auth, signInWithEmailAndPassword } from "./firebase.js";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);

    alert("Login Successful");

    window.location.href = "./index.html";
  } catch (error) {
    alert(error.message);
  }
});
