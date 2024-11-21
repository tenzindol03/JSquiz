(function () {
    // Variables
    const quizContainer = document.getElementById('quiz');
    const resultsContainer = document.getElementById('results');
    const submitButton = document.getElementById('submit');
    const previousButton = document.getElementById("previous");
    const nextButton = document.getElementById("next");
    const timerElement = document.getElementById('timer');

    let myQuestions = [
        {
            question: "Who invented JavaScript?",
            answers: {
                a: "Douglas Crockford",
                b: "Sheryl Sandberg",
                c: "Brendan Eich",
                d: "Ryan Dahl"
            },
            correctAnswer: "c"
        },
        {
            question: "Which one of these is a JavaScript package manager?",
            answers: {
                a: "Node.js",
                b: "TypeScript",
                c: "npm",
                d: "Yarn"
            },
            correctAnswer: "c"
        },
        {
            question: "Which tool can you use to ensure code quality?",
            answers: {
                a: "Angular",
                b: "jQuery",
                c: "RequireJS",
                d: "ESLint"
            },
            correctAnswer: "d"
        },
        {
            question: "What is the output of 'console.log(typeof null)'?",
            answers: {
                a: "null",
                b: "object",
                c: "undefined",
                d: "number"
            },
            correctAnswer: "b"
        },
        {
            question: "What does 'use strict' do in JavaScript?",
            answers: {
                a: "Enables modern JavaScript features",
                b: "Prevents the use of undefined variables",
                c: "Allows the use of deprecated features",
                d: "Disables strict mode"
            },
            correctAnswer: "b"
        }
    ];

    let currentSlide = 0;
    let timeLeft = 50;
    let timer;

    // Shuffle Questions
    myQuestions.sort(function () {
        return 0.5 - Math.random();
    });

    // Build Quiz
    function buildQuiz() {
        const output = [];

        myQuestions.forEach((currentQuestion, questionNumber) => {
            const answers = [];

            Object.keys(currentQuestion.answers).forEach(letter => {
                answers.push(
                    `<label>
                        <input type="radio" name="question${questionNumber}" value="${letter}">
                        ${letter} : ${currentQuestion.answers[letter]}
                    </label>`
                );
            });

            output.push(
                `<div class="slide">
                    <div class="question">${currentQuestion.question}</div>
                    <div class="answers">${answers.join("")}</div>
                    <div class="feedback" id="feedback${questionNumber}" style="color:blue; margin-top:10px;"></div>
                </div>`
            );
        });

        quizContainer.innerHTML = output.join('');
    }

    function showResults() {
        const answerContainers = quizContainer.querySelectorAll('.answers');
        let numCorrect = 0;

        myQuestions.forEach((currentQuestion, questionNumber) => {
            const answerContainer = answerContainers[questionNumber];
            const selector = `input[name=question${questionNumber}]:checked`;
            const userAnswer = (answerContainer.querySelector(selector) || {}).value;

            if (userAnswer === currentQuestion.correctAnswer) {
                numCorrect++;
                answerContainer.style.color = 'lightgreen';
            } else {
                answerContainer.style.color = 'red';
            }

            const feedbackContainer = document.getElementById(`feedback${questionNumber}`);
            feedbackContainer.innerHTML = `Correct answer: ${currentQuestion.correctAnswer}.`;
        });

        resultsContainer.innerHTML = `You got ${numCorrect} out of ${myQuestions.length} questions right.`;
        previousButton.style.display = "none";
        clearInterval(timer); // Stop the timer
        
        // Ask user if they want to play again
        setTimeout(() => {
            if (confirm("Would you like to try again?")) {
                location.reload(); // Reload the page to reset the quiz
            }
        }, 500);
    }

    function showSlide(n) {
        slides[currentSlide].classList.remove('active-slide');
        slides[n].classList.add('active-slide');
        currentSlide = n;

        previousButton.style.display = currentSlide === 0 ? 'none' : 'inline-block';
        nextButton.style.display = currentSlide === slides.length - 1 ? 'none' : 'inline-block';
        submitButton.style.display = currentSlide === slides.length - 1 ? 'inline-block' : 'none';
    }

    function showNextSlide() {
        showSlide(currentSlide + 1);
    }

    function showPreviousSlide() {
        showSlide(currentSlide - 1);
    }

    function startTimer() {
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timer);
                alert('Time is up!');
                showResults();
            }
        }, 1000);
    }

    function provideImmediateFeedback(event) {
        const questionNumber = event.target.name.replace("question", "");
        const selectedAnswer = event.target.value;

        const feedbackContainer = document.getElementById(`feedback${questionNumber}`);
        const correctAnswer = myQuestions[questionNumber].correctAnswer;

        if (selectedAnswer === correctAnswer) {
            feedbackContainer.style.color = 'green';
            feedbackContainer.innerHTML = "Correct!";
        } else {
            feedbackContainer.style.color = 'red';
            feedbackContainer.innerHTML = `Wrong! Correct answer: ${correctAnswer}.`;
        }
    }

    // Start Quiz
    buildQuiz();
    const slides = document.querySelectorAll(".slide");
    showSlide(currentSlide);
    startTimer();

    // Add event listeners for radio buttons
    quizContainer.addEventListener("change", provideImmediateFeedback);

    // Event Listeners
    submitButton.addEventListener('click', showResults);
    previousButton.addEventListener("click", showPreviousSlide);
    nextButton.addEventListener("click", showNextSlide);
})();
