import { createContext, useContext, useMemo, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import useStorage from "../hooks/useStorage";
import { useAuth } from "./AuthContext";

const TaskContext = createContext();

export function useTasks() {
    return useContext(TaskContext);
}

export function TaskProvider({ children }) {
    const { currentUser, isLoading: isAuthLoading } = useAuth();
    const userSuffix = currentUser ? `-${currentUser.email}` : "";

    const defaultTasks = [
        { id: "gs-1", title: "Add your first task by clicking on ➕ Add a task", completed: false, listId: "getting-started", createdAt: new Date().toISOString() },
        { id: "gs-2", title: "👋 Select this task to add a reminder and due date", completed: false, listId: "getting-started", note: "Try adding a due date!", createdAt: new Date().toISOString() },
        { id: "gs-3", title: "Break this task into smaller steps", completed: false, listId: "getting-started", steps: [{ id: "s1", title: "Step 1", completed: false }], createdAt: new Date().toISOString() },
        { id: "gs-4", title: "Open this task's detail view to add it to My Day 🤩", completed: false, listId: "getting-started", note: "My Day resets every night", createdAt: new Date().toISOString() },
        { id: "gs-5", title: "Add #hashtags to a task's title to categorise it", completed: false, listId: "getting-started", note: "Hashtags remain plain text for now", createdAt: new Date().toISOString() },
        { id: "gs-6", title: "Check out our sample grocery list and customise it for yourself", completed: false, listId: "getting-started", note: "See the Groceries list below", createdAt: new Date().toISOString() },
        { id: "gs-7", title: "Tap all the circles in this list to complete your tasks ✅", completed: false, listId: "getting-started", createdAt: new Date().toISOString() },
        { id: "gs-8", title: "yoho", completed: true, listId: "getting-started", createdAt: new Date().toISOString() },
        { id: "gr-1", title: "Milk", completed: false, listId: "groceries", createdAt: new Date().toISOString() },
        { id: "gr-2", title: "Eggs", completed: false, listId: "groceries", createdAt: new Date().toISOString() },
        { id: "gr-3", title: "Bread", completed: false, listId: "groceries", createdAt: new Date().toISOString() },
        { id: "gr-4", title: "Butter", completed: false, listId: "groceries", createdAt: new Date().toISOString() },
        { id: "gr-5", title: "Coffee", completed: false, listId: "groceries", createdAt: new Date().toISOString() }
    ];
    const defaultLists = [
        { id: "default", name: "Tasks", iconic: true },
        { id: "getting-started", name: "Getting started", iconic: false, icon: "👋" },
        { id: "groceries", name: "Groceries", iconic: false, icon: "🛒" },
    ];

    const [tasks, setTasks, isTasksLoading] = useStorage(`todo-tasks${userSuffix}`, defaultTasks);
    const [lists, setLists, isListsLoading] = useStorage(`todo-lists${userSuffix}`, defaultLists);
    const [groups, setGroups, isGroupsLoading] = useStorage(`todo-groups${userSuffix}`, []);
    const [selectedTaskId, setSelectedTaskId, isSelectedLoading] = useStorage(`selected-task-id${userSuffix}`, null);
    const [isSidebarOpen, setIsSidebarOpen, isSidebarLoading] = useStorage(`sidebar-open${userSuffix}`, true);

    const safeTasks = Array.isArray(tasks) ? tasks : defaultTasks;
    const safeLists = Array.isArray(lists) ? lists : defaultLists;

    // --- ACTIONS ---

    const addTask = useCallback((title, listId = "default", extraProps = {}) => {
        const newTask = {
            id: uuidv4(),
            title,
            completed: false,
            important: false,
            addedToMyDay: false,
            myDayDate: null,
            listId,
            steps: [],
            note: "",
            dueDate: null,
            createdAt: new Date().toISOString(),
            ...extraProps,
        };
        setTasks((prev) => [...(Array.isArray(prev) ? prev : []), newTask]);
        return newTask;
    }, [setTasks]);

    const updateTask = useCallback((taskId, updates) => {
        setTasks((prev) =>
            (Array.isArray(prev) ? prev : []).map((task) => (task.id === taskId ? { ...task, ...updates } : task))
        );
    }, [setTasks]);

    const startDeleteTask = useCallback((taskId) => {
        if (selectedTaskId === taskId) {
            setSelectedTaskId(null);
        }
        setTasks((prev) => (Array.isArray(prev) ? prev : []).filter((t) => t.id !== taskId));
    }, [selectedTaskId, setSelectedTaskId, setTasks]);

    const toggleTaskCompletion = useCallback((taskId) => {
        setTasks((prev) =>
            (Array.isArray(prev) ? prev : []).map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        );
    }, [setTasks]);

    const toggleTaskImportance = useCallback((taskId) => {
        setTasks((prev) =>
            (Array.isArray(prev) ? prev : []).map((task) =>
                task.id === taskId ? { ...task, important: !task.important } : task
            )
        );
    }, [setTasks]);

    const toggleMyDay = useCallback((taskId) => {
        setTasks((prev) =>
            (Array.isArray(prev) ? prev : []).map((task) => {
                if (task.id !== taskId) return task;
                const isAdding = !task.addedToMyDay;
                return {
                    ...task,
                    addedToMyDay: isAdding,
                    myDayDate: isAdding ? new Date().toISOString() : null,
                };
            })
        );
    }, [setTasks]);

    const addStep = useCallback((taskId, stepTitle) => {
        const newStep = { id: uuidv4(), title: stepTitle, completed: false };
        setTasks((prev) =>
            (Array.isArray(prev) ? prev : []).map((task) =>
                task.id === taskId
                    ? { ...task, steps: [...(task.steps || []), newStep] }
                    : task
            )
        );
    }, [setTasks]);

    const toggleStepCompletion = useCallback((taskId, stepId) => {
        setTasks((prev) =>
            (Array.isArray(prev) ? prev : []).map((task) =>
                task.id === taskId
                    ? {
                        ...task,
                        steps: (task.steps || []).map((step) =>
                            step.id === stepId ? { ...step, completed: !step.completed } : step
                        ),
                    }
                    : task
            )
        );
    }, [setTasks]);

    const deleteStep = useCallback((taskId, stepId) => {
        setTasks((prev) =>
            (Array.isArray(prev) ? prev : []).map((task) =>
                task.id === taskId
                    ? { ...task, steps: (task.steps || []).filter((s) => s.id !== stepId) }
                    : task
            )
        );
    }, [setTasks]);

    const promoteStep = useCallback((taskId, stepId) => {
        setTasks((prev) => {
            const task = prev.find(t => t.id === taskId);
            if (!task) return prev;
            const step = (task.steps || []).find(s => s.id === stepId);
            if (!step) return prev;

            const newTask = {
                id: uuidv4(),
                title: step.title,
                completed: step.completed,
                important: false,
                addedToMyDay: false,
                myDayDate: null,
                listId: task.listId,
                steps: [],
                note: "",
                dueDate: null,
                createdAt: new Date().toISOString(),
            };

            const newPrev = prev.map(t =>
                t.id === taskId
                    ? { ...t, steps: (t.steps || []).filter(s => s.id !== stepId) }
                    : t
            );

            return [...newPrev, newTask];
        });
    }, [setTasks]);

    const createList = useCallback((name) => {
        const newList = { id: uuidv4(), name, iconic: false };
        setLists((prev) => [...(Array.isArray(prev) ? prev : []), newList]);
        return newList;
    }, [setLists]);

    const deleteList = useCallback((listId) => {
        setLists((prev) => (Array.isArray(prev) ? prev : []).filter((l) => l.id !== listId));
        setTasks((prev) => (Array.isArray(prev) ? prev : []).filter((t) => t.listId !== listId));
    }, [setLists, setTasks]);

    const renameList = useCallback((listId, newName) => {
        setLists(prev => (Array.isArray(prev) ? prev : []).map(l => l.id === listId ? { ...l, name: newName } : l));
    }, [setLists]);

    const createGroup = useCallback((name) => {
        const newGroup = { id: uuidv4(), name };
        setGroups(prev => [...(Array.isArray(prev) ? prev : []), newGroup]);
        return newGroup;
    }, [setGroups]);

    const deleteGroup = useCallback((groupId) => {
        setGroups(prev => (Array.isArray(prev) ? prev : []).filter(g => g.id !== groupId));
        // Ungroup lists that belonged to this group
        setLists(prev => (Array.isArray(prev) ? prev : []).map(l => l.groupId === groupId ? { ...l, groupId: null } : l));
    }, [setGroups, setLists]);

    const renameGroup = useCallback((groupId, newName) => {
        setGroups(prev => (Array.isArray(prev) ? prev : []).map(g => g.id === groupId ? { ...g, name: newName } : g));
    }, [setGroups]);

    const isLoading = isAuthLoading || isTasksLoading || isListsLoading || isGroupsLoading || isSelectedLoading || isSidebarLoading;

    const safeGroups = Array.isArray(groups) ? groups : [];

    const value = useMemo(() => ({
        tasks: safeTasks,
        lists: safeLists,
        groups: safeGroups,
        selectedTaskId,
        isSidebarOpen,
        isLoading,
        setTasks,
        setLists,
        setGroups,
        setSelectedTaskId,
        setIsSidebarOpen,
        addTask,
        updateTask,
        deleteTask: startDeleteTask,
        toggleTaskCompletion,
        toggleTaskImportance,
        toggleMyDay,
        addStep,
        toggleStepCompletion,
        promoteStep,
        deleteStep,
        createList,
        deleteList,
        renameList,
        createGroup,
        deleteGroup,
        renameGroup,
    }), [
        safeTasks, safeLists, safeGroups, selectedTaskId, isSidebarOpen, isLoading,
        setTasks, setLists, setGroups, setSelectedTaskId, setIsSidebarOpen,
        addTask, updateTask, startDeleteTask, toggleTaskCompletion,
        toggleTaskImportance, toggleMyDay, addStep, toggleStepCompletion,
        promoteStep, deleteStep, createList, deleteList, renameList,
        createGroup, deleteGroup, renameGroup
    ]);

    return (
        <TaskContext.Provider value={value}>
            {!isLoading ? children : null}
        </TaskContext.Provider>
    );
}

