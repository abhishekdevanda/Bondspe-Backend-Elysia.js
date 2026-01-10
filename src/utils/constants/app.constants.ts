const getAppBaseUrl = () => {
    if (process.env.BASE_URL) return process.env.BASE_URL;
    
    if (process.env.NODE_ENV === "production") {
        throw new Error("BASE_URL is not defined");
    }
    
    return "http://localhost:3000";
};

export const APP_BASE_URL = getAppBaseUrl();
