```markdown
# SunnahBites - Sunnah Meal Planner

[![Electron](https://img.shields.io/badge/Electron-?-brightgreen)](https://www.electronjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## Project Overview

SunnahBites is a desktop application that helps Muslims discover halal recipes using Sunnah-inspired ingredients (dates, honey, olives, barley) and plan weekly meals.

Built with Electron.js during my Diploma in Computer Science.

## Technologies Used

- Electron.js - Cross-platform desktop framework
- JavaScript (ES6+) - Core programming language
- HTML5 & CSS3 - User interface design
- Spoonacular API - Recipe data integration
- File System (fs) - Local data persistence

## Features

- Search recipes using Sunnah ingredients
- Automatic halal filtering (no pork, alcohol, gelatin)
- Weekly meal planner with full CRUD operations
- Local data persistence (saves between sessions)
- Educational Sunnah facts and quotes

## How to Run

```bash
git clone https://github.com/abbysherryyy/sunnahbites.git
cd sunnahbites
npm install
npm start
```

## Project Structure

```
SunnahBites/
+-- main.js                 # Electron main process
+-- preload.js              # Secure IPC bridge
+-- package.json            # Dependencies
+-- renderer/
¦   +-- index.html          # Home page
¦   +-- search.html         # Recipe search page
¦   +-- planner.html        # Meal planner page
¦   +-- styles.css          # Styling
¦   +-- index.js
¦   +-- search.js
¦   +-- planner.js
+-- data/
¦   +-- mealplan.json       # Saved meal plans
+-- demo-screenshots/       # App screenshots
```

## License

MIT License - see [LICENSE](LICENSE) file for details.

---

Built with love for the Ummah
```

