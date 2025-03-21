document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const logoutBtn = document.getElementById("logoutBtn");
    const addProjectForm = document.getElementById("addProjectForm");

    // ✅ Handle Login
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const response = await fetch("/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("username", data.user.name);
                window.location.href = "dashboard.html";
            } else {
                document.getElementById("errorMessage").innerText = data.message;
            }
        });
    }

    // ✅ Handle Registration
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            const response = await fetch("/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();
            if (response.ok) {
                window.location.href = "index.html";
            } else {
                document.getElementById("registerErrorMessage").innerText = data.message;
            }
        });
    }

    // ✅ Handle Logout
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            window.location.href = "index.html";
        });
    }

    // ✅ Load Dashboard Data
    if (window.location.pathname.includes("dashboard.html")) {
        const username = localStorage.getItem("username");
        if (!username) window.location.href = "index.html";
        document.getElementById("username").innerText = username;

        async function loadProjects() {
            const token = localStorage.getItem("token");
            const response = await fetch("/api/projects", {
                headers: { Authorization: `Bearer ${token}` },
            });

            const projects = await response.json();
            const projectList = document.getElementById("projectList");
            projectList.innerHTML = "";

            projects.forEach((project) => {
                const li = document.createElement("li");
                li.innerText = project.name;
                projectList.appendChild(li);
            });
        }

        loadProjects();

        // ✅ Handle Adding Projects
        addProjectForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const projectName = document.getElementById("projectName").value;
            const projectDesc = document.getElementById("projectDesc").value;
            const token = localStorage.getItem("token");

            await fetch("/api/projects/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: projectName, description: projectDesc }),
            });

            loadProjects();
        });
    }
});
