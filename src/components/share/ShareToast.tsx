import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Snackbar, Alert, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface ShareToastProps {
    show: boolean;
    success: boolean;
    message: string;
    onClose: () => void;
    duration?: number;
}

const ShareToast: React.FC<ShareToastProps> = ({
                                                   show,
                                                   success,
                                                   message,
                                                   onClose,
                                                   duration = 1500,
                                               }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // автоматическое закрытие по таймеру
    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [show, duration, onClose]);

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, x: 100, y: 0 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: 100, y: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 25 }}
                    style={{
                        position: "fixed",
                        top: isMobile ? 16 : 24,
                        right: isMobile ? 16 : 24,
                        zIndex: 9999,
                    }}
                >
                    <Snackbar
                        open={show}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "right",
                        }}
                        onClose={onClose}
                    >
                        <Alert
                            onClose={onClose}
                            severity={success ? "success" : "error"}
                            variant="filled"
                            sx={{
                                borderRadius: 2,
                                boxShadow: 3,
                                minWidth: 280,
                                fontSize: "0.9rem",
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            {message}
                        </Alert>
                    </Snackbar>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ShareToast;
