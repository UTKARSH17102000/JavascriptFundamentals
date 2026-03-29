/**
 * Soni Frontend — Medium — Custom sort (Freshworks) — quicksort in-place
 */

const sortArray = function (nums) {
  function quickSort(l, h) {
    if (l >= h) return;
    const index = partition(l, h);
    quickSort(l, index - 1);
    quickSort(index, h);
  }

  function partition(l, h) {
    const pivot = nums[Math.floor((l + h) / 2)];
    while (l <= h) {
      while (nums[l] < pivot) l++;
      while (nums[h] > pivot) h--;
      if (l <= h) {
        [nums[l], nums[h]] = [nums[h], nums[l]];
        l++;
        h--;
      }
    }
    return l;
  }

  quickSort(0, nums.length - 1);
  return nums;
};

const arr = [21, 31, 45, 56, 43];
console.log(sortArray([...arr]));
