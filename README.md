# Ideafloats_Intern
2nd day work

Code for creating google search frontend page :

#HTML CODE:

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Google Clone</title>
<link rel="stylesheet" href="index.css">
<link rel="icon" href="https://www.google.com/favicon.ico">
</head>
<body>

<header class="header">
  <div class="left">
    <a href="#">About</a>
    <a href="#">Store</a>
  </div>

  <div class="right">
    <a href="#">Gmail</a>
    <a href="#">Images</a>

    <img class="apps"
      src="https://www.gstatic.com/images/icons/material/system/1x/apps_black_24dp.png">

    <button class="signin">Sign in</button>
  </div>
</header>


<main class="main">

  <img class="logo" 
  src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
  alt="Google">

  <div class="search-box">
    <span>+</span>
    <input type="text">
    <div class="icons">
      <img src="https://www.gstatic.com/images/icons/material/system/2x/mic_black_24dp.png">
      <img src="https://www.gstatic.com/images/icons/material/system/2x/photo_camera_black_24dp.png">
      <button>AI Mode</button>
    </div>
  </div>

  <div class="buttons">
    <button>Google Search</button>
    <button>I'm Feeling Lucky</button>
  </div>

  <p class="languages">
    Google offered in:
    <a href="#">हिन्दी</a>
    <a href="#">বাংলा</a>
    <a href="#">తెలుగు</a>
    <a href="#">मराठी</a>
    <a href="#">தமிழ்</a>
    <a href="#">ગુજરાતી</a>
    <a href="#">ಕನ್ನಡ</a>
    <a href="#">മലയാളം</a>
    <a href="#">ਪੰਜਾਬੀ</a>
  </p>

</main>

<footer>
  <div class="india">India</div>

  <div class="footer-bottom">
    <div class="f-left">
      <a href="#">Advertising</a>
      <a href="#">Business</a>
      <a href="#">How Search works</a>
    </div>

    <div class="f-right">
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
      <a href="#">Settings</a>
    </div>
  </div>
</footer>

</body>
</html>

#CSS CODE:

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
  font-family:Arial, sans-serif;
}

body{
  min-height:100vh;
  display:flex;
  flex-direction:column;
}

.header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding: 8px 26px;  
  font-size: 14px;
  justify-content: space-between;
}

.left a{
  margin-right: 12px;  
  text-decoration:none;
  color:#000;
  padding-right: 3px;
}

.right{
  display:flex;
  align-items:center;
  margin-right: -12px;
}

.right a{
  margin-right: 12px;   
  text-decoration:none;
  color:#000;
}

.apps{
  width: 20px;
  margin: 0 6px;       
  cursor:pointer;
  padding: -50px;
}

.signin{
  background:#1a73e8;
  color:white;
  border:none;
  padding: 12px 20px; 
  border-radius: 20px;
  font-size: 14px;
  cursor:pointer;
  
}
.main{
  flex:1;
  display:flex;
  flex-direction:column;
  align-items:center;
  margin-top:24px;
}


.logo{
  width:270px;
  margin-bottom:25px;
  
}


.search-box{
  width: 700px;
  height:50px;
  border:1px solid #dfe1e5;
  border-radius:24px;
  display:flex;
  align-items:center;
  padding:0 16px;
  box-shadow: 0 1px 6px rgba(32,33,36,.28);
  transition: box-shadow;

}


.search-box span{
  font-size: 30px;   
  font-weight: 400;
  margin-right: 8px;
  color:#5f6368;
}

.search-box input{
  flex:1;
  border:none;
  outline:none;
  font-size:14px;
}


.icons{
  font-size:30px;
  display:flex;
  align-items:center;
  gap:12px;
}

.icons img{
  width:23px;
  cursor:pointer;
  margin-left: 8px;
}

.icons button{
  border:none;
  border-radius:16px;
  padding:7px 19px;
  background:#dfe1e54d;
}

.buttons{
  margin-top:29px;
  margin-bottom:50px;

}

.buttons button{
  margin:0 6px;
  padding:10px 16px;
  border:none;
  background:#f8f9fa;
  border-radius:3px;
  cursor:pointer;
  box-shadow: 0 1px 6px rgba(83, 84, 87, 0.28);
}

.buttons{
  margin-top: 28px;
  margin-bottom: 32px;
  display: flex;
  gap: 10px;          
}

/*.buttons button{
  padding: 10px 18px;
  border: 1px solid #f1f3f4;   
  background: #f8f9fa;         
  font-size: 14px;
  border-radius: 6px;          /
  cursor: pointer;
}*/

.buttons button:hover{
  border: 1px solid #dadce0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.languages{
  margin-top: 20px;
  margin-bottom: 30px;
  font-size:13px;
  text-align:center;
  word-spacing:0px;
 
}

.languages a{
  margin-left:0px;
  margin-right:0;
  text-decoration:none;
  color:#1a0dab;
}


footer{
  background:#f2f2f2;
}

.india{
  padding: 15px 30px;
  border-bottom:1px solid #dadce0;
  font-size:15px;
  color:#343536;
}

.footer-bottom{
  display:flex;
  justify-content:space-between;
  align-items:center;
  padding: 14px 20px;
  padding-right: 34px;
}

.footer-bottom a{
  margin-right:9px;
  text-decoration:none;
  color:#2a2b2c;
  font-size:14px;
  padding-left: 16px;
  /* padding-right: 8px; */

}

.footer-bottom a:last-child{
  margin-right:2px;
}
   



