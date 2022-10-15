import React, {createContext, useState, useEffect } from 'react'
import jwt_decode from "jwt-decode";
import { useHistory } from 'react-router-dom';

const AuthContext = createContext()

export default AuthContext;

export function AuthProvider({children}) {

    const [authTokens, setAuthTokens] = useState(localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    const [user, setUser] = useState(
      () =>  localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null
    )
    const [loading, setLoading] = useState(true)
    const history = useHistory()

    //login function
    const loginUser = async (e) => {
      e.preventDefault()
      
      let response = await fetch('http://127.0.0.1:8000/api/token/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'username':e.target.username.value, 'password':e.target.password.value})
      })
      
      let data = await response.json()
      // console.log("data...", data)

      if (response.status === 200){
        setAuthTokens(data)
        setUser(jwt_decode(data.access))
        localStorage.setItem('authTokens', JSON.stringify(data))
        history.push('/')
      } else {
        alert("Something went wrong!")
      }
    }

    // logout function
    function logOut(){
      setAuthTokens(null)
      setUser(null)
      localStorage.removeItem('authTokens')
      history.push('/login')
    }

    // Update Token
    const updateToken = async () => {
      console.log("Update token called!")
      let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({'refresh':authTokens.refresh})
      })
      
      let data = await response.json()

      if(response.status === 200){
        setAuthTokens(data)
        setUser(jwt_decode(data.access))
        localStorage.setItem('authTokens', JSON.stringify(data))
      } else {
        logOut()
      }

      if(loading){
        setLoading(false)
      }
    }

    // useEffect to trigger update token function
    useEffect(() => {

      if(loading){
        updateToken()
      }

      let time = 1000*60*4
      let interval = setInterval(()=> {
        if(authTokens){
          updateToken()
        }
      }, time)
      return () => clearInterval(interval)

    }, [loading, authTokens])

    let contextData = {
      authTokens: authTokens,
      user: user,
      loginUser:loginUser,
      logOut: logOut
    }

    return (
      <AuthContext.Provider value={contextData}>
        {loading ? null : children}
      </AuthContext.Provider>
    )
}
