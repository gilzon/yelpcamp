const User = require('../models/user');

const homePage = (req,res)=>{
    res.render('users/home')
 }


const  registerForm = (req,res)=>{
    res.render('users/register')
}

const createAccount = async (req,res)=>{
    try{
    const {email,username, password} = req.body ;
    const  user = new User({email, username});
    const registeredUser = await User.register(user,password);
    req.logIn(registeredUser,err=>{
        if(err) return next (err); 
        req.flash('success','Welcome to Yelp Camp');
    res.redirect('/campgrounds');
    }) 

   }
    catch(e){
        req.flash('error',(e.message))
        res.redirect('register')
    }

 }

 const loginForm = (req,res)=>{
    res.render('users/login')
}

const login = (req,res)=>{
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    delete req.session.returnTo;
    req.flash('success','welcome back');
    res.redirect(redirectUrl)

}

const logout = (req,res,next)=>{
    req.logOut(function(err){
        if (err){
            return next(err)
        }
   
    req.flash('success','logged out');
    res.redirect('/campgrounds');
 });
}

module.exports = {
    registerForm,
    createAccount,
    loginForm,
    login,
    logout,
    homePage

}