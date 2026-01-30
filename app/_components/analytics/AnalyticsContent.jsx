"use client";
import React, { useState, useEffect } from "react";

export default function AnalyticsContent() {
  const [loading, setLoading] = useState(true);
  const [counter, setCounter] = useState(0);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/analytics", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched analytics data:", data);
        setAnalyticsData(data);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchCounter = async () => {
      try {
        const response = await fetch("/api/counter", {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched counter data:", data);
        setCounter(data.counter);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch counter:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCounter();
    fetchAnalytics();
  }, []); // Only fetch once on mount

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-700">
          Loading analytics...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <h3 className="text-red-800 font-bold text-lg mb-2">
              Error loading analytics
            </h3>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analyticsData || analyticsData.totalQueries === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
        <div className="max-w-2xl mx-auto mt-20">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center shadow-lg">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              No Data Yet
            </h3>
            <p className="text-gray-600">
              Start generating playlists to see analytics!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get top 3 genres
  const topGenres = analyticsData.genres?.slice(0, 3) || [];
  const realGenres = topGenres.filter((g) => g.genre !== "_no_genre");

  // Calculate average parameter preferences
  const getAverageRange = (param) => {
    const stats = analyticsData.parameters?.[param];
    if (!stats) return { min: 0, max: 0 };
    return {
      min: stats.avg_min || 0,
      max: stats.avg_max || 0,
    };
  };

  // Get most popular parameter value
  const getMostPopularValue = (param, type = "max") => {
    const stats = analyticsData.parameters?.[param];
    const dist =
      type === "max" ? stats?.max_distribution : stats?.min_distribution;
    if (!dist || dist.length === 0) return 0;
    return dist[0].value;
  };

  return (
    <div className="min-h-screen font-body">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-700 mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            User preferences and playlist statistics
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Playlists Generated */}
          <div className="bg-gray-100 rounded-md p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">
                Total Songs generated
              </h3>
            </div>
            <p className="text-4xl font-bold">{counter}</p>
            <p className="text-sm opacity-80 mt-1">playlists created</p>
          </div>

          {/* Top Genre */}
          <div className="bg-gray-100 rounded-md p-6 text-white shadow-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium opacity-90">
                Most Popular Genre
              </h3>
            </div>
            <p className="text-3xl font-bold capitalize truncate">
              {realGenres[0]?.genre || "N/A"}
            </p>
            <p className="text-sm opacity-80 mt-1">
              {realGenres[0]
                ? `${realGenres[0].count.toLocaleString()} selections`
                : "No data"}
            </p>
          </div>
        </div>

        {/* Top 3 Genres Chart */}
        <div className="rounded-md shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">Top Genres</h2>
          <div className="space-y-4">
            {realGenres.map((item, idx) => {
              const percentage =
                (item.count / analyticsData.totalQueries) * 100;
              const colors = [
                "bg-gradient-to-r from-blue-500 to-blue-600",
                "bg-gradient-to-r from-purple-500 to-purple-600",
                "bg-gradient-to-r from-pink-500 to-pink-600",
              ];

              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-600 capitalize text-lg">
                        {item.genre}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">
                        {item.count.toLocaleString()}
                      </span>
                      <span className="text-gray-500 text-sm ml-2">
                        ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Parameter Preferences Grid */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[
            "popularity",
            "acoustics",
            "energy",
            "vocals",
            "danceability",
            "mood",
          ].map((param) => {
            const range = getAverageRange(param);
            const mostPopular = getMostPopularValue(param, "max");
            const icons = {
              popularity: "📈",
              acoustics: "🎸",
              energy: "⚡",
              vocals: "🎤",
              danceability: "💃",
              mood: "😊",
            };

            return (
              <div
                key={param}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{icons[param]}</span>
                  <h3 className="text-lg font-bold text-gray-900 capitalize">
                    {param}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Average Range</span>
                      <span className="font-semibold text-gray-900">
                        {range.min.toFixed(2)} - {range.max.toFixed(2)}
                      </span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="absolute h-2 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                        style={{
                          left: `${range.min * 100}%`,
                          width: `${(range.max - range.min) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Most Popular
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        {(mostPopular * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>*/}

        {/* Detailed Statistics (Collapsible) */}
        {/* <div className="rounded-md shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">
            Detailed Statistics
          </h2>

          <details className="mb-4">
            <summary className="cursor-pointer text-lg font-semibold text-blue-600 hover:text-blue-700 mb-3">
              All Genre Statistics
            </summary>
            <div className="pl-4 space-y-2">
              {analyticsData.genres?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between py-2 border-b border-gray-100"
                >
                  <span className="text-gray-700 capitalize">
                    {item.genre === "_no_genre"
                      ? "No Genre Selected"
                      : item.genre}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {item.count.toLocaleString()}
                    <span className="text-gray-500 text-sm ml-2">
                      (
                      {(
                        (item.count / analyticsData.totalQueries) *
                        100
                      ).toFixed(1)}
                      %)
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </details>

          {Object.entries(analyticsData.parameters || {}).map(
            ([param, stats]) => (
              <details key={param} className="mb-4">
                <summary className="cursor-pointer text-lg font-semibold text-blue-600 hover:text-blue-700 mb-3 capitalize">
                  {param} - Value Distribution
                </summary>
                <div className="pl-4 grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Minimum Values
                    </h4>
                    <div className="space-y-1">
                      {stats.min_distribution?.slice(0, 5).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-sm py-1"
                        >
                          <span className="text-gray-600">
                            {item.value.toFixed(2)}
                          </span>
                          <span className="text-gray-900 font-medium">
                            {item.count.toLocaleString()}×
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Maximum Values
                    </h4>
                    <div className="space-y-1">
                      {stats.max_distribution?.slice(0, 5).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-sm py-1"
                        >
                          <span className="text-gray-600">
                            {item.value.toFixed(2)}
                          </span>
                          <span className="text-gray-900 font-medium">
                            {item.count.toLocaleString()}×
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </details>
            ),
          )}
        </div>*/}
      </div>
    </div>
  );
}
