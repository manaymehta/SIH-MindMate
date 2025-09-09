import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
	authUser: null,
	isLoggingIn: false,
	isLoggedIn: false,
	isCheckingAuth: true,
    isSigningUp: false,
	checkAuth: async () => {
		try {
			const res = await axiosInstance.get("/auth/check");
			set({
				authUser: res.data,
				isLoggedIn: true,
			});
		} catch (error) {
			console.error("Error in checkAuth:", error);
			set({
				authUser: null,
				isLoggedIn: false,
			});
		} finally {
			set({ isCheckingAuth: false });
		}
	},

    signup: async (userData) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", userData);
            set({
                authUser: res.data,
                isLoggedIn: true,
            });
            toast.success("Account created successfully!");
        } catch (error) {
            console.error("Error in signup:", error);
            toast.error(error.response?.data?.message || "An error occurred during sign up.");
            set({
                authUser: null,
                isLoggedIn: false,
            });
        } finally {
            set({ isSigningUp: false });
        }
    },

	login: async (userData) => {
		set({ isLoggingIn: true });
		try {
			const res = await axiosInstance.post("/auth/login", userData);
			set({
				authUser: res.data,
				isLoggedIn: true,
			});
			toast.success("Logged in successfully");
		} catch (error) {
			console.error("Error in login:", error);
			toast.error(error.response?.data?.message || "Invalid credentials.");
			set({
				authUser: null,
				isLoggedIn: false,
			});
		} finally {
			set({ isLoggingIn: false });
		}
	},

	logout: async () => {
		try {
			await axiosInstance.post("/auth/logout");
			set({
				authUser: null,
				isLoggedIn: false,
			});
			toast.success("Logged out successfully");
		} catch (error) {
			console.error("Error in logout:", error);
			toast.error(error.response?.data?.message || "An error occurred during logout.");
		}
	},
}));

export default useAuthStore;