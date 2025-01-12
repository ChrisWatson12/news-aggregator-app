import React from "react";

interface SnackbarProps {
  visible?: boolean;
  message?: string; // Optional message, default is provided
}

export const Snackbar: React.FC<SnackbarProps> = ({
  visible = false,
  message = "Default message",
}) => (
  <>
    <div
      id="snackbar"
      className={`${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300 ease-in-out`}
    >
      {message}
    </div>
  </>
);
