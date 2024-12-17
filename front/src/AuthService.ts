class AuthService {
    login = async (email: string, password: string) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/Auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
  
        if (!response.ok) {
          throw new Error("Invalid credentials");
        }
  
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        return data;
        } catch (error: unknown) {
            if (error instanceof Error) {
            throw new Error(error.message || "Login failed");
            } else {
            throw new Error("An unknown error occurred during login");
            }
      }
    };
  
    getToken = () => {
      return localStorage.getItem("token");
    };
  
    isAuthenticated = () => {
      return !!this.getToken();
    };
  
    logout = () => {
      localStorage.removeItem("token");
    };
  }
  
  export default new AuthService();
  