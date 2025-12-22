import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { toast } from "react-toastify";

const UserAuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const { user, checkAuth, isLoading } = useAuthStore();

  useEffect(() => {
    const verifyUser = async () => {
      // If user already exists and is a regular user, skip check
      if (user?.role === "user") return;

      // First check if user is authenticated
      const authResult = await checkAuth();

      if (!authResult.success) {
        navigate("/");
        toast.error("Please sign in to access this page.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        return;
      }

      // Check user role after checkAuth
      const { user: updatedUser } = useAuthStore.getState();
      if (updatedUser?.role !== "user") {
        navigate("/");
        toast.error("Please sign in to access this page.", {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        return;
      }
    };

    // Only verify if user is not a regular user
    if (!user || user?.role !== "user") {
      verifyUser();
    }
  }, [user, checkAuth, navigate]);

  // Show loading while checking
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  // Only show children if user is a regular user
  if (user?.role === "user") {
    return <>{children}</>;
  }

  // Don't show anything if not a regular user (will redirect)
  return null;
};

export default UserAuthWrapper;
