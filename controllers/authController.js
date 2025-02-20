// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');
// const nodemailer = require('nodemailer');
// const db = require('../db');

// // Helper to handle errors
// const handleError = (res, statusCode, message) => {
//   return res.status(statusCode).json({ message });
// };

// // Register User
// const registerUser = async (req, res) => {
//   let { firstName, lastName, vehicleName, userName, email, password } = req.body;
//   console.log(req.body);
//   console.log(userName);
//   firstName = firstName.trim();
//   firstName = firstName.trim();
//   lastName = lastName.trim();
//   vehicleName = vehicleName.trim();
//   userName = userName.trim();
//   email = email.trim();
//   password = password.trim();

//   if (!firstName || !lastName || !vehicleName || !userName || !email || !password) {
//     return handleError(res, 400, 'All fields are required');
//   }

//   try {
//     const [existingUser] = await db.execute(
//       'SELECT * FROM users WHERE userName = ? OR email = ?',
//       [userName, email]
//     );

//     if (existingUser.length > 0) {
//       return handleError(res, 400, 'User already exists with this username or email');
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const [result] = await db.execute(
//       'INSERT INTO users (firstName, lastName, vehicleName, userName, email, password) VALUES (?, ?, ?, ?, ?, ?)',
//       [firstName, lastName, vehicleName, userName, email, hashedPassword]
//     );

//     return res.status(201).json({
//       message: 'User registered successfully',
//       userId: result.insertId,
//     });
//   } catch (error) {
//     console.error('Error registering user:', error.message);
//     return handleError(res, 500, 'Internal server error');
//   }
// };

// // Login User
// const loginUser = async (req, res) => {
//   const { userName, password } = req.body;

//   if (!userName || !password) {
//     return handleError(res, 400, 'Username and password are required');
//   }

//   try {
//     const [result] = await db.execute('SELECT * FROM users WHERE userName = ?', [userName]);

//     if (result.length === 0) {
//       return handleError(res, 400, 'User not found');
//     }

//     const user = result[0];
//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       return handleError(res, 400, 'Invalid password');
//     }

//     const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     return res.json({
//       token,
//       message: 'Login successful',
//     });
//   } catch (error) {
//     console.error('Error during login:', error.message);
//     return handleError(res, 500, 'Internal server error');
//   }
// };

// // Get Profile
// const getProfile = async (req, res) => {
//   const userId = req.user?.userId;

//   if (!userId) {
//     return handleError(res, 400, 'User ID is missing');
//   }

//   try {
//     const [result] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);

//     if (result.length === 0) {
//       return handleError(res, 404, 'User not found');
//     }

//     return res.json(result[0]);
//   } catch (error) {
//     console.error('Error fetching profile:', error.message);
//     return handleError(res, 500, 'Internal server error');
//   }
// };

// // Update Profile
// const updateProfile = async (req, res) => {
//   const userId = req.user?.userId;
//   const { firstName, lastName, email, userName, vehicleName } = req.body;

//   if (!userId || !email || !userName) {
//     return handleError(res, 400, 'Missing required fields');
//   }

//   try {
//     const [result] = await db.execute(
//       'UPDATE users SET firstName = ?, lastName = ?, email = ?, userName = ?, vehicleName = ? WHERE id = ?',
//       [firstName || null, lastName || null, email, userName, vehicleName || null, userId]
//     );

//     if (result.affectedRows === 0) {
//       return handleError(res, 404, 'User not found');
//     }

//     return res.json({ message: 'Profile updated successfully' });
//   } catch (error) {
//     console.error('Error updating profile:', error.message);
//     return handleError(res, 500, 'Internal server error');
//   }
// };

// // Forgot Password
// // Forgot Password
// const forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ message: 'Email is required' });
//   }

//   try {
//     const [result] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

//     if (result.length === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const token = jwt.sign({ id: result[0].id, email }, process.env.JWT_SECRET, {
//       expiresIn: process.env.RESET_TOKEN_EXPIRY || '1h',
//     });

//     const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: process.env.SMTP_USER,
//       to: email,
//       subject: 'Password Reset',
//       html: ` <p>Dear Customer,<br><br>
//               We received a request to reset the password for your ChargeX account. If you made this request, please click the link below to reset your password:,<br>
//               <a href="${resetLink}" class="btn">Reset Your Password</a>
//               The chargeX Support Team<br><br>
//               ---<br>
//               chargeX | Customer Support<br>
//               Email: <a href="mailto:support@chargeX.com">support@chargeX.com</a>
//           </p>`,
//     });

//     return res.status(200).json({ message: 'Password reset link sent to email' });
//   } catch (error) {
//     console.error('Error in forgotPassword:', error.message);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };


// // Reset Password
// const resetPassword = async (req, res) => {
//   const { token, password } = req.body;

//   if (!token || !password) {
//     return res.status(400).json({ message: 'Token and new password are required' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const [result] = await db.execute(
//       'UPDATE users SET password = ? WHERE id = ?',
//       [hashedPassword, decoded.id]
//     );

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     return res.status(200).json({ message: 'Password reset successful' });
//   } catch (error) {
//     console.error('Error in resetPassword:', error.message);
//     if (error.name === 'TokenExpiredError') {
//       return res.status(400).json({ message: 'Token has expired' });
//     }
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };


// module.exports = {
//   registerUser,
//   loginUser,
//   getProfile,
//   updateProfile,
//   forgotPassword,
//   resetPassword,
// };



const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const User = require('../models/Users'); // Import MongoDB User model

// Helper to handle errors
const handleError = (res, statusCode, message) => {
  return res.status(statusCode).json({ message });
};

// Register User
const registerUser = async (req, res) => {
  let { firstName, lastName, vehicleName, userName, email, password } = req.body;
  console.log(req.body);
  console.log(userName);
  firstName = firstName.trim();
  lastName = lastName.trim();
  vehicleName = vehicleName.trim();
  userName = userName.trim();
  email = email.trim();
  password = password.trim();

  if (!firstName || !lastName || !vehicleName || !userName || !email || !password) {
    return handleError(res, 400, 'All fields are required');
  }

  try {
    const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
    if (existingUser) {
      return handleError(res, 400, 'User already exists with this userName or email');
    }

    const newUser = new User({ firstName, lastName, vehicleName, userName, email, password});
    await newUser.save();

    return res.status(201).json({
      message: 'User registered successfully',
      userId: newUser._id,
    });
  } catch (error) {
    console.error('Error registering user:', error.message);
    return handleError(res, 500, 'Internal server error');
  }
};

// Login User
const loginUser = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ message: "userName and password are required" });
  }

  try {
    // Find user by userName
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    console.log("User Found:", user); // Debugging line

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password matched", isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    return res.json({ token, message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  const userId = req.user?.userId;
  if (!userId) {
    return handleError(res, 400, 'User ID is missing');
  }

  try {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return handleError(res, 404, 'User not found');
    }
    return res.json(user);
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    return handleError(res, 500, 'Internal server error');
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  const userId = req.user?.userId;
  const { firstName, lastName, email, userName, vehicleName } = req.body;

  if (!userId || !email || !userName) {
    return handleError(res, 400, 'Missing required fields');
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, email, userName, vehicleName },
      { new: true }
    );

    if (!updatedUser) {
      return handleError(res, 404, 'User not found');
    }

    return res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error.message);
    return handleError(res, 500, 'Internal server error');
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, {
      expiresIn: process.env.RESET_TOKEN_EXPIRY || '1h',
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Password Reset',
      html: `<p>Dear Customer,<br><br> We received a request to reset your ChargeX password.<br>
            Click <a href="${resetLink}">here</a> to reset your password.<br>
            The chargeX Support Team</p>`
    });

    return res.status(200).json({ message: 'Password reset link sent to email' });
  } catch (error) {
    console.error('Error in forgotPassword:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error in resetPassword:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Token has expired' });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile, forgotPassword, resetPassword };
