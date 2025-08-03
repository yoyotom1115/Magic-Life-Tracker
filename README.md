# Magic Life Tracker

A modern, responsive web application for tracking life totals in Magic: The Gathering games. Features a clean, intuitive interface with visual feedback for quick gameplay. Supports 2-4 players with customizable starting life totals and editable player names.

## Features

### Core Functionality
- **Multi-Player Support**: Track life totals for 2, 3, or 4 players simultaneously
- **Editable Player Names**: Click on player names to customize them
- **Life Management**: Increase/decrease life by 1 or 5 points for each player
- **Reset Options**: Individual player reset or reset all players
- **Customizable Starting Life**: Set custom starting life totals (1-999)
- **Player Count Selection**: Easily switch between 2, 3, or 4 player games

### Visual Features
- **Modern UI**: Clean, gradient-based design with smooth animations
- **Responsive Layout**: Automatically adjusts grid layout based on player count
- **Life Status Indicators**: 
  - Normal (11+ life): Standard display
  - Low (6-10 life): Yellow/orange warning
  - Critical (1-5 life): Red with pulsing animation
  - Negative (0 or below): Dark red with shake effect
- **Visual Feedback**: Animated effects when changing life totals
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Files

- `index.html` - Main HTML structure
- `styles.css` - All styling and responsive design
- `script.js` - JavaScript functionality and game logic
- `README.md` - This documentation

## Usage

1. **Open the Application**: Simply open `index.html` in any modern web browser
2. **Select Player Count**: Choose between 2, 3, or 4 players using the dropdown
3. **Customize Player Names**: Click on any player name to edit it (optional)
4. **Start a Game**: All players start with 40 life by default
5. **Track Life**: Use the buttons to modify life totals
6. **Customize**: Change the starting life total using the input field at the bottom
7. **Reset**: Use individual reset buttons or reset all players at once

## Layout Options

- **2 Players**: Side-by-side layout
- **3 Players**: Three-column layout (responsive on smaller screens)
- **4 Players**: 2x2 grid layout

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Technical Details

### Technologies Used
- **HTML5**: Semantic structure
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **Vanilla JavaScript**: No external dependencies

### Key Features
- **Event-Driven**: Real-time updates with visual feedback
- **State Management**: Centralized game state tracking for all players
- **Input Validation**: Prevents invalid life totals
- **Accessibility**: Clear visual hierarchy and intuitive controls
- **Responsive Grid**: CSS Grid layouts that adapt to player count
- **Editable Names**: Inline text editing for player customization

## Customization

The application is designed to be easily customizable:

- **Colors**: Modify the CSS variables and gradient definitions
- **Starting Life**: Change the default starting life in `script.js`
- **Player Names**: Click on any player name to edit it
- **Animations**: Adjust timing and effects in the CSS
- **Player Count**: Extend to support more than 4 players if needed

## Future Enhancements

Potential features for future versions:
- Player names customization (✅ **Implemented**)
- Game history tracking (✅ **Implemented**)
- Multiple game formats support (Commander, Two-Headed Giant, etc.)
- Dice rolling functionality (✅ **Implemented**)
- Commander damage tracking (✅ **Implemented**)
- Tournament mode with multiple players
- Life total presets for different formats
- Game statistics and analytics

## License

This project is open source and available under the MIT License.

---

**Enjoy your Magic: The Gathering games!** 🎴✨ 
