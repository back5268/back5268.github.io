const body = document.querySelector('body');    
const sidebar = document.querySelector('.nav-sidebar');
const header = document.querySelector('.nav-header');
const toggle = document.querySelector('.toggle');
const toggleMode = document.querySelector('.toggle-mode');

toggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    header.classList.toggle("active");
})

toggleMode.addEventListener("click", () => {
    toggleMode.classList.toggle("active");
    body.classList.toggle("light");
})