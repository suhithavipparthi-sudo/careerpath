// ========================================
// CAREERPATH ROLE DETAILS
// ========================================


// Get role from URL

const params = new URLSearchParams(window.location.search);

const currentRole = params.get("role") || "data-analyst";


// ========================================
// LOAD ROLE DATA
// ========================================

async function loadRole() {

    try {

        const response = await fetch("../data/roles.json");

        if (!response.ok) {
            throw new Error("Could not load roles.json");
        }

        const roles = await response.json();


        // Find selected role

        const role = roles.find(item => item.id === currentRole);


        // If role doesn't exist

        if (!role) {

            document.getElementById("roleTitle").textContent =
                "Role Not Found";

            document.getElementById("roleDescription").textContent =
                "The selected career role could not be found.";

            return;
        }


        // Display role

        displayRole(role);

    }

    catch (error) {

        console.error("ROLE DETAILS ERROR:", error);

        document.getElementById("roleTitle").textContent =
            "Unable to load role";

        document.getElementById("roleDescription").textContent =
            "There was a problem loading the career information.";

    }

}


// ========================================
// DISPLAY ROLE
// ========================================

function displayRole(role) {


    // Page title

    document.title = `${role.name} | CareerPath`;


    // Icon

    document.getElementById("roleIcon").textContent =
        role.icon;


    // Title

    document.getElementById("roleTitle").textContent =
        role.name;


    // Description

    document.getElementById("roleDescription").textContent =
        role.description;


    // About

    document.getElementById("roleAbout").textContent =
        role.description;


    // Experience

    document.getElementById("roleExperience").textContent =
        role.experienceLevel;


    // Education

    document.getElementById("roleEducation").textContent =
        getEducationText(role);


    // Salary

    document.getElementById("roleSalary").textContent =
        getSalaryText(role);


    // Skills

    displaySkills(role.skills);


    // Roadmap

    displayRoadmap(role);


    // ========================================
    // ROADMAP BUTTON
    // ========================================

    const roadmapButton =
        document.getElementById("roadmapButton");

    if (roadmapButton) {

        roadmapButton.href =
            `roadmap-details.html?role=${getRoadmapId(role.id)}`;

    }


    // ========================================
    // PROJECTS BUTTON
    // ========================================

    const projectsButton =
        document.getElementById("projectsButton");

    if (projectsButton) {

        projectsButton.href =
            `projects.html?role=${role.id}`;

    }

}


// ========================================
// SKILLS
// ========================================

function displaySkills(skills) {

    const container =
        document.getElementById("skillsList");

    container.innerHTML = "";


    skills.forEach(skill => {

        const span = document.createElement("span");

        span.textContent = skill;

        container.appendChild(span);

    });

}


// ========================================
// ROADMAP
// ========================================

function displayRoadmap(role) {

    const container =
        document.getElementById("roleRoadmap");

    container.innerHTML = "";


    // Create roadmap steps from skills

    role.skills.forEach((skill, index) => {

        const step = document.createElement("div");

        step.className = "roadmap-step";


        step.innerHTML = `

            <div class="step-number">
                ${index + 1}
            </div>

            <div>

                <h3>
                    Learn ${skill}
                </h3>

                <p>
                    Build practical knowledge and skills
                    related to ${skill}.
                </p>

            </div>

        `;


        container.appendChild(step);

    });

}


// ========================================
// EDUCATION
// ========================================

function getEducationText(role) {

    if (role.difficulty === "Beginner") {

        return "Degree or relevant technical skills";

    }

    if (role.difficulty === "Intermediate") {

        return "Degree with relevant technical skills";

    }

    return "Degree with strong technical foundation";

}


// ========================================
// SALARY
// ========================================

function getSalaryText(role) {

    if (role.experienceLevel === "Fresher") {

        return "Entry-level opportunities available";

    }

    if (role.experienceLevel === "Fresher to Mid") {

        return "Varies by experience and company";

    }

    return "Depends on experience and company";

}


// ========================================
// ROADMAP ID MAPPING
// ========================================

function getRoadmapId(roleId) {

    const roadmapMap = {

        "data-analyst": "data-analyst",

        "software-developer": "software-developer",

        "frontend-developer": "frontend-developer",

        "cloud-engineer": "cloud-engineer",

        "cybersecurity-analyst": "cybersecurity-analyst",

        "ai-ml-engineer": "ai-engineer"

    };


    return roadmapMap[roleId] || roleId;

}


// ========================================
// START
// ========================================

loadRole();