// FAANG-level DSA and MERN Stack Study Planner Core Database

const STUDY_PLANNER_DATA = {
  dsa: [
    {
      id: "arrays-hashing",
      name: "Arrays & Hashing",
      description: "Foundational pattern for tracking elements, frequency counting, and sliding windows. Crucial for FAANG interviews.",
      problems: [
        { id: "dsa-1", name: "Two Sum", difficulty: "Easy", link: "https://leetcode.com/problems/two-sum/", pattern: "Hash Map", hint: "Use a hash map to store the index of seen numbers. Look up target - current_val in O(1)." },
        { id: "dsa-2", name: "Contains Duplicate", difficulty: "Easy", link: "https://leetcode.com/problems/contains-duplicate/", pattern: "Hash Set", hint: "Insert items in a set; if item already exists, duplicate found in O(N)." },
        { id: "dsa-3", name: "Valid Anagram", difficulty: "Easy", link: "https://leetcode.com/problems/valid-anagram/", pattern: "Frequency Counter", hint: "Count frequencies of letters in both strings and compare. Maps or array of size 26." },
        { id: "dsa-4", name: "Group Anagrams", difficulty: "Medium", link: "https://leetcode.com/problems/group-anagrams/", pattern: "Categorization / Hashing", hint: "Sort each string to use as a key, or count characters and use count array as key in a hash map." },
        { id: "dsa-5", name: "Top K Frequent Elements", difficulty: "Medium", link: "https://leetcode.com/problems/top-k-frequent-elements/", pattern: "Bucket Sort / Heap", hint: "Count frequencies, then use bucket sort (array index represents frequency) to retrieve top K in O(N)." },
        { id: "dsa-6", name: "Longest Consecutive Sequence", difficulty: "Medium", link: "https://leetcode.com/problems/longest-consecutive-sequence/", pattern: "Set Optimization", hint: "Put all values in a set. Only start building sequence if (num - 1) is not in the set." }
      ]
    },
    {
      id: "two-pointers",
      name: "Two Pointers",
      description: "Linear scanning of sorted structures to optimize O(N^2) search spaces to O(N) linear time.",
      problems: [
        { id: "dsa-7", name: "Valid Palindrome", difficulty: "Easy", link: "https://leetcode.com/problems/valid-palindrome/", pattern: "Two Pointers", hint: "Pointers at start and end. Skip non-alphanumeric. Compare chars ignoring case." },
        { id: "dsa-8", name: "Two Sum II (Input Array Sorted)", difficulty: "Medium", link: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", pattern: "Two Pointers", hint: "Start pointers at 0 and N-1. If sum > target, decrement right; if sum < target, increment left." },
        { id: "dsa-9", name: "3Sum", difficulty: "Medium", link: "https://leetcode.com/problems/3sum/", pattern: "Sort + Two Pointers", hint: "Sort array. Loop through elements and run Two Pointers (Two Sum II) for remaining sub-array. Skip duplicates." },
        { id: "dsa-10", name: "Container With Most Water", difficulty: "Medium", link: "https://leetcode.com/problems/container-with-most-water/", pattern: "Two Pointers", hint: "Left at 0, right at N-1. Calculate area. Shift pointer pointing to the shorter wall." },
        { id: "dsa-11", name: "Trapping Rain Water", difficulty: "Hard", link: "https://leetcode.com/problems/trapping-rain-water/", pattern: "Two Pointers / Prefix Max", hint: "Track max-left and max-right. Water trapped above index i is min(max-left, max-right) - height[i]." }
      ]
    },
    {
      id: "sliding-window",
      name: "Sliding Window",
      description: "Optimizing subarrays or substrings searches by maintaining a sliding window boundary.",
      problems: [
        { id: "dsa-12", name: "Best Time to Buy and Sell Stock", difficulty: "Easy", link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", pattern: "Sliding Window", hint: "Track minimum price seen. Calculate profit at each step and update max profit." },
        { id: "dsa-13", name: "Longest Substring Without Repeating Characters", difficulty: "Medium", link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", pattern: "Dynamic Window", hint: "Use a hash set to track chars in window. Shift left pointer when duplicate is detected." },
        { id: "dsa-14", name: "Longest Repeating Character Replacement", difficulty: "Medium", link: "https://leetcode.com/problems/longest-repeating-character-replacement/", pattern: "Window with Count", hint: "Window size - frequency of max repeating character <= k. Otherwise, shrink left." },
        { id: "dsa-15", name: "Minimum Window Substring", difficulty: "Hard", link: "https://leetcode.com/problems/minimum-window-substring/", pattern: "Frequency Map Window", hint: "Track frequency of characters in T. Expand right until window is valid, then shrink left to find minimum." }
      ]
    },
    {
      id: "stacks-queues",
      name: "Stacks & Queues",
      description: "LIFO and FIFO operations. Key for recursion simulation, parsing, and expression evaluation.",
      problems: [
        { id: "dsa-16", name: "Valid Parentheses", difficulty: "Easy", link: "https://leetcode.com/problems/valid-parentheses/", pattern: "Stack Matching", hint: "Push opening brackets. On closing bracket, check if it matches stack top, then pop." },
        { id: "dsa-17", name: "Min Stack", difficulty: "Medium", link: "https://leetcode.com/problems/min-stack/", pattern: "Design Stack", hint: "Maintain a secondary stack that stores the minimum value corresponding to each node in the primary stack." },
        { id: "dsa-18", name: "Evaluate Reverse Polish Notation", difficulty: "Medium", link: "https://leetcode.com/problems/evaluate-reverse-polish-notation/", pattern: "Stack Evaluation", hint: "Push numbers. When operator is found, pop top two numbers, evaluate, and push result back." },
        { id: "dsa-19", name: "Daily Temperatures", difficulty: "Medium", link: "https://leetcode.com/problems/daily-temperatures/", pattern: "Monotonic Stack", hint: "Maintain a stack of indices with decreasing temperatures. Pop and update differences when finding warmer temp." }
      ]
    },
    {
      id: "binary-search",
      name: "Binary Search",
      description: "Divide and conquer method to search elements in O(log N) complexity. Highly scalable algorithms.",
      problems: [
        { id: "dsa-20", name: "Binary Search", difficulty: "Easy", link: "https://leetcode.com/problems/binary-search/", pattern: "Standard BS", hint: "Initialize left=0, right=N-1. Check midpoint. Halve search space based on target comparison." },
        { id: "dsa-21", name: "Search a 2D Matrix", difficulty: "Medium", link: "https://leetcode.com/problems/search-a-2d-matrix/", pattern: "Virtual Flattening", hint: "Treat 2D grid as 1D array. Mapped index mid: row = mid / cols, col = mid % cols." },
        { id: "dsa-22", name: "Koko Eating Bananas", difficulty: "Medium", link: "https://leetcode.com/problems/koko-eating-bananas/", pattern: "Binary Search on Answer", hint: "Search speed rate from 1 to max(piles). Check if current speed can finish piles in H hours." },
        { id: "dsa-23", name: "Search in Rotated Sorted Array", difficulty: "Medium", link: "https://leetcode.com/problems/search-in-rotated-sorted-array/", pattern: "Modified BS", hint: "Identify which half of the array is sorted. Check if target lies within the range of that sorted half." },
        { id: "dsa-24", name: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/", pattern: "Rotated BS", hint: "Compare mid with rightmost element. If mid > right, minimum lies in right sub-array. Else left." }
      ]
    },
    {
      id: "linked-lists",
      name: "Linked Lists",
      description: "Dynamic memory structures. Mastering pointer manipulation, Floyd's cycle, and reversing lists.",
      problems: [
        { id: "dsa-25", name: "Reverse Linked List", difficulty: "Easy", link: "https://leetcode.com/problems/reverse-linked-list/", pattern: "Pointer Swapping", hint: "Keep track of prev, curr, next. Point curr.next to prev, slide prev and curr forward." },
        { id: "dsa-26", name: "Merge Two Sorted Lists", difficulty: "Easy", link: "https://leetcode.com/problems/merge-two-sorted-lists/", pattern: "Dummy Node", hint: "Use a dummy node to build head. Compare list heads, link smaller to dummy, move pointer forward." },
        { id: "dsa-27", name: "Reorder List", difficulty: "Medium", link: "https://leetcode.com/problems/reorder-list/", pattern: "Find Mid + Reverse + Merge", hint: "Find middle (slow/fast), reverse second half, then interleave both halves one by one." },
        { id: "dsa-28", name: "Remove Nth Node From End of List", difficulty: "Medium", link: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", pattern: "Slow & Fast Pointer", hint: "Move fast pointer N nodes ahead. Then move slow and fast together until fast reaches end. Delete slow.next." },
        { id: "dsa-29", name: "Linked List Cycle", difficulty: "Easy", link: "https://leetcode.com/problems/linked-list-cycle/", pattern: "Floyd's Tortoise & Hare", hint: "Fast pointer moves 2 steps, slow moves 1. If there's a cycle, fast and slow will eventually meet." }
      ]
    },
    {
      id: "trees",
      name: "Trees & BST",
      description: "Hierarchical data structure. Mastery of DFS (Pre/In/Post-order) and BFS (Level order) traversals.",
      problems: [
        { id: "dsa-30", name: "Invert Binary Tree", difficulty: "Easy", link: "https://leetcode.com/problems/invert-binary-tree/", pattern: "DFS / Recursion", hint: "Base case: if root is null, return. Swap left and right child. Recursively invert left and right." },
        { id: "dsa-31", name: "Maximum Depth of Binary Tree", difficulty: "Easy", link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", pattern: "DFS Depth Tracking", hint: "Depth of root is 1 + max(depth(root.left), depth(root.right))." },
        { id: "dsa-32", name: "Same Tree", difficulty: "Easy", link: "https://leetcode.com/problems/same-tree/", pattern: "Tree Traversal", hint: "Check root values. Recursively verify sameTree(p.left, q.left) and sameTree(p.right, q.right)." },
        { id: "dsa-33", name: "Binary Tree Level Order Traversal", difficulty: "Medium", link: "https://leetcode.com/problems/binary-tree-level-order-traversal/", pattern: "BFS Queue", hint: "Use a queue. Process level size in a nested loop. Collect values of current level, queue children." },
        { id: "dsa-34", name: "Validate Binary Search Tree", difficulty: "Medium", link: "https://leetcode.com/problems/validate-binary-search-tree/", pattern: "In-order Range Traversal", hint: "Pass min and max bounds recursively. Node value must be strictly between min and max boundaries." },
        { id: "dsa-35", name: "Construct Binary Tree from Preorder and Inorder", difficulty: "Medium", link: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/", pattern: "Divide & Conquer", hint: "First preorder node is root. Find its index in inorder array to divide left and right subtrees." }
      ]
    },
    {
      id: "heaps-backtracking",
      name: "Heap & Backtracking",
      description: "Priority queues and backtracking searches (permutations, subsets, pruning paths).",
      problems: [
        { id: "dsa-36", name: "Kth Largest Element in an Array", difficulty: "Medium", link: "https://leetcode.com/problems/kth-largest-element-in-an-array/", pattern: "Min-Heap", hint: "Maintain a min-heap of size K. If current element > heap min, push and pop. Result is heap root." },
        { id: "dsa-37", name: "Subsets", difficulty: "Medium", link: "https://leetcode.com/problems/subsets/", pattern: "Backtracking", hint: "At each element, decide to either include it or exclude it in the subset, then recurse." },
        { id: "dsa-38", name: "Permutations", difficulty: "Medium", link: "https://leetcode.com/problems/permutations/", pattern: "Backtracking Permutations", hint: "Loop through available elements. Push to temporary list, mark visited, recurse, backtrack." },
        { id: "dsa-39", name: "Combination Sum", difficulty: "Medium", link: "https://leetcode.com/problems/combination-sum/", pattern: "Backtracking Paths", hint: "Maintain current sum. At each step, either take same element, or move to next. Backtrack if sum > target." }
      ]
    },
    {
      id: "graphs",
      name: "Graphs",
      description: "Modeling networks. Essential DFS/BFS implementations, cycle detection, topological sorting, and Dijkstra's algorithm.",
      problems: [
        { id: "dsa-40", name: "Number of Islands", difficulty: "Medium", link: "https://leetcode.com/problems/number-of-islands/", pattern: "DFS Floodfill", hint: "Iterate grid. When '1' is found, increment count and run DFS/BFS to turn all connected '1's to '0's." },
        { id: "dsa-41", name: "Clone Graph", difficulty: "Medium", link: "https://leetcode.com/problems/clone-graph/", pattern: "Graph Traversal / Map", hint: "Use a hash map to map original node -> cloned node. Traversal (DFS/BFS) clones nodes and links." },
        { id: "dsa-42", name: "Course Schedule", difficulty: "Medium", link: "https://leetcode.com/problems/course-schedule/", pattern: "Topological Sort / Cycle", hint: "Detect cycle in directed graph using DFS node state coloring (visiting, visited) or Kahn's BFS algorithm." },
        { id: "dsa-43", name: "Pacific Atlantic Water Flow", difficulty: "Medium", link: "https://leetcode.com/problems/pacific-atlantic-water-flow/", pattern: "Multi-Source DFS", hint: "Run DFS from ocean borders inward. Intersection of cells reachable from both oceans is the result." },
        { id: "dsa-44", name: "Redundant Connection", difficulty: "Medium", link: "https://leetcode.com/problems/redundant-connection/", pattern: "Union Find (Disjoint Set)", hint: "Run Union-Find. If union(u, v) fails (already have same parent), that edge creates a cycle; return it." }
      ]
    },
    {
      id: "dynamic-programming",
      name: "Dynamic Programming",
      description: "Breaking down complex problems into overlapping subproblems. Bottom-up iteration and memoization.",
      problems: [
        { id: "dsa-45", name: "Climbing Stairs", difficulty: "Easy", link: "https://leetcode.com/problems/climbing-stairs/", pattern: "Fibonacci DP", hint: "dp[i] = dp[i-1] + dp[i-2]. Optimize space by keeping track of the last two steps." },
        { id: "dsa-46", name: "House Robber", difficulty: "Medium", link: "https://leetcode.com/problems/house-robber/", pattern: "1D Array DP", hint: "dp[i] = max(dp[i-1], dp[i-2] + nums[i]). Decide whether to rob current house or skip." },
        { id: "dsa-47", name: "Longest Palindromic Substring", difficulty: "Medium", link: "https://leetcode.com/problems/longest-palindromic-substring/", pattern: "Expand Around Center", hint: "For each index, expand outward for odd and even length palindromes. Track longest boundary." },
        { id: "dsa-48", name: "Word Break", difficulty: "Medium", link: "https://leetcode.com/problems/word-break/", pattern: "DP Substring", hint: "dp[i] = true if dp[j] is true AND substring(j, i) exists in dictionary. 0 <= j < i." },
        { id: "dsa-49", name: "Unique Paths", difficulty: "Medium", link: "https://leetcode.com/problems/unique-paths/", pattern: "2D Grid DP", hint: "dp[r][c] = dp[r-1][c] + dp[r][c-1]. Initialize borders to 1." },
        { id: "dsa-50", name: "Longest Common Subsequence", difficulty: "Medium", link: "https://leetcode.com/problems/longest-common-subsequence/", pattern: "2D Grid LCS", hint: "If chars match, dp[i][j] = 1 + dp[i-1][j-1]. Else, max(dp[i-1][j], dp[i][j-1])." }
      ]
    }
  ],
  mern: [
    {
      id: "phase-1",
      name: "Phase 1: Advanced Frontend & React",
      description: "Deep dive into Virtual DOM, state design patterns, performance tuning, and hooks lifecycle.",
      milestones: [
        { id: "m-1", text: "Master Advanced JS: Closures, Event Loop, Promises, Async/Await, Prototypes, and custom Array methods." },
        { id: "m-2", text: "React Virtual DOM: Explain React Fiber, reconciliation algorithm, key prop necessity, and custom DOM bindings." },
        { id: "m-3", text: "React State Management: Implement Context API vs Redux Toolkit (Slices, Thunks, Selectors, Middleware)." },
        { id: "m-4", text: "React Performance: Utilize useMemo, useCallback, React.memo, windowing, and code-splitting (React.lazy)." },
        { id: "m-5", text: "Custom Hooks & Architecture: Build robust reusable hooks for fetching, forms, intersection observers, and debouncing." },
        { id: "m-6", text: "Modern Styling: Apply Tailwind CSS or CSS Modules with premium design configurations (glassmorphism, variables)." }
      ]
    },
    {
      id: "phase-2",
      name: "Phase 2: Backend Architecture & APIs",
      description: "Building production-ready, highly secure, scalable Express/Node services.",
      milestones: [
        { id: "m-7", text: "Node.js Under the Hood: Understand Event Loop, Libuv thread pool, Streams, Buffers, and non-blocking I/O." },
        { id: "m-8", text: "RESTful API Best Practices: Set up hierarchical routing, status codes, controller layers, and modular error handlers." },
        { id: "m-9", text: "Express Middleware: Design custom middlewares for logging (Morgan), validation (Joi/Zod), and CORS handling." },
        { id: "m-10", text: "Advanced Authentication: Implement JWTs with HTTP-Only Cookies, Refresh Tokens, bcrypt hashing, and Role-Based Access Control (RBAC)." },
        { id: "m-11", text: "Security Engineering: Configure Helmet.js, express-rate-limit, sanitize inputs to prevent SQLi/XSS, and handle CORS policies." }
      ]
    },
    {
      id: "phase-3",
      name: "Phase 3: DB Design, Modeling & Caching",
      description: "Data design using MongoDB/Mongoose. Query optimization and key caching layers.",
      milestones: [
        { id: "m-12", text: "MongoDB Schema Design: Master One-to-Few (embedded) vs One-to-Many (referenced) document designs." },
        { id: "m-13", text: "Mongoose Query Mastery: Implement virtuals, pre/post hooks, populates, deep populates, and custom statics." },
        { id: "m-14", text: "MongoDB Aggregations: Build complex pipeline stages ($match, $group, $lookup, $unwind, $facet, $project)." },
        { id: "m-15", text: "Performance & Indexing: Create single, compound, and text indexes. Analyze queries using explain() and optimize query paths." },
        { id: "m-16", text: "Caching with Redis: Implement cache-aside pattern on high-traffic API endpoints (e.g., product feeds, user sessions)." }
      ]
    },
    {
      id: "phase-4",
      name: "Phase 4: Devops, Deployment & Integration",
      description: "Packaging systems, containerization, hosting, CI/CD, and real-time connectivity.",
      milestones: [
        { id: "m-17", text: "Real-time Communication: Implement WebSockets via Socket.io for live notifications, heartbeats, and room-based chat." },
        { id: "m-18", text: "Dockerization: Write multi-stage Dockerfiles for React/Node and compose services with docker-compose." },
        { id: "m-19", text: "CI/CD Workflows: Build GitHub Actions workflows for automated testing, linting, and building container images." },
        { id: "m-20", text: "Production AWS Hosting: Set up EC2 instances, configure Nginx as a reverse proxy, SSL/HTTPS via Certbot, and S3 for media." },
        { id: "m-21", text: "Production Monitoring: Integrate structured logging (Winston), APM (PM2), and error trackers (Sentry) for diagnostics." }
      ]
    },
    {
      id: "capstone-projects",
      name: "Production Capstone Projects",
      description: "High-level architectural guidelines for 4 showcase projects that standout on elite resumes.",
      milestones: [
        { id: "proj-1", text: "Project 1: E-Commerce Storefront - Stripe payments, inventory locking, complex filters, RBAC dashboard, invoice emailing, unit testing." },
        { id: "proj-2", text: "Project 2: Real-time Collaborative Board - WebSockets workspace, active cursors, document state sync (OT/CRDT), team channels, rich-text markdown." },
        { id: "proj-3", text: "Project 3: Enterprise SaaS Analytics Dashboard - Stripe subscription plans, dynamic charts (SVG/Canvas), Google OAuth, CSV/PDF exporters." },
        { id: "proj-4", text: "Project 4: Developer Portfolio Community Hub - OAuth login, Elasticsearch/MongoDB fuzzy search, system notifications, markdown post editor." }
      ]
    }
  ],
  systemDesign: [
    {
      title: "HLD Key Building Blocks",
      content: [
        "**Load Balancer (LB)**: Distributes incoming traffic. Layer 4 (Transport, IP-based) vs Layer 7 (Application, Path/Cookie-based). Algorithms: Round Robin, Least Connections, Consistent Hashing.",
        "**Caching Layers**: Cache Aside (App reads/writes directly to Cache and DB), Write-Through (App writes to cache, cache writes to DB), Write-Back (App writes to cache, cache writes to DB asynchronously). Key eviction policies: LRU, LFU, FIFO.",
        "**Database Scaling**: Vertical (scale up CPU/RAM) vs Horizontal (Sharding, Replication). Sharding keys, re-sharding problems. Master-Slave replication (read scalability, write to master).",
        "**CAP Theorem**: Consistency, Availability, Partition Tolerance. Pick two. Network partitions are inevitable, so choose AP (eventual consistency) or CP (strict consistency).",
        "**Message Queues (Kafka/RabbitMQ)**: Decoupling services, handling heavy spikes, pub-sub architectures. Event streaming vs message brokers."
      ]
    },
    {
      title: "LLD & OOP Design Patterns",
      content: [
        "**Creational**: Singleton (Single class instance), Factory Method (Deferred instantiation), Abstract Factory (Family of factories), Builder (Step-by-step assembly of complex objects).",
        "**Structural**: Adapter (Bridge incompatible interfaces), Decorator (Add behaviors dynamically), Facade (Simplified subsystem interface), Proxy (Placeholder/access controller).",
        "**Behavioral**: Observer (One-to-many event notification), Strategy (Swappable algorithms at runtime), State (Change behavior with state), Command (Request encapsulated as object)."
      ]
    },
    {
      title: "System Design Interview Template",
      content: [
        "**Step 1: Scoping / Requirements Gathering (5-10 mins)**: Clarify functional requirements (e.g., 'write tweet', 'view feed') and non-functional requirements (DAU, latency SLA, write/read ratio, CAP choices). Estimate scale (QPS, storage, bandwidth).",
        "**Step 2: API Interface Design (5 mins)**: Define REST or gRPC endpoints. Design payload formats, params, and response codes (e.g., `POST /v1/tweets` with body and auth token).",
        "**Step 3: High-Level Architecture (10 mins)**: Sketch boxes for Clients, Load Balancers, API Gateways, App Services, Database, Caches, and Message Queues. Explain data flow.",
        "**Step 4: Database & Schema Design (5 mins)**: Relational (SQL) vs Document (NoSQL) vs Graph. Define core tables, columns, indexes, and primary/foreign keys.",
        "**Step 5: Scaling, Redundancy, Bottlenecks (15 mins)**: Address single points of failure. Introduce Caches, CDNs, DB replicas, sharding, rate limiting, and message queue buffers to handle spike loads."
      ]
    }
  ],
  mockInterviews: [
    {
      id: "mock-1",
      type: "Coding (DSA)",
      title: "Merge K Sorted Lists",
      difficulty: "Hard",
      description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
      duration: 45, // minutes
      rubric: [
        "Brute force: Collect all values, sort, create new list. O(N log N) space/time, where N is total nodes.",
        "Min-Heap optimization: Push head of all K lists into a Min-Heap. Pop minimum, add to result, push popped node's next. Complexity: O(N log K) time, O(K) space.",
        "Divide and Conquer: Merge lists pairwise (similar to Merge Sort). Complexity: O(N log K) time, O(1) space."
      ]
    },
    {
      id: "mock-2",
      type: "Coding (DSA)",
      title: "Edit Distance (Levenshtein Distance)",
      difficulty: "Hard",
      description: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You have three operations permitted on a word: Insert, Delete, Replace.",
      duration: 45,
      rubric: [
        "Recursive Approach: Check character matching from end. If match: recurse on rest. Else: check insert, delete, replace recursively. O(3^(M+N)) complexity.",
        "Memoization (Top-Down): Cache intermediate results in a 2D grid of size M*N. O(M*N) time and space.",
        "Tabulation (Bottom-Up): dp[i][j] represents edits to convert word1[0...i] to word2[0...j]. dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) if mismatch."
      ]
    },
    {
      id: "mock-3",
      type: "Coding (DSA)",
      title: "Longest Consecutive Sequence",
      difficulty: "Medium",
      description: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.",
      duration: 35,
      rubric: [
        "Sorting approach: O(n log n) is invalid due to constraints.",
        "Set approach: Load all items in a Hash Set. Loop through nums. For each element num, check if num - 1 exists in set. If not, this is the start of a sequence. Count elements num + 1, num + 2, etc.",
        "Time complexity: O(N) because each element is visited at most twice. Space complexity: O(N) for set."
      ]
    },
    {
      id: "mock-4",
      type: "System Design",
      title: "Design a URL Shortening Service (TinyURL)",
      difficulty: "Medium",
      description: "Design a highly available, high-performance URL shortening service like TinyURL. It should take a long URL and return a short URL, and redirect short URLs to long URLs.",
      duration: 45,
      rubric: [
        "Requirement analysis: 100M URLs created/month. Read-heavy (100:1). Fast redirection. No single point of failure.",
        "API Contracts: POST `/v1/shorten` (body: longUrl, returns shortUrl), GET `/{shortCode}` (returns HTTP 302 redirect).",
        "Key Generation Service (KGS): Pre-generate random 7-character base62 strings. Avoid collision by leasing key blocks to application servers.",
        "Database Choice: NoSQL (MongoDB or DynamoDB) is ideal due to key-value nature, scalability, and high read throughput.",
        "Caching: Cache hottest redirections in Redis (e.g., 20% of URLs get 80% traffic). Use LRU eviction."
      ]
    },
    {
      id: "mock-5",
      type: "System Design",
      title: "Design a Rate Limiter",
      difficulty: "Medium",
      description: "Design a rate limiter for an API gateway or backend service. It should throttle client requests exceeding a certain threshold (e.g., 100 requests per minute per IP).",
      duration: 45,
      rubric: [
        "Requirement gathering: Low latency overhead, highly accurate across clustered servers, informative 429 Too Many Requests response.",
        "Algorithms: Token Bucket, Leaking Bucket, Fixed Window Counter, Sliding Window Log, Sliding Window Counter.",
        "Distributed architecture: Store counters in Redis with TTLs. Handle race conditions using Redis Lua scripts or locking.",
        "Client notification: Include Headers like X-RateLimit-Limit, X-RateLimit-Remaining, Retry-After in responses."
      ]
    }
  ]
};

// If browser environment, make it available globally
if (typeof window !== "undefined") {
  window.STUDY_PLANNER_DATA = STUDY_PLANNER_DATA;
}
