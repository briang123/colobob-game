// Space Prison Escape 3D Game
class Game3D {
  constructor() {
    console.log('Initializing 3D Game...');
    this.showLoadingScreen('Initializing 3D Game...');

    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
      console.error('Three.js not loaded! Please check the CDN link.');
      this.showError('Three.js library not loaded. Please refresh the page.');
      return;
    }

    this.canvas = document.getElementById('gameCanvas');
    if (!this.canvas) {
      console.error('Canvas element not found!');
      this.showError('Game canvas not found.');
      return;
    }

    // Set canvas to full window size
    this.resizeCanvas();

    // Listen for window resize events
    window.addEventListener('resize', () => this.resizeCanvas());

    this.width = this.canvas.width;
    this.height = this.canvas.height;
    console.log(`Canvas size: ${this.width}x${this.height}`);

    try {
      // Three.js setup
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
      this.renderer.setSize(this.width, this.height);
      this.renderer.setClearColor(0x1a1a2e);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      console.log('Three.js setup complete');
      this.updateLoadingScreen('Creating 3D world...');
    } catch (error) {
      console.error('Error setting up Three.js:', error);
      this.showError('Failed to initialize 3D graphics. Please check your browser supports WebGL.');
      return;
    }

    // Game state
    this.gravity = 0.3;
    this.groundLevel = 0;
    this.cellBoundary = 10;
    this.enemyDetectionRange = 8;
    this.particleCount = 100;
    this.shadowMapSize = 1024;
    this.mouseSensitivity = 0.002;
    this.gravityEnabled = true;
    this.gameTime = 0;
    this.fps = 60;
    this.lastTime = 0;
    this.lightMode = 'light'; // 'light' or 'dark'

    // Cell boundary system
    this.cellBounds = {
      minX: -this.cellBoundary,
      maxX: this.cellBoundary,
      minZ: -this.cellBoundary,
      maxZ: this.cellBoundary,
      height: 8,
    };
    this.inCell = true; // Track if player is inside the cell

    // Mouse controls
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseLocked = false;

    // Player
    this.player = {
      mesh: null,
      x: 0,
      y: 2,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      speed: 0.15,
      jumpPower: 1.0, // High base jump power
      maxJumpPower: 2.0, // Very high max jump power
      jumpCharge: 0, // How long space has been held
      maxJumpCharge: 15, // Reduced charge time for faster response
      onGround: false,
      health: 100,
      maxHealth: 100,
      height: 2,
      radius: 0.5,
      color: 0xff6b35,
    };

    // Input handling
    this.keys = {};
    this.setupInput();

    // Game objects
    this.platforms = [];
    this.enemies = [];
    this.items = [];
    this.particles = [];
    this.lights = [];
    this.checkpoints = []; // Array to store checkpoint objects

    // Checkpoint system
    this.currentCheckpoint = null;
    this.checkpointKey = 'c'; // Key to create checkpoints
    this.respawnKey = 'r'; // Key to respawn at last checkpoint
    this.checkpointCount = 0;
    this.maxCheckpoints = 5; // Maximum number of checkpoints allowed

    // Initialize 3D world
    this.init3DWorld();

    // Start game loop
    this.gameLoop();

    console.log('3D Game initialization complete!');
    this.hideLoadingScreen();

    // Ensure the game object is globally accessible
    window.game3D = this;
    console.log('Game object assigned to window.game3D:', !!window.game3D);
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    if (this.camera && this.renderer) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }

  showLoadingScreen(message) {
    this.loadingDiv = document.createElement('div');
    this.loadingDiv.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #0a0a0a;
      color: #00ffff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: 'Courier New', monospace;
      z-index: 1000;
    `;
    this.loadingDiv.innerHTML = `
      <h2>Space Prison Escape 3D</h2>
      <p>${message}</p>
      <div style="margin-top: 20px; width: 200px; height: 4px; background: #2a2a3e; border-radius: 2px;">
        <div id="loadingBar" style="width: 0%; height: 100%; background: #00ffff; border-radius: 2px; transition: width 0.3s;"></div>
      </div>
    `;
    document.body.appendChild(this.loadingDiv);
  }

  updateLoadingScreen(message, progress = 0) {
    if (this.loadingDiv) {
      const textElement = this.loadingDiv.querySelector('p');
      const barElement = this.loadingDiv.querySelector('#loadingBar');
      if (textElement) textElement.textContent = message;
      if (barElement) barElement.style.width = `${progress}%`;
    }
  }

  hideLoadingScreen() {
    if (this.loadingDiv) {
      this.loadingDiv.remove();
      this.loadingDiv = null;
    }
  }

  showError(message) {
    this.hideLoadingScreen();
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 0, 0, 0.9);
      color: white;
      padding: 20px;
      border-radius: 10px;
      font-family: Arial, sans-serif;
      z-index: 1000;
      text-align: center;
      max-width: 400px;
    `;
    errorDiv.innerHTML = `
      <h3>Game Error</h3>
      <p>${message}</p>
      <p>Please refresh the page or check your browser console for details.</p>
      <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #fff; color: #000; border: none; border-radius: 5px; cursor: pointer;">Refresh Page</button>
    `;
    document.body.appendChild(errorDiv);
  }

  setupInput() {
    document.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;

      // Handle special keys
      if (e.key === ' ') {
        e.preventDefault();
        // Don't jump immediately - let the update loop handle charging
      }
      if (e.key === 'g' || e.key === 'G') {
        this.toggleGravity();
      }
      if (e.key === 'e' || e.key === 'E') {
        this.interact();
      }
      if (e.key === 'Escape') {
        this.toggleMouseLock();
      }
      if (e.key === 'f' || e.key === 'F') {
        this.toggleFullscreen();
      }
      if (e.key === 'l' || e.key === 'L') {
        this.toggleLightMode();
      }
      if (e.key === 'c' || e.key === 'C') {
        this.createCheckpoint();
      }
      if (e.key === 'r' || e.key === 'R') {
        this.respawnAtCheckpoint();
      }
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;

      // Execute jump when space is released
      if (e.key === ' ') {
        e.preventDefault();
        this.executeJump();
      }
    });

    // Mouse movement
    document.addEventListener('mousemove', (e) => {
      if (this.mouseLocked) {
        this.mouseX -= e.movementX * this.mouseSensitivity; // Negative for correct direction
        this.mouseY -= e.movementY * this.mouseSensitivity; // Negative for correct vertical direction

        // Limit vertical rotation
        this.mouseY = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.mouseY));
      }
    });

    // Mouse lock
    this.canvas.addEventListener('click', () => {
      if (!this.mouseLocked) {
        this.canvas.requestPointerLock();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.mouseLocked = document.pointerLockElement === this.canvas;
    });

    // Fullscreen button
    const fullscreenButton = document.getElementById('fullscreenButton');
    if (fullscreenButton) {
      fullscreenButton.addEventListener('click', () => {
        this.toggleFullscreen();
      });
    }
  }

  toggleMouseLock() {
    if (this.mouseLocked) {
      document.exitPointerLock();
    } else {
      this.canvas.requestPointerLock();
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  init3DWorld() {
    // Lighting
    this.updateLoadingScreen('Setting up lighting...', 20);
    this.setupLighting();

    // Create floor
    this.updateLoadingScreen('Creating floor...', 30);
    this.createFloor();

    // Create platforms
    this.updateLoadingScreen('Creating platforms...', 40);
    this.createPlatforms();

    // Create walls
    this.updateLoadingScreen('Creating walls...', 50);
    this.createWalls();

    // Create player
    this.updateLoadingScreen('Creating player...', 60);
    this.createPlayer();

    // Create enemies
    this.updateLoadingScreen('Creating enemies...', 70);
    this.createEnemies();

    // Create items
    this.updateLoadingScreen('Creating items...', 80);
    this.createItems();

    // Position camera
    this.updateLoadingScreen('Setting up camera...', 90);
    this.camera.position.set(0, 3, 5);
    this.camera.lookAt(0, 2, 0);

    this.updateLoadingScreen('Game ready!', 100);
  }

  setupLighting() {
    // Clear existing lights
    this.lights.forEach((light) => {
      this.scene.remove(light);
    });
    this.lights = [];

    // Clear references
    this.ambientLight = null;
    this.directionalLight = null;

    if (this.lightMode === 'light') {
      // Daylight lighting - warm and bright
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      this.scene.add(ambientLight);
      this.lights.push(ambientLight);
      this.ambientLight = ambientLight;

      // Main sunlight from above
      const directionalLight = new THREE.DirectionalLight(0xfff4e6, 1.2);
      directionalLight.position.set(0, 20, 0);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 50;
      directionalLight.shadow.camera.left = -20;
      directionalLight.shadow.camera.right = 20;
      directionalLight.shadow.camera.top = 20;
      directionalLight.shadow.camera.bottom = -20;
      this.scene.add(directionalLight);
      this.lights.push(directionalLight);
      this.directionalLight = directionalLight;

      // Additional warm fill light
      const fillLight = new THREE.DirectionalLight(0xffe6cc, 0.4);
      fillLight.position.set(10, 15, 10);
      this.scene.add(fillLight);
      this.lights.push(fillLight);

      // Set renderer background to sky blue
      this.renderer.setClearColor(0x87ceeb);
    } else {
      // Dark mode with neon blue lights at the top
      const ambientLight = new THREE.AmbientLight(0x101020, 0.2);
      this.scene.add(ambientLight);
      this.lights.push(ambientLight);
      this.ambientLight = ambientLight;

      // Dim main light for basic visibility
      const directionalLight = new THREE.DirectionalLight(0x202040, 0.3);
      directionalLight.position.set(5, 10, 5);
      directionalLight.castShadow = true;
      directionalLight.shadow.mapSize.width = 2048;
      directionalLight.shadow.mapSize.height = 2048;
      directionalLight.shadow.camera.near = 0.5;
      directionalLight.shadow.camera.far = 50;
      directionalLight.shadow.camera.left = -20;
      directionalLight.shadow.camera.right = 20;
      directionalLight.shadow.camera.top = 20;
      directionalLight.shadow.camera.bottom = -20;
      this.scene.add(directionalLight);
      this.lights.push(directionalLight);
      this.directionalLight = directionalLight;

      // Neon blue lights at the top of the prison
      const neonLight1 = new THREE.PointLight(0x00ffff, 0.8, 25);
      neonLight1.position.set(-15, 15, -15);
      this.scene.add(neonLight1);
      this.lights.push(neonLight1);

      const neonLight2 = new THREE.PointLight(0x00ffff, 0.8, 25);
      neonLight2.position.set(15, 15, -15);
      this.scene.add(neonLight2);
      this.lights.push(neonLight2);

      const neonLight3 = new THREE.PointLight(0x00ffff, 0.8, 25);
      neonLight3.position.set(-15, 15, 15);
      this.scene.add(neonLight3);
      this.lights.push(neonLight3);

      const neonLight4 = new THREE.PointLight(0x00ffff, 0.8, 25);
      neonLight4.position.set(15, 15, 15);
      this.scene.add(neonLight4);
      this.lights.push(neonLight4);

      // Additional atmospheric blue lights
      const atmosphericLight1 = new THREE.PointLight(0x0066ff, 0.6, 20);
      atmosphericLight1.position.set(0, 12, 0);
      this.scene.add(atmosphericLight1);
      this.lights.push(atmosphericLight1);

      const atmosphericLight2 = new THREE.PointLight(0x0066ff, 0.6, 20);
      atmosphericLight2.position.set(0, 8, 0);
      this.scene.add(atmosphericLight2);
      this.lights.push(atmosphericLight2);

      // Set renderer background to deep space black
      this.renderer.setClearColor(0x000011);
    }
  }

  createFloor() {
    const floorGeometry = new THREE.PlaneGeometry(40, 40);
    const floorMaterial = new THREE.MeshLambertMaterial({
      color: 0x2a2a3e,
      transparent: true,
      opacity: 0.9,
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  createPlatforms() {
    const platformData = [
      { x: -8, y: 1, z: -8, width: 4, height: 0.5, depth: 4 },
      { x: 0, y: 1, z: -8, width: 4, height: 0.5, depth: 4 },
      { x: 8, y: 1, z: -8, width: 4, height: 0.5, depth: 4 },
      { x: -8, y: 3, z: 0, width: 4, height: 0.5, depth: 4 },
      { x: 0, y: 3, z: 0, width: 4, height: 0.5, depth: 4 },
      { x: 8, y: 3, z: 0, width: 4, height: 0.5, depth: 4 },
      { x: -4, y: 5, z: 8, width: 3, height: 0.5, depth: 3 },
      { x: 4, y: 5, z: 8, width: 3, height: 0.5, depth: 3 },
    ];

    platformData.forEach((data) => {
      const geometry = new THREE.BoxGeometry(data.width, data.height, data.depth);
      const material = new THREE.MeshLambertMaterial({ color: 0x3a3a4e });
      const platform = new THREE.Mesh(geometry, material);
      platform.position.set(data.x, data.y, data.z);
      platform.castShadow = true;
      platform.receiveShadow = true;
      this.scene.add(platform);

      this.platforms.push({
        mesh: platform,
        x: data.x,
        y: data.y,
        z: data.z,
        width: data.width,
        height: data.height,
        depth: data.depth,
      });
    });
  }

  createWalls() {
    const wallData = [
      { x: -20, y: 5, z: 0, width: 1, height: 10, depth: 40 },
      { x: 20, y: 5, z: 0, width: 1, height: 10, depth: 40 },
      { x: 0, y: 5, z: -20, width: 40, height: 10, depth: 1 },
      { x: 0, y: 5, z: 20, width: 40, height: 10, depth: 1 },
    ];

    wallData.forEach((data) => {
      const geometry = new THREE.BoxGeometry(data.width, data.height, data.depth);
      const material = new THREE.MeshLambertMaterial({ color: 0x2a2a3e });
      const wall = new THREE.Mesh(geometry, material);
      wall.position.set(data.x, data.y, data.z);
      wall.castShadow = true;
      wall.receiveShadow = true;
      this.scene.add(wall);
    });
  }

  createPlayer() {
    // Use CylinderGeometry instead of CapsuleGeometry for compatibility
    const geometry = new THREE.CylinderGeometry(
      this.player.radius,
      this.player.radius,
      this.player.height,
      8,
    );
    const material = new THREE.MeshLambertMaterial({ color: this.player.color });
    this.player.mesh = new THREE.Mesh(geometry, material);
    this.player.mesh.position.set(this.player.x, this.player.y, this.player.z);
    this.player.mesh.castShadow = true;
    this.player.mesh.visible = false; // Hide player mesh in first-person view
    this.scene.add(this.player.mesh);
  }

  createEnemies() {
    const enemyData = [
      { x: -6, y: 1.5, z: -6, patrolLeft: -8, patrolRight: -4, vx: 0.02 },
      { x: 6, y: 1.5, z: -6, patrolLeft: 4, patrolRight: 8, vx: -0.02 },
      { x: -6, y: 3.5, z: 2, patrolLeft: -8, patrolRight: -4, vx: 0.015 },
    ];

    enemyData.forEach((data) => {
      // Use CylinderGeometry instead of CapsuleGeometry for compatibility
      const geometry = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 8);
      const material = new THREE.MeshLambertMaterial({ color: 0x0066ff });
      const enemy = new THREE.Mesh(geometry, material);
      enemy.position.set(data.x, data.y, data.z);
      enemy.castShadow = true;
      this.scene.add(enemy);

      this.enemies.push({
        mesh: enemy,
        x: data.x,
        y: data.y,
        z: data.z,
        vx: data.vx,
        patrolLeft: data.patrolLeft,
        patrolRight: data.patrolRight,
        type: 'guard',
        radius: 0.4,
        height: 2,
      });
    });
  }

  createItems() {
    const itemData = [
      { x: -6, y: 1.5, z: -6, type: 'health', color: 0x00ff00 },
      { x: 6, y: 1.5, z: -6, type: 'gravitySwitch', color: 0xffff00 },
      { x: 0, y: 3.5, z: 2, type: 'weapon', color: 0xff0000 },
    ];

    itemData.forEach((data) => {
      const geometry = new THREE.SphereGeometry(0.3);
      const material = new THREE.MeshLambertMaterial({
        color: data.color,
        emissive: data.color,
        emissiveIntensity: 0.3,
      });
      const item = new THREE.Mesh(geometry, material);
      item.position.set(data.x, data.y, data.z);
      item.castShadow = true;
      this.scene.add(item);

      this.items.push({
        mesh: item,
        x: data.x,
        y: data.y,
        z: data.z,
        type: data.type,
        radius: 0.3,
        collected: false,
      });
    });
  }

  update() {
    this.gameTime++;

    // Update player movement
    this.updatePlayer();

    // Update enemies
    this.updateEnemies();

    // Update particles
    this.updateParticles();

    // Check collisions
    this.checkCollisions();

    // Update camera
    this.updateCamera();

    // Update UI
    this.updateUI();

    // Check cell boundary
    this.checkCellBoundary();
  }

  updatePlayer() {
    // Handle jump charging (Minecraft-style) - only works inside cell
    if (
      this.keys[' '] &&
      this.player.onGround &&
      this.player.jumpCharge < this.player.maxJumpCharge &&
      this.inCell
    ) {
      this.player.jumpCharge++;
      console.log('Charging jump:', this.player.jumpCharge, '/', this.player.maxJumpCharge);
    } else if (!this.keys[' '] || !this.player.onGround || !this.inCell) {
      if (this.player.jumpCharge > 0) {
        console.log('Reset jump charge');
      }
      this.player.jumpCharge = 0;
    }

    // First-person movement relative to where player is looking
    let moveX = 0;
    let moveZ = 0;

    if (this.keys['w']) {
      // Move forward in the direction player is looking
      moveX += Math.sin(this.mouseX);
      moveZ += Math.cos(this.mouseX);
    }
    if (this.keys['s']) {
      // Move backward
      moveX -= Math.sin(this.mouseX);
      moveZ -= Math.cos(this.mouseX);
    }
    if (this.keys['a']) {
      // Strafe left (perpendicular to forward direction)
      moveX += Math.cos(this.mouseX);
      moveZ -= Math.sin(this.mouseX);
    }
    if (this.keys['d']) {
      // Strafe right (perpendicular to forward direction)
      moveX -= Math.cos(this.mouseX);
      moveZ += Math.sin(this.mouseX);
    }

    // Normalize movement
    if (moveX !== 0 || moveZ !== 0) {
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX /= length;
      moveZ /= length;
    }

    // Apply movement with different physics based on location
    if (this.inCell) {
      // Physics-based motion inside cell
      this.player.vx = moveX * this.player.speed;
      this.player.vz = moveZ * this.player.speed;

      // Apply gravity and normal physics
      if (this.gravityEnabled) {
        this.player.vy -= this.gravity;
      } else {
        this.player.vy -= this.gravity * 0.3;
      }
    } else {
      // Space-based motion outside cell (no gravity)
      this.player.vx = moveX * this.player.speed * 1.5; // Faster movement in space
      this.player.vz = moveZ * this.player.speed * 1.5;

      // No gravity in space
      this.player.vy *= 0.98; // Slight air resistance

      // Add vertical movement in space with SPACE key
      if (this.keys[' ']) {
        this.player.vy += 0.02; // Float upward
      }
      if (this.keys['shift']) {
        this.player.vy -= 0.02; // Float downward
      }
    }

    // Update position
    this.player.x += this.player.vx;
    this.player.y += this.player.vy;
    this.player.z += this.player.vz;

    // Keep player in bounds
    this.player.x = Math.max(-this.cellBoundary, Math.min(this.cellBoundary, this.player.x));
    this.player.z = Math.max(-this.cellBoundary, Math.min(this.cellBoundary, this.player.z));

    // Ground detection - only applies inside cell
    if (this.inCell) {
      this.player.onGround = false;

      // Check floor collision first - use groundLevel setting
      if (this.player.y <= this.groundLevel + this.player.height / 2 + 0.1) {
        this.player.y = this.groundLevel + this.player.height / 2;
        this.player.vy = 0;
        this.player.onGround = true;
      }

      // Check platform collisions
      for (let platform of this.platforms) {
        if (this.check3DCollision(this.player, platform)) {
          // Check if player is above the platform
          if (this.player.y > platform.y + platform.height / 2) {
            // Check if player is close enough to the platform surface
            const distanceToSurface =
              this.player.y - (platform.y + platform.height / 2 + this.player.height / 2);
            if (distanceToSurface < 0.2 && this.player.vy <= 0) {
              this.player.y = platform.y + platform.height / 2 + this.player.height / 2;
              this.player.vy = 0;
              this.player.onGround = true;
            }
          }
        }
      }
    } else {
      // In space, no ground detection
      this.player.onGround = false;
    }

    // Update player mesh position
    this.player.mesh.position.set(this.player.x, this.player.y, this.player.z);
  }

  updateCamera() {
    // First-person camera positioned at player's eye level
    const eyeHeight = this.camera.position.y - this.player.y; // Use camera height setting
    this.camera.position.set(this.player.x, this.player.y + eyeHeight, this.player.z);

    // Calculate look direction based on mouse movement
    const lookDirection = new THREE.Vector3(
      Math.sin(this.mouseX) * Math.cos(this.mouseY),
      Math.sin(this.mouseY),
      Math.cos(this.mouseX) * Math.cos(this.mouseY),
    );

    // Look in the calculated direction
    this.camera.lookAt(
      this.player.x + lookDirection.x,
      this.player.y + eyeHeight + lookDirection.y,
      this.player.z + lookDirection.z,
    );
  }

  updateEnemies() {
    this.enemies.forEach((enemy) => {
      // Update position
      enemy.x += enemy.vx;

      // Patrol behavior
      if (enemy.x <= enemy.patrolLeft || enemy.x >= enemy.patrolRight) {
        enemy.vx = -enemy.vx;
      }

      // Apply gravity effect
      if (!this.gravityEnabled) {
        enemy.vx *= 0.5;
      }

      // Update mesh position
      enemy.mesh.position.set(enemy.x, enemy.y, enemy.z);

      // Add some rotation for visual effect
      enemy.mesh.rotation.y += 0.02;
    });
  }

  updateParticles() {
    this.particles = this.particles.filter((particle) => {
      particle.life--;
      particle.mesh.position.add(particle.velocity);
      particle.velocity.multiplyScalar(0.98);

      if (particle.life <= 0) {
        this.scene.remove(particle.mesh);
        return false;
      }
      return true;
    });
  }

  checkCollisions() {
    // Check item collisions
    this.items.forEach((item) => {
      if (!item.collected && this.check3DCollision(this.player, item)) {
        this.collectItem(item);
      }
    });

    // Check enemy collisions
    this.enemies.forEach((enemy) => {
      if (this.check3DCollision(this.player, enemy)) {
        this.playerTakeDamage(10);
      }
    });
  }

  check3DCollision(obj1, obj2) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const dz = obj1.z - obj2.z;
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

    const radius1 = obj1.radius || 0;
    const radius2 = obj2.radius || 0;

    return distance < radius1 + radius2;
  }

  executeJump() {
    console.log(
      'Jump executed. onGround:',
      this.player.onGround,
      'charge:',
      this.player.jumpCharge,
    );
    if (this.player.onGround) {
      // Calculate jump power based on charge (Minecraft-style)
      const chargeRatio = this.player.jumpCharge / this.player.maxJumpCharge;
      const jumpPower =
        this.player.jumpPower + (this.player.maxJumpPower - this.player.jumpPower) * chargeRatio;

      this.player.vy = jumpPower;
      this.player.onGround = false;
      this.player.jumpCharge = 0; // Reset charge
      console.log('Jump power:', jumpPower);
      this.createParticles(this.player.x, this.player.y, this.player.z, 0x00ffff);
    } else {
      console.log('Cannot jump - not on ground');
    }
  }

  toggleGravity() {
    if (this.items.some((item) => item.type === 'gravitySwitch' && item.collected)) {
      this.gravityEnabled = !this.gravityEnabled;
      this.createParticles(this.player.x, this.player.y, this.player.z, 0xffff00);
    }
  }

  interact() {
    // Placeholder for future interactions
    console.log('Interact pressed');
  }

  collectItem(item) {
    item.collected = true;
    this.scene.remove(item.mesh);

    switch (item.type) {
      case 'health':
        this.player.health = Math.min(this.player.maxHealth, this.player.health + 25);
        this.createParticles(item.x, item.y, item.z, 0x00ff00);
        break;
      case 'gravitySwitch':
        this.createParticles(item.x, item.y, item.z, 0xffff00);
        break;
      case 'weapon':
        this.createParticles(item.x, item.y, item.z, 0xff0000);
        break;
    }
  }

  playerTakeDamage(amount) {
    this.player.health -= amount;
    this.createParticles(this.player.x, this.player.y, this.player.z, 0xff0000);

    if (this.player.health <= 0) {
      this.gameOver();
    }
  }

  createParticles(x, y, z, color) {
    for (let i = 0; i < 10; i++) {
      const geometry = new THREE.SphereGeometry(0.05);
      const material = new THREE.MeshBasicMaterial({ color: color });
      const particle = new THREE.Mesh(geometry, material);

      particle.position.set(x, y, z);
      particle.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
      );

      this.scene.add(particle);
      this.particles.push({
        mesh: particle,
        velocity: particle.velocity,
        life: 30,
      });
    }
  }

  gameOver() {
    console.log('Game Over!');
    // Reset player health for now
    this.player.health = this.player.maxHealth;
  }

  updateUI() {
    document.getElementById('health').textContent = this.player.health;
    document.getElementById('gravity').textContent = this.gravityEnabled ? 'ON' : 'OFF';
    document.getElementById('lightMode').textContent = this.lightMode.toUpperCase();
    document.getElementById('physicsMode').textContent = this.inCell ? 'CELL' : 'SPACE';
    document.getElementById('position').textContent =
      `${Math.round(this.player.x)}, ${Math.round(this.player.y)}, ${Math.round(this.player.z)}`;
    document.getElementById('fps').textContent = Math.round(this.fps);

    // Update jump charge display - only show when in cell
    const jumpChargeElement = document.getElementById('jumpCharge');
    if (jumpChargeElement) {
      if (this.inCell) {
        const chargePercent = Math.round(
          (this.player.jumpCharge / this.player.maxJumpCharge) * 100,
        );
        jumpChargeElement.textContent = `${chargePercent}%`;
      } else {
        jumpChargeElement.textContent = 'N/A';
      }
    }

    // Update checkpoint display
    const checkpointCountElement = document.getElementById('checkpointCountValue');
    const maxCheckpointsElement = document.getElementById('maxCheckpointsValue');
    if (checkpointCountElement) checkpointCountElement.textContent = this.checkpointCount;
    if (maxCheckpointsElement) maxCheckpointsElement.textContent = this.maxCheckpoints;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  gameLoop(currentTime = 0) {
    // Calculate FPS
    if (this.lastTime !== 0) {
      this.fps = 1000 / (currentTime - this.lastTime);
    }
    this.lastTime = currentTime;

    this.update();
    this.render();
    requestAnimationFrame((time) => this.gameLoop(time));
  }

  toggleLightMode() {
    this.lightMode = this.lightMode === 'light' ? 'dark' : 'light';
    this.setupLighting();

    // Create particles to show the mode change
    const particleColor = this.lightMode === 'light' ? 0xffff00 : 0x0066ff;
    this.createParticles(this.player.x, this.player.y, this.player.z, particleColor);

    console.log(`Switched to ${this.lightMode} mode`);
  }

  checkCellBoundary() {
    const wasInCell = this.inCell;

    // Check if player is within cell boundaries (entire cell area)
    this.inCell =
      this.player.x >= this.cellBounds.minX &&
      this.player.x <= this.cellBounds.maxX &&
      this.player.z >= this.cellBounds.minZ &&
      this.player.z <= this.cellBounds.maxZ;
    // Removed height check to ensure entire cell volume has physics

    // If player just left the cell, create transition effect
    if (wasInCell && !this.inCell) {
      console.log('Player escaped the cell! Space physics activated.');
      this.createParticles(this.player.x, this.player.y, this.player.z, 0x00ffff);
    }

    // If player just entered the cell, create transition effect
    if (!wasInCell && this.inCell) {
      console.log('Player entered the cell. Physics-based motion activated.');
      this.createParticles(this.player.x, this.player.y, this.player.z, 0xff6600);
    }
  }

  updateCellBounds() {
    // Update cell bounds when cell boundary setting changes
    this.cellBounds.minX = -this.cellBoundary;
    this.cellBounds.maxX = this.cellBoundary;
    this.cellBounds.minZ = -this.cellBoundary;
    this.cellBounds.maxZ = this.cellBoundary;
  }

  createCheckpoint() {
    if (this.checkpointCount >= this.maxCheckpoints) {
      this.showCheckpointMessage('Maximum checkpoints reached!', 'warning');
      return;
    }

    const checkpoint = {
      id: this.checkpointCount + 1,
      x: this.player.x,
      y: this.player.y,
      z: this.player.z,
      timestamp: Date.now(),
      mesh: null,
    };

    // Create visual checkpoint marker
    const geometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 8);
    const material = new THREE.MeshPhongMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.8,
      emissive: 0x00ff00,
      emissiveIntensity: 0.3,
    });
    checkpoint.mesh = new THREE.Mesh(geometry, material);
    checkpoint.mesh.position.set(checkpoint.x, checkpoint.y - 0.5, checkpoint.z);
    checkpoint.mesh.rotation.x = Math.PI / 2; // Lay flat on ground
    this.scene.add(checkpoint.mesh);

    // Add pulsing animation
    this.animateCheckpoint(checkpoint.mesh);

    this.checkpoints.push(checkpoint);
    this.currentCheckpoint = checkpoint;
    this.checkpointCount++;

    this.showCheckpointMessage(`Checkpoint ${checkpoint.id} created!`, 'success');
    console.log(
      `Checkpoint ${checkpoint.id} created at (${checkpoint.x.toFixed(1)}, ${checkpoint.y.toFixed(1)}, ${checkpoint.z.toFixed(1)})`,
    );
  }

  respawnAtCheckpoint() {
    if (!this.currentCheckpoint) {
      this.showCheckpointMessage('No checkpoint available!', 'error');
      return;
    }

    // Reset player position and velocity
    this.player.x = this.currentCheckpoint.x;
    this.player.y = this.currentCheckpoint.y;
    this.player.z = this.currentCheckpoint.z;
    this.player.vx = 0;
    this.player.vy = 0;
    this.player.vz = 0;

    // Reset player health
    this.player.health = this.player.maxHealth;

    // Update player mesh position
    if (this.player.mesh) {
      this.player.mesh.position.set(this.player.x, this.player.y, this.player.z);
    }

    this.showCheckpointMessage(`Respawned at Checkpoint ${this.currentCheckpoint.id}!`, 'success');
    console.log(`Respawned at checkpoint ${this.currentCheckpoint.id}`);
  }

  animateCheckpoint(mesh) {
    const animate = () => {
      if (mesh && mesh.material) {
        mesh.material.opacity = 0.4 + Math.sin(Date.now() * 0.005) * 0.3;
        mesh.material.emissiveIntensity = 0.2 + Math.sin(Date.now() * 0.003) * 0.2;
        mesh.rotation.y += 0.01;
        requestAnimationFrame(animate);
      }
    };
    animate();
  }

  showCheckpointMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: ${
        type === 'success'
          ? 'rgba(0, 255, 0, 0.9)'
          : type === 'error'
            ? 'rgba(255, 0, 0, 0.9)'
            : type === 'warning'
              ? 'rgba(255, 165, 0, 0.9)'
              : 'rgba(0, 255, 255, 0.9)'
      };
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 16px;
      font-weight: bold;
      z-index: 2000;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      animation: fadeInOut 2s ease-in-out;
    `;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
      }
    `;
    document.head.appendChild(style);

    // Remove message after animation
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.parentNode.removeChild(messageDiv);
      }
    }, 2000);
  }

  clearAllCheckpoints() {
    // Remove all checkpoint meshes from scene
    this.checkpoints.forEach((checkpoint) => {
      if (checkpoint.mesh && checkpoint.mesh.parent) {
        checkpoint.mesh.parent.remove(checkpoint.mesh);
      }
    });

    this.checkpoints = [];
    this.currentCheckpoint = null;
    this.checkpointCount = 0;

    this.showCheckpointMessage('All checkpoints cleared!', 'info');
    console.log('All checkpoints cleared');
  }

  updateParticleSystems() {
    // Update particle systems based on new particle count
    console.log('Updating particle systems with count:', this.particleCount);
    // This method can be expanded to actually update particle systems
    // For now, it just logs the change
  }

  updateShadowMap() {
    // Update shadow map quality
    console.log('Updating shadow map quality to:', this.shadowMapSize);
    if (this.renderer) {
      this.renderer.shadowMap.mapSize = new THREE.Vector2(this.shadowMapSize, this.shadowMapSize);
      // Force shadow map regeneration
      this.renderer.shadowMap.needsUpdate = true;
    }
  }
}

// Start the game when the page loads
window.addEventListener('load', () => {
  console.log('Page loaded, starting 3D game...');

  // Add a small delay to ensure everything is ready
  setTimeout(() => {
    try {
      new Game3D();
    } catch (error) {
      console.error('Failed to start 3D game:', error);

      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 20px;
        border-radius: 10px;
        font-family: Arial, sans-serif;
        z-index: 1000;
        text-align: center;
        max-width: 400px;
      `;
      errorDiv.innerHTML = `
        <h3>Game Failed to Start</h3>
        <p>Error: ${error.message}</p>
        <p>Please check your browser console for more details.</p>
        <button onclick="location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #fff; color: #000; border: none; border-radius: 5px; cursor: pointer;">Refresh Page</button>
      `;
      document.body.appendChild(errorDiv);
    }
  }, 100);
});

function setupGameControlSliders() {
  console.log('Setting up game control sliders...');

  // Side panel open/close
  const panel = document.getElementById('gameControlsPanel');
  const toggleBtn = document.getElementById('toggleGameControls');
  const fullscreenBtn = document.getElementById('fullscreenToggle');

  console.log('Panel elements found:', {
    panel: !!panel,
    toggleBtn: !!toggleBtn,
    fullscreenBtn: !!fullscreenBtn,
  });

  // Start closed, show cog
  let open = false;
  function updateToggleIcon() {
    toggleBtn.innerHTML = open ? '&times;' : '&#9881;'; // × or ⚙️
    toggleBtn.setAttribute('aria-label', open ? 'Close Game Controls' : 'Open Game Controls');
  }
  updateToggleIcon();

  toggleBtn.addEventListener('click', () => {
    open = !open;
    if (open) {
      panel.classList.add('open');
    } else {
      panel.classList.remove('open');
    }
    updateToggleIcon();
  });

  // Fullscreen logic
  fullscreenBtn.addEventListener('click', () => {
    const doc = document.documentElement;
    if (!document.fullscreenElement) {
      if (doc.requestFullscreen) doc.requestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  });

  // Accordion logic
  document.querySelectorAll('.accordion-header').forEach((header) => {
    header.addEventListener('click', (e) => {
      e.preventDefault();
      const section = header.parentElement;
      const isExpanding = !section.classList.contains('expanded');

      // Add a small delay for smoother animation
      if (isExpanding) {
        // When expanding, add the class immediately
        section.classList.add('expanded');
      } else {
        // When collapsing, add a small delay for better visual effect
        setTimeout(() => {
          section.classList.remove('expanded');
        }, 50);
      }

      // Prevent rapid clicking
      header.style.pointerEvents = 'none';
      setTimeout(() => {
        header.style.pointerEvents = 'auto';
      }, 500);
    });
  });

  // ESC key closes panel
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) {
      open = false;
      panel.classList.remove('open');
      updateToggleIcon();
    }
  });

  // --- Add Event Listeners for All Sliders ---

  console.log('Setting up slider event listeners...');
  console.log('Game object available:', !!window.game3D);
  if (window.game3D) {
    console.log('Game object properties:', {
      player: !!window.game3D.player,
      camera: !!window.game3D.camera,
      renderer: !!window.game3D.renderer,
      scene: !!window.game3D.scene,
    });
  }

  // Physics & Movement Sliders
  const playerHeightSlider = document.getElementById('playerHeightSlider');
  const playerHeightValue = document.getElementById('playerHeightValue');
  const groundLevelSlider = document.getElementById('groundLevelSlider');
  const groundLevelValue = document.getElementById('groundLevelValue');
  const cellBoundarySlider = document.getElementById('cellBoundarySlider');
  const cellBoundaryValue = document.getElementById('cellBoundaryValue');
  const baseJumpSlider = document.getElementById('baseJumpSlider');
  const baseJumpValue = document.getElementById('baseJumpValue');
  const maxJumpSlider = document.getElementById('maxJumpSlider');
  const maxJumpValue = document.getElementById('maxJumpValue');
  const gravitySlider = document.getElementById('gravitySlider');
  const gravityValue = document.getElementById('gravityValue');
  const chargeTimeSlider = document.getElementById('chargeTimeSlider');
  const chargeTimeValue = document.getElementById('chargeTimeValue');
  const speedSlider = document.getElementById('speedSlider');
  const speedValue = document.getElementById('speedValue');

  // Camera & Controls
  const mouseSensitivitySlider = document.getElementById('mouseSensitivitySlider');
  const mouseSensitivityValue = document.getElementById('mouseSensitivityValue');
  const cameraHeightSlider = document.getElementById('cameraHeightSlider');
  const cameraHeightValue = document.getElementById('cameraHeightValue');
  const fovSlider = document.getElementById('fovSlider');
  const fovValue = document.getElementById('fovValue');

  // Enemies & Gameplay
  const enemySpeedSlider = document.getElementById('enemySpeedSlider');
  const enemySpeedValue = document.getElementById('enemySpeedValue');
  const enemyRangeSlider = document.getElementById('enemyRangeSlider');
  const enemyRangeValue = document.getElementById('enemyRangeValue');
  const playerHealthSlider = document.getElementById('playerHealthSlider');
  const playerHealthValue = document.getElementById('playerHealthValue');

  // Visual & Audio
  const lightIntensitySlider = document.getElementById('lightIntensitySlider');
  const lightIntensityValue = document.getElementById('lightIntensityValue');
  const particleCountSlider = document.getElementById('particleCountSlider');
  const particleCountValue = document.getElementById('particleCountValue');
  const shadowQualitySelect = document.getElementById('shadowQualitySelect');
  const shadowQualityValue = document.getElementById('shadowQualityValue');

  // Lighting controls
  const ambientLightIntensitySlider = document.getElementById('ambientLightIntensitySlider');
  const ambientLightIntensityValue = document.getElementById('ambientLightIntensityValue');
  const directionalLightIntensitySlider = document.getElementById(
    'directionalLightIntensitySlider',
  );
  const directionalLightIntensityValue = document.getElementById('directionalLightIntensityValue');
  const ambientLightColorPicker = document.getElementById('ambientLightColorPicker');
  const directionalLightColorPicker = document.getElementById('directionalLightColorPicker');
  const backgroundColorPicker = document.getElementById('backgroundColorPicker');
  const lightingDayPreset = document.getElementById('lightingDayPreset');
  const lightingNightPreset = document.getElementById('lightingNightPreset');

  // --- Profile Save/Load/Delete ---
  const profileNameInput = document.getElementById('profileNameInput');
  const saveProfileBtn = document.getElementById('saveProfileBtn');
  const loadProfileSelect = document.getElementById('loadProfileSelect');
  const loadProfileBtn = document.getElementById('loadProfileBtn');
  const deleteProfileBtn = document.getElementById('deleteProfileBtn');
  const resetGameSettingsBtn = document.getElementById('resetGameSettings');
  const copyGameSettingsBtn = document.getElementById('copyGameSettings');

  // Default settings object
  const defaultSettings = {
    // Physics & Movement
    playerHeight: 1.8,
    groundLevel: 0,
    cellBoundary: 10,
    baseJumpPower: 1.0,
    maxJumpPower: 2.0,
    gravity: 0.3,
    chargeTime: 15,
    movementSpeed: 0.15,
    // Camera & Controls
    mouseSensitivity: 0.002,
    cameraHeight: 1.6,
    fov: 75,
    // Enemies & Gameplay
    enemySpeed: 0.05,
    enemyDetectionRange: 8,
    playerHealth: 100,
    // Visual & Audio
    ambientLightIntensity: 0.6,
    ambientLightColor: '#ffffff',
    directionalLightIntensity: 1.2,
    directionalLightColor: '#fff4e6',
    backgroundColor: '#87ceeb',
    particleCount: 100,
    shadowQuality: 1024,
  };

  function resetToDefaults() {
    // Apply default settings to the game
    applySettings(defaultSettings);

    // Update all slider values and display values
    if (playerHeightSlider) playerHeightSlider.value = defaultSettings.playerHeight;
    if (playerHeightValue) playerHeightValue.textContent = defaultSettings.playerHeight.toFixed(1);

    if (groundLevelSlider) groundLevelSlider.value = defaultSettings.groundLevel;
    if (groundLevelValue) groundLevelValue.textContent = defaultSettings.groundLevel.toFixed(1);

    if (cellBoundarySlider) cellBoundarySlider.value = defaultSettings.cellBoundary;
    if (cellBoundaryValue) cellBoundaryValue.textContent = defaultSettings.cellBoundary;

    if (baseJumpSlider) baseJumpSlider.value = defaultSettings.baseJumpPower;
    if (baseJumpValue) baseJumpValue.textContent = defaultSettings.baseJumpPower.toFixed(1);

    if (maxJumpSlider) maxJumpSlider.value = defaultSettings.maxJumpPower;
    if (maxJumpValue) maxJumpValue.textContent = defaultSettings.maxJumpPower.toFixed(1);

    if (gravitySlider) gravitySlider.value = defaultSettings.gravity;
    if (gravityValue) gravityValue.textContent = defaultSettings.gravity.toFixed(2);

    if (chargeTimeSlider) chargeTimeSlider.value = defaultSettings.chargeTime;
    if (chargeTimeValue) chargeTimeValue.textContent = defaultSettings.chargeTime;

    if (speedSlider) speedSlider.value = defaultSettings.movementSpeed;
    if (speedValue) speedValue.textContent = defaultSettings.movementSpeed.toFixed(2);

    if (mouseSensitivitySlider) mouseSensitivitySlider.value = defaultSettings.mouseSensitivity;
    if (mouseSensitivityValue)
      mouseSensitivityValue.textContent = defaultSettings.mouseSensitivity.toFixed(3);

    if (cameraHeightSlider) cameraHeightSlider.value = defaultSettings.cameraHeight;
    if (cameraHeightValue) cameraHeightValue.textContent = defaultSettings.cameraHeight.toFixed(1);

    if (fovSlider) fovSlider.value = defaultSettings.fov;
    if (fovValue) fovValue.textContent = defaultSettings.fov;

    if (enemySpeedSlider) enemySpeedSlider.value = defaultSettings.enemySpeed;
    if (enemySpeedValue) enemySpeedValue.textContent = enemySpeedSlider.value;

    if (enemyRangeSlider) enemyRangeSlider.value = defaultSettings.enemyDetectionRange;
    if (enemyRangeValue) enemyRangeValue.textContent = enemyRangeSlider.value;

    if (playerHealthSlider) playerHealthSlider.value = defaultSettings.playerHealth;
    if (playerHealthValue) playerHealthValue.textContent = playerHealthSlider.value;

    if (ambientLightIntensitySlider)
      ambientLightIntensitySlider.value = defaultSettings.ambientLightIntensity;
    if (ambientLightIntensityValue)
      ambientLightIntensityValue.textContent = defaultSettings.ambientLightIntensity.toFixed(2);

    if (directionalLightIntensitySlider)
      directionalLightIntensitySlider.value = defaultSettings.directionalLightIntensity;
    if (directionalLightIntensityValue)
      directionalLightIntensityValue.textContent = directionalLightIntensitySlider.value;

    if (ambientLightColorPicker) ambientLightColorPicker.value = defaultSettings.ambientLightColor;
    if (directionalLightColorPicker)
      directionalLightColorPicker.value = defaultSettings.directionalLightColor;
    if (backgroundColorPicker) backgroundColorPicker.value = defaultSettings.backgroundColor;

    if (particleCountSlider) particleCountSlider.value = defaultSettings.particleCount;
    if (particleCountValue) particleCountValue.textContent = defaultSettings.particleCount;

    if (shadowQualitySelect) shadowQualitySelect.value = defaultSettings.shadowQuality;
    if (shadowQualityValue) shadowQualityValue.textContent = defaultSettings.shadowQuality;

    console.log('Settings reset to defaults');
  }

  function copyAllSettings() {
    const settings = getCurrentSettings();
    const settingsText = JSON.stringify(settings, null, 2);

    const outputDiv = document.getElementById('gameSettingsOutput');
    const textarea = document.getElementById('gameSettingsText');

    if (outputDiv && textarea) {
      textarea.value = settingsText;
      outputDiv.style.display = 'block';

      // Copy to clipboard
      textarea.select();
      document.execCommand('copy');

      // Hide after 3 seconds
      setTimeout(() => {
        outputDiv.style.display = 'none';
      }, 3000);
    }
  }

  function getCurrentSettings() {
    return {
      // Physics & Movement
      playerHeight: window.game3D.player.height,
      groundLevel: window.game3D.groundLevel,
      cellBoundary: window.game3D.cellBoundary,
      baseJumpPower: window.game3D.player.jumpPower,
      maxJumpPower: window.game3D.player.maxJumpPower,
      gravity: window.game3D.gravity,
      chargeTime: window.game3D.player.maxJumpCharge,
      movementSpeed: window.game3D.player.speed,
      // Camera & Controls
      mouseSensitivity: window.game3D.mouseSensitivity,
      cameraHeight: window.game3D.camera.position.y,
      fov: window.game3D.camera.fov,
      // Enemies & Gameplay
      enemySpeed: window.game3D.enemies[0]?.speed || 0.05,
      enemyDetectionRange: window.game3D.enemyDetectionRange,
      playerHealth: window.game3D.player.health,
      // Visual & Audio
      ambientLightIntensity: window.game3D.ambientLight.intensity,
      ambientLightColor: window.game3D.ambientLight.color.getStyle(),
      directionalLightIntensity: window.game3D.directionalLight.intensity,
      directionalLightColor: window.game3D.directionalLight.color.getStyle(),
      backgroundColor: window.game3D.renderer.getClearColor().getStyle(),
      particleCount: window.game3D.particleCount,
      shadowQuality: window.game3D.shadowMapSize,
    };
  }

  function applySettings(settings) {
    // Physics & Movement
    if (settings.playerHeight !== undefined) {
      window.game3D.player.height = settings.playerHeight;
      if (playerHeightSlider) playerHeightSlider.value = settings.playerHeight;
      if (playerHeightValue) playerHeightValue.textContent = playerHeightSlider.value;
      console.log('Player height updated to:', window.game3D.player.height);
    }
    if (settings.groundLevel !== undefined) {
      window.game3D.groundLevel = settings.groundLevel;
      if (groundLevelSlider) groundLevelSlider.value = settings.groundLevel;
      if (groundLevelValue) groundLevelValue.textContent = groundLevelSlider.value;
      console.log('Ground level updated to:', window.game3D.groundLevel);
    }
    if (settings.cellBoundary !== undefined) {
      window.game3D.cellBoundary = settings.cellBoundary;
      if (cellBoundarySlider) cellBoundarySlider.value = settings.cellBoundary;
      if (cellBoundaryValue) cellBoundaryValue.textContent = cellBoundarySlider.value;
      console.log('Cell boundary updated to:', window.game3D.cellBoundary);
    }
    if (settings.baseJumpPower !== undefined) {
      window.game3D.player.jumpPower = settings.baseJumpPower;
      if (baseJumpSlider) baseJumpSlider.value = settings.baseJumpPower;
      if (baseJumpValue) baseJumpValue.textContent = baseJumpSlider.value;
      console.log('Base jump power updated to:', window.game3D.player.jumpPower);
    }
    if (settings.maxJumpPower !== undefined) {
      window.game3D.player.maxJumpPower = settings.maxJumpPower;
      if (maxJumpSlider) maxJumpSlider.value = settings.maxJumpPower;
      if (maxJumpValue) maxJumpValue.textContent = settings.maxJumpPower.toFixed(1);
    }
    if (settings.gravity !== undefined) {
      window.game3D.gravity = settings.gravity;
      if (gravitySlider) gravitySlider.value = settings.gravity;
      if (gravityValue) gravityValue.textContent = settings.gravity.toFixed(2);
    }
    if (settings.chargeTime !== undefined) {
      window.game3D.player.maxJumpCharge = settings.chargeTime;
      if (chargeTimeSlider) chargeTimeSlider.value = settings.chargeTime;
      if (chargeTimeValue) chargeTimeValue.textContent = settings.chargeTime;
    }
    if (settings.movementSpeed !== undefined) {
      window.game3D.player.speed = settings.movementSpeed;
      if (speedSlider) speedSlider.value = settings.movementSpeed;
      if (speedValue) speedValue.textContent = settings.movementSpeed.toFixed(2);
    }
    // Camera & Controls
    if (settings.mouseSensitivity !== undefined) {
      window.game3D.mouseSensitivity = settings.mouseSensitivity;
      if (mouseSensitivitySlider) mouseSensitivitySlider.value = settings.mouseSensitivity;
      if (mouseSensitivityValue)
        mouseSensitivityValue.textContent = settings.mouseSensitivity.toFixed(3);
    }
    if (settings.cameraHeight !== undefined) {
      window.game3D.camera.position.y = settings.cameraHeight;
      if (cameraHeightSlider) cameraHeightSlider.value = settings.cameraHeight;
      if (cameraHeightValue) cameraHeightValue.textContent = settings.cameraHeight.toFixed(1);
    }
    if (settings.fov !== undefined) {
      window.game3D.camera.fov = settings.fov;
      window.game3D.camera.updateProjectionMatrix();
      if (fovSlider) fovSlider.value = settings.fov;
      if (fovValue) fovValue.textContent = settings.fov;
    }
    // Enemies & Gameplay
    if (settings.enemySpeed !== undefined) {
      window.game3D.enemies.forEach((enemy) => {
        enemy.speed = settings.enemySpeed;
      });
      if (enemySpeedSlider) enemySpeedSlider.value = settings.enemySpeed;
      if (enemySpeedValue) enemySpeedValue.textContent = enemySpeedSlider.value;
    }
    if (settings.enemyDetectionRange !== undefined) {
      window.game3D.enemyDetectionRange = settings.enemyDetectionRange;
      if (enemyRangeSlider) enemyRangeSlider.value = settings.enemyDetectionRange;
      if (enemyRangeValue) enemyRangeValue.textContent = settings.enemyDetectionRange;
    }
    if (settings.playerHealth !== undefined) {
      window.game3D.player.health = settings.playerHealth;
      window.game3D.player.maxHealth = settings.playerHealth;
      if (playerHealthSlider) playerHealthSlider.value = settings.playerHealth;
      if (playerHealthValue) playerHealthValue.textContent = playerHealthSlider.value;
    }
    // Visual & Audio
    if (settings.ambientLightIntensity !== undefined) {
      window.game3D.ambientLight.intensity = settings.ambientLightIntensity;
      if (ambientLightIntensitySlider)
        ambientLightIntensitySlider.value = settings.ambientLightIntensity;
      if (ambientLightIntensityValue)
        ambientLightIntensityValue.textContent = settings.ambientLightIntensity.toFixed(2);
    }
    if (settings.ambientLightColor !== undefined) {
      window.game3D.ambientLight.color.setStyle(settings.ambientLightColor);
      if (ambientLightColorPicker)
        ambientLightColorPicker.value = rgbToHex(settings.ambientLightColor);
    }
    if (settings.directionalLightIntensity !== undefined) {
      window.game3D.directionalLight.intensity = settings.directionalLightIntensity;
      if (directionalLightIntensitySlider)
        directionalLightIntensitySlider.value = settings.directionalLightIntensity;
      if (directionalLightIntensityValue)
        directionalLightIntensityValue.textContent = directionalLightIntensitySlider.value;
    }
    if (settings.directionalLightColor !== undefined) {
      window.game3D.directionalLight.color.setStyle(settings.directionalLightColor);
      if (directionalLightColorPicker)
        directionalLightColorPicker.value = rgbToHex(settings.directionalLightColor);
    }
    if (settings.backgroundColor !== undefined) {
      window.game3D.renderer.setClearColor(settings.backgroundColor);
      if (backgroundColorPicker) backgroundColorPicker.value = rgbToHex(settings.backgroundColor);
    }
    if (settings.particleCount !== undefined) {
      window.game3D.particleCount = settings.particleCount;
      if (particleCountSlider) particleCountSlider.value = settings.particleCount;
      if (particleCountValue) particleCountValue.textContent = settings.particleCount;
      if (typeof window.game3D.updateParticleSystems === 'function')
        window.game3D.updateParticleSystems();
    }
    if (settings.shadowQuality !== undefined) {
      window.game3D.shadowMapSize = settings.shadowQuality;
      if (shadowQualitySelect) shadowQualitySelect.value = settings.shadowQuality;
      if (shadowQualityValue) shadowQualityValue.textContent = settings.shadowQuality;
      if (typeof window.game3D.updateShadowMap === 'function') window.game3D.updateShadowMap();
    }
  }

  function rgbToHex(rgb) {
    // Accepts 'rgb(r,g,b)' or '#rrggbb' or 'rgba(r,g,b,a)' or color names
    if (rgb.startsWith('#')) return rgb;
    const result = rgb.match(/\d+/g);
    if (!result) return '#ffffff';
    return (
      '#' +
      ((1 << 24) + (parseInt(result[0]) << 16) + (parseInt(result[1]) << 8) + parseInt(result[2]))
        .toString(16)
        .slice(1)
    );
  }

  function updateProfileDropdown() {
    const profiles = JSON.parse(localStorage.getItem('gameProfiles') || '{}');
    loadProfileSelect.innerHTML = '';
    Object.keys(profiles).forEach((name) => {
      const opt = document.createElement('option');
      opt.value = name;
      opt.textContent = name;
      loadProfileSelect.appendChild(opt);
    });
  }

  if (saveProfileBtn)
    saveProfileBtn.addEventListener('click', () => {
      const name = profileNameInput.value.trim();
      if (!name) {
        alert('Enter a profile name.');
        return;
      }
      const profiles = JSON.parse(localStorage.getItem('gameProfiles') || '{}');
      profiles[name] = getCurrentSettings();
      localStorage.setItem('gameProfiles', JSON.stringify(profiles));
      updateProfileDropdown();
      alert('Profile saved!');
    });
  if (loadProfileBtn)
    loadProfileBtn.addEventListener('click', () => {
      const name = loadProfileSelect.value;
      if (!name) {
        alert('Select a profile to load.');
        return;
      }
      const profiles = JSON.parse(localStorage.getItem('gameProfiles') || '{}');
      if (!profiles[name]) {
        alert('Profile not found.');
        return;
      }
      applySettings(profiles[name]);
      alert('Profile loaded!');
    });
  if (deleteProfileBtn)
    deleteProfileBtn.addEventListener('click', () => {
      const name = loadProfileSelect.value;
      if (!name) {
        alert('Select a profile to delete.');
        return;
      }
      const profiles = JSON.parse(localStorage.getItem('gameProfiles') || '{}');
      if (!profiles[name]) {
        alert('Profile not found.');
        return;
      }
      delete profiles[name];
      localStorage.setItem('gameProfiles', JSON.stringify(profiles));
      updateProfileDropdown();
      alert('Profile deleted!');
    });
  if (resetGameSettingsBtn)
    resetGameSettingsBtn.addEventListener('click', () => {
      resetToDefaults();
    });
  if (copyGameSettingsBtn)
    copyGameSettingsBtn.addEventListener('click', () => {
      copyAllSettings();
    });
  updateProfileDropdown();

  function createDefaultProfilesIfNeeded() {
    let profiles = JSON.parse(localStorage.getItem('gameProfiles') || '{}');
    if (Object.keys(profiles).length === 0) {
      profiles = {
        Daytime: {
          playerHeight: 1.8,
          groundLevel: 0,
          cellBoundary: 10,
          baseJumpPower: 1.0,
          maxJumpPower: 2.0,
          gravity: 0.3,
          chargeTime: 15,
          movementSpeed: 0.15,
          mouseSensitivity: 0.002,
          cameraHeight: 1.6,
          fov: 75,
          enemySpeed: 0.05,
          enemyDetectionRange: 8,
          playerHealth: 100,
          ambientLightIntensity: 1.2,
          ambientLightColor: '#ffffff',
          directionalLightIntensity: 1.1,
          directionalLightColor: '#fffbe6',
          backgroundColor: '#bfefff',
          particleCount: 100,
          shadowQuality: 1024,
        },
        Night: {
          playerHeight: 1.8,
          groundLevel: 0,
          cellBoundary: 10,
          baseJumpPower: 1.0,
          maxJumpPower: 2.0,
          gravity: 0.3,
          chargeTime: 15,
          movementSpeed: 0.15,
          mouseSensitivity: 0.002,
          cameraHeight: 1.6,
          fov: 75,
          enemySpeed: 0.05,
          enemyDetectionRange: 8,
          playerHealth: 100,
          ambientLightIntensity: 0.3,
          ambientLightColor: '#223366',
          directionalLightIntensity: 0.2,
          directionalLightColor: '#003366',
          backgroundColor: '#1a1a2e',
          particleCount: 100,
          shadowQuality: 1024,
        },
      };
      localStorage.setItem('gameProfiles', JSON.stringify(profiles));
    }
  }

  createDefaultProfilesIfNeeded();
  updateProfileDropdown();

  // --- Add Event Listeners for All Sliders ---

  // Physics & Movement Sliders
  if (playerHeightSlider) {
    playerHeightSlider.addEventListener('input', () => {
      console.log('Player height slider changed:', playerHeightSlider.value);
      if (window.game3D && window.game3D.player) {
        window.game3D.player.height = parseFloat(playerHeightSlider.value);
        if (playerHeightValue) playerHeightValue.textContent = playerHeightSlider.value;
        console.log('Player height updated to:', window.game3D.player.height);
      } else {
        console.warn('Game or player not available for height slider');
      }
    });
  } else {
    console.warn('Player height slider not found');
  }

  if (groundLevelSlider) {
    groundLevelSlider.addEventListener('input', () => {
      console.log('Ground level slider changed:', groundLevelSlider.value);
      if (window.game3D) {
        window.game3D.groundLevel = parseFloat(groundLevelSlider.value);
        if (groundLevelValue) groundLevelValue.textContent = groundLevelSlider.value;
        console.log('Ground level updated to:', window.game3D.groundLevel);
      } else {
        console.warn('Game not available for ground level slider');
      }
    });
  } else {
    console.warn('Ground level slider not found');
  }

  if (cellBoundarySlider) {
    cellBoundarySlider.addEventListener('input', () => {
      console.log('Cell boundary slider changed:', cellBoundarySlider.value);
      if (window.game3D) {
        window.game3D.cellBoundary = parseInt(cellBoundarySlider.value);
        window.game3D.updateCellBounds(); // Update the cell bounds
        if (cellBoundaryValue) cellBoundaryValue.textContent = cellBoundarySlider.value;
        console.log('Cell boundary updated to:', window.game3D.cellBoundary);
      } else {
        console.warn('Game not available for cell boundary slider');
      }
    });
  } else {
    console.warn('Cell boundary slider not found');
  }

  if (baseJumpSlider) {
    baseJumpSlider.addEventListener('input', () => {
      console.log('Base jump slider changed:', baseJumpSlider.value);
      if (window.game3D && window.game3D.player) {
        window.game3D.player.jumpPower = parseFloat(baseJumpSlider.value);
        if (baseJumpValue) baseJumpValue.textContent = baseJumpSlider.value;
        console.log('Base jump power updated to:', window.game3D.player.jumpPower);
      } else {
        console.warn('Game or player not available for base jump slider');
      }
    });
  } else {
    console.warn('Base jump slider not found');
  }

  if (maxJumpSlider) {
    maxJumpSlider.addEventListener('input', () => {
      console.log('Max jump slider changed:', maxJumpSlider.value);
      if (window.game3D && window.game3D.player) {
        window.game3D.player.maxJumpPower = parseFloat(maxJumpSlider.value);
        if (maxJumpValue) maxJumpValue.textContent = maxJumpSlider.value;
        console.log('Max jump power updated to:', window.game3D.player.maxJumpPower);
      } else {
        console.warn('Game or player not available for max jump slider');
      }
    });
  } else {
    console.warn('Max jump slider not found');
  }

  if (gravitySlider) {
    gravitySlider.addEventListener('input', () => {
      console.log('Gravity slider changed:', gravitySlider.value);
      if (window.game3D) {
        window.game3D.gravity = parseFloat(gravitySlider.value);
        if (gravityValue) gravityValue.textContent = gravitySlider.value;
        console.log('Gravity updated to:', window.game3D.gravity);
      } else {
        console.warn('Game not available for gravity slider');
      }
    });
  } else {
    console.warn('Gravity slider not found');
  }

  if (chargeTimeSlider) {
    chargeTimeSlider.addEventListener('input', () => {
      console.log('Charge time slider changed:', chargeTimeSlider.value);
      if (window.game3D && window.game3D.player) {
        window.game3D.player.maxJumpCharge = parseInt(chargeTimeSlider.value);
        if (chargeTimeValue) chargeTimeValue.textContent = chargeTimeSlider.value;
        console.log('Charge time updated to:', window.game3D.player.maxJumpCharge);
      } else {
        console.warn('Game or player not available for charge time slider');
      }
    });
  } else {
    console.warn('Charge time slider not found');
  }

  if (speedSlider) {
    speedSlider.addEventListener('input', () => {
      console.log('Speed slider changed:', speedSlider.value);
      if (window.game3D && window.game3D.player) {
        window.game3D.player.speed = parseFloat(speedSlider.value);
        if (speedValue) speedValue.textContent = speedSlider.value;
        console.log('Speed updated to:', window.game3D.player.speed);
      } else {
        console.warn('Game or player not available for speed slider');
      }
    });
  } else {
    console.warn('Speed slider not found');
  }

  // Camera & Controls Sliders
  if (mouseSensitivitySlider) {
    mouseSensitivitySlider.addEventListener('input', () => {
      console.log('Mouse sensitivity slider changed:', mouseSensitivitySlider.value);
      if (window.game3D) {
        window.game3D.mouseSensitivity = parseFloat(mouseSensitivitySlider.value);
        if (mouseSensitivityValue) mouseSensitivityValue.textContent = mouseSensitivitySlider.value;
        console.log('Mouse sensitivity updated to:', window.game3D.mouseSensitivity);
      } else {
        console.warn('Game not available for mouse sensitivity slider');
      }
    });
  } else {
    console.warn('Mouse sensitivity slider not found');
  }

  if (cameraHeightSlider) {
    cameraHeightSlider.addEventListener('input', () => {
      console.log('Camera height slider changed:', cameraHeightSlider.value);
      if (window.game3D && window.game3D.camera) {
        window.game3D.camera.position.y = parseFloat(cameraHeightSlider.value);
        if (cameraHeightValue) cameraHeightValue.textContent = cameraHeightSlider.value;
        console.log('Camera height updated to:', window.game3D.camera.position.y);
      } else {
        console.warn('Game or camera not available for camera height slider');
      }
    });
  } else {
    console.warn('Camera height slider not found');
  }

  if (fovSlider) {
    fovSlider.addEventListener('input', () => {
      console.log('FOV slider changed:', fovSlider.value);
      if (window.game3D && window.game3D.camera) {
        window.game3D.camera.fov = parseInt(fovSlider.value);
        window.game3D.camera.updateProjectionMatrix();
        if (fovValue) fovValue.textContent = fovSlider.value;
        console.log('FOV updated to:', window.game3D.camera.fov);
      } else {
        console.warn('Game or camera not available for FOV slider');
      }
    });
  } else {
    console.warn('FOV slider not found');
  }

  // Enemies & Gameplay Sliders
  if (enemySpeedSlider) {
    enemySpeedSlider.addEventListener('input', () => {
      console.log('Enemy speed slider changed:', enemySpeedSlider.value);
      if (window.game3D && window.game3D.enemies) {
        const speed = parseFloat(enemySpeedSlider.value);
        window.game3D.enemies.forEach((enemy) => {
          enemy.speed = speed;
        });
        if (enemySpeedValue) enemySpeedValue.textContent = enemySpeedSlider.value;
        console.log('Enemy speed updated to:', speed);
      } else {
        console.warn('Game or enemies not available for enemy speed slider');
      }
    });
  } else {
    console.warn('Enemy speed slider not found');
  }

  if (enemyRangeSlider) {
    enemyRangeSlider.addEventListener('input', () => {
      console.log('Enemy range slider changed:', enemyRangeSlider.value);
      if (window.game3D) {
        window.game3D.enemyDetectionRange = parseInt(enemyRangeSlider.value);
        if (enemyRangeValue) enemyRangeValue.textContent = enemyRangeSlider.value;
        console.log('Enemy detection range updated to:', window.game3D.enemyDetectionRange);
      } else {
        console.warn('Game not available for enemy range slider');
      }
    });
  } else {
    console.warn('Enemy range slider not found');
  }

  if (playerHealthSlider) {
    playerHealthSlider.addEventListener('input', () => {
      console.log('Player health slider changed:', playerHealthSlider.value);
      if (window.game3D && window.game3D.player) {
        const health = parseInt(playerHealthSlider.value);
        window.game3D.player.health = health;
        window.game3D.player.maxHealth = health;
        if (playerHealthValue) playerHealthValue.textContent = playerHealthSlider.value;
        console.log('Player health updated to:', window.game3D.player.health);
      } else {
        console.warn('Game or player not available for health slider');
      }
    });
  } else {
    console.warn('Player health slider not found');
  }

  // Visual & Audio Sliders
  if (particleCountSlider) {
    particleCountSlider.addEventListener('input', () => {
      console.log('Particle count slider changed:', particleCountSlider.value);
      if (window.game3D) {
        window.game3D.particleCount = parseInt(particleCountSlider.value);
        if (particleCountValue) particleCountValue.textContent = particleCountSlider.value;
        console.log('Particle count updated to:', window.game3D.particleCount);
      } else {
        console.warn('Game not available for particle count slider');
      }
    });
  } else {
    console.warn('Particle count slider not found');
  }

  if (shadowQualitySelect) {
    shadowQualitySelect.addEventListener('change', () => {
      console.log('Shadow quality changed:', shadowQualitySelect.value);
      if (window.game3D) {
        window.game3D.shadowMapSize = parseInt(shadowQualitySelect.value);
        if (shadowQualityValue) shadowQualityValue.textContent = shadowQualitySelect.value;
        console.log('Shadow quality updated to:', window.game3D.shadowMapSize);
      } else {
        console.warn('Game not available for shadow quality select');
      }
    });
  } else {
    console.warn('Shadow quality select not found');
  }

  // Lighting Controls
  if (ambientLightIntensitySlider) {
    ambientLightIntensitySlider.addEventListener('input', () => {
      console.log('Ambient light intensity slider changed:', ambientLightIntensitySlider.value);
      if (window.game3D && window.game3D.ambientLight) {
        window.game3D.ambientLight.intensity = parseFloat(ambientLightIntensitySlider.value);
        if (ambientLightIntensityValue)
          ambientLightIntensityValue.textContent = ambientLightIntensitySlider.value;
        console.log('Ambient light intensity updated to:', window.game3D.ambientLight.intensity);
      } else {
        console.warn('Game or ambient light not available for intensity slider');
      }
    });
  } else {
    console.warn('Ambient light intensity slider not found');
  }

  if (directionalLightIntensitySlider) {
    directionalLightIntensitySlider.addEventListener('input', () => {
      console.log(
        'Directional light intensity slider changed:',
        directionalLightIntensitySlider.value,
      );
      if (window.game3D && window.game3D.directionalLight) {
        window.game3D.directionalLight.intensity = parseFloat(
          directionalLightIntensitySlider.value,
        );
        if (directionalLightIntensityValue)
          directionalLightIntensityValue.textContent = directionalLightIntensitySlider.value;
        console.log(
          'Directional light intensity updated to:',
          window.game3D.directionalLight.intensity,
        );
      } else {
        console.warn('Game or directional light not available for intensity slider');
      }
    });
  } else {
    console.warn('Directional light intensity slider not found');
  }

  if (ambientLightColorPicker) {
    ambientLightColorPicker.addEventListener('input', () => {
      console.log('Ambient light color changed:', ambientLightColorPicker.value);
      if (window.game3D && window.game3D.ambientLight) {
        window.game3D.ambientLight.color.setStyle(ambientLightColorPicker.value);
        console.log('Ambient light color updated to:', ambientLightColorPicker.value);
      } else {
        console.warn('Game or ambient light not available for color picker');
      }
    });
  } else {
    console.warn('Ambient light color picker not found');
  }

  if (directionalLightColorPicker) {
    directionalLightColorPicker.addEventListener('input', () => {
      console.log('Directional light color changed:', directionalLightColorPicker.value);
      if (window.game3D && window.game3D.directionalLight) {
        window.game3D.directionalLight.color.setStyle(directionalLightColorPicker.value);
        console.log('Directional light color updated to:', directionalLightColorPicker.value);
      } else {
        console.warn('Game or directional light not available for color picker');
      }
    });
  } else {
    console.warn('Directional light color picker not found');
  }

  if (backgroundColorPicker) {
    backgroundColorPicker.addEventListener('input', () => {
      console.log('Background color changed:', backgroundColorPicker.value);
      if (window.game3D && window.game3D.renderer) {
        window.game3D.renderer.setClearColor(backgroundColorPicker.value);
        console.log('Background color updated to:', backgroundColorPicker.value);
      } else {
        console.warn('Game or renderer not available for background color picker');
      }
    });
  } else {
    console.warn('Background color picker not found');
  }

  // Lighting Presets
  if (lightingDayPreset) {
    lightingDayPreset.addEventListener('click', () => {
      console.log('Day lighting preset applied');
      if (window.game3D && window.game3D.ambientLight) {
        window.game3D.ambientLight.intensity = 0.6;
        window.game3D.ambientLight.color.setStyle('#ffffff');
        if (ambientLightIntensitySlider) ambientLightIntensitySlider.value = 0.6;
        if (ambientLightIntensityValue) ambientLightIntensityValue.textContent = '0.60';
        if (ambientLightColorPicker) ambientLightColorPicker.value = '#ffffff';
        console.log('Ambient light updated for day preset');
      }
      if (window.game3D && window.game3D.directionalLight) {
        window.game3D.directionalLight.intensity = 1.2;
        window.game3D.directionalLight.color.setStyle('#fff4e6');
        if (directionalLightIntensitySlider) directionalLightIntensitySlider.value = 1.2;
        if (directionalLightIntensityValue) directionalLightIntensityValue.textContent = '1.20';
        if (directionalLightColorPicker) directionalLightColorPicker.value = '#fff4e6';
        console.log('Directional light updated for day preset');
      }
      if (window.game3D && window.game3D.renderer) {
        window.game3D.renderer.setClearColor('#87ceeb');
        if (backgroundColorPicker) backgroundColorPicker.value = '#87ceeb';
        console.log('Background color updated for day preset');
      }
    });
  } else {
    console.warn('Day lighting preset button not found');
  }

  if (lightingNightPreset) {
    lightingNightPreset.addEventListener('click', () => {
      console.log('Night lighting preset applied');
      if (window.game3D && window.game3D.ambientLight) {
        window.game3D.ambientLight.intensity = 0.2;
        window.game3D.ambientLight.color.setStyle('#101020');
        if (ambientLightIntensitySlider) ambientLightIntensitySlider.value = 0.2;
        if (ambientLightIntensityValue) ambientLightIntensityValue.textContent = '0.20';
        if (ambientLightColorPicker) ambientLightColorPicker.value = '#101020';
        console.log('Ambient light updated for night preset');
      }
      if (window.game3D && window.game3D.directionalLight) {
        window.game3D.directionalLight.intensity = 0.3;
        window.game3D.directionalLight.color.setStyle('#202040');
        if (directionalLightIntensitySlider) directionalLightIntensitySlider.value = 0.3;
        if (directionalLightIntensityValue) directionalLightIntensityValue.textContent = '0.30';
        if (directionalLightColorPicker) directionalLightColorPicker.value = '#202040';
        console.log('Directional light updated for night preset');
      }
      if (window.game3D && window.game3D.renderer) {
        window.game3D.renderer.setClearColor('#000011');
        if (backgroundColorPicker) backgroundColorPicker.value = '#000011';
        console.log('Background color updated for night preset');
      }
    });
  } else {
    console.warn('Night lighting preset button not found');
  }

  // Checkpoint Controls
  const createCheckpointBtn = document.getElementById('createCheckpointBtn');
  const respawnCheckpointBtn = document.getElementById('respawnCheckpointBtn');
  const clearCheckpointsBtn = document.getElementById('clearCheckpointsBtn');
  const maxCheckpointsSlider = document.getElementById('maxCheckpointsSlider');
  const maxCheckpointsSliderValue = document.getElementById('maxCheckpointsSliderValue');
  const checkpointCountValue = document.getElementById('checkpointCountValue');
  const maxCheckpointsValue = document.getElementById('maxCheckpointsValue');

  if (createCheckpointBtn) {
    createCheckpointBtn.addEventListener('click', () => {
      if (window.game3D) {
        window.game3D.createCheckpoint();
        updateCheckpointDisplay();
      }
    });
  }

  if (respawnCheckpointBtn) {
    respawnCheckpointBtn.addEventListener('click', () => {
      if (window.game3D) {
        window.game3D.respawnAtCheckpoint();
      }
    });
  }

  if (clearCheckpointsBtn) {
    clearCheckpointsBtn.addEventListener('click', () => {
      if (window.game3D) {
        window.game3D.clearAllCheckpoints();
        updateCheckpointDisplay();
      }
    });
  }

  if (maxCheckpointsSlider) {
    maxCheckpointsSlider.addEventListener('input', () => {
      if (window.game3D) {
        window.game3D.maxCheckpoints = parseInt(maxCheckpointsSlider.value);
        if (maxCheckpointsSliderValue)
          maxCheckpointsSliderValue.textContent = maxCheckpointsSlider.value;
        if (maxCheckpointsValue) maxCheckpointsValue.textContent = maxCheckpointsSlider.value;
      }
    });
  }

  function updateCheckpointDisplay() {
    if (window.game3D) {
      if (checkpointCountValue) checkpointCountValue.textContent = window.game3D.checkpointCount;
      if (maxCheckpointsValue) maxCheckpointsValue.textContent = window.game3D.maxCheckpoints;
    }
  }

  // Update checkpoint display initially
  updateCheckpointDisplay();
}

window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing game...');
  window.game3D = new Game3D();
  console.log('Game initialized, setting up controls...');
  setupGameControlSliders();
  console.log('Controls setup complete. Game object available:', !!window.game3D);
});
