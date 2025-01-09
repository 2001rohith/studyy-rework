export const signupValidation = (name, email, phone, password) => {
    const errors = {};
  
    if (!name.trim()) {
      errors.name = "Enter the name";
    } else if (name.trim().length < 2) {
      errors.name = "Too short for name";
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = "Enter the email";
    } else if (!emailRegex.test(email.trim())) {
      errors.email = "Enter a valid email";
    }
  
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone.trim()) {
      errors.phone = "Enter the phone number";
    } else if (!phoneRegex.test(phone.trim())) {
      errors.phone = "Phone number is not valid";
    }
  
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!password.trim()) {
      errors.password = "Enter the password";
    } else if (!passwordRegex.test(password.trim())) {
      errors.password = "Password must be at least 6 characters long, contain at least 1 uppercase letter, 1 lowercase letter, and 1 number";
    }
  
    return errors;
  };
  