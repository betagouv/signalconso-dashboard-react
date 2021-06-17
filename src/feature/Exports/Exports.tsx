import {Page, PageTitle} from '../../shared/Layout'
import {useI18n} from '../../core/i18n'
import {useEffect} from 'react'
import {useAsyncFileContext} from '../../core/context/AsyncFileContext'

export const Exports = () => {
  const {m} = useI18n()
  const _asyncFile = useAsyncFileContext()

  useEffect(() => {
    _asyncFile.fetch()()
  }, [])

  return (
    <Page>
      <PageTitle>{m.menu_exports}</PageTitle>
      {_asyncFile.entity?.map(file =>
        <div>
          {file.filename}
        </div>
      )}
    </Page>
  )
}
