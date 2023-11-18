const bcrypt = require('bcrypt');
const saltRounds = 10;
const password = "VincentSecurePassword123";

bcrypt.hash(password, saltRounds, function(err, hash) {
  if(err) throw err;
  console.log(hash);
});
