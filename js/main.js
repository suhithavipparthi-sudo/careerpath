// ========================================
// CAREERPATH MAIN JAVASCRIPT
// ========================================


// ----------------------------------------
// ROOT PATH
// ----------------------------------------

const root = document.body.dataset.root || "";


// ========================================
// NAVBAR
// ========================================

const navbar = document.getElementById("navbar");

if (navbar) {

    const currentPage = document.body.dataset.page || "Home";

    navbar.innerHTML = `

        <nav class="navbar">

            <div class="container nav-inner">

                <!-- LOGO -->
                <a href="${root}index.html" class="logo">
                    Career<span>Path</span>
                </a>


                <!-- NAV LINKS -->
                <div class="nav-links">

                    <a href="${root}index.html"
                       data-page="Home">
                        Home
                    </a>

                    <a href="${root}pages/roles.html"
                       data-page="Explore Roles">
                        Explore Roles
                    </a>

                    <a href="${root}pages/roadmap.html"
                       data-page="Roadmaps">
                        Roadmaps
                    </a>

                    <a href="${root}pages/experiences.html"
                       data-page="Experiences">
                        Experiences
                    </a>

                    <a href="${root}pages/companies.html"
                       data-page="Companies">
                        Companies
                    </a>

                    <a href="${root}pages/interview-prep.html"
                       data-page="Interview Prep">
                        Interview Prep
                    </a>

                    <a href="${root}pages/dashboard.html"
                       data-page="Dashboard">
                        Dashboard
                    </a>

                </div>


                <!-- LOGIN / REGISTER -->
                <div class="nav-auth">

                    <a href="${root}login.html"
                       class="btn"
                       data-page="Login">
                        Login
                    </a>

                    <a href="${root}register.html"
                       class="btn"
                       data-page="Register">
                        Register
                    </a>

                </div>

            </div>

        </nav>
    `;


    // Highlight the current page

    const navLinks = navbar.querySelectorAll("[data-page]");

    navLinks.forEach(link => {

        if (link.dataset.page === currentPage) {
            link.classList.add("active");
        }

    });

}


// ========================================
// FOOTER
// ========================================

const footer = document.getElementById("footer");

if (footer) {

    footer.innerHTML = `

        <footer class="footer">

            <div class="container footer-grid">

                <div>

                    <h4>CareerPath</h4>

                    <p>
                        Career guidance for college students
                        and freshers.
                    </p>

                </div>


                <div>

                    <h4>Explore</h4>

                    <a href="${root}pages/roles.html">
                        Job Roles
                    </a>

                    <a href="${root}pages/roadmap.html">
                        Roadmaps
                    </a>

                    <a href="${root}pages/projects.html">
                        Projects
                    </a>

                </div>


                <div>

                    <h4>Career Tools</h4>

                    <a href="${root}pages/interview-prep.html">
                        Interview Prep
                    </a>

                    <a href="${root}pages/resume-analyzer.html">
                        Resume Analyzer
                    </a>

                    <a href="${root}pages/dashboard.html">
                        Dashboard
                    </a>

                </div>

            </div>


            <div class="container footer-bottom">

                © 2026 CareerPath. All rights reserved.

            </div>

        </footer>

    `;

}


// ========================================
// REVEAL SECTIONS
// ========================================

// Your HTML uses class="reveal".
// This makes those sections appear when
// you scroll to them.

const revealElements = document.querySelectorAll(".reveal");

if (revealElements.length > 0) {

    const revealObserver = new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                }

            });

        },

        {
            threshold: 0.1
        }

    );


    revealElements.forEach(element => {

        revealObserver.observe(element);

    });

}


// ========================================
// PROGRESS BARS
// ========================================

const progressBars = document.querySelectorAll(".progress-fill");

progressBars.forEach(bar => {

    const value = bar.dataset.value || 0;

    bar.style.width = value + "%";

});


// ========================================
// POPULAR ROLES
// ========================================

const popularRoles = document.getElementById("popularRoles");

if (popularRoles) {

    const roles = [

        {
            id: "data-analyst",
            icon: "📊",
            title: "Data Analyst",
            description: "Analyze data and discover useful business insights."
        },

        {
            id: "frontend-developer",
            icon: "🎨",
            title: "Frontend Developer",
            description: "Build beautiful and interactive websites."
        },

        {
            id: "cloud-engineer",
            icon: "☁️",
            title: "Cloud Engineer",
            description: "Build and manage cloud infrastructure."
        },

        {
            id: "ai-engineer",
            icon: "🤖",
            title: "AI Engineer",
            description: "Build intelligent systems using AI and machine learning."
        },

        {
            id: "software-developer",
            icon: "💻",
            title: "Software Developer",
            description: "Design and develop software applications."
        },

        {
            id: "cybersecurity-analyst",
            icon: "🔐",
            title: "Cybersecurity Analyst",
            description: "Protect systems and data from security threats."
        }

    ];


    popularRoles.innerHTML = roles.map(role => `

        <a href="${root}pages/role-details.html?role=${role.id}"
           class="card role-card">

            <div class="role-icon">
                ${role.icon}
            </div>

            <h3>${role.title}</h3>

            <p class="muted">
                ${role.description}
            </p>

            <span class="action-link">
                Explore →
            </span>

        </a>

    `).join("");

}