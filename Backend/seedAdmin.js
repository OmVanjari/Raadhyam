import User from "./models/users.js";
import bcrypt from "bcryptjs";

const seedAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@athenura.com" });
    
    if (existingAdmin) {
      console.log("Admin user already exists");
      return;
    }
    
    // Hash the password
    const hashedPassword = await bcrypt.hash("admin@athenura2025", 10);
    
    // Create admin user
    const admin = await User.create({
      email: "admin@athenura.com",
      username: "admin",
      password: hashedPassword,
      role: "admin",
      name: "Admin",
      status: "Active"
    });
    
    console.log("Admin user created successfully:", admin.email);
  } catch (error) {
    console.error("Error seeding admin:", error);
    throw error;
  }
};

export default seedAdmin;
