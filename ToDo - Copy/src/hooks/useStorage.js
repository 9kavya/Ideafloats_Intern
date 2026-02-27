import { useState, useEffect, useCallback, useRef } from "react";
import { storage } from "../utils/storage";

/**
 * A hook that works like useState but persists to IndexedDB.
 * Designed to be stable and prevent infinite re-render loops.
 */
function useStorage(key, initialValue) {
    const [state, setState] = useState(initialValue);
    const [isLoading, setIsLoading] = useState(true);

    // Use a ref for the initialValue to avoid re-triggering effects if the literal changes
    const initialValueRef = useRef(initialValue);

    // Initial load
    useEffect(() => {
        let isMounted = true;

        async function load() {
            try {
                const value = await storage.getItem(key, initialValueRef.current);
                if (isMounted) {
                    setState(value);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error(`Error loading state for key "${key}":`, error);
                if (isMounted) setIsLoading(false);
            }
        }

        load();

        return () => {
            isMounted = false;
        };
    }, [key]);

    // Setter
    const setStoredState = useCallback((value) => {
        setState((prev) => {
            const newValue = value instanceof Function ? value(prev) : value;
            // Async save to storage - we don't await here to keep UI snappy,
            // but the storage utility handles the queueing/locking via transactions.
            storage.setItem(key, newValue).catch(err => {
                console.error(`Error saving state for key "${key}":`, err);
            });
            return newValue;
        });
    }, [key]);

    return [state, setStoredState, isLoading];
}

export default useStorage;
