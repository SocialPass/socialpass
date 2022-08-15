import React, { createContext, useContext, useCallback, useState } from 'react'
import { v4 as uuid } from 'uuid'
import ToastContainer from '../components/ToastContainer'

const ToastContext = createContext({} as any)

const ToastProvider = ({ children }: any) => {
  const [messages, setMessages] = useState<any>([])

  const addToast = useCallback(({ type, title, description }: any) => {
    const id = uuid()

    const toast = {
      id,
      type,
      title,
      description,
    }

    setMessages((state: any) => [...state, toast])
  }, [])

  const removeToast = useCallback((id: number) => {
    setMessages((state: any[]) => state.filter((message: any) => message.id !== id))
  }, [])

  const clearToasts = useCallback(() => {
    setMessages([])
  }, [])

  return (
    <ToastContext.Provider value={{ addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  )
}

function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}

export { ToastProvider, useToast }
