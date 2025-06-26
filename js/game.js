// Space Prison Escape Game
class Game {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    // Game state
    this.gravity = 0.3;
    this.gravityEnabled = true;
    this.gameTime = 0;

    // Player
    this.player = {
      x: 100,
      y: 400,
      width: 30,
      height: 50,
      vx: 0,
      vy: 0,
      speed: 5,
      jumpPower: 12,
      onGround: false,
      health: 100,
      maxHealth: 100,
      shape: 'human', // human, small, wide, tall
      color: '#ff6b35',
    };

    // Input handling
    this.keys = {};
    this.setupInput();

    // Game objects
    this.platforms = [];
    this.enemies = [];
    this.items = [];
    this.particles = [];

    // Initialize game world
    this.initWorld();

    // Start game loop
    this.gameLoop();
  }

  setupInput() {
    document.addEventListener('keydown', (e) => {
      this.keys[e.key.toLowerCase()] = true;

      // Handle special keys
      if (e.key === ' ') {
        e.preventDefault();
        this.playerJump();
      }
      if (e.key === 'g' || e.key === 'G') {
        this.toggleGravity();
      }
      if (e.key === 'e' || e.key === 'E') {
        this.interact();
      }
    });

    document.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  initWorld() {
    // Create platforms (prison structure)
    this.platforms = [
      // Floor
      { x: 0, y: 750, width: 1200, height: 50, color: '#2a2a3e' },

      // Cell platforms
      { x: 50, y: 650, width: 200, height: 20, color: '#3a3a4e' },
      { x: 300, y: 650, width: 200, height: 20, color: '#3a3a4e' },
      { x: 550, y: 650, width: 200, height: 20, color: '#3a3a4e' },

      // Upper platforms
      { x: 100, y: 500, width: 150, height: 20, color: '#4a4a4e' },
      { x: 400, y: 500, width: 150, height: 20, color: '#4a4a4e' },
      { x: 700, y: 500, width: 150, height: 20, color: '#4a4a4e' },

      // High platforms
      { x: 200, y: 350, width: 100, height: 20, color: '#5a5a6e' },
      { x: 500, y: 350, width: 100, height: 20, color: '#5a5a6e' },
      { x: 800, y: 350, width: 100, height: 20, color: '#5a5a6e' },

      // Walls
      { x: 0, y: 0, width: 20, height: 800, color: '#2a2a3e' },
      { x: 1180, y: 0, width: 20, height: 800, color: '#2a2a3e' },
    ];

    // Create enemies (blue aliens)
    this.enemies = [
      {
        x: 350,
        y: 630,
        width: 25,
        height: 40,
        vx: 1,
        patrolLeft: 300,
        patrolRight: 500,
        type: 'guard',
        color: '#0066ff',
      },
      {
        x: 600,
        y: 630,
        width: 25,
        height: 40,
        vx: -1,
        patrolLeft: 550,
        patrolRight: 750,
        type: 'guard',
        color: '#0066ff',
      },
      {
        x: 150,
        y: 480,
        width: 25,
        height: 40,
        vx: 0.5,
        patrolLeft: 100,
        patrolRight: 250,
        type: 'guard',
        color: '#0066ff',
      },
    ];

    // Create items (resources)
    this.items = [
      { x: 150, y: 620, width: 20, height: 20, type: 'health', color: '#00ff00' },
      { x: 450, y: 620, width: 20, height: 20, type: 'gravitySwitch', color: '#ffff00' },
      { x: 750, y: 620, width: 20, height: 20, type: 'weapon', color: '#ff0000' },
    ];
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

    // Update UI
    this.updateUI();
  }

  updatePlayer() {
    // Handle horizontal movement
    if (this.keys['a'] || this.keys['arrowleft']) {
      this.player.vx = -this.player.speed;
    } else if (this.keys['d'] || this.keys['arrowright']) {
      this.player.vx = this.player.speed;
    } else {
      this.player.vx *= 0.8; // Friction
    }

    // Apply gravity if enabled
    if (this.gravityEnabled) {
      this.player.vy += this.gravity;
    } else {
      // Low gravity effect
      this.player.vy += this.gravity * 0.3;
    }

    // Update position
    this.player.x += this.player.vx;
    this.player.y += this.player.vy;

    // Keep player in bounds
    if (this.player.x < 0) this.player.x = 0;
    if (this.player.x + this.player.width > this.width)
      this.player.x = this.width - this.player.width;
    if (this.player.y > this.height) {
      this.player.y = this.height;
      this.player.vy = 0;
      this.player.onGround = true;
    }

    // Platform collision
    this.player.onGround = false;
    for (let platform of this.platforms) {
      if (this.checkCollision(this.player, platform)) {
        if (this.player.vy > 0 && this.player.y < platform.y) {
          // Landing on top
          this.player.y = platform.y - this.player.height;
          this.player.vy = 0;
          this.player.onGround = true;
        } else if (this.player.vy < 0 && this.player.y > platform.y + platform.height) {
          // Hitting from below
          this.player.y = platform.y + platform.height;
          this.player.vy = 0;
        } else if (this.player.vx > 0 && this.player.x < platform.x) {
          // Hitting from left
          this.player.x = platform.x - this.player.width;
          this.player.vx = 0;
        } else if (this.player.vx < 0 && this.player.x > platform.x + platform.width) {
          // Hitting from right
          this.player.x = platform.x + platform.width;
          this.player.vx = 0;
        }
      }
    }
  }

  updateEnemies() {
    for (let enemy of this.enemies) {
      // Simple patrol AI
      enemy.x += enemy.vx;

      if (enemy.x <= enemy.patrolLeft || enemy.x >= enemy.patrolRight) {
        enemy.vx *= -1;
      }

      // Apply gravity to enemies
      if (this.gravityEnabled) {
        enemy.vy += this.gravity;
      } else {
        enemy.vy += this.gravity * 0.3;
      }

      enemy.y += enemy.vy;

      // Platform collision for enemies
      for (let platform of this.platforms) {
        if (this.checkCollision(enemy, platform)) {
          if (enemy.vy > 0 && enemy.y < platform.y) {
            enemy.y = platform.y - enemy.height;
            enemy.vy = 0;
          }
        }
      }
    }
  }

  updateParticles() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let particle = this.particles[i];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;

      if (particle.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  checkCollisions() {
    // Player vs Items
    for (let i = this.items.length - 1; i >= 0; i--) {
      let item = this.items[i];
      if (this.checkCollision(this.player, item)) {
        this.collectItem(item);
        this.items.splice(i, 1);
      }
    }

    // Player vs Enemies
    for (let enemy of this.enemies) {
      if (this.checkCollision(this.player, enemy)) {
        this.playerTakeDamage(10);
      }
    }
  }

  checkCollision(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  playerJump() {
    if (this.player.onGround) {
      this.player.vy = -this.player.jumpPower;
      this.player.onGround = false;
      this.createParticles(
        this.player.x + this.player.width / 2,
        this.player.y + this.player.height,
        '#ff6b35',
      );
    }
  }

  toggleGravity() {
    if (this.hasGravitySwitch) {
      this.gravityEnabled = !this.gravityEnabled;
      this.createParticles(
        this.player.x + this.player.width / 2,
        this.player.y + this.player.height / 2,
        '#ffff00',
      );
    }
  }

  interact() {
    // Interaction logic for doors, switches, etc.
    console.log('Interacting...');
  }

  collectItem(item) {
    switch (item.type) {
      case 'health':
        this.player.health = Math.min(this.player.maxHealth, this.player.health + 25);
        this.createParticles(item.x + item.width / 2, item.y + item.height / 2, '#00ff00');
        break;
      case 'gravitySwitch':
        this.hasGravitySwitch = true;
        this.createParticles(item.x + item.width / 2, item.y + item.height / 2, '#ffff00');
        break;
      case 'weapon':
        this.hasWeapon = true;
        this.createParticles(item.x + item.width / 2, item.y + item.height / 2, '#ff0000');
        break;
    }
  }

  playerTakeDamage(amount) {
    this.player.health -= amount;
    this.createParticles(
      this.player.x + this.player.width / 2,
      this.player.y + this.player.height / 2,
      '#ff0000',
    );

    if (this.player.health <= 0) {
      this.gameOver();
    }
  }

  createParticles(x, y, color) {
    for (let i = 0; i < 5; i++) {
      this.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 30,
        color: color,
      });
    }
  }

  gameOver() {
    console.log('Game Over!');
    this.player.health = 0;
  }

  updateUI() {
    document.getElementById('health').textContent = this.player.health;
    document.getElementById('gravity').textContent = this.gravityEnabled ? 'ON' : 'OFF';
    document.getElementById('position').textContent =
      `${Math.round(this.player.x)}, ${Math.round(this.player.y)}`;
  }

  render() {
    // Clear canvas
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Draw background grid (industrial feel)
    this.ctx.strokeStyle = '#2a2a3e';
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 50) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }

    // Draw platforms
    for (let platform of this.platforms) {
      this.ctx.fillStyle = platform.color;
      this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);

      // Add metallic shine
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      this.ctx.fillRect(platform.x, platform.y, platform.width, 5);
    }

    // Draw items
    for (let item of this.items) {
      this.ctx.fillStyle = item.color;
      this.ctx.fillRect(item.x, item.y, item.width, item.height);

      // Add glow effect
      this.ctx.shadowColor = item.color;
      this.ctx.shadowBlur = 10;
      this.ctx.fillRect(item.x, item.y, item.width, item.height);
      this.ctx.shadowBlur = 0;
    }

    // Draw enemies
    for (let enemy of this.enemies) {
      this.ctx.fillStyle = enemy.color;
      this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

      // Draw glowing eyes
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillRect(enemy.x + 5, enemy.y + 8, 3, 3);
      this.ctx.fillRect(enemy.x + enemy.width - 8, enemy.y + 8, 3, 3);
    }

    // Draw particles
    for (let particle of this.particles) {
      this.ctx.fillStyle = particle.color;
      this.ctx.globalAlpha = particle.life / 30;
      this.ctx.fillRect(particle.x, particle.y, 3, 3);
    }
    this.ctx.globalAlpha = 1;

    // Draw player
    this.ctx.fillStyle = this.player.color;
    this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);

    // Draw player details (face, etc.)
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(this.player.x + 8, this.player.y + 10, 4, 4);
    this.ctx.fillRect(this.player.x + this.player.width - 12, this.player.y + 10, 4, 4);

    // Draw health bar
    this.ctx.fillStyle = '#ff0000';
    this.ctx.fillRect(this.player.x, this.player.y - 10, this.player.width, 5);
    this.ctx.fillStyle = '#00ff00';
    this.ctx.fillRect(
      this.player.x,
      this.player.y - 10,
      (this.player.health / this.player.maxHealth) * this.player.width,
      5,
    );
  }

  gameLoop() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }
}

// Initialize game when page loads
window.addEventListener('load', () => {
  new Game();
});
