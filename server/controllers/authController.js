const User = require('../models/UserModel');
const OtpModel = require('../models/OtpModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const sgMail = require('@sendgrid/mail');

const authCtrl = {};

authCtrl.createUser = async (req, res) => {
  const { username, email, password, phone } = req.body;
  console.log(username, email, password, phone)
  const user = await User.findOne({ $or: [{ username: username }, { email: email }] })
  // if (user) return res.redirect('/register');
  if (user) {
    res.status(500).json({ msg: "User already exists" });
    return
  }

  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new User({ username, email, phone, password: hashedPassword });

    const user = await newUser.save();
    console.log(user)
    res.status(200).json({ msg: "User created successfully" });

  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Something went wrong" })
  }
}

//store it in db or redis cache
//let refreshTokens = [];

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}


authCtrl.userAuth = async (req, res) => {
  const username = req.body.username;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid username or password' });
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(400).json({ msg: 'Invalid username or password' })
    }

    if (user.isBlocked) {
      return res.status(403).json({ msg: "You are Blocked" })
    }

    const { password, ...userInfo } = user._doc;
    console.log(userInfo)

    const accessToken = generateAccessToken({ name: username, role: user.role });
    const refreshToken = jwt.sign({ name: username, role: user.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' });

    res.cookie('access_token', accessToken, { httpOnly: true, maxAge: 1000 * 60 * 15 })
    res.cookie('refresh_token', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 })
    res.status(200).json(userInfo)

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

authCtrl.handleLogin = async (req, res) => {
  const cookies = req.cookies;
  console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ 'message': 'Username and password are required.' });

  try {


    const foundUser = await User.findOne({ username: username }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      // const roles = Object.values(foundUser.roles).filter(Boolean);
      // create JWTs
      const accessToken = jwt.sign(
        {
          "UserInfo": {
            "username": foundUser.username,
            "role": foundUser.role
          }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10s' }
      );
      const newRefreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '1d' }
      );

      // Changed to let keyword
      let newRefreshTokenArray =
        !cookies?.jwt
          ? foundUser.refreshToken
          : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);

      if (cookies?.jwt) {

        /* 
        Scenario added here: 
            1) User logs in but never uses RT and does not logout 
            2) RT is stolen
            3) If 1 & 2, reuse detection is needed to clear all RTs when user logs in
        */
        const refreshToken = cookies.jwt;
        const foundToken = await User.findOne({ refreshToken }).exec();

        // Detected refresh token reuse!
        if (!foundToken) {
          console.log('attempted refresh token reuse at login!')
          // clear out ALL previous refresh tokens
          newRefreshTokenArray = [];
        }

        res.clearCookie('jwt', { httpOnly: true, SameSite: 'None', secure: false });
      }

      // Saving refreshToken with current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      const result = await foundUser.save();
      console.log(result);

      console.log("newRefreshToken", newRefreshToken)

      // Creates Secure Cfalsee with refresh token
      res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: false, SameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
      // res.cookie('jwt', newRefreshToken, { maxAge: 1000 * 60 * 60 * 24 });

      const { password, ...userInfo } = foundUser._doc;

      // Send authorization roles and access token to user
      res.json({ userInfo, accessToken });

    } else {
      res.sendStatus(401);
    }

  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Internal server error" })
  }
}


authCtrl.regenerateToken = async (req, res) => {
  // const refreshToken = req.body.token;
  const refreshToken = req.cookies.refresh_token;
  if (refreshToken == null) return res.sendStatus(401);

  // if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403)

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name, role: user.role });
    res.cookie('access_token', accessToken, { httpOnly: true, maxAge: 1000 * 60 * 15 })

    res.send("access-token regenerated");
  })

}

authCtrl.handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  console.log("cookies", cookies)
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  res.clearCookie('jwt', { httpOnly: true, SameSite: 'None', secure: false });

  try {

    const foundUser = await User.findOne({ refreshToken }).exec();

    // Detected refresh token reuse!
    if (!foundUser) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) return res.sendStatus(403); //Forbidden
          console.log('attempted refresh token reuse!')
          const hackedUser = await User.findOne({ username: decoded.username }).exec();
          hackedUser.refreshToken = [];
          const result = await hackedUser.save();
          console.log(result);
        }
      )
      return res.sendStatus(403); //Forbidden
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

    // evaluate jwt 
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) {
          console.log('expired refresh token')
          foundUser.refreshToken = [...newRefreshTokenArray];
          const result = await foundUser.save();
          console.log(result);
        }
        if (err || foundUser.username !== decoded.username) return res.sendStatus(403);

        console.log("handleRefershDecoded", decoded)

        // Refresh token was still valid
        // const roles = Object.values(foundUser.roles);
        const accessToken = jwt.sign(
          {
            "UserInfo": {
              "username": decoded.username,
              "role": foundUser.role
            }
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: '10s' }
        );

        const newRefreshToken = jwt.sign(
          { "username": foundUser.username },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();

        // Creates Secure Cfalsee with refresh token
        // res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: false, SameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: false, SameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });

        const { password, ...userInfo } = foundUser._doc;

        res.json({ userInfo, accessToken })
      }
    );

  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Internal server error" })
  }
}


// refreshTokens = refreshTokens.filter(token => token !== req.body.token);

authCtrl.logout = async (req, res) => {
  res.clearCookie('access_token');
  res.clearCookie('refresh_token');
  console.log("cookies gone")

  res.sendStatus(204);
}

authCtrl.handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  try {

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) {
      res.clearCookie('jwt', { httpOnly: true, SameSite: 'None', secure: false });
      return res.sendStatus(204);
    }

    // Delete refreshToken in db
    foundUser.refreshToken = foundUser.refreshToken.filter(rt => rt !== refreshToken);;
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt', { httpOnly: true, SameSite: 'None', secure: false });
    res.sendStatus(204);

  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Internal server error" })
  }
}

authCtrl.verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log(token)
  console.log(req.body)

  if (!token) {
    console.log("Unauthorized: Token not provided")
    return res.status(401).json({ msg: "Unauthorized: Token not provided" })
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decodedToken;
    console.log("---------------------------")
    console.log(decodedToken)
    console.log("---------------------------")
    next();
  } catch (error) {
    console.log(error)
    console.log("Unauthorized: Invalid token")
    return res.status(401).json({ msg: "Unauthorized: Invalid token" })
  }

}

authCtrl.tokenVerifier = async (req, res) => {
  console.log(req.user)
  const role = req.user.role;
  res.status(200).json({ role: role, state: true })
}

function generateOTP() {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}

authCtrl.genOtp = async (req, res) => {
  const email = req.body.email;
  console.log(email)
  const user = await User.findOne({ email })
  if (!user) {
    return res.status(404).json({ msg: "You are not registered with us please sign up" })
  }
  const otpExisting = await OtpModel.findOne({ email })
  if (otpExisting) {
    await OtpModel.findByIdAndDelete(otpExisting._id);
  }
  try {
    const OTP = generateOTP();

    const otpDoc = new OtpModel({ email, otp: OTP })
    await otpDoc.save();
    console.log(process.env.SENDGRID_API_KEY)

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: email,
      from: 'abhijithrb91@gmail.com',
      subject: 'Your OTP to change password',
      text: `Your OTP is ${OTP}`,
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })

    res.status(200).json({ msg: 'Otp Sent successfully' })

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Something went wrong' })
  }
}


authCtrl.verifyOtp = async (req, res) => {
  const otp = req.body.otp;
  const email = req.body.email;
  const validOtp = await OtpModel.findOne({ email, otp })
  if (!validOtp) {
    res.status(403).json({ msg: 'Invalid Otp number' })
    return;
  }
  const user = await User.findOne({ email });
  const userId = user._id;
  await OtpModel.findByIdAndDelete(validOtp._id)

  return res.status(200).json({ userId });
}

//Email verification

authCtrl.createOtpForMail = async (req, res) => {
  const email = req.body.email;
  console.log(email)

  const otpExisting = await OtpModel.findOne({ email })
  if (otpExisting) {
    await OtpModel.findByIdAndDelete(otpExisting._id);
  }
  try {
    const OTP = generateOTP();

    const otpDoc = new OtpModel({ email, otp: OTP })
    await otpDoc.save();
    console.log(process.env.SENDGRID_API_KEY)

    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: email,
      from: 'abhijithrb91@gmail.com',
      subject: 'Your OTP to verify Email',
      text: `Your OTP is ${OTP}`,
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })

    res.status(200).json({ msg: 'Otp Sent successfully' })

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Something went wrong' })
  }
}

authCtrl.verifyEmail = async (req, res) => {
  const otp = req.body.otp;
  const email = req.body.email;
  const validOtp = await OtpModel.findOne({ email, otp })
  if (!validOtp) {
    res.status(403).json({ msg: 'Invalid Otp number' })
    return;
  }

  await OtpModel.findByIdAndDelete(validOtp._id)

  return res.status(200).json({ msg: "Email verified" });
}



authCtrl.updatePwd = async (req, res) => {
  const userId = req.params.id;
  const { password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.findByIdAndUpdate(userId, {
      $set: { password: hashedPassword }
    })

    res.status(200).json({ msg: "Password updated" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: "Something went wrong" })
  }
}

const tokenMaker = (res, user) => {
  const { password, ...userInfo } = user._doc;

  const accessToken = generateAccessToken({ name: userInfo.username, role: userInfo.role });
  const refreshToken = jwt.sign({ name: userInfo.username, role: userInfo.role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' })

  res.cookie('access_token', accessToken, { httpOnly: true, maxAge: 1000 * 60 * 15 })
  res.cookie('refresh_token', refreshToken, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 30 })
  res.status(200).json(userInfo)
}

authCtrl.googleAuth = async (req, res) => {
  const { username, email, image } = req.body;
  console.log(username, email, image)

  try {
    const existingUser = await User.findOne({ email: email })
    if (existingUser) {
      const user = existingUser
      return tokenMaker(res, user);
    }

    let newUser;
    const nameRegex = new RegExp(username, "i")
    const nameExists = await User.findOne({ username: { $regex: nameRegex } })
    if (nameExists) {
      newUser = new User({ username: email, email, image, googleUser: true })
    } else {
      newUser = new User({ username, email, image, googleUser: true })
    }

    const user = await newUser.save();
    return tokenMaker(res, user);

  } catch (error) {
    res.status(500).json({ msg: "Something went wrong" })
  }
}

module.exports = authCtrl;