/* eslint-disable no-unused-vars */
import React from 'react'
import ChatHeader from './chatComponents/chatHeader'
import MessageBar from './chatComponents/messageBar'
import MessageContainer from './chatComponents/messageContainer'

const chatContainer = () => {
  return (
    <section className='fixed top-0 h-[100vh] w-[100vw] bg-[#1c1d25] flex flex-col md:static md:flex-1'>
      <ChatHeader />
      <MessageContainer />
      <MessageBar />
    </section>
  )
}

export default chatContainer
