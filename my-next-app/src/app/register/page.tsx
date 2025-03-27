"use client"
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Register = () => {
    interface User {
        name: string;
        email: string;
        password: string;
        profile:string
      }
      const [data,setData]=useState<User>({
        name:'',
        email:'',
        password:"",
        profile:""
      })
      const router = useRouter();
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData({
          ...data,
          [name]: value,
        });
      };
      const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setData({
          ...data,
          [e.target.name]:file
        });
      };
      const SignUp = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault(); 
        try {
          const formData=new FormData()
          formData.append('name',data.name)
          formData.append('email',data.email)
          formData.append('password',data.password)
          formData.append('profile',data.profile)

          const response = await fetch('http://localhost:3000/user', {
            method: 'POST',
            body: formData,
          });
    
          if (response.ok) {
            const data = await response.json();
            alert('Account created successfully!');
            console.log(data);
            router.push("/login");
          } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
          }
        } catch (err) {
          console.error('Signup error:', err);
          alert('An error occurred while creating the account.');
        }
      };
  return (
    <div>
       <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg rounded" style={{ width: "400px" }}>
        <h2 className="text-center mb-4 text-primary">Register</h2>
        <form onSubmit={SignUp}>
          <div className="mb-3">
            <label className="form-label">Nom</label><br />
            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="Entrez votre nom"
            />
          </div>

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
          <div className="mb-3">
            <label className="form-label">Your Profile</label><br />
            <input
              type="file"
              onChange={handleImageChange}
              name="profile"
              placeholder="choose file"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            signUp
          </button>
        </form>
      </div>
    </div>
    </div>
  )
}

export default Register
