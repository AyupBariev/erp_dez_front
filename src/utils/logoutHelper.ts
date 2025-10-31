export const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    // мгновенный редирект
    window.location.href = "/login";
};
