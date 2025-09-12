import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = path.join(__dirname, 'auth.db');
const INIT_SQL_PATH = path.join(__dirname, 'init.sql');

// Create database connection
const db = new Database(DB_PATH);
console.log('Connected to SQLite database');

// Initialize database with schema
const initializeDatabase = async () => {
  try {
    const initSQL = fs.readFileSync(INIT_SQL_PATH, 'utf8');
    db.exec(initSQL);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error.message);
    throw error;
  }
};

// User database operations
const userDb = {
  // Check if any users exist
  hasUsers: () => {
    try {
      const row = db.prepare('SELECT COUNT(*) as count FROM users').get();
      return row.count > 0;
    } catch (err) {
      throw err;
    }
  },

  // Create a new user
  createUser: (username, passwordHash) => {
    try {
      const stmt = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
      const result = stmt.run(username, passwordHash);
      return { id: result.lastInsertRowid, username };
    } catch (err) {
      throw err;
    }
  },

  // Get user by username
  getUserByUsername: (username) => {
    try {
      const row = db.prepare('SELECT * FROM users WHERE username = ? AND is_active = 1').get(username);
      return row;
    } catch (err) {
      throw err;
    }
  },

  // Update last login time
  updateLastLogin: (userId) => {
    try {
      db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(userId);
    } catch (err) {
      throw err;
    }
  },

  // Get user by ID
  getUserById: (userId) => {
    try {
      const row = db.prepare('SELECT id, username, created_at, last_login FROM users WHERE id = ? AND is_active = 1').get(userId);
      return row;
    } catch (err) {
      throw err;
    }
  }
};

// Push subscription database operations
const pushDb = {
  // Save push subscription for user
  savePushSubscription: (userId, subscription) => {
    try {
      // First deactivate any existing subscriptions for this user
      db.prepare('UPDATE push_subscriptions SET is_active = 0 WHERE user_id = ?').run(userId);
      
      // Insert new subscription
      const stmt = db.prepare(`
        INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth) 
        VALUES (?, ?, ?, ?)
      `);
      const result = stmt.run(
        userId,
        subscription.endpoint,
        subscription.keys.p256dh,
        subscription.keys.auth
      );
      return { id: result.lastInsertRowid };
    } catch (err) {
      throw err;
    }
  },

  // Get active push subscriptions for user
  getUserPushSubscriptions: (userId) => {
    try {
      const rows = db.prepare(
        'SELECT endpoint, p256dh, auth FROM push_subscriptions WHERE user_id = ? AND is_active = 1'
      ).all(userId);
      return rows.map(row => ({
        endpoint: row.endpoint,
        keys: {
          p256dh: row.p256dh,
          auth: row.auth
        }
      }));
    } catch (err) {
      throw err;
    }
  },

  // Remove push subscription
  removePushSubscription: (userId, endpoint) => {
    try {
      db.prepare(
        'UPDATE push_subscriptions SET is_active = 0 WHERE user_id = ? AND endpoint = ?'
      ).run(userId, endpoint);
    } catch (err) {
      throw err;
    }
  },

  // Get all active push subscriptions
  getAllActivePushSubscriptions: () => {
    try {
      const rows = db.prepare(`
        SELECT ps.endpoint, ps.p256dh, ps.auth, u.username, u.id as user_id
        FROM push_subscriptions ps
        JOIN users u ON ps.user_id = u.id
        WHERE ps.is_active = 1 AND u.is_active = 1
      `).all();
      return rows.map(row => ({
        userId: row.user_id,
        username: row.username,
        subscription: {
          endpoint: row.endpoint,
          keys: {
            p256dh: row.p256dh,
            auth: row.auth
          }
        }
      }));
    } catch (err) {
      throw err;
    }
  }
};

export {
  db,
  initializeDatabase,
  userDb,
  pushDb
};