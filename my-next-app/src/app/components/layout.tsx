"use client";

import React from 'react';
import Sidebar from './siderBar';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="d-flex">
      <main className="flex-grow-1 p-4">{children}</main>
    </div>
  );
};

export default Layout;
