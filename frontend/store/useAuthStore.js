import { create } from 'zustand';
import { axiosInstance } from '../utils/axiosInstance.js';

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
        console.log("Signing up with data:", userData);
        set({ isSigningUp: true });
        
        try {
            const res = await axiosInstance.post("/auth/signup", userData);
            set({
                authUser: res.data,
                isLoggedIn: true,
            });
        } catch (error) {
            console.error("Error in signup:", error);
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
		} catch (error) {
			console.error("Error in login:", error);
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
		} catch (error) {
			console.error("Error in logout:", error);
		}
	},
}));

export default useAuthStore;