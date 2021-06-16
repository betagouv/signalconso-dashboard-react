import React, {useEffect} from 'react'
import {Page} from '../../shared/Layout'
import {useLoginContext} from '../../App'

export const Websites = () => {
  const {apiSdk} = useLoginContext()
  useEffect(() => {
    apiSdk.secured.website.search()
  }, [])
  return (
    <Page></Page>
  )
}
