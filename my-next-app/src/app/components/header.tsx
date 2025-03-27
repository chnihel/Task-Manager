"use client";

import React, { useEffect, useState } from "react";

const Header = () => {
  const [data, setData] = useState<{ profile?: string }>({});
  const fetchPhoto=async(id:string)=>{
    try {
      const response=await fetch(`http://localhost:3000/user/${id}`)
      if (!response.ok) {
        throw new Error("error");
      }
      const data = await response.json();
      setData(data.data)
      //console.log('data of user',data.data)
    } catch (error) {
       console.error("Erreur lors de la récupération user:", error);
    }
  }

  useEffect(()=>{
     const localDtorageData=localStorage.getItem('user')
     const userData=localDtorageData?JSON.parse(localDtorageData):null
     //console.log('userData in header',userData.user)
    // const profileUser=userData.user.profile 
    // console.log('profileUser',profileUser)
    if (userData && userData.user) {
      console.log('userData in header', userData.user);
      fetchPhoto(userData.user._id);
    } else {
      console.log('no user connected');
    }
   
  },[])
  return (
    <header className=" bg-danger-subtle fixed-header mb-5">
      <div className="container d-flex justify-content-between align-items-center p-3">
      <h1 className="title fs-1 ms-5 title-header" >TodoList</h1>
      <img 
        src={data.profile ? `http://localhost:3000/file/${data.profile}` : "/avatar.jpg"}  alt="Avatar"
        width={40} 
        height={40} 
        className="rounded-circle border border-white"
      />
      </div>
    </header>
  );
};

export default Header;
