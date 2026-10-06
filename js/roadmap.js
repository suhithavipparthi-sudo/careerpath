// ========================================
// CAREERPATH ROADMAP + TEST SYSTEM
// ========================================

let roadmapData = {};
let currentRole = "";
let allChecklistItems = [];

const params = new URLSearchParams(window.location.search);

currentRole = params.get("role") || "data-analyst";


// ========================================
// LOAD ROADMAP
// ========================================

async function loadRoadmap() {

    try {

        const response =
            await fetch("../data/roadmaps.json");

        if (!response.ok) {
            throw new Error("Could not load roadmaps.json");
        }

        roadmapData = await response.json();

        const role =
            roadmapData[currentRole];

        if (!role) {

            document.getElementById("roleTitle").textContent =
                "Roadmap not found";

            return;
        }

        displayRole(role);

    }

    catch (error) {

        console.error("ROADMAP ERROR:", error);

        document.getElementById("roleTitle").textContent =
            "Unable to load roadmap";

    }

}


// ========================================
// DISPLAY ROLE
// ========================================

function displayRole(role) {

    document.title =
        `${role.title} Roadmap | CareerPath`;

    document.getElementById("roleIcon").textContent =
        role.icon;

    document.getElementById("roleTitle").textContent =
        `${role.title} Roadmap`;

    document.getElementById("roleDescription").textContent =
        role.description;

    renderSteps(role.steps);

    updateProgress();

}


// ========================================
// RENDER STEPS
// ========================================

function renderSteps(steps) {

    const container =
        document.getElementById("roadmapContainer");

    if (!container) return;

    container.innerHTML = "";

    allChecklistItems = [];


    steps.forEach((step, index) => {

        const stepElement =
            document.createElement("div");

        stepElement.className =
            "roadmap-step";


        const hasTopics =
            Array.isArray(step.topics) &&
            step.topics.length > 0;


        stepElement.innerHTML = `

            <div class="step-number">
                ${index + 1}
            </div>

            <div class="step-card"
                 id="step-${step.id}">

                <div class="step-header">

                    <div>

                        <h3>
                            ${step.title}
                        </h3>

                        <p class="step-description">
                            ${step.description}
                        </p>

                    </div>

                    ${
                        hasTopics
                        ?
                        `
                        <button
                            class="expand-btn"
                            type="button"
                            onclick="toggleTopics('${step.id}')">

                            View Learning Path ↓

                        </button>
                        `
                        :
                        ""
                    }

                </div>


                <div class="skill-list">

                    ${
                        step.skills
                        .map(skill => `
                            <span class="skill-tag">
                                ${skill}
                            </span>
                        `)
                        .join("")
                    }

                </div>


                ${
                    hasTopics
                    ?
                    `
                    <div
                        id="topics-${step.id}"
                        class="topic-container">

                        <div class="topic-flow">

                            ${renderTopics(step)}

                        </div>


                        <!-- TOPIC TEST -->

                        <div
                            id="topic-test-${step.id}"
                            class="topic-test-lock">

                            <div class="test-lock-icon">
                                🔒
                            </div>

                            <h3>
                                Topic Test
                            </h3>

                            <p>
                                Complete all subtopic tests
                                to unlock the 10-minute topic test.
                            </p>

                            <button
                                class="test-btn"
                                type="button"
                                disabled>

                                🔒 Locked

                            </button>

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

    updateTestLocks();

}


// ========================================
// RENDER SUBTOPICS
// ========================================

function renderTopics(step) {

    return step.topics.map(
        (topic, topicIndex) => {

            const topicId =
                createTopicId(
                    step.id,
                    topicIndex
                );


            const items =
                Array.isArray(topic.items)
                ? topic.items
                : [];


            return `

                <div
                    class="topic-node"
                    id="topic-node-${topicId}">

                    <div class="topic-box">

                        <div class="topic-title">

                            ${topicIndex + 1}.
                            ${topic.title}

                        </div>


                        <div class="topic-checklist">

                            ${
                                items.map(
                                    (item, itemIndex) => {

                                        const id =
                                            `${currentRole}-${step.id}-${topicIndex}-${itemIndex}`;

                                        allChecklistItems.push(id);

                                        return `

                                            <label
                                                class="topic-check"
                                                id="label-${id}">

                                                <input
                                                    type="checkbox"
                                                    id="${id}"
                                                    onchange="updateChecklist('${id}')">

                                                <span>
                                                    ${item}
                                                </span>

                                            </label>

                                        `;

                                    }
                                ).join("")
                            }

                        </div>


                        <!-- SUBTOPIC TEST -->

                        <div
                            class="subtopic-test-area"
                            id="subtest-${topicId}">

                            <div class="subtest-status">
                                📝 Test not attempted
                            </div>

                            <button
                                class="subtopic-test-btn"
                                type="button"
                                onclick="startSubtopicTest(
                                    '${step.id}',
                                    ${topicIndex}
                                )">

                                📝 Take 5-Mark Test

                            </button>

                        </div>

                    </div>

                </div>

            `;

        }
    ).join("");

}


// ========================================
// CREATE TOPIC ID
// ========================================

function createTopicId(stepId, topicIndex) {

    return `${currentRole}-${stepId}-${topicIndex}`;

}


// ========================================
// TOGGLE TOPICS
// ========================================

function toggleTopics(stepId) {

    const container =
        document.getElementById(
            `topics-${stepId}`
        );

    if (!container) return;


    container.classList.toggle("open");


    const button =
        container.parentElement
        .querySelector(".expand-btn");


    if (
        container.classList.contains("open")
    ) {

        button.textContent =
            "Hide Learning Path ↑";

    }

    else {

        button.textContent =
            "View Learning Path ↓";

    }

}


// ========================================
// CHECKLIST
// ========================================

function updateChecklist(id) {

    const checkbox =
        document.getElementById(id);

    const label =
        document.getElementById(
            `label-${id}`
        );


    if (!checkbox || !label) return;


    if (checkbox.checked) {

        label.classList.add("completed");

        localStorage.setItem(
            id,
            "completed"
        );

    }

    else {

        label.classList.remove("completed");

        localStorage.removeItem(id);

    }


    updateProgress();

    updateTestLocks();

}


// ========================================
// LOAD SAVED CHECKLIST
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

            label.classList.add("completed");

        }

    });


    updateProgress();

}


// ========================================
// ROADMAP PROGRESS
// ========================================

function updateProgress() {

    const total =
        allChecklistItems.length;


    const percentElement =
        document.getElementById(
            "progressPercent"
        );

    const bar =
        document.getElementById(
            "progressBar"
        );

    const textElement =
        document.getElementById(
            "progressText"
        );


    if (
        !percentElement ||
        !bar ||
        !textElement
    ) return;


    if (total === 0) {

        percentElement.textContent =
            "0";

        bar.style.width =
            "0%";

        textElement.textContent =
            "Start learning your roadmap 🚀";

        return;

    }


    const completed =
        allChecklistItems.filter(
            id =>
                localStorage.getItem(id) ===
                "completed"
        ).length;


    const percentage =
        Math.round(
            (completed / total) * 100
        );


    percentElement.textContent =
        percentage;

    bar.style.width =
        `${percentage}%`;


    if (percentage === 0) {

        textElement.textContent =
            "Start learning your roadmap 🚀";

    }

    else if (percentage < 50) {

        textElement.textContent =
            "Good start! Keep going 💪";

    }

    else if (percentage < 100) {

        textElement.textContent =
            "You're making great progress! 🔥";

    }

    else {

        textElement.textContent =
            "Roadmap completed! You're job-ready 🚀";

    }

}


// ========================================
// SUBTOPIC TEST
// ========================================

function startSubtopicTest(
    stepId,
    topicIndex
) {

    const role =
        roadmapData[currentRole];

    const step =
        role.steps.find(
            item => item.id === stepId
        );


    if (!step) return;


    const topic =
        step.topics[topicIndex];


    if (!topic) return;


    const questions =
        generateQuestions(
            topic.title,
            topic.items,
            5
        );


    openTestModal({

        type: "subtopic",

        title:
            topic.title,

        subtitle:
            "5-Mark Subtopic Test",

        questions:
            questions,

        duration:
            0,

        stepId:
            stepId,

        topicIndex:
            topicIndex

    });

}


// ========================================
// TOPIC TEST
// ========================================

function startTopicTest(stepId) {

    const role =
        roadmapData[currentRole];

    const step =
        role.steps.find(
            item => item.id === stepId
        );


    if (!step) return;


    if (!areAllSubtopicTestsPassed(step)) {

        alert(
            "Complete and pass all subtopic tests first."
        );

        return;

    }


    const allItems = [];


    step.topics.forEach(topic => {

        topic.items.forEach(item => {

            allItems.push(item);

        });

    });


    const questions =
        generateQuestions(
            step.title,
            allItems,
            15
        );


    openTestModal({

        type:
            "topic",

        title:
            `${step.title} Topic Test`,

        subtitle:
            "15 Questions • 10 Minutes",

        questions:
            questions,

        duration:
            10 * 60,

        stepId:
            stepId

    });

}


// ========================================
// FINAL TEST
// ========================================

function startFinalTest() {

    if (!isEntireRoadmapComplete()) {

        alert(
            "Complete all roadmap topics before starting the final test."
        );

        return;

    }


    const role =
        roadmapData[currentRole];


    const allItems = [];


    role.steps.forEach(step => {

        step.topics.forEach(topic => {

            topic.items.forEach(item => {

                allItems.push(item);

            });

        });

    });


    const questions =
        generateQuestions(
            role.title,
            allItems,
            30
        );


    openTestModal({

        type:
            "final",

        title:
            `${role.title} Final Assessment`,

        subtitle:
            "30 Questions • 30 Minutes",

        questions:
            questions,

        duration:
            30 * 60

    });

}


// ========================================
// QUESTION GENERATOR
// ========================================

function generateQuestions(
    title,
    items,
    count
) {

    if (!items || items.length === 0) {

        return [];

    }


    const uniqueItems =
        [...new Set(items)];


    const questions = [];


    for (
        let i = 0;
        i < count;
        i++
    ) {

        const correct =
            uniqueItems[
                i % uniqueItems.length
            ];


        let distractors =
            uniqueItems.filter(
                item =>
                    item !== correct
            );


        distractors =
            shuffleArray(
                distractors
            ).slice(0, 3);


        let options =
            [
                correct,
                ...distractors
            ];


        options =
            shuffleArray(options);


        const correctIndex =
            options.indexOf(correct);


        questions.push({

            question:
                `Which of the following is a concept covered under ${title}?`,

            options:
                options,

            answer:
                correctIndex

        });

    }


    return questions;

}


// ========================================
// SHUFFLE
// ========================================

function shuffleArray(array) {

    return [...array].sort(
        () => Math.random() - 0.5
    );

}


// ========================================
// OPEN TEST MODAL
// ========================================

let activeTest = null;

let testTimer = null;


function openTestModal(test) {

    activeTest = {

        ...test,

        currentQuestion: 0,

        score: 0,

        answers: [],

        startTime: Date.now()

    };


    if (!document.getElementById("testModal")) {

        createTestModal();

    }


    const modal =
        document.getElementById("testModal");


    modal.classList.add("show");


    renderTestQuestion();


    if (test.duration > 0) {

        startTestTimer(
            test.duration
        );

    }

}


// ========================================
// CREATE MODAL
// ========================================

function createTestModal() {

    const modal =
        document.createElement("div");

    modal.id =
        "testModal";

    modal.className =
        "test-modal";


    modal.innerHTML = `

        <div class="test-modal-content">

            <div class="test-header">

                <div>

                    <span
                        id="testSubtitle"
                        class="test-subtitle">
                    </span>

                    <h2
                        id="testTitle">
                    </h2>

                </div>

                <button
                    class="close-test"
                    onclick="closeTestModal()">

                    ×

                </button>

            </div>


            <div class="test-info">

                <span id="testQuestionNumber">
                    Question 1
                </span>

                <span
                    id="testTimer"
                    class="test-timer">
                </span>

            </div>


            <div
                id="testQuestion"
                class="test-question">
            </div>


            <div
                id="testOptions"
                class="test-options">
            </div>


            <div class="test-navigation">

                <button
                    id="nextTestButton"
                    class="test-next-btn"
                    onclick="nextTestQuestion()">

                    Next →

                </button>

            </div>

        </div>

    `;


    document.body.appendChild(modal);

}


// ========================================
// RENDER QUESTION
// ========================================

function renderTestQuestion() {

    const test =
        activeTest;


    const question =
        test.questions[
            test.currentQuestion
        ];


    document.getElementById(
        "testTitle"
    ).textContent =
        test.title;


    document.getElementById(
        "testSubtitle"
    ).textContent =
        test.subtitle;


    document.getElementById(
        "testQuestionNumber"
    ).textContent =
        `Question ${
            test.currentQuestion + 1
        } of ${
            test.questions.length
        }`;


    document.getElementById(
        "testQuestion"
    ).textContent =
        question.question;


    const optionsContainer =
        document.getElementById(
            "testOptions"
        );


    optionsContainer.innerHTML =
        "";


    question.options.forEach(
        (option, index) => {

            const label =
                document.createElement(
                    "label"
                );

            label.className =
                "test-option";


            label.innerHTML = `

                <input
                    type="radio"
                    name="testAnswer"
                    value="${index}">

                <span>
                    ${option}
                </span>

            `;


            optionsContainer.appendChild(
                label
            );

        }
    );


    const nextButton =
        document.getElementById(
            "nextTestButton"
        );


    if (
        test.currentQuestion ===
        test.questions.length - 1
    ) {

        nextButton.textContent =
            "Submit Test ✓";

    }

    else {

        nextButton.textContent =
            "Next →";

    }

}


// ========================================
// NEXT QUESTION
// ========================================

function nextTestQuestion() {

    const selected =
        document.querySelector(
            'input[name="testAnswer"]:checked'
        );


    if (!selected) {

        alert(
            "Please select an answer."
        );

        return;

    }


    const answer =
        Number(selected.value);


    const question =
        activeTest.questions[
            activeTest.currentQuestion
        ];


    activeTest.answers.push(
        answer
    );


    if (
        answer ===
        question.answer
    ) {

        activeTest.score++;

    }


    if (
        activeTest.currentQuestion <
        activeTest.questions.length - 1
    ) {

        activeTest.currentQuestion++;

        renderTestQuestion();

    }

    else {

        finishTest();

    }

}


// ========================================
// TIMER
// ========================================

function startTestTimer(seconds) {

    clearInterval(testTimer);


    let remaining =
        seconds;


    updateTimerDisplay(
        remaining
    );


    testTimer =
        setInterval(() => {

            remaining--;


            updateTimerDisplay(
                remaining
            );


            if (remaining <= 0) {

                clearInterval(
                    testTimer
                );

                finishTest(true);

            }

        }, 1000);

}


function updateTimerDisplay(seconds) {

    const timer =
        document.getElementById(
            "testTimer"
        );


    if (!timer) return;


    const minutes =
        Math.floor(
            seconds / 60
        );


    const secs =
        seconds % 60;


    timer.textContent =
        `⏱ ${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

}


// ========================================
// FINISH TEST
// ========================================

function finishTest(timeUp = false) {

    clearInterval(testTimer);


    const test =
        activeTest;


    const total =
        test.questions.length;


    const score =
        test.score;


    const percentage =
        Math.round(
            (score / total) * 100
        );


    const passed =
        percentage >= 60;


    saveTestResult(
        test,
        score,
        total,
        percentage,
        passed
    );


    showTestResult(
        test,
        score,
        total,
        percentage,
        passed,
        timeUp
    );

}


// ========================================
// SAVE TEST RESULT
// ========================================

function saveTestResult(
    test,
    score,
    total,
    percentage,
    passed
) {

    let key = "";


    if (test.type === "subtopic") {

        key =
            `subtest-${currentRole}-${test.stepId}-${test.topicIndex}`;

    }

    else if (test.type === "topic") {

        key =
            `topictest-${currentRole}-${test.stepId}`;

    }

    else {

        key =
            `finaltest-${currentRole}`;

    }


    const result = {

        score:
            score,

        total:
            total,

        percentage:
            percentage,

        passed:
            passed,

        date:
            new Date().toISOString()

    };


    localStorage.setItem(
        key,
        JSON.stringify(result)
    );

}


// ========================================
// SHOW RESULT
// ========================================

function showTestResult(
    test,
    score,
    total,
    percentage,
    passed,
    timeUp
) {

    const modal =
        document.getElementById(
            "testModal"
        );


    const content =
        modal.querySelector(
            ".test-modal-content"
        );


    const message =
        passed
        ?
        "Great job! You have successfully passed this test."
        :
        "Review the topic and try the test again.";


    const status =
        passed
        ?
        "🟢 PASSED"
        :
        "🔴 NOT PASSED";


    content.innerHTML = `

        <div class="test-result">

            <div class="result-icon">

                ${
                    passed
                    ? "🎉"
                    : "📚"
                }

            </div>


            <h2>

                ${
                    timeUp
                    ? "Time's Up!"
                    : "Test Completed!"
                }

            </h2>


            <div class="result-score">

                ${score} / ${total}

            </div>


            <div class="result-percentage">

                ${percentage}%

            </div>


            <div
                class="result-status ${
                    passed
                    ? "passed"
                    : "failed"
                }">

                ${status}

            </div>


            <p>

                ${message}

            </p>


            <div class="result-actions">

                ${
                    !passed
                    ?
                    `
                    <button
                        class="test-next-btn"
                        onclick="retryTest()">

                        ↻ Retake Test

                    </button>
                    `
                    :
                    `
                    <button
                        class="test-next-btn"
                        onclick="closeTestModal()">

                        Continue Roadmap →

                    </button>
                    `
                }

            </div>

        </div>

    `;


    updateTestLocks();

}


// ========================================
// RETRY TEST
// ========================================

function retryTest() {

    const oldTest =
        activeTest;


    closeTestModal();


    setTimeout(() => {

        openTestModal({

            ...oldTest,

            currentQuestion: 0,

            score: 0,

            answers: []

        });

    }, 100);

}


// ========================================
// CLOSE MODAL
// ========================================

function closeTestModal() {

    clearInterval(testTimer);


    const modal =
        document.getElementById(
            "testModal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );

    }


    updateTestLocks();

}


// ========================================
// GET SUBTOPIC RESULT
// ========================================

function getSubtopicResult(
    stepId,
    topicIndex
) {

    const key =
        `subtest-${currentRole}-${stepId}-${topicIndex}`;


    const saved =
        localStorage.getItem(key);


    if (!saved) return null;


    try {

        return JSON.parse(saved);

    }

    catch {

        return null;

    }

}


// ========================================
// CHECK ALL SUBTOPIC TESTS
// ========================================

function areAllSubtopicTestsPassed(step) {

    return step.topics.every(
        (topic, index) => {

            const result =
                getSubtopicResult(
                    step.id,
                    index
                );

            return (
                result &&
                result.passed
            );

        }
    );

}


// ========================================
// UPDATE TEST LOCKS
// ========================================

function updateTestLocks() {

    if (!roadmapData[currentRole]) {
        return;
    }


    const role =
        roadmapData[currentRole];


    role.steps.forEach(step => {

        step.topics.forEach(
            (topic, topicIndex) => {

                const area =
                    document.getElementById(
                        `subtest-${createTopicId(
                            step.id,
                            topicIndex
                        )}`
                    );


                if (!area) return;


                const result =
                    getSubtopicResult(
                        step.id,
                        topicIndex
                    );


                const status =
                    area.querySelector(
                        ".subtest-status"
                    );


                const button =
                    area.querySelector(
                        ".subtopic-test-btn"
                    );


                if (result) {

                    if (result.passed) {

                        status.textContent =
                            `🟢 Passed — ${result.score}/${result.total} (${result.percentage}%)`;

                        button.textContent =
                            "✓ Test Passed — Retake";

                        button.classList.add(
                            "test-passed"
                        );

                    }

                    else {

                        status.textContent =
                            `🔴 Not Passed — ${result.score}/${result.total} (${result.percentage}%)`;

                        button.textContent =
                            "↻ Retake Test";

                        button.classList.remove(
                            "test-passed"
                        );

                    }

                }

                else {

                    status.textContent =
                        "📝 Test not attempted";

                    button.textContent =
                        "📝 Take 5-Mark Test";

                }

            }
        );


        const topicTest =
            document.getElementById(
                `topic-test-${step.id}`
            );


        if (!topicTest) return;


        const topicButton =
            topicTest.querySelector(
                ".test-btn"
            );


        const topicResult =
            getTopicTestResult(
                step.id
            );


        if (topicResult) {

            if (topicResult.passed) {

                topicTest.className =
                    "topic-test-lock test-completed";

                topicTest.innerHTML = `

                    <div class="test-lock-icon">
                        🏆
                    </div>

                    <h3>
                        Topic Test Completed
                    </h3>

                    <p>
                        Score:
                        ${topicResult.score}/${topicResult.total}
                        (${topicResult.percentage}%)
                    </p>

                    <button
                        class="test-btn test-passed"
                        onclick="startTopicTest('${step.id}')">

                        ↻ Retake Topic Test

                    </button>

                `;

            }

            return;

        }


        const unlocked =
            areAllSubtopicTestsPassed(
                step
            );


        if (unlocked) {

            topicTest.className =
                "topic-test-lock test-unlocked";


            topicTest.innerHTML = `

                <div class="test-lock-icon">
                    🔓
                </div>

                <h3>
                    Topic Test Unlocked!
                </h3>

                <p>
                    15 questions • 10 minutes
                </p>

                <button
                    class="test-btn"
                    onclick="startTopicTest('${step.id}')">

                    📝 Start Topic Test

                </button>

            `;

        }

        else {

            topicTest.className =
                "topic-test-lock";


            topicTest.innerHTML = `

                <div class="test-lock-icon">
                    🔒
                </div>

                <h3>
                    Topic Test Locked
                </h3>

                <p>
                    Pass all subtopic tests
                    to unlock this test.
                </p>

                <button
                    class="test-btn"
                    disabled>

                    🔒 Locked

                </button>

            `;

        }

    });


    updateFinalTestButton();

}


// ========================================
// TOPIC TEST RESULT
// ========================================

function getTopicTestResult(stepId) {

    const key =
        `topictest-${currentRole}-${stepId}`;


    const saved =
        localStorage.getItem(key);


    if (!saved) return null;


    try {

        return JSON.parse(saved);

    }

    catch {

        return null;

    }

}


// ========================================
// CHECK ENTIRE ROADMAP
// ========================================

function isEntireRoadmapComplete() {

    const role =
        roadmapData[currentRole];


    if (!role) return false;


    return role.steps.every(
        step => {

            return (
                areAllSubtopicTestsPassed(
                    step
                ) &&
                Boolean(
                    getTopicTestResult(
                        step.id
                    )?.passed
                )
            );

        }
    );

}


// ========================================
// FINAL TEST BUTTON
// ========================================

function updateFinalTestButton() {

    let finalArea =
        document.getElementById(
            "finalRoadmapTest"
        );


    if (!finalArea) {

        finalArea =
            document.createElement(
                "section"
            );

        finalArea.id =
            "finalRoadmapTest";

        finalArea.className =
            "final-test-section";


        const container =
            document.getElementById(
                "roadmapContainer"
            );


        if (container) {

            container.parentElement.appendChild(
                finalArea
            );

        }

    }


    const complete =
        isEntireRoadmapComplete();


    if (complete) {

        finalArea.innerHTML = `

            <div class="final-test-card unlocked">

                <div class="final-test-icon">
                    🎓
                </div>

                <h2>
                    Final Roadmap Test Unlocked!
                </h2>

                <p>
                    You have completed every topic.
                    Now prove your knowledge.
                </p>

                <div class="final-test-info">

                    📝 30 Questions
                    &nbsp; • &nbsp;
                    ⏱ 30 Minutes
                    &nbsp; • &nbsp;
                    🎯 30 Marks

                </div>

                <button
                    class="final-test-btn"
                    onclick="startFinalTest()">

                    🎓 Start Final Test

                </button>

            </div>

        `;

    }

    else {

        finalArea.innerHTML = `

            <div class="final-test-card locked">

                <div class="final-test-icon">
                    🔒
                </div>

                <h2>
                    Final Roadmap Test
                </h2>

                <p>
                    Complete and pass every
                    topic test to unlock the
                    final assessment.
                </p>

                <div class="final-test-info">

                    📝 30 Questions
                    &nbsp; • &nbsp;
                    ⏱ 30 Minutes

                </div>

            </div>

        `;

    }

}


// ========================================
// START
// ========================================

loadRoadmap();