import { useState, useEffect } from "react";
import { setPuffCounts } from "./api/admin";

export default function QuickEdit() {
  const [adminToken, setAdminToken] = useState("");
  const [counts, setCounts] = useState({ chicken: 0, motta: 0, meat: 0 });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("quick");

  async function handleUpdate(type, increment) {
    if (!adminToken.trim()) {
      setError("Please enter admin token");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      // Create payload with just one puff type
      const payload = {
        [type]: increment ? counts[type] + 1 : Math.max(0, counts[type] - 1),
      };

      const result = await setPuffCounts(payload, adminToken);

      // Update local state with the new values
      setCounts((prev) => ({
        ...prev,
        [type]: result.stats[type],
      }));

      setMessage(`${type} count ${increment ? "increased" : "decreased"}!`);
      console.log("Updated stats:", result);
    } catch (err) {
      setError(err.message || "Failed to update puff count");
    } finally {
      setLoading(false);
    }
  }

  // Load current counts when token is entered
  async function fetchCounts() {
    if (!adminToken.trim()) {
      setError("Please enter admin token");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Send an empty update to get current counts
      const result = await setPuffCounts({}, adminToken);
      setCounts({
        chicken: result.stats.chicken || 0,
        motta: result.stats.motta || 0,
        meat: result.stats.meat || 0,
      });
    } catch (err) {
      setError(err.message || "Failed to load counts");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-yellow-300 py-4 px-3 pb-24">
      <div className="w-full max-w-md mx-auto">
        <div className="p-4">
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <label className="block font-mono text-black font-bold mr-2">
                admin token
              </label>
              <input
                type="password"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-400 bg-gray-100"
                placeholder="Enter admin token"
                onBlur={fetchCounts}
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 font-mono text-black text-sm">{error}</div>
          )}

          {message && (
            <div className="mb-4 font-mono text-black text-sm">{message}</div>
          )}

          {loading && (
            <div className="mb-4 font-mono text-black text-sm">Loading...</div>
          )}

          <div className="space-y-12">
            {/* Chicken Puff Controls */}
            <div className="flex items-center">
              <div className="w-12 h-12 mr-6">
                <img
                  src="data:image/png;base64,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"
                  alt="Chicken"
                />
              </div>
              <div className="flex-grow flex">
                <button
                  onClick={() => handleUpdate("chicken", false)}
                  disabled={
                    loading || !adminToken.trim() || counts.chicken <= 0
                  }
                  className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mr-auto"
                >
                  <span className="text-white text-4xl font-bold">-</span>
                </button>
                <button
                  onClick={() => handleUpdate("chicken", true)}
                  disabled={loading || !adminToken.trim()}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center ml-auto mr-4"
                >
                  <span className="text-black text-3xl font-bold">+</span>
                </button>
              </div>
            </div>

            {/* Motta Controls */}
            <div className="flex items-center">
              <div className="w-12 h-12 mr-6">
                <img
                  src="data:image/png;base64,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"
                  alt="Motta"
                />
              </div>
              <div className="flex-grow flex">
                <button
                  onClick={() => handleUpdate("motta", false)}
                  disabled={loading || !adminToken.trim() || counts.motta <= 0}
                  className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mr-auto"
                >
                  <span className="text-white text-4xl font-bold">-</span>
                </button>
                <button
                  onClick={() => handleUpdate("motta", true)}
                  disabled={loading || !adminToken.trim()}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center ml-auto mr-4"
                >
                  <span className="text-black text-3xl font-bold">+</span>
                </button>
              </div>
            </div>

            {/* Meat Controls */}
            <div className="flex items-center">
              <div className="w-12 h-12 mr-6">
                <img
                  src="data:image/png;base64,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"
                  alt="Meat"
                />
              </div>
              <div className="flex-grow flex">
                <button
                  onClick={() => handleUpdate("meat", false)}
                  disabled={loading || !adminToken.trim() || counts.meat <= 0}
                  className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center mr-auto"
                >
                  <span className="text-white text-4xl font-bold">-</span>
                </button>
                <button
                  onClick={() => handleUpdate("meat", true)}
                  disabled={loading || !adminToken.trim()}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center ml-auto mr-4"
                >
                  <span className="text-black text-3xl font-bold">+</span>
                </button>
              </div>
            </div>
          </div>

          <div className="fixed bottom-16 left-0 right-0 mx-auto flex justify-center space-x-4">
            <button
              onClick={() => setActiveTab("set")}
              className={`py-2 px-6 rounded-full text-center font-mono ${
                activeTab === "set"
                  ? "bg-black text-white"
                  : "bg-black text-white opacity-70"
              }`}
            >
              set count
            </button>
            <button
              onClick={() => setActiveTab("quick")}
              className={`py-2 px-6 rounded-full text-center font-mono ${
                activeTab === "quick"
                  ? "bg-gray-200 text-black"
                  : "bg-gray-200 text-black opacity-70"
              }`}
            >
              quick edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
