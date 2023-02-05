# Frontend Mentor - Calculator app solution

This is a solution to the [Calculator app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/calculator-app-9lteq5N29). Frontend Mentor challenges help you improve your coding skills by building realistic projects. 

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- See the size of the elements adjust based on their device's screen size
- Perform mathmatical operations like addition, subtraction, multiplication, and division
- Adjust the color theme based on their preference
- **Bonus**: Have their initial theme preference checked using `prefers-color-scheme` and have any additional changes saved in the browser

### Links

- Solution URL: [Add solution URL here](https://your-solution-url.com)
- Live Site URL: [Add live site URL here](https://your-live-site-url.com)

## My process

### Built with

- HTML5
- CSS
- Flexbox
- CSS Grid
- JavaScript
- Mobile-first workflow

### What I learned

Checking theme modes using `matchMedia()`. I was a little confused on how to setup CSS themes along with checking user's preferred theme. I think I got it setup right.

Chrome's Lighthouse was complaining about the tri-state theme toggle switcher in regards to being too small for thumb pressing. I made it larger for minimum 48x48px thumb pressing.

Added an automatic font sizer based on the number of characters entered. It scales back up as well if numbers are removed and will also be checked if window is resized.

## Author

- Frontend Mentor - [@seranela](https://www.frontendmentor.io/profile/seranela)