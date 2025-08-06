require('dotenv').config();
const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Allow only frontend URL to call backend
app.use(cors({
    origin: '*',
    credentials: true,
}));
app.use(express.json());

// Initialize DB
const db = knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        database: 'travel_planner',
    },
});

// =================== AUTH ROUTES ===================

// REGISTER
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    try {
        const existingUser = await db('user_creds').where({ email }).first();
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [newUserId] = await db('user_creds').insert({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: newUserId,
                name,
                email,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred during registration', error: error.message });
    }
});

// LOGIN
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    try {
        const user = await db('user_creds').where({ email }).first();

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                email: user.email,
                name: user.name || null,
            },
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error occurred during login', error: error.message });
    }
});

app.post('/api/auth/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  try {
    // Check if user exists
    const user = await knex('users').where({ email }).first();
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await knex('users')
      .where({ email })
      .update({ password: hashedPassword });

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// =================== TRIP ROUTES ===================

// CREATE trip
app.post('/api/trips', async (req, res) => {
    const { user_id, destination, startDate, endDate, budget, transport } = req.body;
    try {
        const [tripId] = await db('trips').insert({
            user_id,
            destination,
            start_date: startDate,
            end_date: endDate,
            budget,
            transport: JSON.stringify(transport),
        });
        res.status(201).json({ success: true, tripId });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to create trip", error: err.message });
    }
});

// READ trips for a user
app.get('/api/trips/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const trips = await db('trips').where({ user_id });
        res.status(200).json({ success: true, trips });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to fetch trips", error: err.message });
    }
});

// DELETE a trip and its activities
app.delete('/api/trips/:trip_id', async (req, res) => {
    const { trip_id } = req.params;
    try {
        await db('activities').where({ trip_id }).del(); // optional if using ON DELETE CASCADE
        await db('trips').where({ id: trip_id }).del();
        res.status(200).json({ success: true, message: "Trip deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to delete trip", error: err.message });
    }
});

// =================== ACTIVITY ROUTES ===================
// Get all activities by user ID
app.get('/api/user-activities/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const activities = await db('activities')
      .join('trips', 'activities.trip_id', 'trips.id')
      .where('trips.user_id', user_id)
      .select(
        'activities.id',
        'activities.activity',
        'activities.date',
        'activities.time',
        'activities.location',
        'activities.notes',
        'activities.estimated_cost',
        'trips.destination'
      );

    if (activities.length === 0) {
      return res.status(200).json({ success: true, activities: [] });
    }

    res.status(200).json({ success: true, activities });
  } catch (err) {
    console.error('Error fetching user activities:', err.message);
    res.status(500).json({ success: false, message: "Failed to fetch activities", error: err.message });
  }
});
// ADD activity
app.post('/api/activities', async (req, res) => {
    const { trip_id, date, time, activity, location, notes, estimated_cost } = req.body;
    try {
        const [id] = await db('activities').insert({
            trip_id,
            date,
            time,
            activity,
            location,
            notes,
            estimated_cost,
        });
        res.status(201).json({ success: true, activityId: id });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to add activity", error: err.message });
    }
});

// READ activities for a trip
app.get('/api/activities/:trip_id', async (req, res) => {
    const { trip_id } = req.params;
    try {
        const activities = await db('activities').where({ trip_id });
        res.status(200).json({ success: true, activities });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to get activities", error: err.message });
    }
});

// DELETE activity
app.delete('/api/activities/:activity_id', async (req, res) => {
    const { activity_id } = req.params;
    try {
        await db('activities').where({ id: activity_id }).del();
        res.status(200).json({ success: true, message: "Activity deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to delete activity", error: err.message });
    }
});

// UPDATE activity
app.put('/api/activities/:activity_id', async (req, res) => {
    const { activity_id } = req.params;
    const { date, time, activity, location, notes, estimated_cost } = req.body;
    try {
        await db('activities').where({ id: activity_id }).update({
            date,
            time,
            activity,
            location,
            notes,
            estimated_cost,
        });
        res.status(200).json({ success: true, message: "Activity updated" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update activity", error: err.message });
    }
});



// --- ADMIN: for everything ---


app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await db('admin').where({ email }).first();
  if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: admin.id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.json({
    success: true,
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email
    }
  });
});

// ================== TOKEN VERIFICATION MIDDLEWARE ==================
function verifyAdminToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ success: false, message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden: Not an admin' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
}

// ================== PROTECTED EXAMPLE ROUTE ==================
app.get('/api/admin/dashboard', verifyAdminToken, async (req, res) => {
  try {
    const userCount = await db('users').count('id as total');
    const tripCount = await db('trips').count('id as total');
    const activityCount = await db('activities').count('id as total');

    res.json({
      success: true,
      stats: {
        users: userCount[0].total,
        trips: tripCount[0].total,
        activities: activityCount[0].total,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
});



app.get('/api/users', async (req, res) => {
  try {
    const users = await db('user_creds').select('user_id', 'name', 'email'); // Removed 'id'
    res.json({ success:true, users });
  } catch(err) {
    res.status(500).json({ success:false, message:'Users fetch error', error: err.message });
  }
});


app.get('/api/trips', async (req, res) => {
  try {
    const trips = await db('trips');
    res.json({ success:true, trips });
  } catch(err) {
    res.status(500).json({ success:false, message:'Trips fetch error', error: err.message });
  }
});

app.delete('/api/trips/:trip_id', async (req, res) => {
  try {
    await db('activities').where({ trip_id: req.params.trip_id }).del();
    await db('trips').where({ id: req.params.trip_id }).del();
    res.json({ success:true, message:'Trip deleted' });
  } catch(err) {
    res.status(500).json({ success:false, message:'Trip delete error', error: err.message });
  }
});

app.get('/api/activities', async (req, res) => {
  try {
    const acts = await db('activities')
      .join('trips', 'activities.trip_id', 'trips.id')
      .join('user_creds', 'trips.user_id', 'user_creds.id')
      .select(
        'activities.id','activities.activity','activities.date','activities.time','activities.location',
        'activities.notes','activities.estimated_cost',
        'trips.id as trip_id','trips.destination','user_creds.id as user_id','user_creds.email as user_email'
      );
    res.json({ success:true, activities: acts });
  } catch(err) {
    res.status(500).json({ success:false, message:'Activities fetch error', error: err.message });
  }
});

app.delete('/api/activities/:activity_id', async (req, res) => {
  try {
    await db('activities').where({ id: req.params.activity_id }).del();
    res.json({ success:true, message:'Activity deleted' });
  } catch(err) {
    res.status(500).json({ success:false, message:'Activity delete error', error: err.message });
  }
});


// Example: GET all users (for admin dashboard)
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await db('user_creds').select('user_id', 'name', 'email');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Users fetch error', error: err.message });
  }
});

// GET all trips
app.get('/api/admin/trips', async (req, res) => {
  try {
    const trips = await db('trips').select('*');
    res.json({ success: true, trips });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Trips fetch error', error: err.message });
  }
});

// GET all activities
app.get('/api/admin/activities', async (req, res) => {
  try {
    const activities = await db('activities').select('*');
    res.json({ success: true, activities });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Activities fetch error', error: err.message });
  }
});

app.get('/api/admin/stats', async (req, res) => {
  try {
    // Count total users
    const usersCountResult = await db('user_creds').count('user_id as count').first();
    const tripsCountResult = await db('trips').count('id as count').first();
    const activitiesCountResult = await db('activities').count('id as count').first();

    res.json({
      success: true,
      stats: {
        users: usersCountResult.count,
        trips: tripsCountResult.count,
        activities: activitiesCountResult.count,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch stats', error: err.message });
  }
});

app.delete('/api/admin/users/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    await db('user_creds').where({ user_id }).del();
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete user', error: err.message });
  }
});

app.post('/api/admin/users', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }

  try {
    const existingUser = await db('user_creds').where({ email }).first();
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [user_id] = await db('user_creds').insert({ name, email, password: hashedPassword });
    res.status(201).json({ success: true, user: { user_id, name, email } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating user', error: err.message });
  }
});

app.put('/api/admin/users/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { name, email, password } = req.body;

  try {
    const updateData = { name, email };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    await db('user_creds').where({ user_id }).update(updateData);
    res.json({ success: true, message: 'User updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update user', error: err.message });
  }
});

app.delete('/api/admin/trips/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db('trips').where({ id }).del();
    res.json({ success: true, message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete trip', error: err.message });
  }
});


// =================== SERVER START ===================
const PORT = process.env.PORT || 1833;
app.listen(PORT, () => {
    console.log(`🚀 Server Running on http://localhost:${PORT}`);
});
