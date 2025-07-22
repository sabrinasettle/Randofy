"use client";
import { createContext, useContext, useState } from "react";

const ToastContext = createContext(null);

// ${
//   toast.type === "success"
//     ? "bg-green-600"
//     : toast.type === "error"
//       ? "bg-red-600"
//       : "bg-blue-600"
// }

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000); // hide after 3s
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          className={`fixed font-body top-4 right-4 z-50 px-4 py-2 rounded shadow-lg text-gray-700 bg-gray-100 border border-gray-300 `}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
