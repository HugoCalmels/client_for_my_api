import { useState } from 'react';
import Axios from "axios";

const App = () => {

  const [emailRegistration, setEmailRegistration] = useState("");
  const [passwordRegistration, setPasswordRegistration] = useState("");

  const [emailLogin, setEmailLogin] = useState("");
  const [passwordLogin, setPasswordLogin] = useState("");

  const [isAuthenticated, setIsAuthenticated] = useState(false);


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
      setIsAuthenticated(true)
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
          } else if (res.status == "401") {
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
          setIsAuthenticated(false)
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


  return (
    <div className="app">

{isAuthenticated ?
  (

    <button onClick={logout} > logout </button>
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

   </div>
  )};

export default App;


