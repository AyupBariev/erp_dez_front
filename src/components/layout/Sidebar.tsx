import {NavLink, useNavigate} from "react-router-dom";
import {
    IconReport, IconTruck, IconPhone, IconRefresh,
    IconCash, IconUserDollar, IconChartBar, IconBus,
    IconCalendar, IconUsers, IconChevronLeft, IconChevronRight, IconLogout
} from "@tabler/icons-react";
import {useAuth} from "../../context/AuthContext.tsx";

type SidebarProps = {
    isOpen?: boolean;
    isMobile?: boolean;
    onToggle: () => void;
};

export default function Sidebar({ isOpen = true, isMobile = false, onToggle }: SidebarProps) {
    const linkClass = ({ isActive }: { isActive: boolean }) =>
        `nav-link d-flex align-items-center text-white mb-1 p-2 rounded ${
            isActive ? "bg-primary" : "text-white"
        }`;
    const { logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
        <aside
            className={`bg-dark text-white h-100 d-flex flex-column ${isMobile ? "" : "position-fixed top-0"}`}
            style={{
                width: isMobile ? "100%" : isOpen ? 220 : 60,
                transition: "all 0.3s",
                overflowY: "auto",
                zIndex: isMobile ? 0 : 1000,
            }}
        >
            {/* Toggle для десктопа */}
            {!isMobile && (
                <div className="d-flex justify-content-end p-2">
                    <button className="btn btn-sm btn-outline-light" onClick={onToggle}>
                        {isOpen ? <IconChevronLeft/> : <IconChevronRight/>}
                    </button>
                </div>
            )}

            <ul className={`nav flex-column px-2 small ${!isMobile ? "flex-grow-1" : ""}`}>
                <li>
                    <NavLink to="/dashboard" className={linkClass}>
                        <IconChartBar className="me-2"/> {isOpen && "СВД"}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/reports" className={linkClass}>
                        <IconReport className="me-2"/> {isOpen && "Отчёты на кассу"}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/orders" className={linkClass}>
                        <IconTruck className="me-2"/> {isOpen && "Заказы"}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/calls" className={linkClass}>
                        <IconPhone className="me-2"/> {isOpen && "Записи звонков"}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/repeat-requests" className={linkClass}>
                        <IconRefresh className="me-2"/> {isOpen && "Запрос повтора"}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/payouts/aggregators" className={linkClass}>
                        <IconCash className="me-2"/> {isOpen && "Выплата агрегаторам"}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/payouts/si" className={linkClass}>
                        <IconUserDollar className="me-2"/> {isOpen && "Выплата СИ"}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/profit" className={linkClass}>
                        <IconChartBar className="me-2"/> {isOpen && "Наша прибыль"}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/assign-orders" className={linkClass}>
                        <IconBus className="me-2"/> {isOpen && "Маршрутка"}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/schedule" className={linkClass}>
                        <IconCalendar className="me-2"/> {isOpen && "График работы СИ"}
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/si-management" className={linkClass}>
                        <IconUsers className="me-2"/> {isOpen && "Управление СИ"}
                    </NavLink>
                </li>
            </ul>

            <div className="p-2 border-top">
                <button
                    className={`btn btn-outline-danger d-flex align-items-center justify-content-center ${isMobile ? "btn-sm w-50" : "w-100" }`}
                    onClick={handleLogout}
                >
                    <IconLogout className="me-2"/>
                    {isOpen && "Выйти"}
                </button>
            </div>
        </aside>
    );
}
