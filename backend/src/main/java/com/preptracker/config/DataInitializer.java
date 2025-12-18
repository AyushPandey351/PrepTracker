package com.preptracker.config;

import com.preptracker.model.*;
import com.preptracker.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final TabRepository tabRepository;
    private final SubtopicRepository subtopicRepository;
    private final ItemRepository itemRepository;
    private final ChecklistItemRepository checklistItemRepository;
    private final ApplicationRepository applicationRepository;

    @Override
    public void run(String... args) {
        // Only initialize if database is empty
        if (tabRepository.count() > 0) {
            log.info("Database already contains data, skipping initialization");
            return;
        }

        log.info("Initializing database with sample data...");

        // Create Tabs
        Tab dsaTab = tabRepository.save(Tab.builder()
                .name("DSA")
                .icon("Database")
                .color("#00d9ff")
                .hasSubtopics(true)
                .sortOrder(0)
                .build());

        Tab designTab = tabRepository.save(Tab.builder()
                .name("Design")
                .icon("Layers")
                .color("#bf7fff")
                .hasSubtopics(false)
                .sortOrder(1)
                .build());

        Tab javaTab = tabRepository.save(Tab.builder()
                .name("Java")
                .icon("Code2")
                .color("#ff9f43")
                .hasSubtopics(false)
                .sortOrder(2)
                .build());

        Tab springBootTab = tabRepository.save(Tab.builder()
                .name("Spring Boot")
                .icon("Cpu")
                .color("#00ff94")
                .hasSubtopics(false)
                .sortOrder(3)
                .build());

        Tab jsTab = tabRepository.save(Tab.builder()
                .name("JavaScript")
                .icon("FileCode")
                .color("#ff6b9d")
                .hasSubtopics(false)
                .sortOrder(4)
                .build());

        // Create Subtopics for DSA
        Subtopic dpSubtopic = subtopicRepository.save(Subtopic.builder()
                .name("Dynamic Programming")
                .color("#ff6b9d")
                .tabId(dsaTab.getId())
                .sortOrder(0)
                .build());

        Subtopic graphsSubtopic = subtopicRepository.save(Subtopic.builder()
                .name("Graphs")
                .color("#00d9ff")
                .tabId(dsaTab.getId())
                .sortOrder(1)
                .build());

        Subtopic treesSubtopic = subtopicRepository.save(Subtopic.builder()
                .name("Trees")
                .color("#00ff94")
                .tabId(dsaTab.getId())
                .sortOrder(2)
                .build());

        Subtopic arraysSubtopic = subtopicRepository.save(Subtopic.builder()
                .name("Arrays & Strings")
                .color("#ff9f43")
                .tabId(dsaTab.getId())
                .sortOrder(3)
                .build());

        // Create Items for DP subtopic
        itemRepository.saveAll(List.of(
                Item.builder()
                        .title("Fibonacci Series")
                        .completed(false)
                        .content("# Fibonacci Series\n\nClassic DP problem with memoization and tabulation approaches.")
                        .code("// Fibonacci with memoization\nfunction fib(n, memo = {}) {\n  if (n in memo) return memo[n];\n  if (n <= 2) return 1;\n  memo[n] = fib(n - 1, memo) + fib(n - 2, memo);\n  return memo[n];\n}")
                        .codeLanguage("javascript")
                        .tabId(dsaTab.getId())
                        .subtopicId(dpSubtopic.getId())
                        .sortOrder(0)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                Item.builder()
                        .title("Longest Common Subsequence")
                        .completed(false)
                        .content("# LCS\n\nFind the longest subsequence common to two sequences.")
                        .code("")
                        .codeLanguage("javascript")
                        .tabId(dsaTab.getId())
                        .subtopicId(dpSubtopic.getId())
                        .sortOrder(1)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                Item.builder()
                        .title("0/1 Knapsack")
                        .completed(false)
                        .content("# 0/1 Knapsack\n\nMaximize value with weight constraint.")
                        .code("")
                        .codeLanguage("javascript")
                        .tabId(dsaTab.getId())
                        .subtopicId(dpSubtopic.getId())
                        .sortOrder(2)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build()
        ));

        // Create Items for Graphs subtopic
        itemRepository.saveAll(List.of(
                Item.builder()
                        .title("BFS & DFS")
                        .completed(false)
                        .content("# BFS & DFS\n\nBreadth-first and Depth-first search traversals.")
                        .code("// BFS Implementation\nfunction bfs(graph, start) {\n  const queue = [start];\n  const visited = new Set([start]);\n  while (queue.length) {\n    const node = queue.shift();\n    for (const neighbor of graph[node]) {\n      if (!visited.has(neighbor)) {\n        visited.add(neighbor);\n        queue.push(neighbor);\n      }\n    }\n  }\n}")
                        .codeLanguage("javascript")
                        .tabId(dsaTab.getId())
                        .subtopicId(graphsSubtopic.getId())
                        .sortOrder(0)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                Item.builder()
                        .title("Dijkstra's Algorithm")
                        .completed(false)
                        .content("# Dijkstra's Algorithm\n\nShortest path in weighted graph.")
                        .code("")
                        .codeLanguage("javascript")
                        .tabId(dsaTab.getId())
                        .subtopicId(graphsSubtopic.getId())
                        .sortOrder(1)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build()
        ));

        // Create Items for Trees subtopic
        itemRepository.saveAll(List.of(
                Item.builder()
                        .title("Binary Tree Traversals")
                        .completed(false)
                        .content("# Tree Traversals\n\nInorder, Preorder, Postorder traversals.")
                        .code("// Inorder traversal\nfunction inorder(root, result = []) {\n  if (!root) return result;\n  inorder(root.left, result);\n  result.push(root.val);\n  inorder(root.right, result);\n  return result;\n}")
                        .codeLanguage("javascript")
                        .tabId(dsaTab.getId())
                        .subtopicId(treesSubtopic.getId())
                        .sortOrder(0)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                Item.builder()
                        .title("BST Operations")
                        .completed(false)
                        .content("# BST Operations\n\nInsert, Delete, Search in Binary Search Tree.")
                        .code("")
                        .codeLanguage("javascript")
                        .tabId(dsaTab.getId())
                        .subtopicId(treesSubtopic.getId())
                        .sortOrder(1)
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build()
        ));

        // Create Items for Arrays subtopic
        itemRepository.save(Item.builder()
                .title("Two Sum")
                .completed(false)
                .content("# Two Sum\n\nFind two numbers that add up to target.")
                .code("// Two Sum\nfunction twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}")
                .codeLanguage("javascript")
                .tabId(dsaTab.getId())
                .subtopicId(arraysSubtopic.getId())
                .sortOrder(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        // Create Items for non-DSA tabs (flat structure)
        itemRepository.save(Item.builder()
                .title("System Design Basics")
                .completed(false)
                .content("# System Design Basics\n\n- Scalability\n- Load Balancing\n- Caching")
                .code("")
                .codeLanguage("javascript")
                .tabId(designTab.getId())
                .sortOrder(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        itemRepository.save(Item.builder()
                .title("Core Java Concepts")
                .completed(false)
                .content("# Core Java\n\nOOPs, Collections, Multithreading")
                .code("public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello World!\");\n  }\n}")
                .codeLanguage("java")
                .tabId(javaTab.getId())
                .sortOrder(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        itemRepository.save(Item.builder()
                .title("Spring Boot Basics")
                .completed(false)
                .content("# Spring Boot\n\nDependency Injection, REST APIs")
                .code("@RestController\npublic class HelloController {\n  @GetMapping(\"/hello\")\n  public String hello() {\n    return \"Hello World!\";\n  }\n}")
                .codeLanguage("java")
                .tabId(springBootTab.getId())
                .sortOrder(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        itemRepository.save(Item.builder()
                .title("ES6+ Features")
                .completed(false)
                .content("# ES6+ Features\n\nArrow functions, Destructuring, Promises, Async/Await")
                .code("const fetchData = async () => {\n  const response = await fetch(\"/api/data\");\n  const data = await response.json();\n  return data;\n};")
                .codeLanguage("javascript")
                .tabId(jsTab.getId())
                .sortOrder(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build());

        // Create Checklist Items
        checklistItemRepository.saveAll(List.of(
                ChecklistItem.builder()
                        .text("Complete DSA fundamentals")
                        .completed(false)
                        .sortOrder(0)
                        .createdAt(LocalDateTime.now())
                        .build(),
                ChecklistItem.builder()
                        .text("Build 3 full-stack projects")
                        .completed(false)
                        .sortOrder(1)
                        .createdAt(LocalDateTime.now())
                        .build(),
                ChecklistItem.builder()
                        .text("Contribute to open source")
                        .completed(false)
                        .sortOrder(2)
                        .createdAt(LocalDateTime.now())
                        .build(),
                ChecklistItem.builder()
                        .text("Practice system design")
                        .completed(false)
                        .sortOrder(3)
                        .createdAt(LocalDateTime.now())
                        .build()
        ));

        // Create Sample Applications
        applicationRepository.saveAll(List.of(
                Application.builder()
                        .company("Google")
                        .role("Software Engineer")
                        .status(Application.ApplicationStatus.APPLIED)
                        .date(LocalDate.of(2024, 1, 15))
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                Application.builder()
                        .company("Meta")
                        .role("Full Stack Developer")
                        .status(Application.ApplicationStatus.INTERVIEW)
                        .date(LocalDate.of(2024, 1, 10))
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build(),
                Application.builder()
                        .company("Amazon")
                        .role("SDE II")
                        .status(Application.ApplicationStatus.OFFERED)
                        .date(LocalDate.of(2024, 1, 5))
                        .createdAt(LocalDateTime.now())
                        .updatedAt(LocalDateTime.now())
                        .build()
        ));

        log.info("Database initialization completed successfully!");
    }
}

