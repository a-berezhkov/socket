const UserService = require("../service/UserService");
const bcrypt = require("bcrypt");
const generateTokens = require("../utils/generateTokens");
const jwtConfig = require("../config/jwtConfig");

const authorization = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email.trim() === "" || password.trim() === "") {
      return res.status(400).json({ message: "Empty" });
    }

    const user = (await UserService.getUserByEmail(email)).get();
    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      const { accessToken, refreshToken } = generateTokens({ user });

      res
        .status(200)
        .cookie(jwtConfig.refresh.type, refreshToken, {
          httpOnly: true,
          maxAge: jwtConfig.refresh.expiresIn,
        })
        .json({ accessToken, user });
    } else {
      return res.status(400).json({ message: "In correct!" });
    }
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: error.message });
  }
};

const registration = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
      return res.status(400).json({ message: "Empty" });
    }

    const userInDb = await UserService.getUserByEmail(email);

    if (userInDb) {
      return res.status(400).json({ message: "User is already exist" });
    } else {
      const user = (
        await UserService.createUser({
          name,
          email,
          password: await bcrypt.hash(password, 10),
        })
      ).get();

      const { accessToken, refreshToken } = generateTokens({ user });

      res
        .status(201)
        .cookie(jwtConfig.refresh.type, refreshToken, {
          httpOnly: true,
          maxAge: jwtConfig.refresh.expiresIn,
        })
        .json({ accessToken, user });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie(jwtConfig.refresh.type).json({ accessToken: "" });
};

module.exports = { authorization, registration, logout };
