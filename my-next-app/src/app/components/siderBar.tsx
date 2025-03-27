"use client";

import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import Link from "next/link";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Bouton "Menu" avec l'icône */}
      <div className="menu-toggle" style={{width:200}} onClick={() => setIsOpen(!isOpen)}>
        <FaBars size={24} />
        <span className="ms-2">Menu</span>
      </div>

      {/* Sidebar (affichée uniquement si isOpen est true) */}
      {isOpen && (
        <div className="sidebar">
          <ul className="nav flex-column p-3">
            <li className="nav-item">
              <Link className="nav-link text-white" href="/">🏠 Accueil</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" href="/about">📖 À Propos</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-white" href="/contact">📞 Contact</Link>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default Sidebar;
