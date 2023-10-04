var db

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

    const db = request.result

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
}

export function addMoneyTransaction(moneyTransaction) {
  const request = db
    .transaction('moneyTransactions', 'readwrite')
    .objectStore('moneyTransactions')
    .add(moneyTransaction)
  request.onsuccess = () => {
    console.log('Money transaction added to the database')
  }
}

export function getStudent(key) {
  console.log('######## getStudent ########')
  const transaction = db.transaction(['expenses'])
  const objectStore = transaction.objectStore('expenses')
  const request = objectStore.get(key)
  request.onsuccess = () => {
    console.log(`Student found in the database ${request.result.name}`)
  }
}

export function getAllStudents() {
  console.log('######## getAllStudents ########')
  const transaction = db.transaction(['expenses'])
  const objectStore = transaction.objectStore('expenses')
  const request = objectStore.getAll()
  request.onsuccess = () => {
    console.log(`Students found in the database ${request.result}`, request.result)
  }
}

export function removeStudent(key) {
  console.log('######## removeStudent ########')
  const request = db.transaction(['expenses'], 'readwrite').objectStore('expenses').delete(key)
  request.onsuccess = () => {
    console.log(`Student removed from the database`)
  }
}

export function updateStudent(student) {
  console.log('######## updateStudent ########')
  const objectStore = db.transaction(['expenses'], 'readwrite').objectStore('expenses')
  const request = objectStore.get(student)
  request.onsuccess = (event) => {
    const data = event.target.result

    data.name = 'Fulano'

    const requestUpdate = objectStore.put(data)
    requestUpdate.onsuccess = () => {
      console.log(`Student updated in the database`)
    }
  }
}

function indexedDBSupport() {
  return 'indexedDB' in window
}
