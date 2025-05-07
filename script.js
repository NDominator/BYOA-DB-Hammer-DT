// Decision tree data
const decisionTree = {
    "start": {
        "question": "Are your athletes explosive early but fading fast?",
        "yes": {
            "focus": "ND",
            "description": "Neural Duration",
            "recommendations": [
                "Add buffered AR circuits",
                "Include fatigue cycles",
                "Use short capacity sets"
            ]
        },
        "no": {
            "next": {
                "question": "Are your athletes strong in drills but slow in live play?",
                "yes": {
                    "focus": "NR",
                    "description": "Neural Rate",
                    "recommendations": [
                        "Layer AN-1 work",
                        "Short sprints",
                        "Depth jumps",
                        "Reflexive drills"
                    ]
                },
                "no": {
                    "next": {
                        "question": "Are your athletes powerful but inconsistent from play to play?",
                        "yes": {
                            "focus": ["ND", "AE"],
                            "description": "Neural Duration buffering + Aerobic Reserve support",
                            "recommendations": [
                                "Clustered med ball work",
                                "ISO + jump circuits",
                                "AE reloads"
                            ]
                        },
                        "no": {
                            "next": {
                                "question": "Are your athletes struggling to produce force even when fresh?",
                                "yes": {
                                    "focus": "NM",
                                    "description": "Neural Magnitude",
                                    "recommendations": [
                                        "Introduce clusters",
                                        "ISOs",
                                        "Banded accelerative lifts (9–12s sets)"
                                    ]
                                },
                                "no": {
                                    "next": {
                                        "question": "Are your athletes sluggish, sore, or showing delayed recovery?",
                                        "yes": {
                                            "focus": "AE",
                                            "description": "Aerobic Reserve",
                                            "recommendations": [
                                                "Tempo ISOs",
                                                "Low-load circuits",
                                                "Breathing resets"
                                            ]
                                        },
                                        "no": {
                                            "conclusion": "Your trait targeting is likely on track."
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

// DOM Elements
const questionContainer = document.getElementById('question-container');
const resultContainer = document.getElementById('result-container');
const currentQuestion = document.getElementById('current-question');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const restartBtn = document.getElementById('restart-btn');
const focusArea = document.getElementById('focus-area');
const description = document.getElementById('description');
const recommendations = document.getElementById('recommendations');
const questionList = document.getElementById('question-list');

let currentNode = decisionTree.start;
let questionNodes = [];

// Function to collect all questions from the decision tree
function collectQuestions(node, path = []) {
    if (node.question) {
        questionNodes.push({
            node: node,
            path: [...path],
            question: node.question
        });
    }
    
    if (node.yes && node.yes.next) {
        collectQuestions(node.yes.next, [...path, 'yes']);
    }
    if (node.no && node.no.next) {
        collectQuestions(node.no.next, [...path, 'no']);
    }
}

// Function to populate the navigation menu
function populateNavigation() {
    collectQuestions(decisionTree.start);
    questionNodes.forEach((qNode, index) => {
        const li = document.createElement('li');
        li.textContent = `Q${index + 1}: ${qNode.question}`;
        li.addEventListener('click', () => navigateToQuestion(qNode));
        questionList.appendChild(li);
    });
}

// Function to navigate to a specific question
function navigateToQuestion(qNode) {
    currentNode = qNode.node;
    showQuestion();
    updateActiveQuestion();
}

// Function to update the active question in the navigation
function updateActiveQuestion() {
    const listItems = questionList.getElementsByTagName('li');
    for (let i = 0; i < listItems.length; i++) {
        if (questionNodes[i].node === currentNode) {
            listItems[i].classList.add('active');
        } else {
            listItems[i].classList.remove('active');
        }
    }
}

function showQuestion() {
    questionContainer.classList.remove('hidden');
    resultContainer.classList.add('hidden');
    currentQuestion.textContent = currentNode.question;
    updateActiveQuestion();
}

function showResult(result) {
    questionContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');

    if (result.conclusion) {
        focusArea.textContent = "No Specific Focus Needed";
        description.textContent = result.conclusion;
        recommendations.innerHTML = '';
    } else {
        focusArea.textContent = Array.isArray(result.focus) ? result.focus.join(' + ') : result.focus;
        description.textContent = result.description;
        recommendations.innerHTML = result.recommendations.map(rec => `<li>${rec}</li>`).join('');
    }
}

function handleAnswer(answer) {
    if (answer === 'yes' && currentNode.yes) {
        if (currentNode.yes.next) {
            currentNode = currentNode.yes.next;
            showQuestion();
        } else {
            showResult(currentNode.yes);
        }
    } else if (answer === 'no' && currentNode.no) {
        if (currentNode.no.next) {
            currentNode = currentNode.no.next;
            showQuestion();
        } else {
            showResult(currentNode.no);
        }
    }
}

// Event Listeners
yesBtn.addEventListener('click', () => handleAnswer('yes'));
noBtn.addEventListener('click', () => handleAnswer('no'));
restartBtn.addEventListener('click', () => {
    currentNode = decisionTree.start;
    showQuestion();
});

// Initialize
populateNavigation();
showQuestion(); 