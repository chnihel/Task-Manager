"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Login = () => {
    interface User {
        email: string;
        password: string;
      }
      const router = useRouter();
      const [data, setData] = useState<User>({
        email: '',
        password: '',
      });
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData({
          ...data,
          [name]: value,
        });
      };

      const SignIn = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        try {
          const response = await fetch('http://localhost:3000/auth/signIn', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
    
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("user", JSON.stringify(data));
            alert('login successfully!');
            console.log(data);
            router.push("/");
            localStorage.setItem('user',JSON.stringify(data))
    
          } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
          }
        } catch (err) {
          console.error('Signin error:', err);
          alert('An error occurred while login in the account.');
        }
      };
  return (
    <div>
       <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg rounded" style={{ width: "400px" }}>
        <h2 className="text-center mb-4 text-primary">Login</h2>
        <form onSubmit={SignIn}>

          <div className="mb-3">
            <label className="form-label">Email</label><br />
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Entrez votre email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mot de passe</label><br />
            <input
              type="password"
              onChange={handleChange}
              name="password"
              placeholder="Entrez votre mot de passe"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            signIn
          </button>
        </form>
      </div>
    </div>
    </div>
  )
}

export default Login
