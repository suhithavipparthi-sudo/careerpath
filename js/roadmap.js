let roadmapData = {};
let currentRole = "";
let allChecklistItems = [];


// ========================================
// GET ROLE FROM URL
// ========================================

const params = new URLSearchParams(window.location.search);

currentRole = params.get("role") || "data-analyst";


// ========================================
// LOAD ROADMAP
// ========================================

async function loadRoadmap() {

    try {

        console.log("Loading roadmap...");

        const response = await fetch("../data/roadmaps.json");

        if (!response.ok) {
            throw new Error(
                `Could not load roadmaps.json: ${response.status}`
            );
        }

        roadmapData = await response.json();

        console.log("Roadmap data loaded:", roadmapData);

        const role = roadmapData[currentRole];

        if (!role) {

            console.error(
                "Role not found:",
                currentRole
            );

            document.getElementById("roleTitle").textContent =
                "Roadmap not found";

            return;
        }

        displayRole(role);

    } catch (error) {

        console.error(
            "ROADMAP ERROR:",
            error
        );

    }
}


// ========================================
// DISPLAY ROLE
// ========================================

function displayRole(role) {

    document.getElementById("roleIcon").textContent =
        role.icon;

    document.getElementById("roleTitle").textContent =
        `${role.title} Roadmap`;

    document.getElementById("roleDescription").textContent =
        role.description;

    document.title =
        `${role.title} Roadmap | CareerPath`;

    renderSteps(role.steps);

    updateProgress();
}


// ========================================
// RENDER ROADMAP STEPS
// ========================================

function renderSteps(steps) {

    const container =
        document.getElementById("roadmapContainer");

    if (!container) {

        console.error(
            "roadmapContainer was not found!"
        );

        return;
    }

    container.innerHTML = "";

    allChecklistItems = [];


    steps.forEach((step, index) => {

        const stepElement =
            document.createElement("div");

        stepElement.className =
            "roadmap-step";


        const hasTopics =
            step.topics &&
            step.topics.length > 0;


        stepElement.innerHTML = `

            <div class="step-number">
                ${index + 1}
            </div>


            <div
                class="step-card"
                id="step-${step.id}"
            >

                <div class="step-header">

                    <h3>
                        ${step.title}
                    </h3>

                    ${
                        hasTopics
                        ?
                        `
                        <button
                            class="expand-btn"
                            onclick="toggleTopics('${step.id}')"
                        >
                            View Learning Path ↓
                        </button>
                        `
                        :
                        ""
                    }

                </div>


                <p class="step-description">
                    ${step.description}
                </p>


                <div class="skill-list">

                    ${step.skills.map(skill => `
                        
                        <span class="skill-tag">
                            ${skill}
                        </span>

                    `).join("")}

                </div>


                ${
                    hasTopics
                    ?
                    `
                    <div
                        id="topics-${step.id}"
                        class="topic-container"
                    >

                        <div class="topic-flow">

                            ${renderTopics(step)}

                        </div>

                    </div>
                    `
                    :
                    ""
                }

            </div>

        `;


        container.appendChild(stepElement);

    });


    loadSavedProgress();

}


// ========================================
// RENDER SQL TOPICS
// ========================================

function renderTopics(step) {

    let html = "";


    step.topics.forEach(
        (topic, topicIndex) => {

            html += `

                <div class="topic-node">

                    <div class="topic-box">

                        <div class="topic-title">

                            ${topicIndex + 1}.
                            ${topic.title}

                        </div>


                        <div class="topic-checklist">

                            ${topic.items.map(
                                (item, itemIndex) => {

                                    const id =
                                        `${currentRole}-${step.id}-${topicIndex}-${itemIndex}`;

                                    allChecklistItems.push(id);


                                    return `

                                        <label
                                            class="topic-check"
                                            id="label-${id}"
                                        >

                                            <input
                                                type="checkbox"
                                                id="${id}"
                                                onchange="updateChecklist('${id}')"
                                            >

                                            <span>
                                                ${item}
                                            </span>

                                        </label>

                                    `;

                                }
                            ).join("")}

                        </div>

                    </div>

                </div>

            `;

        }
    );


    return html;

}


// ========================================
// OPEN / CLOSE LEARNING PATH
// ========================================

function toggleTopics(stepId) {

    const container =
        document.getElementById(
            `topics-${stepId}`
        );


    if (!container) {
        return;
    }


    container.classList.toggle("open");


    const button =
        container
            .parentElement
            .querySelector(".expand-btn");


    if (
        container.classList.contains("open")
    ) {

        button.textContent =
            "Hide Learning Path ↑";

    } else {

        button.textContent =
            "View Learning Path ↓";

    }

}


// ========================================
// CHECK TOPIC
// ========================================

function updateChecklist(id) {

    const checkbox =
        document.getElementById(id);

    const label =
        document.getElementById(
            `label-${id}`
        );


    if (!checkbox || !label) {
        return;
    }


    if (checkbox.checked) {

        label.classList.add("completed");

        localStorage.setItem(
            id,
            "completed"
        );

    } else {

        label.classList.remove("completed");

        localStorage.removeItem(id);

    }


    updateProgress();

}


// ========================================
// LOAD SAVED PROGRESS
// ========================================

function loadSavedProgress() {

    allChecklistItems.forEach(id => {

        const checkbox =
            document.getElementById(id);

        const label =
            document.getElementById(
                `label-${id}`
            );


        if (
            checkbox &&
            localStorage.getItem(id) ===
            "completed"
        ) {

            checkbox.checked = true;

            label.classList.add(
                "completed"
            );

        }

    });


    updateProgress();

}


// ========================================
// UPDATE PROGRESS
// ========================================

function updateProgress() {

    const total =
        allChecklistItems.length;


    if (total === 0) {

        document.getElementById(
            "progressPercent"
        ).textContent = "0";

        return;
    }


    let completed = 0;


    allChecklistItems.forEach(id => {

        if (
            localStorage.getItem(id) ===
            "completed"
        ) {

            completed++;

        }

    });


    const percentage =
        Math.round(
            (completed / total) * 100
        );


    document.getElementById(
        "progressPercent"
    ).textContent = percentage;


    document.getElementById(
        "progressBar"
    ).style.width =
        `${percentage}%`;


    const progressText =
        document.getElementById(
            "progressText"
        );


    if (percentage === 0) {

        progressText.textContent =
            "Start learning your roadmap 🚀";

    } else if (percentage < 50) {

        progressText.textContent =
            "Good start! Keep going 💪";

    } else if (percentage < 100) {

        progressText.textContent =
            "You're making great progress! 🔥";

    } else {

        progressText.textContent =
            "Roadmap completed! You're job-ready 🚀";

    }

}


// ========================================
// START
// ========================================

loadRoadmap();