import { useState, useEffect } from 'react';
import Axios from "axios";
import Cookies from "js-cookie";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';
import Profile from "./pages/Profile";
import Auth from './components/Auth';

const App = () => {

  const [emailRegistration, setEmailRegistration] = useState("");
  const [passwordRegistration, setPasswordRegistration] = useState("");

  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");

  const [isAuth, setIsAuth] = useState(false);


  const register = () => {
    Axios.post('http://localhost:3000/api/signup', {
      user:{
      email: emailRegistration, 
      password: passwordRegistration
    }
    }).then((response) => {
      console.log(response);
    });
  };

  function checkAuth() {
    if (localStorage.getItem("token") !== undefined) {
     return setIsAuth(true)
    } else {
      return setIsAuth(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, []);
 


  const login = () => {
    fetch("http://localhost:3000/api/login", {
  method: "post",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    user: {
      email: emailLogin,
      password: passwordLogin,
    },
  }),
})
  .then((res) => {
    if (res.ok) {
      console.log(res.headers.get("Authorization"));
      localStorage.setItem("token", res.headers.get("Authorization"));
      setIsAuth(true)
      return res.json();
    } else {
      return res.text().then((text) => Promise.reject(text));
    }
  })
  .then((json) => console.dir(json))
  .catch((err) => console.error(err));
  };
  
  
  const getArticles = () => {
      fetch("http://localhost:3000/articles", {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          } else if (res.status === "401") {
            throw new Error("Unauthorized Request. Must be signed in.");
          }
        })
        .then((json) => console.dir(json))
        .catch((err) => console.error(err));
    }

    const logout = () => {
      fetch("http://localhost:3000/api/logout", {
        method: "delete",
        headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
        },
      })
      .then((res) => {
        if (res.ok) {
          setIsAuth(false)
          return res.json();
        } else {
          return res.json().then((json) => Promise.reject(json));
        }
      })
      .then((json) => {
        console.dir(json);
      })
      .catch((err) => console.error(err));
    };

  
  const testBearer = () => {
    let cookie = localStorage.getItem("token");
    console.log(cookie)
  }

  return (
    <Router>
    
    <div className="app">
    <Auth />
{isAuth ?
  (
    <div>
    <Link to="/profile">Go to profile</Link>
    <button onClick={logout} > logout </button>
    </div>
  )
  :
  (
    <div className="auth">
        <div className="registration">

          <h1> Registration </h1>

          <label> Email </label>
          <input 
            type="email" 
            onChange={(e) => {
              setEmailRegistration(e.target.value);
            }} 
          />

          <label> Password </label>
          <input 
            type="password" 
            onChange={(e) => {
              setPasswordRegistration(e.target.value);
            }} 
          />

          <button onClick={register} > Register </button>

        </div>
        <div className="login">

          <h1> Login </h1>

          <label> Email </label>
          <input 
            type="email" 
            onChange={(e) => {
              setEmailLogin(e.target.value);
            }} 
          />

          <label> Password </label>
          <input 
            type="password" 
            onChange={(e) => {
              setPasswordLogin(e.target.value);
            }} 
          />

          <button onClick={login} > Login </button>

        </div>
        
      </div>

      
  )
}
    
    <br />
    <hr />
    <br />

    <button onClick={getArticles} >getArticles </button>
    <button onClick={testBearer} >testCookie </button>
    <button onClick={logout} > logout </button>
    
   </div>


 
      <ProtectedRoute
        exact
        path="/profile"
        component={Profile}
        isAuth={isAuth}
      />
   


   </Router>
  )};

export default App;


