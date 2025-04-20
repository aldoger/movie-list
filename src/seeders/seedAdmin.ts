import user from "../Model/user";
import bcrypt from "bcrypt";

export async function seedAdmin() {
    try {
      const existingAdmin = await user.findOne({ email: "nainggolanben12@gmail.com" });
  
      if (existingAdmin) {
        console.log("Admin already exists. Skipping seeding.");
        return;
      }
  
      const password = "AldoGantengCihuy";
      const salt = bcrypt.genSaltSync(10);
      const hashpassword = bcrypt.hashSync(password, salt);
  
      const adminData = {
        email: "nainggolanben12@gmail.com",
        username: "Geraldo",
        password: hashpassword,
        role: "admin",
        bio: null,
        displayname: null,
      };
  
      const result = await user.create(adminData);
  
      if (result) {
        console.log("Admin created");
      } else {
        console.error("Admin cannot be created");
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(e.message);
      }
    }
  }