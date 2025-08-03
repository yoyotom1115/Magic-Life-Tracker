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

## **Setting Up Git in Cursor (One-time setup):**

### **Step 1: Initialize Git in Your Project**
1. **Open Terminal in Cursor:** `Ctrl + Shift + `` (backtick) or `View > Terminal`
2. **Run these commands one by one:**
```bash
git init
git add .
git commit -m "Initial commit"
```

### **Step 2: Connect to Your GitHub Repository**
After you've created your repository on GitHub, you'll see commands like these on the repository page:
```bash
git remote add origin https://github.com/yourusername/Magic-Life-Tracker.git
git branch -M main
git push -u origin main
```

### **Step 3: Set Up Authentication**
GitHub will ask for your credentials. You have two options:

**Option A: GitHub Desktop (Easiest)**
- Download GitHub Desktop app
- Sign in with your account
- It handles authentication automatically

**Option B: Personal Access Token**
- Go to GitHub Settings > Developer settings > Personal access tokens
- Create a token with "repo" permissions
- Use your username and the token as your password

---

## **Daily Workflow for Updates:**

### **Using Cursor's Built-in Git (Visual Way):**
1. **Make your changes** to any files
2. **Go to Source Control panel** in Cursor (Ctrl+Shift+G)
3. **You'll see your changed files listed**
4. **Stage changes:** Click the "+" next to files or "Stage All Changes"
5. **Write a commit message:** Like "Fixed life counter bug"
6. **Click "Commit"**
7. **Click "Push"** to send to GitHub

### **Using Terminal (Command Way):**
```bash
git add .                          # Stage all changes
git commit -m "Your update message"  # Commit with a message
git push                          # Push to GitHub
```

---

## **What Happens When You Push:**

1. **Your changes go to GitHub** (usually takes a few seconds)
2. **GitHub Pages automatically rebuilds** your site (takes 1-2 minutes)
3. **Your live site updates** with the new changes
4. **Anyone visiting your site sees the updates**

---

## **Cursor's Git Features You'll Love:**

- **Visual diff:** See exactly what changed
- **File history:** See previous versions of files
- **Branch management:** Create feature branches if needed
- **Integrated terminal:** Run git commands without leaving Cursor

**Want me to walk you through setting this up after you create your GitHub repository?** 