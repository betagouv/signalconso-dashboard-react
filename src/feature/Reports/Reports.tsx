import {Page, PageTitle} from '../../shared/Layout';
import {useI18n} from '../../core/i18n';

export const Reports = ({}) => {
  const {m} = useI18n();
  return (
    <Page>
      <PageTitle>{m.login}</PageTitle>
    </Page>
  );
};
