import { useState } from "react";
import { useParams } from "react-router";

export default function Messages() {
    const [input, setInput] = useState('')
    const {conversationId} = useParams()
}