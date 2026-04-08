// src/components/GlobalLoader.jsx
import React from "react";
import useLoaderStore from "../../stores/loaderStore";
import { AnimatePresence, motion } from "framer-motion";

const GlobalLoader = () => {
  const loading = useLoaderStore ((state) => state.loading);

  if (!loading) return null;

  return (
    <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-lg flex items-center gap-3"
            >
              <div className="h-5 w-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              {/* <p className="text-gray-800">Loading...</p> */}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
  );
};

export default GlobalLoader;
