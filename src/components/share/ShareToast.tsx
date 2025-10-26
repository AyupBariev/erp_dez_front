import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

interface ShareToastProps {
    show: boolean;
    success: boolean;
    message: string;
    onClose: () => void;
    duration?: number; // по умолчанию 1.5 секунды
}

const ShareToast: React.FC<ShareToastProps> = ({
                                                   show,
                                                   success,
                                                   message,
                                                   onClose,
                                                   duration = 1500,
                                               }) => {
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
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 rounded-2xl shadow-lg px-4 py-3 w-[320px] border ${
                        success
                            ? "border-green-400 bg-white"
                            : "border-red-400 bg-white"
                    }`}
                >
                    {success ? (
                        <CheckCircle2 className="text-green-500 w-6 h-6 flex-shrink-0" />
                    ) : (
                        <XCircle className="text-red-500 w-6 h-6 flex-shrink-0" />
                    )}
                    <p
                        className={`text-sm font-medium ${
                            success ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {message}
                    </p>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ShareToast;
