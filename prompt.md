# Space Prison Escape - Development Prompts & Instructions

## 📝 Original Prompts

### Initial Game Concept (User's First Request)

```
I want to make a platformer game where you can move around a character with WASD keys on the keyboard. Can you help me work through a theme for this game?

I'm looking to create a game that is in outer space and in a prison with a main character that is human, but there are blue aliens who are the enemies. I want to defeat these enemies and escape from the prison. The game is dark and mysterious and there is low gravity since it's in outer space.
```

### Enhanced Theme Development (User's Second Request)

```
The space prison complex is futuristic, has high security, but has resources scattered across the cell and prison that will assist the human to escape; however, the prisoner needs to find them and learn how to use them first. The prisoner, who's wearing a tattered jumb suit, has been captured as hostage, but can morph into different shapes and change his appearance, as well. The enemies are blue aliens with storm trooper type uniforms and are security droids, but aren't that smart. they're their to make sure the prisoners stay in their cells. There are the elite guards who aid in fixing problems or emergencies related to a prisoner's escape. The gameplay mechanics includes a resource where the human prisoner might find a switch to turn off gravity to maybe help him in his escape because the security droids may become disoriented. I want all the game mechanics you listed. The visual style should be an industrial sci-fi aesthetic, glowing elements, and has bright lighting (not dark and moody), but in the cells it's dimmly lit.

Let's start building with WASD moment for the main character. The game should use javascript/html5 canvas so we can play in the browser.
```

### Cursor Rules Request (User's Third Request)

```
/Generate Cursor Rules  Can you create and maintain a "how to play" guide and update it with this information? Also, anytime I ask for changes, can update a prompt.md file with an optimized instruction to build the game. please make sure to include the original prompts, as well.
```

## 🏗️ Optimized Development Instructions

### Core Game Architecture

- **Technology Stack**: JavaScript + HTML5 Canvas for browser-based gameplay
- **Game Engine**: Custom game loop with requestAnimationFrame for 60fps
- **File Structure**:
  - [index.html](mdc:index.html) - Main HTML file with canvas and UI
  - [js/game.js](mdc:js/game.js) - Core game logic and mechanics
  - [.cursor/rules/how-to-play.md](mdc:.cursor/rules/how-to-play.md) - Player guide
  - [.cursor/rules/prompt.md](mdc:.cursor/rules/prompt.md) - This development guide

### 🎯 Essential Game Features (Implemented)

1. **Player Movement System**

   - WASD controls with smooth physics and friction
   - Space jumping with ground detection
   - Platform collision handling with proper response
   - Wall boundary constraints

2. **Physics Engine**

   - Configurable gravity system (normal/low gravity modes)
   - Velocity-based movement with realistic friction
   - Comprehensive collision detection for all game objects
   - Particle system for visual feedback

3. **Enemy AI System**

   - Blue alien guards with patrol patterns
   - Gravity-aware movement (slower in low gravity)
   - Simple collision detection with player
   - Extensible AI framework for future enhancements

4. **Item Collection System**

   - Health packs (green) - restore 25 HP
   - Gravity switch (yellow) - enables G key functionality
   - Weapons (red) - placeholder for combat system
   - Visual feedback with particles and glow effects

5. **Visual Effects & UI**
   - Particle system for feedback
   - Glowing elements and industrial sci-fi aesthetic
   - Real-time UI updates
   - Bright lighting with industrial color scheme

## 📋 Development Guidelines

### 🎨 Visual Design Standards

- **Color Palette**:
  - UI: #00ffff (cyan) for highlights and text
  - Player: #ff6b35 (orange) for human character
  - Enemies: #0066ff (blue) for alien guards
  - Environment: Industrial grays (#2a2a3e, #3a3a4e, #4a4a4e)
  - Items: Green (#00ff00), Yellow (#ffff00), Red (#ff0000)
- **Lighting**: Bright, industrial sci-fi aesthetic (not dark/moody)
- **Effects**: Glowing elements, particle systems, metallic shine
- **Style**: Industrial sci-fi with clean, geometric shapes

### 💻 Code Structure Standards

- **ES6 Classes**: Use modern JavaScript classes for game objects
- **Collision Detection**: Implement proper AABB collision for all interactive elements
- **Particle Effects**: Add visual feedback for important actions
- **Error Handling**: Include bounds checking and graceful error recovery
- **Performance**: Optimize for 60fps gameplay with efficient rendering
- **Modularity**: Keep code organized and reusable

### 🔧 File Organization

- **Game Logic**: Keep core mechanics in [js/game.js](mdc:js/game.js)
- **HTML Structure**: Maintain clean, semantic HTML in [index.html](mdc:index.html)
- **Documentation**: Update [.cursor/rules/how-to-play.md](mdc:.cursor/rules/how-to-play.md) for new features
- **Development Tracking**: Maintain this prompt file with all changes

### 🚀 Feature Implementation Workflow

1. **Plan**: Define feature requirements and visual design
2. **Implement**: Add code following established patterns
3. **Test**: Verify collision detection, physics, and visual effects
4. **Polish**: Add particles, UI updates, and visual feedback
5. **Document**: Update how-to-play guide and this prompt file
6. **Optimize**: Ensure 60fps performance

## 🎮 Planned Feature Implementation Order

1. **Shape-shifting mechanics** for player (morph into different forms)
2. **Enhanced enemy AI** with elite guards and smarter patrol patterns
3. **Interactive elements** (doors, switches, terminals)
4. **Combat system** with weapons and attack mechanics
5. **Multiple levels/areas** with different prison sections
6. **Sound effects and music** for immersive experience
7. **Escape objectives** and win conditions
8. **Save/load system** for game progress

## ✅ Quality Assurance Checklist

- [ ] All new features work with existing gravity system
- [ ] Collision detection properly implemented and tested
- [ ] Visual feedback (particles) added for important actions
- [ ] UI updated to reflect new game states
- [ ] Performance optimized for smooth 60fps gameplay
- [ ] How-to-play guide updated with new features
- [ ] This prompt file updated with new instructions
- [ ] Code follows established patterns and standards
- [ ] Visual design maintains industrial sci-fi aesthetic
- [ ] Error handling and bounds checking implemented

## 🔄 Maintenance Tasks

- **Regular Updates**: Keep documentation current with game changes
- **Performance Monitoring**: Ensure smooth gameplay as features are added
- **Code Review**: Maintain clean, readable, and efficient code
- **User Experience**: Test gameplay flow and difficulty balance
- **Cross-browser Testing**: Ensure compatibility across modern browsers
