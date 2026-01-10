// utils/Trie.js - Perfect for product name prefix searching

class TrieNode {
  constructor() {
    this.children = new Map(); // Map of character to TrieNode
    this.products = [];       // Products that match this node
    this.isEndOfWord = false; // Marks end of a product name
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
    this.totalProducts = 0;
  }

  // Build Trie from product array
  build(products) {
    this.root = new TrieNode();
    this.totalProducts = 0;
    
    products.forEach(product => {
      this.insert(product);
    });
  }

  // Insert a product into the Trie
  insert(product) {
    const productName = product.p_name.toLowerCase().trim();
    let currentNode = this.root;

    for (let i = 0; i < productName.length; i++) {
      const char = productName[i];
      
      if (!currentNode.children.has(char)) {
        currentNode.children.set(char, new TrieNode());
      }
      
      currentNode = currentNode.children.get(char);
      
      // Add product to current node (for prefix matching)
      currentNode.products.push(product);
    }

    currentNode.isEndOfWord = true;
    this.totalProducts++;
  }

  // Search products by name prefix
  searchByName(keyword) {
    if (!keyword.trim()) {
      return this.getAllProducts();
    }

    const searchTerm = keyword.toLowerCase().trim();
    let currentNode = this.root;

    // Traverse to the node representing the prefix
    for (let i = 0; i < searchTerm.length; i++) {
      const char = searchTerm[i];
      
      if (!currentNode.children.has(char)) {
        return []; // No products found with this prefix
      }
      
      currentNode = currentNode.children.get(char);
    }

    // Return all products from this node and its children (for prefix search)
    return this.getAllProductsFromNode(currentNode);
  }

  // Get all products from a node and its children
  getAllProductsFromNode(node) {
    const results = new Set(); // Use Set to avoid duplicates
    this.collectProducts(node, results);
    return Array.from(results);
  }

  // Recursively collect all products from node and children
  collectProducts(node, results) {
    if (!node) return;

    // Add all products from current node
    node.products.forEach(product => {
      results.add(product); // Set automatically handles duplicates
    });

    // Recursively collect from all children
    for (let [char, childNode] of node.children) {
      this.collectProducts(childNode, results);
    }
  }

  // Get all products (in alphabetical order)
  getAllProducts() {
    const results = new Set();
    this.collectAllProducts(this.root, results);
    return Array.from(results);
  }

  // Collect all products in alphabetical order
  collectAllProducts(node, results) {
    if (!node) return;

    // Add current node's products
    node.products.forEach(product => {
      results.add(product);
    });

    // Get children in alphabetical order
    const sortedChars = Array.from(node.children.keys()).sort();
    
    for (let char of sortedChars) {
      this.collectAllProducts(node.children.get(char), results);
    }
  }

  // Get Trie statistics
  getStats() {
    const stats = {
      totalProducts: this.totalProducts,
      totalNodes: this.countNodes(this.root),
      treeHeight: this.calculateHeight(this.root)
    };
    return stats;
  }

  countNodes(node) {
    if (!node) return 0;
    
    let count = 1; // Count current node
    
    for (let [char, childNode] of node.children) {
      count += this.countNodes(childNode);
    }
    
    return count;
  }

  calculateHeight(node) {
    if (!node || node.children.size === 0) return 0;
    
    let maxHeight = 0;
    for (let [char, childNode] of node.children) {
      maxHeight = Math.max(maxHeight, this.calculateHeight(childNode));
    }
    
    return maxHeight + 1;
  }

  // Print Trie structure (for debugging)
  print() {
    console.log('Trie Structure:');
    this.printNode(this.root, '');
  }

  printNode(node, prefix) {
    console.log(`${prefix}Products: ${node.products.length}`);
    
    const sortedChars = Array.from(node.children.keys()).sort();
    for (let char of sortedChars) {
      console.log(`${prefix}└── "${char}"`);
      this.printNode(node.children.get(char), prefix + '    ');
    }
  }
}

export default Trie;
