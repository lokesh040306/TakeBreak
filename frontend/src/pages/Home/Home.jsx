import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { createRoom, joinRoom } from "../../services/api";
import {
  FiLock,
  FiClock,
  FiTrash2,
  FiUser,
} from "react-icons/fi";

/**
 * Home Page
 */
function Home() {
  const navigate = useNavigate();

  const [createPassword, setCreatePassword] = useState("");
  const [duration, setDuration] = useState(15);

  const [joinRoomId, setJoinRoomId] = useState("");
  const [joinPassword, setJoinPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- CREATE ---------------- */

  const handleCreateRoom = useCallback(async () => {
    if (loading) return;

    try {
      setError("");
      if (!createPassword) {
        setError("Password is required to create a room");
        return;
      }

      setLoading(true);
      const res = await createRoom(createPassword, duration);
      navigate(`/room/${res.data.roomId}`);
    } catch (err) {
      setError(err.message || "Failed to create room");
    } finally {
      setLoading(false);
    }
  }, [createPassword, duration, navigate, loading]);

  /* ---------------- JOIN ---------------- */

  const handleJoinRoom = useCallback(async () => {
    if (loading) return;

    try {
      setError("");
      if (!joinRoomId || !joinPassword) {
        setError("Room ID and password are required");
        return;
      }

      setLoading(true);
      const res = await joinRoom(joinRoomId, joinPassword);
      navigate(`/room/${res.data.roomId}`);
    } catch (err) {
      setError(err.message || "Failed to join room");
    } finally {
      setLoading(false);
    }
  }, [joinRoomId, joinPassword, navigate, loading]);

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen px-4 py-14 bg-gradient-to-b from-bgDark via-bgDark to-black text-textLight">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-20 text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-semibold mb-4">
            Anonymous Chat Rooms
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Secure, temporary chat rooms with no accounts, no tracking,
            and automatic cleanup.
          </p>
        </motion.header>

        {/* CREATE / JOIN */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-24">
          {/* Create */}
          <MotionCard>
            <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
              <FiLock className="text-primary" />
              Create Room
            </h2>

            <Input
              type="password"
              placeholder="Room Password"
              value={createPassword}
              disabled={loading}
              onChange={(e) => setCreatePassword(e.target.value)}
            />

            <select
              value={duration}
              disabled={loading}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full mb-6 px-4 py-3 rounded-md bg-bgDark border border-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition disabled:opacity-50"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>

            <PrimaryButton
              onClick={handleCreateRoom}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Room"}
            </PrimaryButton>
          </MotionCard>

          {/* Join */}
          <MotionCard>
            <h2 className="text-lg font-medium mb-6 flex items-center gap-2">
              <FiUser className="text-primary" />
              Join Room
            </h2>

            <Input
              type="text"
              placeholder="Room ID"
              value={joinRoomId}
              disabled={loading}
              onChange={(e) =>
                setJoinRoomId(e.target.value.toUpperCase())
              }
            />

            <Input
              type="password"
              placeholder="Room Password"
              value={joinPassword}
              disabled={loading}
              onChange={(e) => setJoinPassword(e.target.value)}
            />

            <PrimaryButton
              onClick={handleJoinRoom}
              disabled={loading}
            >
              {loading ? "Joining..." : "Join Room"}
            </PrimaryButton>
          </MotionCard>
        </section>

        {/* FEATURES */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Feature icon={<FiLock />} title="Private & Secure" desc="Password-protected rooms with no user accounts." />
          <Feature icon={<FiClock />} title="Timed Rooms" desc="Rooms automatically expire after selected time." />
          <Feature icon={<FiTrash2 />} title="Auto Cleanup" desc="Messages and files are deleted automatically." />
          <Feature icon={<FiUser />} title="Anonymous Chat" desc="No identity required. Pick any username." />
        </section>

        {/* ERROR */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-14 text-center text-red-400 font-medium"
          >
            {error}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ---------- UI HELPERS ---------- */

function MotionCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="bg-cardDark border border-gray-800 rounded-xl p-6 hover:border-gray-700 hover:shadow-xl hover:shadow-black/30 transition"
    >
      {children}
    </motion.div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full mb-4 px-4 py-3 rounded-md bg-bgDark border border-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition disabled:opacity-50"
    />
  );
}

function PrimaryButton({ children, ...props }) {
  return (
    <button
      {...props}
      className="w-full bg-primary hover:bg-blue-700 active:scale-[0.98] transition py-3 rounded-md font-medium disabled:opacity-50"
    >
      {children}
    </button>
  );
}

/* ---------- FEATURE ---------- */

function Feature({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-cardDark border border-gray-800 rounded-lg p-5 hover:border-gray-700 transition"
    >
      <div className="flex items-center gap-2 mb-2 text-primary">
        {icon}
        <h3 className="font-medium">{title}</h3>
      </div>
      <p className="text-sm text-gray-400">{desc}</p>
    </motion.div>
  );
}

export default Home;
