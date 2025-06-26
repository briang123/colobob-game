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
      minX: -10,
      maxX: 10,
      minZ: -10,
      maxZ: 10,
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

    // Initialize 3D world
    this.init3DWorld();

    // Start game loop
    this.gameLoop();

    console.log('3D Game initialization complete!');
    this.hideLoadingScreen();
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

    if (this.lightMode === 'light') {
      // Daylight lighting - warm and bright
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      this.scene.add(ambientLight);
      this.lights.push(ambientLight);

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
    this.player.x = Math.max(-19, Math.min(19, this.player.x));
    this.player.z = Math.max(-19, Math.min(19, this.player.z));

    // Ground detection - only applies inside cell
    if (this.inCell) {
      this.player.onGround = false;

      // Check floor collision first
      if (this.player.y <= this.player.height / 2 + 0.1) {
        this.player.y = this.player.height / 2;
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
    const eyeHeight = this.player.height * 0.8; // Position camera at 80% of player height
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

window.addEventListener('DOMContentLoaded', () => {
  // Side panel open/close
  const panel = document.getElementById('gameControlsPanel');
  const toggleBtn = document.getElementById('toggleGameControls');
  const fullscreenBtn = document.getElementById('fullscreenToggle');

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
    header.addEventListener('click', () => {
      const section = header.parentElement;
      section.classList.toggle('expanded');
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
});
