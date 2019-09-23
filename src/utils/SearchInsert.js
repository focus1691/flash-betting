const SearchInsert = (nums, target) => {
    var start = 0;
    var end = nums.length - 1;
    var index = Math.floor((end - start) / 2) + start;
    
    if (target > nums[nums.length-1]) {
        // The target is beyond the end of this array.
        index = nums.length;
    }
    else {
        // Start in middle, divide and conquer.
        while (start < end) {
            // Get value at current index.
            var value = nums[index][0];
            
            if (value === target) {
                // Found our target.
                break;
            }
            else if (target < value) {
                // Target is lower in array, move the index halfway down.
                end = index;
            }
            else {
                // Target is higher in array, move the index halfway up.
                start = index + 1;
            }
            
            // Get next mid-point.
            index = Math.floor((end - start) / 2) + start;
        }
    }
    
    return index;
};

export { SearchInsert };