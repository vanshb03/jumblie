function mixLetters(words) {
	let letters = words.join("").split("");
	for (let i = letters.length - 1; i >= 0; i--) {
		let randomIndex = Math.floor(Math.random() * (i + 1));
		let temp = letters[i];
		letters[i] = letters[randomIndex];
		letters[randomIndex] = temp;
	}
	return letters;
}

let theme = wordsForTheDay.theme;
let jumbledLetters = mixLetters(wordsForTheDay.words);
let letterGrid = document.getElementById("letterGrid");
let workingWordDiv = document.getElementById("workingWord");
let wordsList = document.getElementById("wordsList");
let themeDiv = document.getElementById("theme");
let selectedButtons = [];

themeDiv.textContent = theme;

jumbledLetters.forEach((letter, index) => {
	let letterButton = document.createElement("button");
	letterButton.textContent = letter;
	letterButton.classList.add("letter-button");
	letterButton.classList.add(`letter-${index}`);
	letterButton.addEventListener("click", (event) => {
		const button = event.target;
		const index = button.classList[1].split("-")[1];

		if (selectedButtons.includes(index)) {
			selectedButtons = selectedButtons.filter(
				(btnIndex) => btnIndex !== index
			);
		} else {
			selectedButtons.push(index);
		}

		button.classList.toggle("selected");

		updateWorkingWord();
	});

	letterGrid.appendChild(letterButton);
});

function updateWorkingWord() {
	const letterButtons = document.querySelectorAll(".letter-button");
	let workingWord = "";

	selectedButtons.forEach((index) => {
		const button = letterButtons[index];
		workingWord += button.textContent;
	});

	workingWordDiv.textContent = workingWord;
}

document.addEventListener("keydown", handleKeydown);

const letterMap = {};
jumbledLetters.forEach((letter, index) => {
	letterMap[letter] = index;
});

function handleKeydown(event) {
	if (event.key === "Backspace") {
		if (selectedButtons.length > 0) {
			const index = selectedButtons.pop();
			const letterButtons = document.querySelectorAll(".letter-button");

			if (letterButtons[index]) {
				letterButtons[index].classList.remove("selected");
			}

			updateWorkingWord();
		}
	}

	const key = event.key;
	const letterButtons = document.querySelectorAll(".letter-button");

	if (key.length === 1 && key >= "a" && key <= "z") {
		const indexes = [];
		letterButtons.forEach((button, index) => {
			if (button.textContent === key) {
				indexes.push(index);
			}
		});

		const availableIndex = indexes.find((index) => {
			const button = letterButtons[index];
			return !button.classList.contains("selected");
		});

		if (availableIndex !== undefined) {
			const button = letterButtons[availableIndex];
			button.classList.add("selected");
			selectedButtons.push(availableIndex);
			updateWorkingWord();
		}
	}
}

document.getElementById("submit").addEventListener("click", () => {
	const workingWord = workingWordDiv.textContent;
	const letterButtons = document.querySelectorAll(".letter-button");

	if (wordsForTheDay.words.includes(workingWord)) {
		const wordElement = document.createElement("li");
		wordElement.textContent = workingWord;
		wordsList.appendChild(wordElement);

		selectedButtons.forEach((index) => {
			const button = letterButtons[index];
			button.remove();
		});

		selectedButtons = [];
	} else {
		selectedButtons.forEach((index) => {
			const button = letterButtons[index];
			button.classList.remove("selected");
		});

		selectedButtons = [];
	}

	workingWordDiv.textContent = "";
});

document.getElementById("help").addEventListener("click", () => {
	document.querySelector("dialog").showModal();
});
