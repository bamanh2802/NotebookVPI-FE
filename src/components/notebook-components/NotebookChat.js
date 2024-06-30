import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import '../../css/notebook/notebook.css';
import '../../css/notebook/notebook-chat.css';
import '../../css/notebook/notebook-item.css';

import AssistantMessage from '../message/AssistantMessage';

function NotebookChat({ notebookId }) {
    const isChatOpen = useSelector((state) => state.isChatOpen);
    const [isStatusChat, setIsStatusChat] = useState(true);
    const [shouldOpenChat, setShouldOpenChat] = useState(false);
    const [isClosedClassActive, setIsClosedClassActive] = useState(true);
    const [chatHistory, setChatHistory] = useState([]);
    const [isChatFullyOpened, setIsChatFullyOpened] = useState(false);
    const dispatch = useDispatch();
    const conversations = useSelector(state => state.notebooks[notebookId] || []);
    const chatContainerRef = useRef(null); // Ref để trỏ tới phần tử chứa tin nhắn
    const lastMessageRef = useRef(null); // Ref để trỏ tới tin nhắn cuối cùng

    useEffect(() => {
        if ((isChatOpen && !isStatusChat) || (!isChatOpen && isStatusChat)) {
            if (!shouldOpenChat) {
                setShouldOpenChat(true);
            }
        }
        setIsStatusChat(isChatOpen);
        setIsClosedClassActive(true)

        setTimeout(() => {
            setIsClosedClassActive(false);
        }, 1000);
    }, [isChatOpen]);

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await fetch(`http://localhost:3000/notebook/${notebookId}/chathistory`);
                const data = await response.json();
                setChatHistory(data);
            } catch (error) {
                console.error('Error fetching chat history:', error);
            }
        };

        fetchChatHistory();
    }, [notebookId]);

    function closeNotebookChat() {
        setIsStatusChat(!isStatusChat);
        dispatch({ type: 'TOGGLE_CHAT' });
        setIsClosedClassActive(true)
        
        setTimeout(() => {
            setIsClosedClassActive(false);
        }, 1000);
    }

    useEffect(() => {
        if (isChatFullyOpened && lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversations, isChatFullyOpened]);

    

    // Trigger the fully opened state after a delay (e.g., 300ms) to allow the chat to fully open
    useEffect(() => {
        if (shouldOpenChat) {
            const timer = setTimeout(() => {
                setIsChatFullyOpened(true);
            }, 300); // Adjust the delay as needed for your animation timing

            return () => clearTimeout(timer);
        }
    }, [shouldOpenChat]);

    return (
        <div className={`notebook-chat ${shouldOpenChat && (!isStatusChat ? 'open' : isClosedClassActive ? 'closed' : '')}`}>
            <div className="notebook-chat-icon-close" onClick={closeNotebookChat}>
                <i className="fa-solid fa-xmark" />
            </div>
            <div className="notebook-chat-content">
                <div className="notebook-user-message" ref={chatContainerRef}>
                    {chatHistory.map((entry, index) => (
                        <div key={index}>
                            {entry.messages.map((message, messageIndex) => (
                                <div key={messageIndex} className={`chat-message ${message.user === 'User' ? 'user-message' : 'assistant-message'}`}>
                                    {message.user === 'User' ? (
                                        <div className="user-message-content">{message.message}</div>
                                    ) : (
                                        <AssistantMessage message={message.assistant} />
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                    {conversations.map((message, index) => (
                        <div
                            key={index}
                            className={`chat-message ${message.type === 'user' ? 'user-message' : 'assistant-message'}`}
                            ref={index === conversations.length - 1 ? lastMessageRef : null}
                        >
                            {message.type === 'user' ? (
                                <div className="user-message-content">{message.content}</div>
                            ) : (
                                <AssistantMessage message={message.content} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default NotebookChat;