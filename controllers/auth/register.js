const { User } = require('../../models');

const register = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    res.status(409).json({
      message: `User with email ${email} already exists`
    })
    return;
  }

  const newUser = new User({...req.body});
  newUser.setPassword(password);
  await newUser.save();
  res.status(201).json({
    data: {
      user: {
        email 
      }
    }
  })
}

module.exports = register;