# Binary Search Template

## Lowest/ Minimum/ First_True

if you want to find the lowest x satisfying f(x)

    int l=lowest_possible_value-1,r=highest_possible_value,m;
    while(r-l>1)
    {
        m=l+(r-l)/2;
    
        if(f(m))
            r=m;
        else 
            l=m;
    }
    return r;

    // F F F F F T T T T T T T T T T

    int first_true(int lo, int hi, function<bool(int)> f) {
        hi++;
        while (lo < hi) {
            int mid = lo + (hi - lo) / 2;
            if (f(mid)) {
                hi = mid;
            } else {
                lo = mid + 1;
            }
        }
        return lo;
    }

## Highest/ Maximum/ Last_True

if you want to find the highest x satisfying g(x)

    int l=lowest_possible_value,r=highest_possible_value+1,m;
    while(r-l>1)
    {
        m=l+(r-l)/2;
        if(g(m))
            l=m;
        else 
            r=m;
    }
    return l;
    
    // T T T T T T T T T T f f f f

    int last_true(int lo, int hi, function<bool(int)> f) {
        lo--;
        while (lo < hi) {
            int mid = lo + (hi - lo + 1) / 2;
            if (f(mid)) {
                lo = mid;
            } else {
                hi = mid - 1;
            }
        }
        return lo;
    }

## Lower Bound and upper Bound

    class Solution {
    public:
        int lowerBound(vector<int>& nums, int target) {
            int l = 0;
            int r = nums.size() - 1;
            int ans = -1;
            while (l<=r) {
                int m = l + (r - l) / 2;
                if(nums[m] ==  target){
                    ans  = m;
                    r = m-1;
                }
                else if (nums[m] > target)
                    r = m-1;
                else
                    l = m+1;
            }
                return ans;
        }
    
        int upperBound(vector<int>& nums, int target) {
            int l = 0;
            int r = nums.size() - 1;
            int ans = -1;
            while (l <= r) {
                int m = l + (r - l) / 2;
                if(nums[m] == target){
                    ans = m;
                    l = m+1;
                }
                else if (nums[m] < target)
                    l = m+1;
                else
                    r = m-1;
            }
                return ans;
        }
        vector<int> searchRange(vector<int>& nums, int target) {
            int lb = lowerBound(nums, target);
            int ub = upperBound(nums, target);
            cout<<lb<<" "<<ub;
            return {lb, ub};
    
        }
    };

## Binary Search on Floating Point Number

    double diff = 1e-6 ;
    while (high - low > diff) {
        double mid = (low + high) / (2.0);
        int cnt = helper(mid, arr);
        if (cnt > k) {
            low = mid;
        }
        else {
            high = mid;
        }
    }
Practice question: [Minimize Max Distance to Gas Station](https://www.naukri.com/code360/problems/minimise-max-distance_7541449)

## Common Mistakes

### Infinite Loop

- The reason for an infinite loop is when `r` is one more than `l` and `f(l)` evaluates to true. `m` will be defined as 
$\lfloor \frac {l + r} 2 \rfloor = l$ , and will thus evaluate to true, which means that $l$ and $r$ have not changed in the loop. By adding $1$ to the expression, $\lfloor \frac {l + r + 1} 2 \rfloor$
 will instead evaluate to $r$ which will break the loop.

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

Best to ye hai ans alg store kra and update `l = m + 1`  and `r = m - 1`. (See Lower Bound Upperbound Implementation)

