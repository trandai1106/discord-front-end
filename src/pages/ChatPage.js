import React from 'react'
import { Chat, Header } from '../components'

function ChatPage(props) {
    // console.log("props: " + this.props.match);
    return (
        <>
            <Header />
            <Chat />
        </>
    )
}

export default ChatPage
