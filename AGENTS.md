# Agent Guidelines for RPG Dating Game Project

## Build/Test Commands
- **Open the app**: Open `src/index.html` in a web browser
- **Development**: No build process required - edit files directly and refresh browser
- **Testing**: Manual testing in browser, check browser console for errors

## Code Style Guidelines
- Use vanilla JavaScript (ES6+) for all functionality
- Store all game data in localStorage for persistence
- Use semantic HTML5 elements for better structure
- Follow CSS best practices with clear class naming conventions
- Use camelCase for JavaScript variables/functions
- Use descriptive variable names (e.g., `playerCharacter` not `pc`)
- Handle errors explicitly with try-catch blocks
- Use modern JavaScript features (arrow functions, destructuring, template literals)
- Add comments for complex game logic and localStorage operations
- Implement proper input validation for user data and game state
- Use consistent indentation (2 or 4 spaces)
- Keep HTML, CSS, and JavaScript in separate files for maintainability

## Technical Architecture
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Data Storage**: Browser localStorage only
- **No backend**: All game logic runs client-side
- **No build tools**: Direct file editing and browser refresh workflow
- **No external dependencies**: Self-contained application

## File Structure
- `src/index.html` - Main HTML file
- `src/styles.css` - All CSS styles
- `src/game.js` - Game logic and localStorage operations
