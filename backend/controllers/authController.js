
const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next) => {
    const { email } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
        return next(new ErrorResponse("E-mail already registred", 400));
    }
    try {
        const user = await User.create(req.body);
        res.status(201).json({
            success: true,
            user
        })
    } catch (error) {
        next(error);
    }
}

/*
exports.signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        //validation
        if (!email) {
            return next(new ErrorResponse("please add an email", 403));
        }
        if (!password) {
            return next(new ErrorResponse("please add a password", 403));
        }

        //check user email
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorResponse("invalid credentials", 400));
        }

        console.log('user$$')
        console.log(user)
        //check password
        const isMatched = await user.comparePassword(password);
        if (!isMatched) {
            return next(new ErrorResponse("invalid credentials password", 400));
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
}
*/

exports.signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(403).json({ error: "Please add email and password" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials" });
        }

        console.log('User:', user);  // Debugging output
        const isMatched = await user.comparePassword(password);
        console.log('Password match:', isMatched, "Password :" , password);  // Debugging output
        if (!isMatched) {
            return res.status(400).json({ error: "Invalid credentials password" });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error('Sign in error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


const sendTokenResponse = async (user, codeStatus, res) => {
    const token = await user.getJwtToken();
    const options = { maxAge: 60 * 60 * 1000, httpOnly: true }
    if (process.env.NODE_ENV === 'production') {
        options.secure = true
    }
    res
        .status(codeStatus)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            id: user._id,
            role: user.role
        })
        console.log(user, codeStatus, res);
}

//log out
exports.logout = (req, res, next) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "logged out"
    })
}


//user profile
exports.userProfile = async (req, res, next) => {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({
        success: true,
        user
    })
}



exports.updateUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    const userId = req.user.id;

    try {
        // Eğer şifre gönderildiyse, hashleme işlemi yap
        let updatedFields = {
            name,
            email
        };

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedFields.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(userId, updatedFields, { new: true });

        // Yeni bir JWT token oluştur
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        // HTTP-only cookie olarak token'ı gönder
        const cookieOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        if (process.env.NODE_ENV === 'production') {
            cookieOptions.secure = true;
        }

        res.status(200)
           .cookie('token', token, cookieOptions)
           .json({
               success: true,
               token,
               data: user
           });

    } catch (error) {
        next(new ErrorResponse('User update failed', 500));
    }
};

exports.showUsers = async (req, res, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        // Kullanıcıyı veritabanından sil
        await User.findByIdAndRemove(req.params.id);

        // Başarılı yanıtı gönder
        res.status(200).json({
            success: true,
            message: "User deleted"
        });
    } catch (error) {
        // Hata durumunda error handling middleware'e ilet
        next(error);
    }
};


exports.createUser = async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      // Kullanıcı var mı diye kontrol et
      let user = await User.findOne({ email });
  
      if (user) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      // Şifreyi hashle
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Yeni kullanıcı objesi oluştur
      user = new User({
        name,
        email,
        password: hashedPassword,
      });
      console.log("user:", user)
  
      // Kullanıcıyı veritabanına kaydet
      await user.save();
  
      // JWT token oluştur
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(201).json({ message: 'User created successfully', token });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  async function testPassword() {
    const password = 'test1234';  // Test şifresi
    const hashedPassword = await bcrypt.hash(password, 10);  // Şifreyi hash'le

    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('Password match:', isMatch);  // Doğrulama sonucunu yazdır
}

testPassword();
/*
exports.updateUser2 = async (req, res, next) => {
    const { name, email, password, role } = req.body;
    const userId = req.user.id; // Bu kısmı isteğe bağlı olarak değiştirebilirsiniz, adminin kendi ID'si gibi

    try {
        let updatedFields = {
            name,
            email,
            role // Yeni eklendi: Kullanıcının rolünü güncelle
        };

        if (password) {
            const salt = await bcrypt.genSalt(10);
            updatedFields.password = await bcrypt.hash(password, salt);
        }

        const user = await User.findByIdAndUpdate(userId, updatedFields, { new: true });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE,
        });

        const cookieOptions = {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
            httpOnly: true
        };

        if (process.env.NODE_ENV === 'production') {
            cookieOptions.secure = true;
        }

        res.status(200)
           .cookie('token', token, cookieOptions)
           .json({
               success: true,
               token,
               data: user
           });

    } catch (error) {
        next(new ErrorResponse('User update failed', 500));
    }
};

*/


exports.updateUser2 = async (req, res) => {
    const { id } = req.params; // URL parametresinden kullanıcı ID'si
    let { name, email, password, role } = req.body;

    try {
        // Şifreyi hash'leme
        if (password) {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            id, 
            { name, email, password, role },
            { new: true, runValidators: true }  // runValidators seçeneği model düzeyinde belirlenen doğrulamaları çalıştırır.
        );

        res.status(200).json({
            message: 'User updated successfully',
            updatedUser
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};