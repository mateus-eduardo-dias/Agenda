export default function Card(props) {
    return (
        <div className="card-container">
            <img src={props.img} />
            <h2 className="fira-sans-bold">{props.title}</h2>
            <div className="flex-break" />
            <p className="fira-sans-regular">{props.text}</p>
        </div>
    );
}