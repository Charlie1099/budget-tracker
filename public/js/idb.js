let db;

const request = indexedDB.open("transaction_unit", 1)

// this event will emit if the database version changes
request.onupgradeneeded = function(event) {
    //save a refrence to the database
    const db = event.target.result;

    db.createObjectStore("new_transaction", { atouIncrement: true })    
    
}

// upon successful
request.onsuccess = function(even) {
    db = event.target.result

    if (navigator.onLine) {

    }
}

request.onerror = function(event) {
    
    console.log(event.target.errorCode)
}

function saveRecord(record) {
    const transaction = db.transaction(["new_transaction"], "readwrite")

    const transactionObjectStore = transaction.objectStore("new_transaction")

    transactionObjectStore.add(record)
}

function uploadTransaction() {
    const transaction = db.transaction(["new_transaction"], "readwrite")

    const transactionObjectStore = transaction.objectStore("new_transaction")

    const getAll = transactionObjectStore.getAll()

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch("/api/transaction", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            })
            .then((response) => response.json())
          .then((serverResponse) => {
            if (serverResponse.message) {
              throw new Error(serverResponse);
            }
            // open one more transaction
            const transaction = db.transaction(["new_transaction"], "readwrite");
            // access the object store
            const transactionObjectStore = transaction.objectStore("new_transaction");
            // clear all items in your store
            transactionObjectStore.clear();
  
            alert("All saved transactions has been submitted!");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
  }
  
  // listen for app coming back online
  window.addEventListener("online", uploadTransaction);