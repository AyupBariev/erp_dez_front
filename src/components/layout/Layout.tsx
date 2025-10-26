import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 768); // md breakpoint
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className="page d-flex">
            {/* Sidebar only on desktop */}
            {isDesktop && (
                <Sidebar
                    isOpen={isSidebarOpen}
                    onToggle={() => setSidebarOpen(!isSidebarOpen)}
                />
            )}

            {/* Контент */}
            <div
                className="page-wrapper flex-grow-1"
                style={{
                    marginLeft: isDesktop ? (isSidebarOpen ? 220 : 60) : 0, // 👈 на мобилке всегда 0
                    transition: "margin-left 0.3s",
                }}
            >
                <Navbar onToggleMobileMenu={() => setMobileMenuOpen(true)} />

                {/* Mobile sidebar (шторка сверху) */}
                {!isDesktop && isMobileMenuOpen && (
                    <div
                        className="position-fixed top-0 start-0 w-100 bg-dark text-white shadow-lg"
                        style={{ height: "100%", zIndex: 2000 }} // 👈 растягиваем на всю высоту
                    >
                        <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
                            <span>Меню</span>
                            <button
                                className="btn btn-sm btn-outline-light"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <Sidebar isMobile onToggle={() => setMobileMenuOpen(false)} />
                    </div>
                )}


                <div className="page-body p-3">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
