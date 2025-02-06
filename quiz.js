// Select DOM elements
const _question = document.getElementById('question');
const _options = document.querySelector('.quiz-options');
const _currentQuestion = document.getElementById('current-question');
const _totalQuestion = document.getElementById('total-question');
const _playAgainBtn = document.getElementById('play-again');

let correctAnswer = "", correctScore = 0, askedCount = 0, totalQuestion = 10;
let questionData = [];  // Store the questions data

// Initialize the quiz
function initializeQuiz() {
    _totalQuestion.textContent = totalQuestion; // Total number of questions
    loadQuestions();  // Load all questions first
    addEventListeners();
}

// Add event listeners
function addEventListeners() {
    _playAgainBtn.addEventListener('click', restartQuiz);
}

document.addEventListener('DOMContentLoaded', initializeQuiz);

// Fetch and load all questions from the API
async function loadQuestions() {
    const APIUrl = 'https://opentdb.com/api.php?amount=10&category=18';
    try {
        const response = await fetch(APIUrl);
        const data = await response.json();
        questionData = data.results;  // Store questions
        loadQuestion();  // Load the first question
    } catch (error) {
        console.error('Failed to fetch questions:', error);
    }
}

// Load the next question
function loadQuestion() {
    if (askedCount >= totalQuestion) {
        displayFinalScore(); // Stop loading questions once totalQuestion limit is reached
        return;
    }

    const currentQuestionData = questionData[askedCount];
    if (!currentQuestionData) return;

    correctAnswer = currentQuestionData.correct_answer;
    const incorrectAnswers = currentQuestionData.incorrect_answers;
    const optionsList = [...incorrectAnswers];
    optionsList.splice(Math.floor(Math.random() * (incorrectAnswers.length + 1)), 0, correctAnswer);

    _question.innerHTML = `${currentQuestionData.question} <br> <span class="category">${currentQuestionData.category}</span>`;
    _options.innerHTML = optionsList.map(option => `<li>${option}</li>`).join('');
    
    setCount();  // Update the question count
    enableOptionSelection();
}

// Enable option selection
function enableOptionSelection() {
    _options.querySelectorAll('li').forEach(option => {
        option.addEventListener('click', () => {
            if (_options.querySelector('.selected')) {
                _options.querySelector('.selected').classList.remove('selected');
            }
            option.classList.add('selected');
            handleAnswer(option);  // Handle the answer immediately upon selection
        });
    });
}

// Handle the selected answer
function handleAnswer(selectedOption) {
    const selectedAnswer = selectedOption.textContent;

    // Increase score if the answer is correct
    if (selectedAnswer === correctAnswer) {
        correctScore++; 
    }

    // Proceed to the next question automatically after 2 seconds
    setTimeout(() => {
        askedCount++; // Increment question count
        setCount();  // Update the current question number

        if (askedCount < totalQuestion) {
            loadQuestion(); // Load the next question
        } else {
            displayFinalScore(); // Display final score after all questions
        }
    }, 2000); // 2 seconds delay
}

// Update the current question and total question count
function setCount() {
    _currentQuestion.textContent = askedCount + 1; // Display the current question number correctly (1-based)
}

// Display final score on the next page
function displayFinalScore() {
    // Store score in localStorage
    localStorage.setItem('finalScore', correctScore);

    // Redirect to the final score page
    window.location.href = 'finalScore.html'; 
}

// Restart the quiz
function restartQuiz() {
    correctScore = askedCount = 0;
    _playAgainBtn.style.display = "none";
    loadQuestion(); // Load the first question again
}
