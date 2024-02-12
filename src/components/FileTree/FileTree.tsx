import { useState, useEffect } from "react";
import { invoke } from '@tauri-apps/api/tauri'
import classes from "./FileTree.module.css"
import Collection from "./Collection";

const FileTree = () => {
    const [files, setFiles] = useState<Data>();

    const syncFileSystem = () => {
        invoke('sync_files').then((files) => setFiles(JSON.parse(files as string)))
    }

    useEffect(() => {
        syncFileSystem()
    },[]);

    return (
        <div className={classes.container}>
            <h1>File tree</h1>
            <input type="text" placeholder="Search collections"/>
            <button>+</button>
            {files?.collections.map(collection => (<Collection key={crypto.randomUUID()} collection={collection}/>))}
            <button onClick={syncFileSystem}>
                refresh
            </button>
        </div>
    )
}

export default FileTree
