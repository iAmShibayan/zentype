import { Snippet } from './types';

export const snippets: Snippet[] = [
  // --- EASY (3-5 lines) ---
  {
    id: 'easy-1',
    language: 'javascript',
    category: 'arrays',
    difficulty: 'easy',
    description: 'Basic Map',
    code: `const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map((num) => {
  return num * 2;
});`
  },
  {
    id: 'easy-2',
    language: 'javascript',
    category: 'functions',
    difficulty: 'easy',
    description: 'Simple Greeting',
    code: `function createGreeting(name) {
  const greeting = "Hello, " + name;
  return greeting;
}`
  },
  {
    id: 'easy-3',
    language: 'javascript',
    category: 'objects',
    difficulty: 'easy',
    description: 'Object Props',
    code: `const user = {
  id: 1,
  username: "jdoe",
  isActive: true
};`
  },
  {
    id: 'easy-4',
    language: 'javascript',
    category: 'dom',
    difficulty: 'easy',
    description: 'Query Selector',
    code: `const button = document.querySelector('#btn');
if (button) {
  button.click();
}`
  },
  {
    id: 'easy-5',
    language: 'javascript',
    category: 'async',
    difficulty: 'easy',
    description: 'Simple Promise',
    code: `const promise = new Promise((resolve) => {
  setTimeout(() => {
    resolve("Done!");
  }, 1000);
});`
  },
  {
    id: 'easy-6',
    language: 'javascript',
    category: 'arrays',
    difficulty: 'easy',
    description: 'Array Push',
    code: `const fruits = ['apple', 'banana'];
fruits.push('orange');
console.log(fruits.length);`
  },

  // --- MEDIUM (6-10 lines) ---
  {
    id: 'med-1',
    language: 'javascript',
    category: 'async',
    difficulty: 'medium',
    description: 'Async Fetch',
    code: `async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
  }
}`
  },
  {
    id: 'med-2',
    language: 'javascript',
    category: 'arrays',
    difficulty: 'medium',
    description: 'Filter & Map',
    code: `const products = [
  { name: 'Laptop', price: 1000, inStock: true },
  { name: 'Phone', price: 500, inStock: false },
  { name: 'Tablet', price: 300, inStock: true }
];

const availableProducts = products
  .filter(product => product.inStock)
  .map(product => product.name);`
  },
  {
    id: 'med-3',
    language: 'javascript',
    category: 'dom',
    difficulty: 'medium',
    description: 'Event Listener',
    code: `const input = document.getElementById('search-input');
const results = document.getElementById('results');

input.addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase();
  if (query.length > 2) {
    results.classList.remove('hidden');
    console.log('Searching for:', query);
  } else {
    results.classList.add('hidden');
  }
});`
  },
  {
    id: 'med-4',
    language: 'javascript',
    category: 'objects',
    difficulty: 'medium',
    description: 'Object Method',
    code: `const calculator = {
  value: 0,
  add(n) {
    this.value += n;
    return this;
  },
  subtract(n) {
    this.value -= n;
    return this;
  },
  getResult() {
    return this.value;
  }
};`
  },
  {
    id: 'med-5',
    language: 'javascript',
    category: 'functions',
    difficulty: 'medium',
    description: 'Closure',
    code: `function makeCounter() {
  let count = 0;
  return function() {
    return count++;
  };
}

const counter = makeCounter();
console.log(counter()); // 0
console.log(counter()); // 1`
  },

  // --- HARD (10+ lines) ---
  {
    id: 'hard-1',
    language: 'javascript',
    category: 'async',
    difficulty: 'hard',
    description: 'Promise.allSettled',
    code: `async function syncData(users, posts) {
  const results = await Promise.allSettled([
    updateUsers(users),
    updatePosts(posts),
    logSyncEvent(new Date())
  ]);

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(\`Task \${index} succeeded: \`, result.value);
    } else {
      console.error(\`Task \${index} failed: \`, result.reason);
    }
  });

  const successCount = results.filter(r => r.status === 'fulfilled').length;
  return successCount === results.length;
}`
  },
  {
    id: 'hard-2',
    language: 'javascript',
    category: 'arrays',
    difficulty: 'hard',
    description: 'Complex Reduce',
    code: `const transactions = [
  { type: 'deposit', amount: 100, category: 'salary' },
  { type: 'withdrawal', amount: 50, category: 'food' },
  { type: 'deposit', amount: 200, category: 'freelance' },
  { type: 'withdrawal', amount: 30, category: 'transport' }
];

const summary = transactions.reduce((acc, curr) => {
  if (!acc[curr.category]) {
    acc[curr.category] = 0;
  }
  
  if (curr.type === 'deposit') {
    acc[curr.category] += curr.amount;
    acc.totalBalance += curr.amount;
  } else {
    acc[curr.category] -= curr.amount;
    acc.totalBalance -= curr.amount;
  }
  
  return acc;
}, { totalBalance: 0 });`
  },
  {
    id: 'hard-3',
    language: 'javascript',
    category: 'objects',
    difficulty: 'hard',
    description: 'Deep Clone',
    code: `function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(deepClone);
  }

  const cloned = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}`
  },
  {
    id: 'hard-4',
    language: 'javascript',
    category: 'dom',
    difficulty: 'hard',
    description: 'Drag and Drop',
    code: `const draggables = document.querySelectorAll('.draggable');
const containers = document.querySelectorAll('.container');

draggables.forEach(draggable => {
  draggable.addEventListener('dragstart', () => {
    draggable.classList.add('dragging');
  });

  draggable.addEventListener('dragend', () => {
    draggable.classList.remove('dragging');
  });
});

containers.forEach(container => {
  container.addEventListener('dragover', e => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const draggable = document.querySelector('.dragging');
    if (afterElement == null) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });
});`
  }
];
