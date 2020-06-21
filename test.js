class Journal {
  static journalCount = 0

  constructor() {
    this.journal = {}
  }

  addEntry() {}

  removeEntry() {}

  readJournal() {}
}

class PersistentStorage {
  constructor(documentType, storageType) {
    this.documentType = documentType
    this.storageType = storageType
  }

  save() {}

  load() {}
}

// Usage:
const journal = new Journal()
const fileSystemJournalStore = new PersistentStorage('journal', 'fs')

fileSystemJournalStore.save(journal)

