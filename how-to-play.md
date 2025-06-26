# Space Prison Escape 3D - How to Play Guide

## 🎮 Game Overview

You are a human prisoner trapped in a futuristic 3D space prison complex. You must escape by navigating through the industrial prison environment while avoiding blue alien guards and collecting resources to aid your escape. Experience the prison in full 3D with immersive lighting and realistic physics.

## 🎯 Controls

- **WASD** - Move your character forward, backward, left, right
- **MOUSE** - Look around and control camera view
- **SPACE** - Jump (hold to charge for higher jumps)
- **G** - Toggle gravity on/off (only works after finding the gravity switch)
- **E** - Interact with objects (placeholder for future features)
- **ESC** - Toggle mouse lock (click to lock mouse to game)
- **CLICK** - Lock mouse to game for full 3D control
- **F** - Toggle fullscreen
- **J** - Toggle jump debugger window
- **S**: Toggle game settings panel
- **C** - Create a checkpoint at current position
- **R** - Respawn at the last checkpoint created

## ⚙️ Game Mechanics

### 3D Movement & Physics

- **First-Person Movement**: WASD moves relative to where you're looking
- **Mouse Look**: Full 360-degree camera control with mouse
- **3D Gravity**: Realistic physics with gravity affecting all objects
- **Low Gravity Mode**: When gravity is disabled, you float more and jump higher
- **Platform Collision**: Land on 3D platforms to avoid falling
- **Wall Collision**: Cannot pass through prison walls

### Health System

- **Starting Health**: 100 HP
- **Health Packs**: Green glowing spheres restore 25 HP
- **Damage**: Touching blue aliens causes 10 HP damage
- **Game Over**: When health reaches 0 (currently resets health)

### Collectible Items

- **🟢 Health Pack** (Green Sphere): Restores 25 health points
- **🟡 Gravity Switch** (Yellow Sphere): Enables the G key to toggle gravity
- **🔴 Weapon** (Red Sphere): Future combat item (currently placeholder)

### Enemies

- **Blue Alien Guards**: 3D capsule-shaped enemies that patrol back and forth
- **AI Behavior**: Simple patrol patterns between set boundaries
- **Gravity Effect**: When gravity is disabled, guards move slower and become disoriented
- **Damage**: Contact with guards causes health loss
- **Visual Effects**: Rotating enemies with shadow casting

### 3D Environment

- **Industrial Sci-Fi Aesthetic**: Metallic platforms with realistic 3D lighting
- **Dynamic Lighting**: Multiple light sources including ambient, directional, and point lights
- **Shadow System**: Real-time shadows cast by all objects
- **Glowing Elements**: Items have emissive materials that glow
- **Particle Effects**: 3D particle systems for visual feedback
- **Atmospheric Lighting**: Cyan point lights create sci-fi atmosphere

## 🖥️ UI Elements

- **Health Display**: Shows current health out of 100
- **Gravity Status**: Shows if gravity is ON or OFF
- **Position Display**: Shows 3D coordinates (X, Y, Z)
- **FPS Counter**: Shows current frame rate
- **Crosshair**: Center-screen aiming reticle
- **Control Guide**: Bottom-left corner shows all available controls

## 🎯 Strategy Tips

1. **Collect the Gravity Switch First**: This gives you the ability to confuse enemies
2. **Use Low Gravity Strategically**: Toggle gravity off to reach higher platforms or escape enemies
3. **Master 3D Movement**: Use mouse to look around and plan your escape route
4. **Avoid Direct Contact**: Blue aliens will damage you on touch
5. **Manage Health**: Collect green health spheres to stay alive
6. **Use Mouse Lock**: Click to lock mouse for better 3D control
7. **Plan Your Route**: Use the 3D prison layout to your advantage

## ✅ Current Game Features

- ✅ 3D WASD movement with mouse look controls
- ✅ Space jumping mechanics with 3D physics
- ✅ Low gravity toggle system affecting all objects
- ✅ Health and damage system
- ✅ Collectible 3D items with glow effects
- ✅ Enemy AI with 3D patrol patterns
- ✅ 3D platform collision detection
- ✅ Particle effects and visual feedback
- ✅ Industrial sci-fi visual style with realistic lighting
- ✅ Real-time UI updates with 3D position tracking
- ✅ Shadow mapping and atmospheric lighting
- ✅ Mouse lock for immersive 3D control
- ✅ Fullscreen support
- ✅ Jump debugger window

## 🚀 Future Features (Planned)

- Shape-shifting mechanics for the player (morph into different forms)
- More complex enemy AI and elite guards
- Doors, switches, and interactive 3D elements
- Combat system with weapons and 3D projectiles
- Multiple levels and areas with different prison sections
- Sound effects and 3D spatial audio
- Escape objectives and win conditions
- Save/load system for game progress
- VR support for immersive experience

## 🐛 Troubleshooting

- **Game not loading**: Make sure you're using a modern browser with WebGL support
- **Controls not working**: Click on the game canvas first to focus and lock mouse
- **Performance issues**: Close other browser tabs to free up memory
- **Visual glitches**: Refresh the page to reset the game state
- **Mouse not responding**: Press ESC to toggle mouse lock, then click to re-lock
- **Low FPS**: Reduce browser window size or close other applications

## 🎨 3D Graphics Features

- **WebGL Rendering**: Hardware-accelerated 3D graphics
- **Real-time Shadows**: Dynamic shadow mapping for all objects
- **Particle Systems**: 3D particle effects for actions and feedback
- **Emissive Materials**: Glowing items and atmospheric lighting
- **Anti-aliasing**: Smooth edges and high-quality rendering
- **Perspective Camera**: Realistic 3D perspective with depth
- **Lighting System**: Multiple light types for atmospheric sci-fi environment

## Jump Debugger Window

Press **J** to toggle the jump debugger window. This floating panel allows you to:

- **Base Jump Power**: Adjust the minimum jump strength (0.1 - 3.0)
- **Max Jump Power**: Adjust the maximum jump strength when fully charged (0.1 - 5.0)
- **Gravity**: Control how strong gravity is (0.05 - 0.8)
- **Charge Time**: Set how many frames it takes to reach maximum charge (5 - 30)
- **Movement Speed**: Adjust how fast you move (0.05 - 0.5)

### Using the Debugger

1. Press **J** to open the debugger window
2. Adjust sliders in real-time to test different jump behaviors
3. Click **Copy Settings** to copy the current settings to your clipboard
4. Paste the settings in chat to have them permanently applied to the game
5. Click **Reset to Default** to return to original settings
6. Click the **×** button or press **J** again to close the window

## Game Settings Panel

Press **S** or click the ⚙️ button in the jump debugger to open the comprehensive game settings panel. This full-screen overlay includes:

### Physics & Movement

- **Player Height**: Adjust player collision height (1.0 - 3.0)
- **Ground Level**: Set the ground level position (-2.0 - 2.0)
- **Cell Boundary**: Control the cell boundary size (5 - 20)

### Camera & Controls

- **Mouse Sensitivity**: Adjust mouse look sensitivity (0.001 - 0.01)
- **Camera Height**: Set camera position height (1.0 - 2.5)
- **FOV**: Control field of view (60 - 120 degrees)

### Enemies & Gameplay

- **Enemy Speed**: Adjust enemy movement speed (0.01 - 0.15)
- **Enemy Detection Range**: Set enemy detection distance (3 - 15)
- **Player Health**: Adjust player health (50 - 200)

### Visual & Audio

- **Light Intensity**: Control lighting brightness (0.1 - 2.0)
- **Particle Count**: Adjust particle effects (20 - 200)
- **Shadow Quality**: Set shadow map resolution (Low/Medium/High)

### Using the Settings Panels

1. **Jump Debugger**: Press **J** to open jump-specific controls
2. **Game Settings**: Press **S** or click ⚙️ for comprehensive settings
3. **Real-time Adjustment**: All sliders update the game immediately
4. **Copy Settings**: Click "Copy Settings" to export current values as JSON
5. **Reset to Default**: Return to original settings
6. **Close**: Click × button, press the same key again, or click outside (settings panel)

## Tips

- Use the jump debugger to find the perfect jump settings for your playstyle
- Experiment with different gravity and jump power combinations
- The debugger settings are applied immediately, so you can test changes in real-time
- Once you find settings you like, copy them and share with the developer to make them permanent
- The game settings panel provides fine-tune control over all aspects of the game
- Adjust enemy speed and detection range to change difficulty
- Modify visual settings to optimize performance on your device

## 🎮 Game Controls

### **First-Person Movement**

- **WASD** - Move (relative to where you're looking)
- **MOUSE** - Look around (click to lock mouse)
- **ESC** - Toggle mouse lock

### **Physics Controls**

- **SPACE** - Jump (hold to charge in cell mode)
- **SHIFT** - Float downward (in space mode)
- **G** - Toggle gravity (when gravity switch is found)
- **L** - Toggle light/dark mode
- **F** - Toggle fullscreen

### **Settings Panel**

- **⚙️ Button** (top right) - Open/close settings panel
- **Accordion sections** - Expand/collapse different setting categories
- **Sliders** - Adjust game parameters in real-time
- **Color pickers** - Change lighting colors
- **Save/Load Profiles** - Save named configurations
- **Reset to Default** - Restore all settings to original values
- **Copy Settings** - Copy current settings to clipboard

### **Profile Management**

- **Save Profile** - Save current settings with a custom name
- **Load Profile** - Load previously saved settings
- **Delete Profile** - Remove saved profiles
- **Default Profiles** - "Daytime" and "Night" profiles are auto-created

### Checkpoint System

- **C** - Create a checkpoint at current position
- **R** - Respawn at the last checkpoint created
- **Maximum 5 checkpoints** can be placed at once
- Checkpoints appear as **green glowing markers** on the ground
- Respawn restores full health and resets velocity

### Physics Modes

- **Cell Physics**: Normal gravity and movement within the prison cell
- **Space Physics**: Zero gravity, momentum-based movement outside the cell

### Health System

- Player has 100 health points
- Health can be restored by respawning at checkpoints
- Health is displayed in the top-left UI

### Visual Effects

- Particle effects for various actions
- Dynamic lighting system
- Smooth animations and transitions

### Tips for Success

1. **Use checkpoints strategically** - Place them before difficult jumps or dangerous areas
2. **Master the jump charging** - Hold space longer for higher jumps
3. **Explore the environment** - Look for platforms and items
4. **Watch your health** - Don't take unnecessary damage
5. **Experiment with physics** - Use gravity toggle to your advantage

## Game Controls Panel

Access the game controls panel by clicking the gear icon (⚙️) in the top-right corner. This panel allows you to:

- Adjust physics settings (gravity, jump power, movement speed)
- Modify camera controls (sensitivity, FOV)
- Change visual settings (lighting, particle count)
- Manage checkpoints (create, respawn, clear all)
- Save and load game profiles

## Troubleshooting

- If the game doesn't respond, try refreshing the page
- Make sure your browser supports WebGL
- Check the browser console for any error messages
- Ensure JavaScript is enabled in your browser
