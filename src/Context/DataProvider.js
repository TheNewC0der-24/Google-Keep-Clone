import { createContext, useState, useEffect } from "react";

export const DataContext = createContext(null);

const DataProvider = ({ children }) => {

    const [notes, setNotes] = useState(() => {
        const storedNotes = localStorage.getItem("notes");
        return storedNotes ? JSON.parse(storedNotes) : [];
    });
    const [archivedNotes, setArchivedNotes] = useState(() => {
        const storedArchivedNotes = localStorage.getItem("archivedNotes");
        return storedArchivedNotes ? JSON.parse(storedArchivedNotes) : [];
    });
    const [deletedNotes, setDeletedNotes] = useState(() => {
        const storedDeletedNotes = localStorage.getItem("deletedNotes");
        return storedDeletedNotes ? JSON.parse(storedDeletedNotes) : [];
    });

    useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes));
    }, [notes]);

    useEffect(() => {
        localStorage.setItem("archivedNotes", JSON.stringify(archivedNotes));
    }, [archivedNotes]);

    useEffect(() => {
        localStorage.setItem("deletedNotes", JSON.stringify(deletedNotes));
    }, [deletedNotes]);

    return (
        <DataContext.Provider value={{
            notes,
            setNotes,
            archivedNotes,
            setArchivedNotes,
            deletedNotes,
            setDeletedNotes
        }}>
            {children}
        </DataContext.Provider>
    )
};

export default DataProvider;