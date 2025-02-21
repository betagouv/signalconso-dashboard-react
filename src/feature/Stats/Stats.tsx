// import { config } from 'conf/config'
// import { Navigate, Routes } from 'react-router'
// import { Route } from 'react-router'
// import { Page, PageTitle } from 'shared/Page'
// import { useConnectedContext } from '../../core/context/ConnectedContext'
// import { useI18n } from '../../core/i18n'
// import { relativeToParent, siteMap } from '../../core/siteMap'
// import { PageTab, PageTabs } from '../../shared/Page/PageTabs'
// import { ArborescenceWithCounts } from './ArborescenceWithCounts'
// import { DgccrfStats } from './DgccrfStats'
// import { ProStats } from './ProStats'
// import { ReportStats } from './ReportStats'
//
// export const Stats = () => {
//   const { m } = useI18n()
//   const { connectedUser } = useConnectedContext()
//   return (
//     <Page>
//       <PageTitle>{m.statsLandingPage}</PageTitle>
//       <p className="mb-4">
//         D'autres statistiques sont accessibles directement sur le{' '}
//         <a href={`${config.appBaseUrl}/fr/stats`} target="blank">
//           site de SignalConso
//         </a>{' '}
//         et sur{' '}
//         <a
//           href={`https://data.economie.gouv.fr/pages/signalconso/`}
//           target="blank"
//         >
//           DataEconomie
//         </a>
//         .
//       </p>
//       {connectedUser.isDGAL ? (
//         <PageTabs>
//           <PageTab
//             to={relativeToParent(siteMap.logged.stats.pro.value)}
//             label={m.statsPro}
//           />
//           <PageTab
//             to={relativeToParent(
//               siteMap.logged.stats.countBySubCategories.value,
//             )}
//             label={m.statsCountBySubCategoriesTab}
//           />
//         </PageTabs>
//       ) : (
//         <PageTabs>
//           <PageTab
//             to={relativeToParent(siteMap.logged.stats.report.value)}
//             label={m.statsReports}
//           />
//           <PageTab
//             to={relativeToParent(siteMap.logged.stats.pro.value)}
//             label={m.statsPro}
//           />
//           <PageTab
//             to={relativeToParent(siteMap.logged.stats.dgccrf.value)}
//             label={m.statsDgccrf}
//           />
//           <PageTab
//             to={relativeToParent(
//               siteMap.logged.stats.countBySubCategories.value,
//             )}
//             label={m.statsCountBySubCategoriesTab}
//           />
//         </PageTabs>
//       )}
//       {connectedUser.isDGAL ? (
//         <Routes>
//           <Route
//             path="*"
//             element={
//               <Navigate
//                 replace
//                 to={relativeToParent(siteMap.logged.stats.pro.value)}
//               />
//             }
//           />
//           <Route path={siteMap.logged.stats.pro.value} element={<ProStats />} />
//           <Route
//             path={siteMap.logged.stats.countBySubCategories.value}
//             element={<ArborescenceWithCounts />}
//           />
//         </Routes>
//       ) : (
//         <Routes>
//           <Route
//             path="*"
//             element={
//               <Navigate
//                 replace
//                 to={relativeToParent(siteMap.logged.stats.report.value)}
//               />
//             }
//           />
//           <Route
//             path={siteMap.logged.stats.report.value}
//             element={<ReportStats />}
//           />
//           <Route path={siteMap.logged.stats.pro.value} element={<ProStats />} />
//           <Route
//             path={siteMap.logged.stats.dgccrf.value}
//             element={<DgccrfStats />}
//           />
//           <Route
//             path={siteMap.logged.stats.countBySubCategories.value}
//             element={<ArborescenceWithCounts />}
//           />
//         </Routes>
//       )}
//     </Page>
//   )
// }
