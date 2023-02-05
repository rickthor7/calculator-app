(() => {
	/* --- Theme Switcher --- */

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

	{ // Initialize theme
		let currentTheme = localStorage.getItem('theme');
		if (currentTheme) {
			setTheme(currentTheme);
		} else {
			setTheme('theme1'); // Default theme
		}
	}

	function toggleTheme() {
		const selectedTheme = document.querySelector('input[name=theme]:checked').value;
		setTheme(selectedTheme);
	}

	// The three (tri-state) radio button click listeners
	document.querySelectorAll('input[name=theme]').forEach((toggleRadio) => {
		toggleRadio.addEventListener('click', toggleTheme, false);
	});

	// Dark mode media query checker
	window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
		if (e.matches) setTheme('theme1');
	}, false);

	// Light mode media query checker
	window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
		if (e.matches) setTheme('theme2');
	}, false);

	// High contrast mode media query checker
	window.matchMedia('(prefers-contrast: more)').addEventListener('change', (e) => {
		if (e.matches) setTheme('theme3');
	}, false);

	/* --- Calculator --- */

	let formatter = new Intl.NumberFormat('en-US', { maximumFractionDigits: 20 });

	const result = document.querySelector('#result');
	result.value = 0;
	let mathArray = [];
	let operationFlag = false;
	let divideByZeroFlag = false;
	let fontScales = [];

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

	function getValueWithoutCommas() {
		return result.value.replace(/,/g, '');
	}

	function autoScaleResult() {
		// Scale result font size down if too many characters are shown
		if (result.scrollWidth > result.clientWidth) {
			fontScales.push(window.getComputedStyle(result)['font-size']);
			const charWidth = result.scrollWidth / result.value.length;
			result.style.fontSize = `calc(${charWidth}px - ${charWidth / result.clientWidth}px)`;
		}

		// If result font was scaled down, check to see if it can scaled back up
		// based on number of chars and current font size of result field.
		if (fontScales.length) {
			const digitsOnly = result.value.replace(/[,\.]/g, '');
			const charWidth = parseInt(window.getComputedStyle(result)['font-size'].replace('px',''));
			const charsWidthTotal = (digitsOnly.length - 1) * charWidth;
			const charsWidthTotalInResultHalf = Math.ceil(result.clientWidth / 2 / charWidth) * charWidth;

			if (charsWidthTotal <= charsWidthTotalInResultHalf) {
				result.style.fontSize = fontScales[fontScales.length - 1];
				fontScales.pop();
			}
		}
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
					mathArray.push(parseFloat(getValueWithoutCommas()));
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
					let rawValue = getValueWithoutCommas();
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
					const digitsOnly = result.value.replace(/[,\.]/g, '');
					if (digitsOnly.length + 1 < 16) {
						const newValue = parseFloat(getValueWithoutCommas() + e.target.value);
						result.value = formatter.format(newValue);
					}
				}
				break;
		}

		autoScaleResult();
	}

	document.querySelectorAll('.key').forEach((key) => {
		key.addEventListener('click', keyPushed, false);
	});

	// If window is resized, check result value font size and scale as needed
	window.addEventListener('resize', autoScaleResult, false);
})();