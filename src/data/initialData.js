import { DEFAULT_TABS, DATA_VERSION } from './constants';

// Initial data structure
export const getInitialData = () => {
  const saved = localStorage.getItem('prepTrackerData');
  const savedVersion = localStorage.getItem('prepTrackerVersion');
  
  // If version mismatch or no version, use fresh data
  if (saved && savedVersion === String(DATA_VERSION)) {
    return JSON.parse(saved);
  }
  
  // Save new version
  localStorage.setItem('prepTrackerVersion', String(DATA_VERSION));
  
  return {
    tabs: DEFAULT_TABS,
    // Tabs with subtopics (nested structure)
    tabsWithSubtopics: ['dsa'], // Array of tab IDs that use subtopic structure
    // Subtopics structure for tabs that need it
    subtopics: {
      dsa: [
        {
          id: 'dp',
          name: 'Dynamic Programming',
          color: '#ff6b9d',
          items: [
            { id: '1', title: 'Fibonacci Series', completed: false, content: '# Fibonacci Series\n\nClassic DP problem with memoization and tabulation approaches.', code: '// Fibonacci with memoization\nfunction fib(n, memo = {}) {\n  if (n in memo) return memo[n];\n  if (n <= 2) return 1;\n  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);\n  return memo[n];\n}', codeLanguage: 'javascript' },
            { id: '2', title: 'Longest Common Subsequence', completed: false, content: '# LCS\n\nFind the longest subsequence common to two sequences.', code: '', codeLanguage: 'javascript' },
            { id: '3', title: '0/1 Knapsack', completed: false, content: '# 0/1 Knapsack\n\nMaximize value with weight constraint.', code: '', codeLanguage: 'javascript' },
          ]
        },
        {
          id: 'graphs',
          name: 'Graphs',
          color: '#00d9ff',
          items: [
            { id: '1', title: 'BFS & DFS', completed: false, content: '# BFS & DFS\n\nBreadth-first and Depth-first search traversals.', code: '// BFS Implementation\nfunction bfs(graph, start) {\n  const queue = [start];\n  const visited = new Set([start]);\n  while (queue.length) {\n    const node = queue.shift();\n    for (const neighbor of graph[node]) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push(neighbor);\n      }\n    }\n  }\n}', codeLanguage: 'javascript' },
            { id: '2', title: 'Dijkstra\'s Algorithm', completed: false, content: '# Dijkstra\'s Algorithm\n\nShortest path in weighted graph.', code: '', codeLanguage: 'javascript' },
            { id: '3', title: 'Topological Sort', completed: false, content: '# Topological Sort\n\nLinear ordering of vertices in DAG.', code: '', codeLanguage: 'javascript' },
          ]
        },
        {
          id: 'trees',
          name: 'Trees',
          color: '#00ff94',
          items: [
            { id: '1', title: 'Binary Tree Traversals', completed: false, content: '# Tree Traversals\n\nInorder, Preorder, Postorder traversals.', code: '// Inorder traversal\nfunction inorder(root, result = []) {\n  if (!root) return result;\n  inorder(root.left, result);\n  result.push(root.val);\n  inorder(root.right, result);\n  return result;\n}', codeLanguage: 'javascript' },
            { id: '2', title: 'BST Operations', completed: false, content: '# BST Operations\n\nInsert, Delete, Search in Binary Search Tree.', code: '', codeLanguage: 'javascript' },
            { id: '3', title: 'Lowest Common Ancestor', completed: false, content: '# LCA\n\nFind lowest common ancestor of two nodes.', code: '', codeLanguage: 'javascript' },
          ]
        },
        {
          id: 'bitmanip',
          name: 'Bit Manipulation',
          color: '#bf7fff',
          items: [
            { id: '1', title: 'Basic Bit Operations', completed: false, content: '# Bit Operations\n\nAND, OR, XOR, NOT, Left/Right Shift.', code: '// Check if number is power of 2\nfunction isPowerOfTwo(n) {\n  return n > 0 && (n & (n - 1)) === 0;\n}', codeLanguage: 'javascript' },
            { id: '2', title: 'Single Number', completed: false, content: '# Single Number\n\nFind the element that appears once.', code: '', codeLanguage: 'javascript' },
          ]
        },
        {
          id: 'arrays',
          name: 'Arrays & Strings',
          color: '#ff9f43',
          items: [
            { id: '1', title: 'Two Sum', completed: false, content: '# Two Sum\n\nFind two numbers that add up to target.', code: '// Two Sum\nfunction twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}', codeLanguage: 'javascript' },
            { id: '2', title: 'Sliding Window Maximum', completed: false, content: '# Sliding Window\n\nFind maximum in each window of size k.', code: '', codeLanguage: 'javascript' },
          ]
        },
      ],
    },
    // Regular items for tabs without subtopics
    items: {
      design: [
        { id: '1', title: 'System Design Basics', completed: false, content: '# System Design Basics\n\n- Scalability\n- Load Balancing\n- Caching', code: '', codeLanguage: 'javascript' },
      ],
      java: [
        { id: '1', title: 'Core Java Concepts', completed: false, content: '# Core Java\n\nOOPs, Collections, Multithreading', code: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello World!");\n  }\n}', codeLanguage: 'java' },
      ],
      springboot: [
        { id: '1', title: 'Spring Boot Basics', completed: false, content: '# Spring Boot\n\nDependency Injection, REST APIs', code: '@RestController\npublic class HelloController {\n  @GetMapping("/hello")\n  public String hello() {\n    return "Hello World!";\n  }\n}', codeLanguage: 'java' },
      ],
      javascript: [
        { id: '1', title: 'ES6+ Features', completed: false, content: '# ES6+ Features\n\nArrow functions, Destructuring, Promises, Async/Await', code: 'const fetchData = async () => {\n  const response = await fetch("/api/data");\n  const data = await response.json();\n  return data;\n};', codeLanguage: 'javascript' },
      ],
    },
    checklist: [
      { id: '1', text: 'Complete DSA fundamentals', completed: false },
      { id: '2', text: 'Build 3 full-stack projects', completed: false },
      { id: '3', text: 'Contribute to open source', completed: false },
      { id: '4', text: 'Practice system design', completed: false },
    ],
    applications: [
      { id: '1', company: 'Google', role: 'Software Engineer', status: 'applied', date: '2024-01-15' },
      { id: '2', company: 'Meta', role: 'Full Stack Developer', status: 'interview', date: '2024-01-10' },
      { id: '3', company: 'Amazon', role: 'SDE II', status: 'offered', date: '2024-01-05' },
    ],
    // Activity journal - logs daily completions
    activityLog: [],
  };
};

