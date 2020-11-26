import React, { useContext, useState } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import "./MenuBar.css";

function MenuBar() {
  const { user, logout } = useContext(AuthContext);
  const pathname = window.location.pathname;
  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);
  const handleItemClick = (e, { name }) => setActiveItem(name);

  const menuBar = user ? (
    <div className="menuBar">
      <Menu pointing secondary size="massive" color="blue">
        <Menu.Item name="Beranda" active as={Link} to="/" />
        <Menu.Menu position="right">
          <Menu.Item name="Keluar" onClick={logout} as={Link} to="/login" />
        </Menu.Menu>
      </Menu>
    </div>
  ) : (
    <div className="menuBar">
      <Menu pointing secondary size="massive" color="blue">
        <Menu.Item
          name="Beranda"
          active={activeItem === "Beranda"}
          onClick={handleItemClick}
          as={Link}
          to="/"
        />
        <Menu.Menu position="right">
          <Menu.Item
            name="Masuk"
            active={activeItem === "Masuk"}
            onClick={handleItemClick}
            as={Link}
            to="/login"
          />
          <Menu.Item
            name="Daftar"
            active={activeItem === "Daftar"}
            onClick={handleItemClick}
            as={Link}
            to="/register"
          />
        </Menu.Menu>
      </Menu>
    </div>
  );

  return menuBar;
}

export default MenuBar;
