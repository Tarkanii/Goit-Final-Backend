const { User } = require('../../models');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = process.env;

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.comparePasswords(password)) {
    res.status(400).json({
      message: "Wrong email or password"
    })
    return;
  }

  const token = jwt.sign({ id: user._id }, SECRET_KEY);
  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    data: {
      user: {
        email,
        token
      }
    }
  })

}

module.exports = login;