export const PLATFORMS = {
  leetcode: {
    key: "leetcode",
    name: "LeetCode",
    color: "#FFA116",
    url: "https://leetcode.com",
    metrics: ["problems_solved", "ranking", "acceptance_rate"],
  },
  codeforces: {
    key: "codeforces",
    name: "Codeforces",
    color: "#1890FF",
    url: "https://codeforces.com",
    metrics: ["rating", "max_rating", "rank", "contests"],
  },
  codechef: {
    key: "codechef",
    name: "CodeChef",
    color: "#5B4638",
    url: "https://codechef.com",
    metrics: ["rating", "stars", "problems_solved"],
  },
  atcoder: {
    key: "atcoder",
    name: "AtCoder",
    color: "#222222",
    url: "https://atcoder.jp",
    metrics: ["rating", "rank", "contests"],
  },
  hackerrank: {
    key: "hackerrank",
    name: "HackerRank",
    color: "#00EA64",
    url: "https://hackerrank.com",
    metrics: ["badges", "certifications", "score"],
  },
  hackerearth: {
    key: "hackerearth",
    name: "HackerEarth",
    color: "#2C3454",
    url: "https://hackerearth.com",
    metrics: ["rating", "problems_solved"],
  },
} as const;

export const PLATFORM_ORDER = [
  "leetcode",
  "codeforces",
  "codechef",
  "atcoder",
  "hackerrank",
  "hackerearth",
] as const;

/**
 * Platforms we can actually sync. Only these have an adapter in
 * lib/integrations — HACKERRANK and GEEKSFORGEEKS are registered as
 * `undefined` there, and HackerEarth has no Platform enum member at all.
 * Marketing surfaces must read from this list, never PLATFORM_ORDER, so we
 * never advertise a platform we cannot fetch.
 */
export const SUPPORTED_PLATFORMS = [
  "leetcode",
  "codeforces",
  "codechef",
  "atcoder",
] as const;

export const PROFILE_LIMITS = {
  guestVisiblePlatforms: 3,
  guestChartPoints: 8,
} as const;
