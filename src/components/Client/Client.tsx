import { useState } from "react"
import QueryParams from "../QueryParams/QueryParams"
import RequestBody from "../RequestBody/RequestBody"
import ResponseBody from "../ResponseBody/ResponseBody"
import SearchBar from "../SearchBar/SearchBar"
import classes from "./Client.module.css"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Paper } from "@mantine/core"
const panels = ["Query", "Body", "Headers", "Auth"]

const Client = (): JSX.Element => {
    const [active, setActive] = useState(0);
    const status = useSelector((state:RootState) => state.response.status)
    const loading = useSelector((state:RootState) => state.response.loading)

    const tabs = panels.map((panel, index) => (
        <div
            onClick={(event) => {
                event.preventDefault();
                setActive(index);
            }}
            key={panel}
            className={classes.tab}
        >
            {panel}
        </div>
    ));
    return(
        <>
            <SearchBar/>
            <div >
                <PanelGroup direction="horizontal">
                    <Panel defaultSize={50} minSize={30}>
                        <Paper withBorder mih="100%"  >

                            <div className={classes.request}>
                                <div className={classes.tabs}>
                                    {tabs}
                                </div>
                                { active === 0 && <QueryParams/> }
                                { active === 1 && <RequestBody/> }
                                { active === 2 && <p>Headers Tab</p> }
                                { active === 3 && <p>Auth Tab</p> }
                            </div>
                        </Paper>
                    </Panel>
                    <PanelResizeHandle />
                    <Panel defaultSize={50} minSize={30}>
                        <Paper withBorder  mih="100%" >

                            <div>
                                {loading ? <p>Loading...</p> : status ? <ResponseBody/> : <p style={{textAlign: 'center'}}>Make a request using the URL bar above</p>}
                            </div>
                        </Paper>
                    </Panel>
                </PanelGroup>


            </div>
        </>
    )
}

export default Client
