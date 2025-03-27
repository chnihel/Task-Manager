import { FaFacebook, FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-danger-subtle">
      <div className="d-flex flex-wrap justify-content-between align-items-center p-3 container">
        <h1 className="title fs-1">TodoList</h1>
        <h3>© 2024 Tekandme. All Rights Reserved</h3>
        <div className="icons d-flex">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FaFacebook size={24} color="black" />
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={24} color="black" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <FaTwitter size={24} color="black" />
          </a>
          <a href="https://www.github.com" target="_blank" rel="noopener noreferrer">
            <FaGithub size={24} color="black" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
