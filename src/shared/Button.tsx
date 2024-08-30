import { forwardRef, Ref } from 'react'
import { Btn, BtnProps } from '../alexlibs/mui-extension'

export const ScButton = forwardRef(
  (props: BtnProps, ref: Ref<HTMLButtonElement>) => {
    return <Btn {...props} ref={ref} />
  },
)
