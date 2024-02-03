

type Props = {
    collection: Collection 
}

const Collection = ({collection}: Props): JSX.Element => {
    return(
    <>
        <p>{collection.name}</p>
        {collection.requests.map((request) => (<ul>{request.url}</ul>))}
    </>)
}

export default Collection
