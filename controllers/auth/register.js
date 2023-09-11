const { User } = require('../../models');

const register = async (req, res) => {
  const { password, email } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    res.status(409).json({
      message: 'Already exist'
    })
    return;
  }

  const newUser = new User({...req.body});
  newUser.setPassword(password);
  await newUser.save();
  res.status(201).json({
    user: {
      email 
    }
  })
}

module.exports = register;