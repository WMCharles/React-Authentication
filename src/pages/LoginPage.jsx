import React, { useContext } from 'react'
import AuthContext from '../context/AuthContext'

export default function LoginPage() {
    let { loginUser } = useContext(AuthContext)
    return (
        <div>
            <form onSubmit={ loginUser }>
                <input type="text" name='username' placeholder='enter username' />
                <input type="text" name="password" id="password" placeholder='enter password' />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}
