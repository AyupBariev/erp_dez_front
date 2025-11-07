import { NavLink, useNavigate } from "react-router-dom";
import {
    IconReport, IconTruck, IconPhone, IconRefresh,
    IconCash, IconUserDollar, IconChartBar, IconBus,
    IconCalendar, IconUsers, IconChevronLeft, IconChevronRight,
    IconLogout, IconX
} from "@tabler/icons-react";
import { useAuth } from "../../context/AuthContext.tsx";
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Button,
    Typography,
    useTheme
} from "@mui/material";

type SidebarProps = {
    isOpen?: boolean;
    isMobile?: boolean;
    onToggle: () => void;
};

export default function Sidebar({ isOpen = true, isMobile = false, onToggle }: SidebarProps) {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const theme = useTheme();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    const menuItems = [
        { path: "/dashboard", icon: IconChartBar, label: "СВД" },
        { path: "/reports", icon: IconReport, label: "Отчёты на кассу" },
        { path: "/orders", icon: IconTruck, label: "Заказы" },
        { path: "/calls", icon: IconPhone, label: "Записи звонков" },
        { path: "/repeat-requests", icon: IconRefresh, label: "Запрос повтора" },
        { path: "/payouts/aggregators", icon: IconCash, label: "Выплата агрегаторам" },
        { path: "/payouts/si", icon: IconUserDollar, label: "Выплата СИ" },
        { path: "/profit", icon: IconChartBar, label: "Наша прибыль" },
        { path: "/assign-orders", icon: IconBus, label: "Маршрутка" },
        { path: "/schedule", icon: IconCalendar, label: "График работы СИ" },
        { path: "/si-management", icon: IconUsers, label: "Управление СИ" },
    ];

    const sidebarContent = (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.common.white,
                background: 'linear-gradient(180deg, #2c3e50 0%, #34495e 100%)'
            }}
        >
            {/* Заголовок и кнопка закрытия для мобильных */}
            {isMobile && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        p: 2,
                        borderBottom: `1px solid ${theme.palette.divider}`
                    }}
                >
                    <Typography variant="h6" fontWeight="bold">
                        Меню
                    </Typography>
                    <IconButton
                        onClick={onToggle}
                        sx={{ color: theme.palette.common.white }}
                    >
                        <IconX size={20} />
                    </IconButton>
                </Box>
            )}

            {/* Toggle для десктопа */}
            {!isMobile && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                    <IconButton
                        onClick={onToggle}
                        sx={{ color: theme.palette.common.white }}
                        size="small"
                    >
                        {isOpen ? <IconChevronLeft/> : <IconChevronRight/>}
                    </IconButton>
                </Box>
            )}

            {/* Меню навигации */}
            <List sx={{ flexGrow: 1, px: 1 }}>
                {menuItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                        <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                component={NavLink}
                                to={item.path}
                                onClick={isMobile ? onToggle : undefined}
                                sx={{
                                    borderRadius: 1,
                                    '&.active': {
                                        backgroundColor: theme.palette.primary.main,
                                        '&:hover': {
                                            backgroundColor: theme.palette.primary.dark,
                                        },
                                    },
                                    '&:hover': {
                                        backgroundColor: theme.palette.action.hover,
                                    },
                                    color: theme.palette.common.white,
                                    py: 1.5,
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                                    <IconComponent size={20} />
                                </ListItemIcon>
                                {isOpen && (
                                    <ListItemText
                                        primary={item.label}
                                        primaryTypographyProps={{
                                            fontSize: '0.875rem',
                                            fontWeight: 'medium'
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            {/* Кнопка выхода */}
            <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    onClick={handleLogout}
                    startIcon={<IconLogout size={18} />}
                    size={isMobile ? "small" : "medium"}
                    sx={{
                        justifyContent: isOpen ? 'flex-start' : 'center',
                        color: theme.palette.common.white,
                        borderColor: theme.palette.error.main,
                        '&:hover': {
                            borderColor: theme.palette.error.dark,
                            backgroundColor: theme.palette.error.main,
                        }
                    }}
                >
                    {isOpen && "Выйти"}
                </Button>
            </Box>
        </Box>
    );

    // Для мобильных устройств используем Drawer
    if (isMobile) {
        return (
            <Drawer
                anchor="left"
                open={true}
                onClose={onToggle}
                sx={{
                    '& .MuiDrawer-paper': {
                        width: '100%',
                    },
                }}
            >
                {sidebarContent}
            </Drawer>
        );
    }

    // Для десктопа используем фиксированный Sidebar
    return (
        <Box
            sx={{
                width: isOpen ? 220 : 60,
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: theme.zIndex.drawer,
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.enteringScreen,
                }),
                overflow: 'hidden',
            }}
        >
            {sidebarContent}
        </Box>
    );
}