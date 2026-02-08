// src/app/App.jsx
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Home from "../pages/Home";
import ChatRoom from "../pages/ChatRoom";

/**
 * App component
 * - Handles routing
 * - Provides base layout
 * - Adds smooth route transitions
 */
function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-bgDark via-bgDark to-black text-textLight">
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="min-h-screen"
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/room/:roomId" element={<ChatRoom />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
