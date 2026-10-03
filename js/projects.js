// ========================================
// CAREERPATH PROJECTS
// ========================================


// ========================================
// GET ROLE FROM URL
// ========================================

const projectParams =
    new URLSearchParams(window.location.search);

const selectedRole =
    projectParams.get("role") || "data-analyst";


// ========================================
// VARIABLES
// ========================================

let allProjects = [];


// ========================================
// LOAD PROJECTS
// ========================================

async function loadProjects() {

    try {

        const response =
            await fetch("../data/projects.json");


        if (!response.ok) {

            throw new Error(
                "Could not load projects.json"
            );

        }


        const projectsData =
            await response.json();


        // Get projects for selected role

        allProjects =
            projectsData[selectedRole] || [];


        console.log(
            "Selected Role:",
            selectedRole
        );


        console.log(
            "Projects:",
            allProjects
        );


        // Update page heading

        updatePageHeader();


        // Display projects

        displayProjects(allProjects);


        // Setup filters

        setupFilters();

    }

    catch (error) {

        console.error(
            "PROJECTS ERROR:",
            error
        );


        document.getElementById(
            "projectsGrid"
        ).innerHTML = `

            <div class="project-card">

                <h2>
                    Unable to load projects
                </h2>

                <p>
                    Please check your projects.json
                    file and try again.
                </p>

            </div>

        `;

    }

}


// ========================================
// UPDATE PAGE HEADER
// ========================================

function updatePageHeader() {

    const roleNames = {

        "data-analyst":
            "Data Analyst",

        "frontend-developer":
            "Frontend Developer",

        "software-developer":
            "Software Developer",

        "cloud-engineer":
            "Cloud Engineer",

        "ai-engineer":
            "AI Engineer",

        "cybersecurity-analyst":
            "Cybersecurity Analyst"

    };


    const roleName =
        roleNames[selectedRole] ||
        "Career";


    document.getElementById(
        "projectsTitle"
    ).innerHTML = `

        ${roleName} Projects That Make You
        <span>Job-Ready</span>

    `;


    document.getElementById(
        "projectsIntro"
    ).textContent =

        `Build practical ${roleName} projects
        and create a strong portfolio for your career.`;

    
    document.title =
        `${roleName} Projects | CareerPath`;

}


// ========================================
// DISPLAY PROJECTS
// ========================================

function displayProjects(projects) {

    const container =
        document.getElementById(
            "projectsGrid"
        );


    container.innerHTML = "";


    if (projects.length === 0) {

        container.innerHTML = `

            <div class="project-card">

                <h2>
                    No projects available
                </h2>

                <p>
                    Projects for this career are
                    coming soon.
                </p>

            </div>

        `;

        return;

    }


    projects.forEach((project, index) => {

        const card =
            document.createElement("div");


        card.className =
            "project-card";


        card.dataset.level =
            project.level;


        card.innerHTML = `

            <div class="project-icon">

                ${project.icon}

            </div>


            <span class="project-level ${project.level}-level">

                ${capitalize(project.level)}

            </span>


            <h2>

                ${project.title}

            </h2>


            <p>

                ${project.description}

            </p>


            <div class="project-tags">

                ${project.skills.map(skill => `

                    <span>
                        ${skill}
                    </span>

                `).join("")}

            </div>


            <a href="#"
               class="project-link"
               onclick="return false;">

                View Project →

            </a>

        `;


        container.appendChild(card);

    });

}


// ========================================
// FILTERS
// ========================================

function setupFilters() {

    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    filterButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {


                // Remove active

                filterButtons.forEach(btn => {

                    btn.classList.remove(
                        "active"
                    );

                });


                // Add active

                button.classList.add(
                    "active"
                );


                // Get filter

                const filter =
                    button.dataset.filter;


                // Filter projects

                if (filter === "all") {

                    displayProjects(
                        allProjects
                    );

                }

                else {

                    const filteredProjects =
                        allProjects.filter(
                            project =>
                                project.level === filter
                        );


                    displayProjects(
                        filteredProjects
                    );

                }

            }
        );

    });

}


// ========================================
// CAPITALIZE
// ========================================

function capitalize(text) {

    return text.charAt(0).toUpperCase()
        + text.slice(1);

}


// ========================================
// START
// ========================================

loadProjects();