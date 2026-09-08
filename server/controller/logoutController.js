import { query } from "../config/database.js";


 export const LogOut = async (req, res) => {
  try {
    req.session.destroy((err) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Unable to logout"
      });
    }

    res.clearCookie("connect.sid");
    res.json({
      success: true,
      message: "Logout successful!"
    })
  });
} catch (error) {
   console.log("Logout failed", error);
   res.json({
    success: false,
    message: "Logout failed"
   })
}
 }

 