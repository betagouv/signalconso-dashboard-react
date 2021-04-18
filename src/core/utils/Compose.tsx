interface Props {
  components: Array<React.JSXElementConstructor<React.PropsWithChildren<any>>>
  children: React.ReactNode
}

export const Compose = (props: Props) => {
  const {components = [], children} = props
  return (
    <>
      {components.reduceRight((acc, Comp) => <Comp>{acc}</Comp>, children)}
    </>
  )
}
