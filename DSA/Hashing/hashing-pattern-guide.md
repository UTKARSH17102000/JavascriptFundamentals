# Hashing Pattern in DSA - Complete Guide for SDE 2 Interview

## Table of Contents
1. [What is Hashing?](#what-is-hashing)
2. [Common Hashing Patterns](#common-hashing-patterns)
3. [When to Apply Hashing Pattern](#when-to-apply-hashing-pattern)
4. [JavaScript Implementation Details](#javascript-implementation-details)
5. [Easy Problems](#easy-problems)
6. [Medium Problems](#medium-problems)
7. [Hard Problems](#hard-problems)
8. [How to Identify Hashing Solutions](#how-to-identify-hashing-solutions)
9. [Interview Tips & Pitfalls](#interview-tips--pitfalls)

---

## What is Hashing?

**Hashing** is a technique that maps data of arbitrary size to fixed-size values (indices) using a hash function. In the context of DSA interviews, when we say "hashing pattern," we're typically referring to using hash-based data structures to achieve **O(1) average time complexity** for lookups, insertions, and deletions.

### Core Concepts

- **Hash Function**: Takes a key and returns an integer index
  - `h(key) → integer index`
- **Hash Table**: An array/bucket structure where data is stored based on the hash function result
- **Collision Handling**: When two keys hash to the same index (chaining, open addressing)

### In JavaScript

JavaScript provides several hash-based data structures:

- **`Map`**: Key-value pairs, preserves insertion order, any type as key
- **`Set`**: Collection of unique values, any type
- **Plain Object `{}`**: Key-value pairs, but keys are coerced to strings (use with caution)

### The "Hashing Pattern" in DSA Context

When we talk about the "hashing pattern" in interviews, we mean:
> **Using hash-based data structures (Map/Set/Object) to achieve O(1) lookups, counting, or grouping operations**

---

## Common Hashing Patterns

### 1. Frequency Map (Counting Pattern)

**Goal**: Count how many times each value appears

**Structure**: `Map<value, count>` or `{ value: count }`

**Use Cases**:
- Valid Anagram
- Majority Element
- First Unique Character
- Top K Frequent Elements

**Example Pattern**:
```javascript
const freq = new Map();
for (const item of array) {
    freq.set(item, (freq.get(item) || 0) + 1);
}
```

### 2. Membership/Existence Check (Set Pattern)

**Goal**: Check if a value exists in O(1) time

**Structure**: `Set<value>` or `Map<value, boolean>`

**Use Cases**:
- Contains Duplicate
- Remove Duplicates
- Detect Cycles
- "Have we seen this before?"

**Example Pattern**:
```javascript
const seen = new Set();
if (seen.has(value)) {
    // Found duplicate
}
seen.add(value);
```

### 3. Index Map (Value → Position)

**Goal**: Quickly find the index/indices of a value

**Structure**: `Map<value, index>` or `Map<value, index[]>`

**Use Cases**:
- Two Sum
- Nearest Duplicate
- LRU Cache
- First Missing Positive

**Example Pattern**:
```javascript
const indexMap = new Map();
for (let i = 0; i < array.length; i++) {
    indexMap.set(array[i], i);
}
```

### 4. Prefix Sum + Map (Subarray Pattern)

**Goal**: Find subarrays with specific sum properties

**Structure**: `Map<prefixSum, countOfOccurrences>`

**Use Cases**:
- Subarray Sum Equals K
- Longest Subarray with Sum K
- Count Subarrays with Equal 0s and 1s
- Continuous Subarray Sum

**Example Pattern**:
```javascript
const prefixMap = new Map();
prefixMap.set(0, 1); // Important initialization
let currSum = 0;
for (const num of nums) {
    currSum += num;
    const needed = currSum - k;
    if (prefixMap.has(needed)) {
        count += prefixMap.get(needed);
    }
    prefixMap.set(currSum, (prefixMap.get(currSum) || 0) + 1);
}
```

### 5. Signature/Grouping Map

**Goal**: Group items by a "signature" (normalized representation)

**Structure**: `Map<signature, listOfItems>`

**Use Cases**:
- Group Anagrams (signature = sorted string)
- Group by remainder
- Group by parity
- Group by transformation

**Example Pattern**:
```javascript
const groups = new Map();
for (const item of items) {
    const signature = getSignature(item);
    if (!groups.has(signature)) {
        groups.set(signature, []);
    }
    groups.get(signature).push(item);
}
```

---

## When to Apply Hashing Pattern

You should think "hashmap/hashset" when you see these signals:

### ✅ Signals to Use Hashing

1. **Need O(1) Lookups**
   - "Is X present?"
   - "Have I seen this before?"
   - "How many times has this appeared?"

2. **Pairs/Complements**
   - "Find two numbers that sum to K"
   - "Find if there is a pair with difference K"
   - "Find two strings with some relation"

3. **Subarrays/Substrings with Conditions**
   - "Subarray sum equals K"
   - "Longest substring without repeating characters"
   - "Count number of subarrays with even sum"
   - Often combines with **sliding window** or **prefix sum**

4. **Grouping/Classification**
   - "Group anagrams"
   - "Group people by age"
   - "Group strings by some transformation"

5. **De-duplication**
   - "Remove duplicates"
   - "Find intersection/union of arrays"

### 🎯 Quick Decision Rule

If you can phrase your need as:
> "I need to remember something about values I've seen before, and retrieve it in O(1)"

Then hashing is likely the right pattern!

---

## JavaScript Implementation Details

### Best Practices

**For Interviews**: Always use `Map` and `Set` instead of plain objects when possible

```javascript
// ✅ Preferred
const map = new Map();
const set = new Set();

// ⚠️ Use objects only when keys are simple strings/numbers
const freq = {};
```

### Common Patterns

**Increment Count**:
```javascript
map.set(key, (map.get(key) || 0) + 1);
```

**Add if Not Exists**:
```javascript
if (!map.has(key)) {
    map.set(key, value);
}
```

**Frequency with Objects** (only when keys are simple):
```javascript
const freq = {};
freq[x] = (freq[x] || 0) + 1;
```

**Check and Update**:
```javascript
if (map.has(key)) {
    // Do something with existing value
    map.set(key, map.get(key) + 1);
} else {
    map.set(key, 1);
}
```

---

## Easy Problems

### Problem 1: Two Sum (LeetCode 1)

**Problem**: Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.

**Example**:
```
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
```

#### Naive Approach (Brute Force)

```javascript
function twoSum(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}
```
**Time Complexity**: O(n²)  
**Space Complexity**: O(1)

#### Hashing Approach

**Key Insight**: For each number `x`, we need to find `target - x` (complement). If we've seen the complement before, we're done!

**Data Structure**: `Map<number, index>` - stores each number and its index

```javascript
function twoSum(nums, target) {
    const map = new Map(); // num -> index
    
    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        const complement = target - num;
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(num, i);
    }
    
    return []; // Should not reach here per problem constraints
}
```

**Time Complexity**: O(n)  
**Space Complexity**: O(n)

#### Dry Run

**Input**: `nums = [2, 7, 11, 15]`, `target = 9`

| Step | i | num | complement | map before | Action | map after |
|------|---|-----|------------|------------|--------|-----------|
| 0 | 0 | 2 | 7 | `{}` | 7 not in map | `{2: 0}` |
| 1 | 1 | 7 | 2 | `{2: 0}` | 2 found at index 0! | Return `[0, 1]` |

**Why Hashing Helps**: 
- Brute force: Check every pair → O(n²)
- Hashing: One pass, O(1) lookup per element → O(n)

---

### Problem 2: Valid Anagram (LeetCode 242)

**Problem**: Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.

**Example**:
```
Input: s = "anagram", t = "nagaram"
Output: true
```

#### Approach

**Key Insight**: Two strings are anagrams if they have the same character frequencies.

**Strategy**:
1. Count frequency of each character in `s`
2. Decrement frequency for each character in `t`
3. If all frequencies are zero, they're anagrams

```javascript
function isAnagram(s, t) {
    if (s.length !== t.length) return false;
    
    const freq = {};
    
    // Count characters in s
    for (const ch of s) {
        freq[ch] = (freq[ch] || 0) + 1;
    }
    
    // Decrement for characters in t
    for (const ch of t) {
        if (!freq[ch]) return false; // Character not in s or already used up
        freq[ch]--;
    }
    
    return true;
}
```

**Time Complexity**: O(n) where n is length of strings  
**Space Complexity**: O(1) - at most 26 characters for lowercase English

#### Dry Run

**Input**: `s = "anagram"`, `t = "nagaram"`

**Step 1 - Build frequency map from `s`**:
```
freq = {
    'a': 3,
    'n': 1,
    'g': 1,
    'r': 1,
    'm': 1
}
```

**Step 2 - Process `t`**:
- 'n': freq['n'] = 1 → 0 ✓
- 'a': freq['a'] = 3 → 2 ✓
- 'g': freq['g'] = 1 → 0 ✓
- 'a': freq['a'] = 2 → 1 ✓
- 'r': freq['r'] = 1 → 0 ✓
- 'a': freq['a'] = 1 → 0 ✓
- 'm': freq['m'] = 1 → 0 ✓

All frequencies are zero → **Return `true`**

---

## Medium Problems

### Problem 1: Subarray Sum Equals K (LeetCode 560)

**Problem**: Given an array of integers `nums` and an integer `k`, return the total number of continuous subarrays whose sum equals `k`.

**Example**:
```
Input: nums = [1,1,1], k = 2
Output: 2
Explanation: The subarrays [1,1] and [1,1] have sum 2.
```

#### Naive Approach

```javascript
function subarraySum(nums, k) {
    let count = 0;
    for (let i = 0; i < nums.length; i++) {
        let sum = 0;
        for (let j = i; j < nums.length; j++) {
            sum += nums[j];
            if (sum === k) count++;
        }
    }
    return count;
}
```
**Time Complexity**: O(n²)  
**Space Complexity**: O(1)

#### Prefix Sum + Hash Map Approach

**Key Insight**: 
- If `prefix[i]` = sum of elements from index 0 to i
- Sum of subarray from index `j+1` to `i` = `prefix[i] - prefix[j]`
- We need: `prefix[i] - prefix[j] = k`
- Which means: `prefix[j] = prefix[i] - k`

**Strategy**:
- Maintain a map: `prefixSum → count of occurrences`
- For each current sum, check if `currentSum - k` exists in map
- Initialize map with `0 → 1` (for subarrays starting at index 0)

```javascript
function subarraySum(nums, k) {
    const map = new Map(); // sum -> count
    map.set(0, 1); // Important: for subarrays starting at index 0
    
    let currSum = 0;
    let count = 0;
    
    for (const num of nums) {
        currSum += num;
        
        const needed = currSum - k;
        if (map.has(needed)) {
            count += map.get(needed);
        }
        
        // Update map with current sum
        map.set(currSum, (map.get(currSum) || 0) + 1);
    }
    
    return count;
}
```

**Time Complexity**: O(n)  
**Space Complexity**: O(n)

#### Dry Run

**Input**: `nums = [1, 1, 1]`, `k = 2`

| Step | num | currSum | needed (currSum - k) | map before | count | map after |
|------|-----|---------|---------------------|------------|-------|-----------|
| Init | - | 0 | - | `{0: 1}` | 0 | - |
| 1 | 1 | 1 | -1 | `{0: 1}` | 0 | `{0: 1, 1: 1}` |
| 2 | 1 | 2 | 0 | `{0: 1, 1: 1}` | 0 + 1 = 1 | `{0: 1, 1: 1, 2: 1}` |
| 3 | 1 | 3 | 1 | `{0: 1, 1: 1, 2: 1}` | 1 + 1 = 2 | `{0: 1, 1: 1, 2: 1, 3: 1}` |

**Explanation**:
- Step 2: `currSum = 2`, `needed = 0`. Map has `0` with count 1 → Found subarray `[1,1]` (indices 0-1)
- Step 3: `currSum = 3`, `needed = 1`. Map has `1` with count 1 → Found subarray `[1,1]` (indices 1-2)

**Result**: `2`

**Why Hashing Helps**: 
- Instead of recalculating sums for every subarray (O(n²)), we reuse previous prefix sums stored in the map (O(1) lookup)

---

### Problem 2: Group Anagrams (LeetCode 49)

**Problem**: Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.

**Example**:
```
Input: strs = ["eat","tea","tan","ate","nat","bat"]
Output: [["bat"],["nat","tan"],["ate","eat","tea"]]
```

#### Approach

**Key Insight**: Two strings are anagrams if their sorted character arrays are identical.

**Strategy**: Use sorted string as a "signature" to group anagrams

```javascript
function groupAnagrams(strs) {
    const map = new Map(); // key: sorted string, value: array of anagrams
    
    for (const s of strs) {
        // Create signature by sorting characters
        const key = s.split('').sort().join('');
        
        if (!map.has(key)) {
            map.set(key, []);
        }
        
        map.get(key).push(s);
    }
    
    return Array.from(map.values());
}
```

**Time Complexity**: O(n * k log k) where n is number of strings, k is average length  
**Space Complexity**: O(n * k)

#### Dry Run

**Input**: `strs = ["eat","tea","tan","ate","nat","bat"]`

| String | Sorted (Key) | Map State |
|--------|--------------|-----------|
| "eat" | "aet" | `{"aet": ["eat"]}` |
| "tea" | "aet" | `{"aet": ["eat", "tea"]}` |
| "tan" | "ant" | `{"aet": ["eat", "tea"], "ant": ["tan"]}` |
| "ate" | "aet" | `{"aet": ["eat", "tea", "ate"], "ant": ["tan"]}` |
| "nat" | "ant" | `{"aet": ["eat", "tea", "ate"], "ant": ["tan", "nat"]}` |
| "bat" | "abt" | `{"aet": ["eat", "tea", "ate"], "ant": ["tan", "nat"], "abt": ["bat"]}` |

**Result**: `[["eat","tea","ate"], ["tan","nat"], ["bat"]]`

**Pattern**: This is the **group-by-signature** pattern using hash map

---

### Problem 3: Longest Substring Without Repeating Characters (LeetCode 3)

**Problem**: Given a string `s`, find the length of the longest substring without repeating characters.

**Example**:
```
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
```

#### Approach

**Key Insight**: Use **sliding window** + **hash map** to track last seen index of each character

**Strategy**:
- Maintain a window `[start, i]` with no repeating characters
- For each character at index `i`:
  - If character was seen before at index `prev` AND `prev >= start`:
    - Move `start` to `prev + 1`
  - Update last seen index of character to `i`
  - Update answer with current window length

```javascript
function lengthOfLongestSubstring(s) {
    const indexMap = new Map(); // char -> last index
    let start = 0;
    let maxLen = 0;
    
    for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        
        // If character seen before and within current window
        if (indexMap.has(ch) && indexMap.get(ch) >= start) {
            start = indexMap.get(ch) + 1;
        }
        
        indexMap.set(ch, i);
        
        const windowLen = i - start + 1;
        if (windowLen > maxLen) {
            maxLen = windowLen;
        }
    }
    
    return maxLen;
}
```

**Time Complexity**: O(n)  
**Space Complexity**: O(min(n, m)) where m is size of character set

#### Dry Run

**Input**: `s = "abcabcbb"`

| i | ch | indexMap before | start | Action | indexMap after | windowLen | maxLen |
|---|----|-----------------|-------|--------|----------------|-----------|--------|
| 0 | 'a' | `{}` | 0 | Add 'a' → 0 | `{'a': 0}` | 1 | 1 |
| 1 | 'b' | `{'a': 0}` | 0 | Add 'b' → 1 | `{'a': 0, 'b': 1}` | 2 | 2 |
| 2 | 'c' | `{'a': 0, 'b': 1}` | 0 | Add 'c' → 2 | `{'a': 0, 'b': 1, 'c': 2}` | 3 | **3** |
| 3 | 'a' | `{'a': 0, 'b': 1, 'c': 2}` | 0 | 'a' seen at 0 ≥ start(0) → start = 1 | `{'a': 3, 'b': 1, 'c': 2}` | 3 | 3 |
| 4 | 'b' | `{'a': 3, 'b': 1, 'c': 2}` | 1 | 'b' seen at 1 ≥ start(1) → start = 2 | `{'a': 3, 'b': 4, 'c': 2}` | 3 | 3 |
| 5 | 'c' | `{'a': 3, 'b': 4, 'c': 2}` | 2 | 'c' seen at 2 ≥ start(2) → start = 3 | `{'a': 3, 'b': 4, 'c': 5}` | 3 | 3 |
| 6 | 'b' | `{'a': 3, 'b': 4, 'c': 5}` | 3 | 'b' seen at 4 ≥ start(3) → start = 5 | `{'a': 3, 'b': 6, 'c': 5}` | 2 | 3 |
| 7 | 'b' | `{'a': 3, 'b': 6, 'c': 5}` | 5 | 'b' seen at 6 ≥ start(5) → start = 7 | `{'a': 3, 'b': 7, 'c': 5}` | 1 | 3 |

**Result**: `3` (substring "abc" at indices 0-2)

**Pattern**: Hash map remembers last seen index, allowing O(1) window adjustment

---

## Hard Problems

### Problem: Minimum Window Substring (LeetCode 76)

**Problem**: Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window. If there is no such window, return the empty string `""`.

**Example**:
```
Input: s = "ADOBECODEBANC", t = "ABC"
Output: "BANC"
Explanation: The minimum window substring "BANC" includes 'A', 'B', and 'C' from string t.
```

#### Approach

**Key Insight**: This combines:
- **Frequency map** for target string `t`
- **Frequency map** for current window
- **Sliding window** with two pointers

**Strategy**:
1. Build `need` map: frequency of each character in `t`
2. Track `required`: number of distinct characters in `t`
3. Expand window by moving `right` pointer:
   - Add `s[right]` to window frequency map
   - If frequency matches `need`, increment `formed` counter
4. When `formed === required`, we have a valid window:
   - Try to shrink from `left` to find minimum:
     - Update answer if current window is smaller
     - Remove `s[left]` from window
     - If frequency drops below `need`, decrement `formed`
     - Move `left++`
5. Continue until `right` reaches end

```javascript
function minWindow(s, t) {
    if (t.length === 0 || s.length === 0) return "";
    
    // Build need map: frequency of each character in t
    const need = new Map();
    for (const ch of t) {
        need.set(ch, (need.get(ch) || 0) + 1);
    }
    const required = need.size; // Number of distinct characters needed
    
    // Sliding window variables
    let left = 0, right = 0;
    let formed = 0; // Number of distinct characters with correct frequency
    const window = new Map(); // Frequency map for current window
    
    // Answer: [windowLength, leftIndex, rightIndex]
    let ans = [Infinity, 0, 0];
    
    while (right < s.length) {
        const ch = s[right];
        
        // Add character to window
        window.set(ch, (window.get(ch) || 0) + 1);
        
        // Check if this character's frequency now matches need
        if (need.has(ch) && window.get(ch) === need.get(ch)) {
            formed++;
        }
        
        // Try to shrink window from left while it's still valid
        while (left <= right && formed === required) {
            // Update answer if current window is smaller
            const windowLen = right - left + 1;
            if (windowLen < ans[0]) {
                ans = [windowLen, left, right];
            }
            
            // Remove left character from window
            const leftCh = s[left];
            window.set(leftCh, window.get(leftCh) - 1);
            
            // If removing this character breaks the validity
            if (need.has(leftCh) && window.get(leftCh) < need.get(leftCh)) {
                formed--;
            }
            
            left++;
        }
        
        right++;
    }
    
    return ans[0] === Infinity ? "" : s.slice(ans[1], ans[2] + 1);
}
```

**Time Complexity**: O(|s| + |t|)  
**Space Complexity**: O(|s| + |t|)

#### Dry Run (High-Level)

**Input**: `s = "ADOBECODEBANC"`, `t = "ABC"`

**Step 1 - Build need map**:
```
need = {
    'A': 1,
    'B': 1,
    'C': 1
}
required = 3
```

**Step 2 - Expand window**:
- `right = 0-5`: Window "ADOBEC" → Has A, B, C → `formed = 3` ✓
- Shrink: "ADOBEC" → "DOBEC" → "OBEC" → "BEC" (still valid, length 3)
- Continue expanding...

**Step 3 - Find minimum**:
- Eventually find "BANC" at indices 9-12 with length 4
- This is smaller than previous valid windows

**Result**: `"BANC"`

**Pattern**: Hash maps track "how many of each character we need vs have", enabling O(1) validity checks

---

## How to Identify Hashing Solutions

### Systematic Approach

When reading a problem, ask yourself:

1. **Do I need to know if I've seen this value/index before?**
   - ✅ Yes → Need `Set` or `Map`

2. **Do I need counts/frequencies of elements?**
   - ✅ Yes → Frequency map

3. **Is there a complement/pairing logic?**
   - ✅ Yes → Store seen values in map for O(1) complement lookup
   - Examples: `a + b = k`, `a - b = k`, `a * b = k`

4. **Am I dealing with subarrays/substrings?**
   - **Sums** → Prefix sum + hash map
   - **Uniqueness/No repeats** → Sliding window + hash map/set

5. **Do I need to group items by some property?**
   - ✅ Yes → Use that property as key in `Map`

### Time Complexity Hints

- If constraints are like `n <= 10^5` or `10^6` and brute force is O(n²), you likely need hashing
- Hashing is good when you want to **trade space for time**

### Common LeetCode Problems by Pattern

#### Frequency Map
- Valid Anagram (242)
- Top K Frequent Elements (347)
- Ransom Note (383)
- First Unique Character (387)

#### Set/Existence
- Contains Duplicate (217)
- Longest Consecutive Sequence (128)
- Happy Number (202)
- Intersection of Two Arrays (349)

#### Prefix Sum + Hash Map
- Subarray Sum Equals K (560)
- Continuous Subarray Sum (523)
- Binary Subarrays With Sum (930)
- Subarray Sums Divisible by K (974)

#### Sliding Window + Hash Map
- Longest Substring Without Repeating Characters (3)
- Minimum Window Substring (76)
- Longest Repeating Character Replacement (424)
- Fruit Into Baskets (904)

#### Grouping/Signature
- Group Anagrams (49)
- Group Shifted Strings (249)
- Find All Anagrams in a String (438)

---

## Interview Tips & Pitfalls

### ✅ Best Practices

1. **Always use `Map`/`Set` over plain objects** when:
   - Keys are not simple strings
   - You need better performance
   - Code clarity matters

2. **Be explicit about your pattern**:
   - "I'm using a hash map to store frequency of characters"
   - "I'm using a set to quickly check membership"
   - "I use a map from prefix sum to count of occurrences"

3. **Watch for off-by-one errors**:
   - In prefix sum problems, be clear: does prefix sum at index `i` include `nums[i]`?
   - Always initialize `map.set(0, 1)` when counting subarrays starting at index 0

### ⚠️ Common Pitfalls

1. **Space Complexity**:
   - Interviewers often ask: "What is the space complexity of your hash map?"
   - Answer: O(n) in worst case (all distinct elements)

2. **Collision Handling**:
   - You don't manually handle collisions in high-level languages
   - But know conceptually:
     - Average case: O(1)
     - Worst case: O(n) if many collisions (rare with good implementations)

3. **Key Type Confusion**:
   - Objects coerce keys to strings: `{1: 'a', '1': 'b'}` → only one key!
   - Use `Map` to avoid this issue

4. **Initialization Mistakes**:
   - Forgetting to initialize `map.set(0, 1)` in prefix sum problems
   - Not handling empty input cases

5. **Updating Map Incorrectly**:
   ```javascript
   // ❌ Wrong - doesn't handle undefined
   map.set(key, map.get(key) + 1);
   
   // ✅ Correct
   map.set(key, (map.get(key) || 0) + 1);
   ```

### 🎯 Communication Tips

1. **Explain your thought process**:
   - "I'll use a hash map because I need O(1) lookups"
   - "I'm storing prefix sums to avoid recalculating subarray sums"

2. **Mention trade-offs**:
   - "This solution uses O(n) extra space to achieve O(n) time instead of O(n²)"

3. **Discuss edge cases**:
   - Empty input
   - Single element
   - All elements same
   - Very large input

### 📝 Practice Strategy

1. **Pattern Recognition**: Practice identifying which hashing pattern applies
2. **Code Templates**: Memorize common patterns (frequency map, prefix sum, etc.)
3. **Dry Runs**: Always trace through examples manually
4. **Time/Space Analysis**: Always state complexity clearly

---

## Summary

The **hashing pattern** is one of the most powerful techniques in DSA interviews. It allows you to:

- ✅ Achieve O(1) lookups, insertions, deletions
- ✅ Count frequencies efficiently
- ✅ Group and classify data
- ✅ Solve subarray/substring problems with prefix sums
- ✅ Implement sliding window optimizations

**Remember**: If you need to "remember something about values you've seen before" and retrieve it quickly, hashing is your friend!

---

## Additional Resources

- Practice more problems on LeetCode with "hash table" tag
- Study collision handling techniques (chaining, open addressing)
- Learn about hash functions and their properties
- Practice explaining solutions clearly in mock interviews

**Good luck with your SDE 2 interview! 🚀**
