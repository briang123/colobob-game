# Space Prison Escape 3D - Development Prompts & Instructions

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

### 3D Conversion Request (User's Fourth Request)

```
are you able to make this a 3D game?
```

## 🏗️ Optimized Development Instructions

### Core Game Architecture

- **Technology Stack**: JavaScript + Three.js + HTML5 Canvas for browser-based 3D gameplay
- **Game Engine**: Custom 3D game loop with Three.js rendering and requestAnimationFrame for 60fps
- **File Structure**:
  - [index.html](mdc:index.html) - Main HTML file with Three.js library and 3D canvas
  - [js/game.js](mdc:js/game.js) - Core 3D game logic and mechanics
  - [how-to-play.md](mdc:how-to-play.md) - Player guide for 3D gameplay
  - [prompt.md](mdc:prompt.md) - This development guide

### 🎯 Essential 3D Game Features (Implemented)

1. **3D Player Movement System**

   - WASD controls with mouse look for full 3D movement
   - First-person camera with mouse lock functionality
   - 3D physics with realistic gravity and jumping
   - Platform collision handling in 3D space
   - Wall boundary constraints with 3D coordinates

2. **3D Physics Engine**

   - Configurable gravity system affecting all 3D objects
   - Velocity-based movement with realistic friction
   - 3D collision detection using spherical collision volumes
   - Particle system with 3D particle effects
   - Shadow mapping for realistic lighting

3. **3D Enemy AI System**

   - Blue alien guards as 3D capsule meshes
   - Patrol patterns in 3D space
   - Gravity-aware movement (slower in low gravity)
   - 3D collision detection with player
   - Visual rotation effects for dynamic appearance

4. **3D Item Collection System**

   - Health packs (green spheres) - restore 25 HP
   - Gravity switch (yellow spheres) - enables G key functionality
   - Weapons (red spheres) - placeholder for combat system
   - Emissive materials for glowing effects
   - 3D particle feedback systems

5. **3D Visual Effects & Lighting**
   - Multiple light sources (ambient, directional, point lights)
   - Real-time shadow mapping
   - 3D particle systems for feedback
   - Industrial sci-fi aesthetic with atmospheric lighting
   - Anti-aliasing and high-quality rendering

## 📋 Development Guidelines

### 🎨 3D Visual Design Standards

- **Color Palette**:
  - UI: #00ffff (cyan) for highlights and text
  - Player: #ff6b35 (orange) for human character capsule
  - Enemies: #0066ff (blue) for alien guard capsules
  - Environment: Industrial grays (#2a2a3e, #3a3a4e, #4a4a4e)
  - Items: Green (#00ff00), Yellow (#ffff00), Red (#ff0000) spheres
- **Lighting**: Multiple light sources for atmospheric sci-fi environment
- **Effects**: 3D particle systems, emissive materials, shadow mapping
- **Style**: Industrial sci-fi with realistic 3D lighting and shadows

### 💻 3D Code Structure Standards

- **Three.js Integration**: Use Three.js for all 3D rendering and scene management
- **3D Collision Detection**: Implement spherical collision detection for all interactive elements
- **3D Particle Effects**: Add visual feedback using Three.js particle systems
- **Error Handling**: Include bounds checking and graceful error recovery
- **Performance**: Optimize for 60fps 3D gameplay with efficient rendering
- **Modularity**: Keep 3D code organized and reusable

### 🔧 3D File Organization

- **3D Game Logic**: Keep core 3D mechanics in [js/game.js](mdc:js/game.js)
- **HTML Structure**: Maintain Three.js library inclusion in [index.html](mdc:index.html)
- **Documentation**: Update [how-to-play.md](mdc:how-to-play.md) for new 3D features
- **Development Tracking**: Maintain this prompt file with all 3D changes

### 🚀 3D Feature Implementation Workflow

1. **Plan**: Define 3D feature requirements and visual design
2. **Implement**: Add Three.js code following established patterns
3. **Test**: Verify 3D collision detection, physics, and visual effects
4. **Polish**: Add 3D particles, UI updates, and visual feedback
5. **Document**: Update how-to-play guide and this prompt file
6. **Optimize**: Ensure 60fps 3D performance

## 🎮 Planned 3D Feature Implementation Order

1. **Shape-shifting mechanics** for player (morph into different 3D forms)
2. **Enhanced 3D enemy AI** with elite guards and smarter patrol patterns
3. **Interactive 3D elements** (doors, switches, terminals)
4. **3D combat system** with weapons and projectile mechanics
5. **Multiple 3D levels/areas** with different prison sections
6. **3D spatial audio** for immersive experience
7. **3D escape objectives** and win conditions
8. **VR support** for immersive 3D experience

## ✅ 3D Quality Assurance Checklist

- [ ] All new 3D features work with existing gravity system
- [ ] 3D collision detection properly implemented and tested
- [ ] 3D visual feedback (particles) added for important actions
- [ ] UI updated to reflect new 3D game states
- [ ] Performance optimized for smooth 60fps 3D gameplay
- [ ] How-to-play guide updated with new 3D features
- [ ] This prompt file updated with new 3D instructions
- [ ] Code follows established Three.js patterns and standards
- [ ] 3D visual design maintains industrial sci-fi aesthetic
- [ ] Error handling and bounds checking implemented for 3D space

## 🔄 3D Maintenance Tasks

- **Regular Updates**: Keep documentation current with 3D game changes
- **Performance Monitoring**: Ensure smooth 3D gameplay as features are added
- [ ] Code Review: Maintain clean, readable, and efficient Three.js code
- [ ] User Experience: Test 3D gameplay flow and difficulty balance
- [ ] Cross-browser Testing: Ensure WebGL compatibility across modern browsers

## 🎨 3D Graphics Features Implemented

- **WebGL Rendering**: Hardware-accelerated 3D graphics via Three.js
- **Real-time Shadows**: Dynamic shadow mapping for all 3D objects
- **Particle Systems**: 3D particle effects for actions and feedback
- **Emissive Materials**: Glowing items and atmospheric lighting
- **Anti-aliasing**: Smooth edges and high-quality 3D rendering
- **Perspective Camera**: Realistic 3D perspective with depth
- **Lighting System**: Multiple light types for atmospheric sci-fi environment
- **Mouse Lock**: Immersive 3D control with pointer lock API

## Game Overview

A 3D first-person sci-fi prison escape game built with Three.js. Players navigate through a futuristic space prison environment with physics-based movement, jumping mechanics, enemies, and collectibles.

## Core Features

- **3D First-Person Camera**: Mouse look with locked cursor for immersive experience
- **Physics-Based Movement**: WASD movement relative to camera direction with gravity
- **Advanced Jumping**: Minecraft-style variable jump height with charging mechanism
- **Dynamic Environment**: Cell-based physics (gravity inside, space physics outside)
- **Enemy AI**: Patrolling enemies that chase the player
- **Collectibles**: Glowing spheres with particle effects
- **Lighting System**: Toggle between daylight and atmospheric neon dark mode
- **Fullscreen Support**: F key toggle and button
- **Jump Debugger Window**: Real-time adjustment of jump settings with copy functionality
- **Game Settings Panel**: Comprehensive settings panel with physics, camera, enemies, and visual controls

## Technical Implementation

- **Three.js**: 3D graphics and rendering
- **Physics Engine**: Custom gravity and collision detection
- **Input System**: Keyboard and mouse controls with proper event handling
- **UI System**: Overlay HUD with health, position, FPS, and debug information
- **Debug Tools**: Floating debugger window for jump settings adjustment
- **Settings System**: Full-screen settings panel with real-time parameter control

## Jump System Details

The jumping system features:

- **Base Jump Power**: Minimum jump strength (default: 1.0)
- **Max Jump Power**: Maximum jump strength when fully charged (default: 2.0)
- **Gravity**: Strength of downward force (default: 0.3)
- **Charge Time**: Frames to reach maximum charge (default: 15)
- **Movement Speed**: Player movement velocity (default: 0.15)

## Debugger Window Features

- **Real-time Control**: Adjust all jump parameters with sliders
- **Visual Feedback**: Live value displays for all settings
- **Copy Functionality**: Export current settings as JSON
- **Reset Option**: Return to default values
- **Toggle Access**: J key to show/hide debugger
- **Professional UI**: Sci-fi themed styling with cyan accents

## Game Settings Panel Features

- **Comprehensive Controls**: Physics, camera, enemies, and visual settings
- **Real-time Adjustment**: All parameters update immediately
- **Organized Sections**: Grouped settings for easy navigation
- **Copy All Settings**: Export complete game configuration
- **Reset Functionality**: Return all settings to defaults
- **Multiple Access Methods**: S key or settings button
- **Professional Overlay**: Full-screen modal with sci-fi styling

## Settings Categories

- **Physics & Movement**: Player height, ground level, cell boundary
- **Camera & Controls**: Mouse sensitivity, camera height, FOV
- **Enemies & Gameplay**: Enemy speed, detection range, player health
- **Visual & Audio**: Light intensity, particle count, shadow quality

## Controls

- **WASD**: Movement
- **Mouse**: Look around
- **Space**: Jump (hold to charge)
- **F**: Toggle fullscreen
- **J**: Toggle jump debugger window
- **S**: Toggle game settings panel

## Development Notes

- All jump settings are configurable through the debugger window
- Settings can be exported and shared for permanent implementation
- The debugger provides immediate feedback for testing different configurations
- The system supports both cell-based physics and space physics modes

## 🎮 Game Features

### **3D First-Person Controls**

- WASD movement relative to camera direction
- Mouse look with sensitivity control
- Jump charging system (hold SPACE to charge)
- Gravity toggle for space physics
- Fullscreen toggle and mouse lock

### **Advanced Physics System**

- Dual physics modes: Cell (normal gravity) and Space (low gravity)
- Configurable jump power, charge time, and movement speed
- Real-time gravity adjustment
- Ground level and boundary controls

### **Comprehensive Settings Panel**

- **Physics & Movement**: Player height, gravity, jump settings, movement speed
- **Camera & Controls**: Mouse sensitivity, camera height, field of view
- **Enemies & Gameplay**: Enemy speed, detection range, player health
- **Visual & Audio**: Lighting, particle count, shadow quality
- **Real-time Updates**: All sliders update game values immediately
- **Reset to Defaults**: One-click restoration of all original settings
- **Copy Settings**: Export current configuration to clipboard

### **Profile Management System**

- Save/load/delete named profiles
- Auto-created "Daytime" and "Night" default profiles
- Persistent storage using localStorage
- Complete settings backup and restore

### **3D Environment & Objects**

- Industrial sci-fi prison aesthetic
- Multiple platforms and walls for navigation
- Collectible items with different effects:
  - Health packs (green spheres) - restore 25 HP
  - Gravity switch (yellow spheres) - enables G key functionality
  - Weapons (red spheres) - placeholder for combat system
  - Emissive materials for glowing effects
  - 3D particle feedback systems

### **3D Visual Effects & Lighting**

- Multiple light sources (ambient, directional, point lights)
- Real-time shadow mapping
- 3D particle systems for feedback
- Industrial sci-fi aesthetic with atmospheric lighting
- Anti-aliasing and high-quality rendering
- Dynamic lighting controls and presets

### Checkpoint System

- **Checkpoint Creation**: Press C to create a checkpoint at current position
- **Respawn Function**: Press R to respawn at the last checkpoint
- **Visual Markers**: Green glowing cylindrical markers on the ground
- **Health Restoration**: Respawn restores full health and resets velocity
- **Maximum Limit**: Up to 5 checkpoints can be placed simultaneously
- **Animated Effects**: Pulsing and rotating checkpoint markers

### Interactive Controls

- **WASD Movement**: Standard FPS controls
- **Mouse Look**: Click to lock/unlock mouse
- **Space Jump**: Charge-based jumping system
- **Gravity Toggle**: G key
- **Light Mode Toggle**: L key
- **Fullscreen**: F key
- **Interaction**: E key

### Visual System

- **Dynamic Lighting**: Ambient and directional lighting
- **Particle Effects**: Visual feedback for actions
- **Shadow Mapping**: Real-time shadows
- **Light/Dark Modes**: Toggle between different lighting presets

### Game Controls Panel

- **Physics Settings**: Adjust gravity, jump power, movement speed
- **Camera Controls**: Mouse sensitivity, FOV, camera height
- **Visual Settings**: Lighting intensity, particle count, shadow quality
- **Checkpoint Management**: Create, respawn, clear all checkpoints
- **Profile System**: Save and load game configurations

## Technical Implementation

### Three.js Integration

- WebGL renderer with antialiasing
- Perspective camera with adjustable FOV
- Phong material for realistic lighting
- Shadow mapping for depth perception

### Game State Management

- Player position, velocity, and health tracking
- Checkpoint array with visual meshes
- Physics mode detection (cell vs space)
- Input handling with key state management

### UI System

- Real-time HUD with health, position, FPS
- Animated checkpoint messages
- Responsive control panel with accordion sections
- Profile save/load functionality

## Development Guidelines

### Code Structure

- ES6 class-based architecture
- Modular method organization
- Comprehensive error handling
- Console logging for debugging

### Performance Optimization

- Efficient rendering loop
- Optimized particle systems
- Responsive input handling
- Memory management for checkpoints

### User Experience

- Intuitive controls
- Visual feedback for all actions
- Smooth animations and transitions
- Accessible control panel

## Future Enhancements

- Sound effects and music
- More complex level design
- Enemy AI improvements
- Multiplayer functionality
- Mobile device support
