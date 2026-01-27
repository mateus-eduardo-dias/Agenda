import { CircleAlert } from "lucide-react";

export default function ErrorBlock({text}) {
    return (
        <div className="error-block space-grotesk-regular">
            <CircleAlert strokeWidth={3} />
            <span>{text}</span>
        </div>
    );
}