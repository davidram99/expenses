var db

// Create database
export function createDatabase() {
  if (!indexedDBSupport()) throw new Error("Your browser doesn't support IndexedDB")

  const request = window.indexedDB.open('ExpensesDB', 1)

  // Event handling
  request.onerror = () => {
    console.error(`IndexedDB error: ${request.errorCode}`)
  }

  request.onsuccess = () => {
    console.info('Successful database connection')
    db = request.result
    // DB error handling
    db.onerror = (event) => {
      console.error(`Database error: `, event.target.error)
    }
  }

  request.onupgradeneeded = () => {
    console.log('%cDatabase created', 'color: yellow; font-weight: bold; font-size: 1.2em')

    db = request.result

    createMoneyTransactionsTable()
    createCategoriesTable()
  }
}

// Create tables
function createMoneyTransactionsTable() {
  const objectStore = db.createObjectStore('moneyTransactions', { autoIncrement: true })

  // Indexes
  objectStore.createIndex('concept', 'concept', { unique: false })
  objectStore.createIndex('date', 'date', { unique: false })
  objectStore.createIndex('amount', 'amount', { unique: false })
  objectStore.createIndex('category', 'category', { unique: false })
  objectStore.createIndex('type', 'type', { unique: false })

  // Transaction completed
  objectStore.transaction.oncompleted = () => {
    console.log('Object store "moneyTransactions" created')
  }
}

function createCategoriesTable() {
  const objectStore = db.createObjectStore('categories', { keyPath: ['name', 'type'] })

  // Indexes
  objectStore.createIndex('name', 'name', { unique: false })
  objectStore.createIndex('icon', 'icon', { unique: false })
  objectStore.createIndex('type', 'type', { unique: false })
  objectStore.createIndex('color', 'color', { unique: false })

  // Transaction completed
  objectStore.transaction.oncompleted = () => {
    console.log('Object store "categories" created')
  }
}

// Money transactions
export function addMoneyTransaction(moneyTransaction) {
  const request = db
    .transaction('moneyTransactions', 'readwrite')
    .objectStore('moneyTransactions')
    .add(moneyTransaction)
  request.onsuccess = () => {
    console.log('Money transaction added to the database')
  }
}

export function getMoneyTransaction(key) {
  const request = db.transaction(['moneyTransactions']).objectStore('moneyTransactions').get(key)
  request.onsuccess = () => {
    console.log(`Expense found in the database ${request.result}`, request.result)
  }
}

export function getAllMoneyTransactions() {
  const request = db.transaction(['moneyTransactions']).objectStore('moneyTransactions').getAll()
  request.onsuccess = () => {
    console.log(`Money transactions found in the database ${request.result}`, request.result)
  }
}

export function removeMoneyTransaction(key) {
  const request = db
    .transaction(['moneyTransactions'], 'readwrite')
    .objectStore('moneyTransactions')
    .delete(key)
  request.onsuccess = () => {
    console.log(`Money transaction removed from the database`)
  }
}

export function updateMoneyTransaction(key) {
  const request = db
    .transaction(['moneyTransactions'], 'readwrite')
    .objectStore('moneyTransactions')
    .get(key)
  request.onsuccess = (event) => {
    const data = event.target.result

    data.amount = '10.00'

    const requestUpdate = db.transaction(['moneyTransactions'], 'readwrite').objectStore.put(data)
    requestUpdate.onsuccess = () => {
      console.log(`Money transaction updated in the database`)
    }
  }
}

// Categories
export function addCategory(category) {
  const request = db.transaction('categories', 'readwrite').objectStore('categories').add(category)
  request.onsuccess = () => {
    console.log('Category added to the database')
  }
}

export function getCategory(key) {
  const request = db.transaction(['categories']).objectStore('categories').get(key)
  request.onsuccess = () => {
    console.log(`Category found in the database ${request.result}`, request.result)
  }
}

export function getAllCategories() {
  const request = db.transaction(['categories']).objectStore('categories').getAll()
  request.onsuccess = () => {
    console.log(`Categories found in the database ${request.result}`, request.result)
  }
}

export function removeCategory(key) {
  const request = db.transaction(['categories'], 'readwrite').objectStore('categories').delete(key)
  request.onsuccess = () => {
    console.log(`Category removed from the database`)
  }
}

export function updateCategory(key) {
  const request = db.transaction(['categories'], 'readwrite').objectStore('categories').get(key)
  request.onsuccess = (event) => {
    const data = event.target.result

    data.name = 'Food'

    const requestUpdate = db.transaction(['categories'], 'readwrite').objectStore.put(data)
    requestUpdate.onsuccess = () => {
      console.log(`Category updated in the database`)
    }
  }
}

// Error handling for non supported browsers
function indexedDBSupport() {
  return 'indexedDB' in window
}
