import { useState } from "react";
import { setPuffCounts } from "./api/admin";

export default function Admin() {
  const [adminToken, setAdminToken] = useState("");
  const [chicken, setChicken] = useState("");
  const [motta, setMotta] = useState("");
  const [meat, setMeat] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!adminToken.trim()) {
      setError("Please enter admin token");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const payload = {};
      if (chicken) payload.chicken = parseInt(chicken);
      if (motta) payload.motta = parseInt(motta);
      if (meat) payload.meat = parseInt(meat);

      const result = await setPuffCounts(payload, adminToken);
      setMessage("Puff counts updated successfully!");
      console.log("Updated stats:", result);
    } catch (err) {
      setError(err.message || "Failed to update puff counts");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
            <p className="text-gray-600 mt-2">Update global puff counts</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Token
              </label>
              <input
                type="password"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter admin token"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chicken
                </label>
                <input
                  type="number"
                  value={chicken}
                  onChange={(e) => setChicken(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motta
                </label>
                <input
                  type="number"
                  value={motta}
                  onChange={(e) => setMotta(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meat
                </label>
                <input
                  type="number"
                  value={meat}
                  onChange={(e) => setMeat(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update Counts"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
