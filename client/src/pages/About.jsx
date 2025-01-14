import React from "react";
// import Markdown from "react-markdown";
// import remarkGfm from "remark-gfm"; // For GitHub-flavored Markdown (optional)
// import './common.css'
// import DashboardSidebar from '../components/DashboardSidebar'

const markdownContent = `
# Binary Search Template

## Lowest/ Minimum/ First_True

If you want to find the lowest x satisfying f(x):

\`\`\`cpp
int l = lowest_possible_value - 1, r = highest_possible_value, m;
while (r - l > 1) {
    m = l + (r - l) / 2;

    if (f(m))
        r = m;
    else 
        l = m;
}
return r;
\`\`\`

## Highest/ Maximum/ Last_True

If you want to find the highest x satisfying g(x):

\`\`\`cpp
int l = lowest_possible_value, r = highest_possible_value + 1, m;
while (r - l > 1) {
    m = l + (r - l) / 2;
    if (g(m))
        l = m;
    else 
        r = m;
}
return l;
\`\`\`

## Lower Bound and Upper Bound

\`\`\`cpp
class Solution {
public:
    int lowerBound(vector<int>& nums, int target) {
        int l = 0, r = nums.size() - 1, ans = -1;
        while (l <= r) {
            int m = l + (r - l) / 2;
            if (nums[m] == target) {
                ans = m;
                r = m - 1;
            } else if (nums[m] > target) {
                r = m - 1;
            } else {
                l = m + 1;
            }
        }
        return ans;
    }

    int upperBound(vector<int>& nums, int target) {
        int l = 0, r = nums.size() - 1, ans = -1;
        while (l <= r) {
            int m = l + (r - l) / 2;
            if (nums[m] == target) {
                ans = m;
                l = m + 1;
            } else if (nums[m] < target) {
                l = m + 1;
            } else {
                r = m - 1;
            }
        }
        return ans;
    }

    vector<int> searchRange(vector<int>& nums, int target) {
        int lb = lowerBound(nums, target);
        int ub = upperBound(nums, target);
        return {lb, ub};
    }
};
\`\`\`

---

Practice question: [Minimize Max Distance to Gas Station](https://www.naukri.com/code360/problems/minimise-max-distance_7541449)
## Common Mistakes

### Infinite Loop

- The reason for an infinite loop is when \`r\` is one more than \`l\` and \`f(l)\` evaluates to true. \`m\` will be defined as 

\`\`\`math
\lfloor \frac {l + r} 2 \rfloor = l
\`\`\`

and will thus evaluate to true, which means that \`l\` and \`r\` have not changed in the loop. By adding \`1\` to the expression:

\`\`\`math
\lfloor \frac {l + r + 1} 2 \rfloor
\`\`\`

will instead evaluate to \`r\` which will break the loop.

\`\`\`cpp
int find_max_true(int l, int r, function<bool(int)> f) {
    while (l < r) {
        int m = (l + r + 1) / 2;  // change (l + r) / 2
        if (f(m)) {
            l = m;
        } else {
            r = m - 1;
        }
    }
    return l;
}
\`\`\`

---

Best to store the answer and update \`l = m + 1\` and \`r = m - 1\` as shown in the lower and upper bound implementation.
![test image](../assets/cat.jpg)
![test image](https://i.pinimg.com/originals/e7/62/14/e76214d0fe4fcb8fedfe274d4a2537c3.jpg)
`;

export default function About() {
  return (
    // <div className='min-h-screen flex flex-col md:flex-row'>
    // <div className='w-56 hidden md:inline'>
    //           {/* sidebar */}
    //           <DashboardSidebar/>
    // </div>
    <div className='min-h-screen' style={{ padding: "16px", maxWidth: "800px", margin: "0 auto" }}>
       {/* <Markdown>
        {markdownContent}
      </Markdown>  */}
      About
    </div>
    // </div>
  );
}



// https://www.youtube.com/watch?v=AEmy6FXdzyk
// https://www.youtube.com/watch?v=DXFc8MNUZQM
// https://www.npmjs.com/package/react-markdown
//https://www.npmjs.com/package/react-syntax-highlighter
// what learn
// markdown likh css likh react markdown ka use kar ke render