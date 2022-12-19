import { AppBar, Box, Toolbar, Typography, Button } from "@mui/material";
import { NavLink } from "react-router-dom";
import { getToken } from "../services/LocalStorageServes";
const Navbar = () => {
  const token = getToken("token");
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" color="secondary">
          <Toolbar>
            <Button
              component={NavLink}
              to="/"
              style={({ isActive }) => {
                return { backgroundColor: isActive ? "#6d1b7b" : "" };
              }}
              sx={{ color: "white", textTransform: "none" }}
            >
              Home
            </Button>

            <Button
              component={NavLink}
              to="/contact"
              style={({ isActive }) => {
                return { backgroundColor: isActive ? "#6d1b7b" : "" };
              }}
              sx={{ color: "white", textTransform: "none" }}
            >
              Contact
            </Button>

            {token ? (
              <Button
                component={NavLink}
                to="/dashboard"
                style={({ isActive }) => {
                  return { backgroundColor: isActive ? "#6d1b7b" : "" };
                }}
                sx={{ color: "white", textTransform: "none" }}
              >
                Dashboard
              </Button>
            ) : (
              <Button
                component={NavLink}
                to="/login"
                style={({ isActive }) => {
                  return { backgroundColor: isActive ? "#6d1b7b" : "" };
                }}
                sx={{ color: "white", textTransform: "none" }}
              >
                Login/Registration
              </Button>
            )}
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};

export default Navbar;
