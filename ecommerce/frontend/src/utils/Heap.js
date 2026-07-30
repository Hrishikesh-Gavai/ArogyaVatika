// utils/Heap.js - Simplified for price sorting only

class Heap {
  // Sort products by price only (using amt field)
  static sortByPrice(products, order = 'asc') {
    if (!products.length) return products;
    
    const productsCopy = [...products];
    
    // Simple heap sort implementation for prices
    const heapSort = (arr, isAscending) => {
      const n = arr.length;
      
      // Build heap
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i, isAscending);
      }
      
      // Extract elements from heap
      for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        heapify(arr, i, 0, isAscending);
      }
      
      return arr;
    };
    
    const heapify = (arr, n, i, isAscending) => {
      let extreme = i;
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      
      if (isAscending) {
        if (left < n && arr[left].amt < arr[extreme].amt) extreme = left;
        if (right < n && arr[right].amt < arr[extreme].amt) extreme = right;
      } else {
        if (left < n && arr[left].amt > arr[extreme].amt) extreme = left;
        if (right < n && arr[right].amt > arr[extreme].amt) extreme = right;
      }
      
      if (extreme !== i) {
        [arr[i], arr[extreme]] = [arr[extreme], arr[i]];
        heapify(arr, n, extreme, isAscending);
      }
    };
    
    return heapSort(productsCopy, order === 'asc');
  }
}

export default Heap;
