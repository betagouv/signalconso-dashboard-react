import { Component, ReactNode } from 'react'
import { ToastContext, useToastContext } from '../alexlibs/mui-extension'

type Props = {
  toast: ToastContext
  children: ReactNode
}

class Bundary extends Component<Props> {
  componentDidCatch(error: Error | null, info: object) {
    const message = error ? error.message : JSON.stringify(info)
    this.props.toast.toastError(message)
  }

  render() {
    return this.props.children
  }
}

export const ErrorBundary = (props: { children: ReactNode }) => {
  const toast = useToastContext()
  return <Bundary {...props} {...{ toast }} />
}
