const DB_NAME = "ToDoDB";
const STORE_NAME = "kv-store";
const DB_VERSION = 1;

let dbPromise = null;

const getDB = () => {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };

        request.onerror = (event) => {
            reject(event.target.error);
        };
    });

    return dbPromise;
};

export const storage = {
    async getItem(key, defaultValue) {
        try {
            const db = await getDB();
            return new Promise((resolve) => {
                const transaction = db.transaction(STORE_NAME, "readonly");
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get(key);

                request.onsuccess = () => {
                    const value = request.result;
                    resolve(value !== undefined ? value : defaultValue);
                };

                request.onerror = () => {
                    resolve(defaultValue);
                };
            });
        } catch (error) {
            console.error("IndexedDB getItem error:", error);
            return defaultValue;
        }
    },

    async setItem(key, value) {
        try {
            const db = await getDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, "readwrite");
                const store = transaction.objectStore(STORE_NAME);
                const request = store.put(value, key);

                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error("IndexedDB setItem error:", error);
        }
    },

    async removeItem(key) {
        try {
            const db = await getDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction(STORE_NAME, "readwrite");
                const store = transaction.objectStore(STORE_NAME);
                const request = store.delete(key);

                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
            });
        } catch (error) {
            console.error("IndexedDB removeItem error:", error);
        }
    }
};
