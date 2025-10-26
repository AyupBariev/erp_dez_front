import { IconMenu2 } from "@tabler/icons-react";

type NavbarProps = {
    onToggleMobileMenu: () => void;
};

export default function Navbar({ onToggleMobileMenu }: NavbarProps) {
    return (
        <header className="navbar navbar-light bg-light shadow-sm px-3 d-flex justify-content-between">
            <span className="navbar-brand">Панель</span>

            {/* Бургер показываем только на мобилке */}
            <button
                className="btn btn-outline-secondary d-md-none"
                onClick={onToggleMobileMenu}
            >
                <IconMenu2/>
            </button>
        </header>
    );
}
