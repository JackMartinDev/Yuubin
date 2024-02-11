import Client from "./components/Client/Client"
import FileTree from "./components/FileTree/FileTree";
import classes from "./App.module.css"
function App(): JSX.Element {
    return (
        <div className={classes.container}>
            <div className={classes.file}>
                <FileTree />
            </div>
            <div className={classes.client}>
                <Client/>
            </div>
        </div>
    )
}

export default App
