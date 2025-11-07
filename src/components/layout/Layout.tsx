import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { Box, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { IconMenu2 } from "@tabler/icons-react";

export default function Layout() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    useEffect(() => {
        if (isDesktop && isMobileMenuOpen) {
            setMobileMenuOpen(false);
        }
    }, [isDesktop, isMobileMenuOpen]);

    return (
        <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
            {/* Sidebar для десктопа */}
            {isDesktop && (
                <Sidebar
                    isOpen={isSidebarOpen}
                    onToggle={() => setSidebarOpen(!isSidebarOpen)}
                />
            )}

            {/* Основной контент */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    marginLeft: isDesktop ? (isSidebarOpen ? '220px' : '60px') : 0,
                    transition: theme.transitions.create('margin-left', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                    height: '100%',
                    overflow: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Кнопка открытия мобильного меню */}
                {!isDesktop && (
                    <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
                        <IconButton
                            onClick={() => setMobileMenuOpen(true)}
                            size="small"
                        >
                            <IconMenu2 size={20} />
                        </IconButton>
                    </Box>
                )}

                {/* Мобильное меню */}
                {!isDesktop && isMobileMenuOpen && (
                    <Sidebar
                        isMobile
                        isOpen={true}
                        onToggle={() => setMobileMenuOpen(false)}
                    />
                )}

                {/* Контент страницы */}
                <Box sx={{ flexGrow: 1 }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
}