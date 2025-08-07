# Whack-a-Mole Game

A modern, feature-rich implementation of the classic arcade game Whack-a-Mole with multiple difficulty levels, dynamic board sizes, custom cursor effects, and comprehensive game mechanics. Built with pure HTML5, CSS3, and JavaScript.

![Whack-a-Mole](https://img.shields.io/badge/Game-Whack--a--Mole-green)
![HTML5](https://img.shields.io/badge/HTML5-Structure-orange)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![CSS3](https://img.shields.io/badge/CSS3-Grid%20%26%20Animations-purple)

## 🎮 Features

### Core Gameplay
- **Classic whack-a-mole mechanics** with modern enhancements
- **Three difficulty levels**: Easy, Medium, Hard with different timing and spawn rates
- **Multiple board sizes**: 3x3, 4x4, and 5x5 grids for varied gameplay
- **Dynamic scoring system** with bonus and penalty moles
- **Time-based challenges** with countdown timer
- **Pause and resume functionality** for interrupted gameplay
- **Simultaneous mole spawning** on higher difficulties

### Visual & Audio Features
- **Custom hammer cursor** with click animations
- **Smooth mole animations** with raise/lower effects
- **Visual feedback** for different mole types (bonus/penalty flashes)
- **Immersive board design** with realistic hole depth effects
- **Sound effects** for successful hits
- **Responsive UI** that adapts to different screen sizes
- **Game status overlays** for pause states

### Game Mechanics
- **Multiple mole types**:
  - **Regular Moles**: Standard scoring (1x multiplier)
  - **Bonus Moles**: High-value targets (3x multiplier)
  - **Penalty Moles**: Score reduction (-2x multiplier)
- **Adaptive difficulty**: Faster spawn rates and shorter visibility windows
- **Score persistence** throughout game session
- **Configurable game duration** based on difficulty level

### Advanced Features
- **Smart spawning system** preventing overlap
- **Pause state management** with proper timer handling
- **Game state persistence** during pause/resume cycles
- **Dynamic board generation** with CSS Grid
- **Performance-optimized** animations and interactions

## 🎯 Game Rules

### Objective
Click on moles as they pop up from holes to earn points before time runs out!

### Scoring System
- **Regular Moles**: +10 points (Easy/Medium), +15 points (Hard)
- **Bonus Moles**: 3x score multiplier with special visual effects
- **Penalty Moles**: -2x score multiplier (negative points)
- **Missed Moles**: No penalty, but lost opportunity

### Difficulty Levels

| Difficulty | Mole Visibility | Spawn Rate | Simultaneous Moles | Game Duration | Base Score |
|------------|-----------------|------------|-------------------|---------------|------------|
| **Easy** | 1.0-1.8 seconds | 0.8-1.6 seconds | 1 | 60 seconds | 10 points |
| **Medium** | 0.6-1.2 seconds | 0.5-1.0 seconds | 1 | 45 seconds | 10 points |
| **Hard** | 0.35-0.7 seconds | 0.25-0.6 seconds | 2 | 30 seconds | 15 points |

### Board Sizes
- **3x3 Grid**: Classic gameplay with 9 holes
- **4x4 Grid**: Intermediate challenge with 16 holes
- **5x5 Grid**: Expert level with 25 holes

## 🕹 Controls

### Mouse Controls
- **Click on moles**: Score points when moles are visible
- **Hover effects**: Visual feedback on interactive elements
- **Custom cursor**: Hammer cursor replaces default pointer

### Game Controls
- **New Game**: Start a fresh game with current settings
- **Pause/Resume**: Temporarily stop and continue gameplay
- **Restart**: Reset current game while maintaining settings
- **Play Again**: Quick restart after game completion

### Settings
- **Difficulty Selector**: Choose Easy, Medium, or Hard
- **Board Size**: Select from 3x3, 4x4, or 5x5 grids
- **Settings Lock**: Prevent changes during active gameplay

## 🛠 Installation & Setup

### Quick Start
1. Download or clone this repository
2. Ensure all asset files are in the correct directories:
   ```
   assets/
   ├── mole.png              # Standard mole image
   ├── mole-whacked.png      # Whacked mole image
   ├── hammer.png            # Cursor hammer image
   └── smash.mp3            # Hit sound effect
   ```
3. Open `index.html` in any modern web browser
4. Start playing immediately!

### Asset Requirements
The game requires the following assets in the `assets/` folder:
- **mole.png**: Standard mole sprite
- **mole-whacked.png**: Mole image when hit
- **hammer.png**: Custom cursor hammer image
- **smash.mp3**: Sound effect for successful hits

### Local Web Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

Then navigate to `http://localhost:8000`

## 📁 Project Structure

```
whack-a-mole/
├── index.html              # Main HTML structure
├── style.css              # Complete styling and animations
├── script.js              # Game logic and mechanics
├── assets/                # Game assets directory
│   ├── mole.png          # Standard mole sprite
│   ├── mole-whacked.png  # Hit mole sprite
│   ├── hammer.png        # Hammer cursor image
│   └── smash.mp3         # Hit sound effect
├── LICENSE               # MIT License
└── README.md            # This documentation
```

## 🔧 Technical Implementation

### Game Architecture
The game uses a modular architecture with clear separation of concerns:

```javascript
const Game = {
    config: {       // Game configuration and constants
        difficulties: { /* difficulty settings */ },
        boardSizes: { /* board size configurations */ },
        moleTypes: { /* mole type definitions */ }
    },
    state: {        // Current game state
        currentScore: 0,
        currentTimeLeft: 0,
        activeMolesData: new Map(),
        // ... other state variables
    },
    elements: {     // Cached DOM references
        // All DOM elements cached for performance
    }
};
```

### Key Systems

#### Mole Spawning System
- **Probability-based spawning** for different mole types
- **Collision detection** to prevent mole overlap
- **Configurable spawn rates** based on difficulty
- **Simultaneous mole management** for advanced gameplay

#### Timing System
- **Precise game timer** with pause/resume capability
- **Individual mole timers** for appearance duration
- **Staggered spawning** to maintain consistent difficulty
- **Performance-optimized** timeout management

#### Animation System
- **CSS-based animations** for smooth performance
- **JavaScript-triggered** state changes
- **Responsive feedback** for user interactions
- **Cross-browser compatible** animations

### Performance Optimizations

#### DOM Management
- **Element caching** for frequently accessed nodes
- **Event delegation** where appropriate
- **Minimal DOM manipulation** during gameplay
- **Efficient cleanup** of dynamic elements

#### Memory Management
- **Proper timeout cleanup** to prevent memory leaks
- **Map-based tracking** for active game objects
- **Event listener management** with proper removal
- **Asset preloading** for smooth gameplay

#### Rendering Optimization
- **CSS transforms** instead of position changes
- **Hardware acceleration** through CSS properties
- **Minimal reflows and repaints**
- **Efficient animation loops**

## 🎨 Customization Guide

### Difficulty Modification
Edit the difficulty settings in `script.js`:
```javascript
config: {
    difficulties: {
        easy: { 
            moleMinTime: 1000,        // Mole visible time (min)
            moleMaxTime: 1800,        // Mole visible time (max)
            spawnMinTime: 800,        // Time between spawns (min)
            spawnMaxTime: 1600,       // Time between spawns (max)
            simultaneousMoles: 1,     // Max moles on screen
            gameDuration: 60,         // Game length in seconds
            baseScore: 10             // Base score per hit
        }
    }
}
```

### Board Size Customization
Add new board sizes:
```javascript
boardSizes: {
    '6x6': { 
        rows: 6, 
        cols: 6, 
        className: 'size-6x6' 
    }
}
```

And corresponding CSS:
```css
.board.size-6x6 { 
    --board-cols: 6; 
    --board-rows: 6; 
    --board-width: 600px; 
    --board-height: 600px; 
    --board-gap: 8px; 
}
```

### Mole Type Configuration
Customize mole types and probabilities:
```javascript
moleTypes: [
    { 
        type: 'regular', 
        scoreMultiplier: 1, 
        probability: 0.70,    // 70% spawn chance
        image: './assets/mole.png',
        whackedImage: './assets/mole-whacked.png',
        sound: './assets/smash.mp3'
    }
]
```

### Visual Theming
Modify colors and styling in `style.css`:
```css
body {
    background-color: rgb(40, 80, 0); /* Game background */
}

.board {
    background-color: rgb(111, 78, 55); /* Board soil color */
}

.hole {
    background-color: rgb(87, 65, 47); /* Hole color */
}
```

### Sound Customization
Replace audio files in the `assets/` directory:
- Use `.mp3`, `.wav`, or `.ogg` formats
- Keep file names consistent with configuration
- Optimize for quick loading and smooth playback

## 🌐 Browser Compatibility

### Fully Supported
- ✅ **Chrome** 60+ (Recommended)
- ✅ **Firefox** 55+
- ✅ **Safari** 12+
- ✅ **Edge** 79+

### Partial Support
- ⚠️ **Mobile Safari**: Touch interactions may vary
- ⚠️ **Older browsers**: Some CSS features may not work

### Not Supported
- ❌ **Internet Explorer** (All versions)

## 📱 Mobile Optimization

### Touch Support
- **Touch-to-click** conversion for mobile devices
- **Responsive sizing** for different screen sizes
- **Optimized hit areas** for finger interaction

### Performance Considerations
- **Reduced animation complexity** on mobile
- **Battery-efficient** timing mechanisms
- **Touch delay minimization** for responsive gameplay

### Layout Adaptations
- **Flexible board sizing** based on screen space
- **Scalable UI elements** for readability
- **Portrait/landscape** orientation support

## 🚀 Advanced Features

### Game State Management
```javascript
// Access current game state
const gameState = Game.state;
console.log('Current Score:', gameState.currentScore);
console.log('Time Left:', gameState.currentTimeLeft);
console.log('Active Moles:', gameState.activeMolesData.size);
```

### Custom Event Handling
The game supports custom event listeners for integration:
```javascript
// Example: Track high scores
let highScore = localStorage.getItem('whackAMoleHighScore') || 0;

// Check after each game
if (Game.state.currentScore > highScore) {
    highScore = Game.state.currentScore;
    localStorage.setItem('whackAMoleHighScore', highScore);
}
```

### Debug Mode
Enable debug features by adding to console:
```javascript
// Enable visual debugging
Game.debug = true;

// Log all mole spawn events
Game.logSpawns = true;

// Show hit areas
Game.showHitboxes = true;
```

## 🎯 Educational Value

This implementation demonstrates several important programming concepts:

### JavaScript Concepts
- **Object-oriented programming** with modular design
- **Asynchronous programming** with timers and callbacks
- **Event-driven architecture** for user interactions
- **State management** for complex game logic
- **Performance optimization** techniques

### CSS Concepts
- **CSS Grid** for responsive layouts
- **CSS Animations** for smooth visual effects
- **CSS Custom Properties** for dynamic styling
- **Responsive design** principles
- **Hardware acceleration** optimization

### Game Development Principles
- **Game loop architecture** and timing systems
- **Collision detection** and hit testing
- **Difficulty balancing** and progression curves
- **User experience design** for arcade games
- **Performance profiling** and optimization

## 🔍 Troubleshooting

### Common Issues

#### Moles Not Appearing
- Check that asset images are in the correct `assets/` folder
- Verify image file names match configuration
- Ensure browser has loaded all assets

#### Sound Not Playing
- Confirm `smash.mp3` exists in `assets/` folder
- Check browser audio permissions
- Try different audio formats if needed

#### Performance Issues
- Close other browser tabs to free memory
- Check browser developer tools for console errors
- Consider reducing board size for older devices

#### Custom Cursor Not Showing
- Verify `hammer.png` exists and is accessible
- Check CSS cursor settings
- Ensure cursor element is properly positioned

### Debug Tools
```javascript
// Check game configuration
console.log('Game Config:', Game.config);

// Monitor active moles
console.log('Active Moles:', Game.state.activeMolesData);

// Check timer status
console.log('Game Timer:', Game.state.gameTimerId);
```

## 🚀 Future Enhancements

### Planned Features
- [ ] **Power-ups**: Special abilities like freeze time or double score
- [ ] **Combo system**: Bonus points for consecutive hits
- [ ] **Achievement system**: Unlock rewards for milestones
- [ ] **Leaderboard**: Local high score tracking
- [ ] **Sound options**: Volume controls and sound toggling
- [ ] **Accessibility**: Keyboard navigation and screen reader support
- [ ] **Mobile gestures**: Swipe and tap optimizations
- [ ] **Multiplayer mode**: Competitive gameplay options

### Advanced Enhancements
- [ ] **AI opponents**: Computer players with different strategies
- [ ] **Level progression**: Unlock new boards and challenges
- [ ] **Customization**: Player-selectable themes and mole types
- [ ] **Statistics**: Detailed performance analytics
- [ ] **Replay system**: Record and playback game sessions
- [ ] **Tournament mode**: Structured competitive play

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow **ES6+ JavaScript** standards
- Use **semantic HTML** and **accessible markup**
- Maintain **60fps performance** for animations
- Test on **multiple browsers** and devices
- Document **complex game logic** with clear comments
- Follow **mobile-first** responsive design principles

### Code Style
- Use **camelCase** for variables and functions
- Use **PascalCase** for constructors and classes
- Include **meaningful comments** for game logic
- Keep **functions focused** and **single-purpose**
- Use **const** for constants, **let** for variables

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Ngô Hữu Lộc**

## 🙏 Acknowledgments

- Classic arcade game inspiration
- Modern web development best practices
- CSS Grid and animation techniques
- Game design and user experience principles
- Open source game development community

---

*Enjoy the classic arcade experience with modern web technology! 🔨🐭*
