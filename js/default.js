(() => {
	/* --- Theme Switcher --- */

	let currentTheme = localStorage.getItem('theme');

	const toggleButton = document.querySelector('.toggle-switch-button');

	// Slide the tri-state toggle switch into position
	function setToggleState(themeName) {
		switch (themeName) {
			case 'theme1':
				toggleButton.style.left = '0.3rem';
				break;
			case 'theme2':
				toggleButton.style.left = 'calc(50% - 1.05rem)';
				break;
			case 'theme3':
				toggleButton.style.left = 'calc(100% - 2.1rem - 0.3rem)';
				break;
		}
	}

	function setTheme(themeName) {
		localStorage.setItem('theme', themeName);
		document.documentElement.className = themeName;
		setToggleState(themeName);
	}

	function toggleTheme() {
		const selectedTheme = document.querySelector('input[name=theme]:checked').value;
		setTheme(selectedTheme);
	}

	if (currentTheme) {
		setTheme(currentTheme);
	} else {
		setTheme('theme1'); // Default theme
	}

	// The three (tri-state) radio button click listeners
	const toggleRadios = document.querySelectorAll('input[name=theme]');
	for (let i = 0; i < toggleRadios.length; ++i) {
		toggleRadios[i].addEventListener('click', toggleTheme, false);
	}

	// Dark mode media query checker
	const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
	prefersDarkMode.addEventListener('change', (e) => {
		if (e.matches) setTheme('theme1');
	}, false);

	// Light mode media query checker
	const prefersLightMode = window.matchMedia('(prefers-color-scheme: light)');
	prefersLightMode.addEventListener('change', (e) => {
		if (e.matches) setTheme('theme2');
	}, false);

	// High contrast mode media query checker
	const prefersHighContrastMode = window.matchMedia('(prefers-contrast: more)');
	prefersHighContrastMode.addEventListener('change', (e) => {
		if (e.matches) setTheme('theme3');
	}, false);

	/* --- Calculator --- */

	let formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 20 });

	const result = document.querySelector('#result');
	result.value = 0;
	let mathArray = [];
	let operationFlag = false;
	let divideByZeroFlag = false;

	function calculateArray() {
		let total = 0;

		if (mathArray[1] === '+') { // Addition
			total = mathArray[0] + mathArray[2];
		} else if (mathArray[1] === '-') { // Subtraction
			total = mathArray[0] - mathArray[2];
		} else if (mathArray[1] === '*') { // Multiplication
			total = mathArray[0] * mathArray[2];
		} else if (mathArray[1] === '/') {// Division
			if (mathArray[2] !== 0) { // Divide by zero check
				total = mathArray[0] / mathArray[2];
			} else {
				// Cannot divide by zero!
				total = 0;
				mathArray = [];
				divideByZeroFlag = true;
			}
		}

		if (!divideByZeroFlag) {
			if (mathArray[3] !== '=') {
				// As operators are entered, continue the sequence
				mathArray = [total, mathArray[3]];
			} else {
				// Equal pressed. Total it up!
				mathArray = [total];
			}

			// Display result
			result.value = formatter.format(total);
		} else {
			result.value = 'Cannot divide by zero';
			divideByZeroFlag = false;
		}
	}

	function getRawValue() {
		return parseFloat(result.value.replace(/,/g, ''));
	}

	function keyPushed(e) {
		switch (e.target.value) {
			case '+':
			case '-':
			case '*':
			case '/':
			case '=':
				if (operationFlag) {
					// Replace previously entered operator with new operator
					mathArray[mathArray.length - 1] = e.target.value;
				} else {
					// Add entered number followed by operator into sequence
					mathArray.push(getRawValue());
					mathArray.push(e.target.value);	
				}

				if (mathArray.length === 4) {
					// We have enough operations entered - calculate it!
					calculateArray();
				}

				operationFlag = true;
				break;
			case '.':
				if (operationFlag) {
					// If decimal was entered using an operation, add zero to front
					result.value = '0.';
					operationFlag = false;
				} else {
					// Otherwise, append the decimal to current number
					result.value += '.';
				}
				break;
			case 'delete':
				if (result.value.length > 1) {
					// Delete a number on every press
					let rawValue = result.value.replace(/,/g, '');
					result.value = formatter.format(parseFloat(rawValue.substr(0, rawValue.length - 1)));
				} else if (result.value.length === 1) {
					// If a single number is left, then zero it out
					result.value = 0;
					// Since all numbers were removed, clear any pending calculations
					mathArray = [];
				}
				break;
			case 'reset':
				result.value = 0;
				mathArray = [];
				break;
			default:
				// If the beginning of a number entry or an operation was used
				if (result.value === '0' || operationFlag) {
					result.value = e.target.value;
					operationFlag = false;
				} else {
					// Keep the number of digits entered less than 16
					const digitsOnly = result.value.replace(/,\./g, '');
					if (digitsOnly.length + 1 < 16) {
						const newValue = parseFloat(result.value.replace(/,/g, '') + e.target.value);
						result.value = formatter.format(newValue);
					}
				}
				break;
		}
	}

	const keys = document.querySelectorAll('.key');
	for (let i = 0; i < keys.length; ++i) {
		keys[i].addEventListener('click', keyPushed, false);
	}
})();