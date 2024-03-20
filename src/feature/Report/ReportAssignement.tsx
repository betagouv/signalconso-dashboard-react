import {Icon, MenuItem} from '@mui/material'
import {useQuery} from '@tanstack/react-query'
import {CompanyClient} from 'core/client'
import {useApiContext} from 'core/context/ApiContext'
import {CompanyAccess, Id, ReportSearchResult, User} from 'core/model'
import {useCompanyAccessesQuery} from 'core/queryhooks/companyQueryHooks'
import {Link} from 'react-router-dom'
import {ScSelect} from 'shared/Select/Select'

export function ReportAssignement({reportSearchResult, companySiret}: {reportSearchResult: ReportSearchResult; companySiret: string}) {
  const assignedUser = reportSearchResult.assignedUser
  const fullName = assignedUser ? User.buildFullName(assignedUser) : 'John Jon'
  const _accesses = useCompanyAccessesQuery(companySiret)
  const options = _accesses.data
    ? _accesses.data.map(buildOptionFromAccess)
    : [
        // when loading, at least display the currently assigned user
        ...(assignedUser ? [buildOptionFromUser(assignedUser)] : []),
      ]

  return (
    <div className="flex flex-col items-start sm:items-end gap-1">
      <ScSelect size="small" value={assignedUser?.id} variant="outlined" onChange={x => {}} label={'Assigné à'} fullWidth>
        {options.map(option => {
          return (
            <MenuItem value={option.id} key={option.id}>
              <div className="flex items-center gap-1">
                <Icon className="">account_circle</Icon>
                {option.fullName}
              </div>
            </MenuItem>
          )
        })}
      </ScSelect>

      <Link to={''} className="block text-scbluefrance text-sm">
        Me l'assigner
      </Link>
    </div>
  )
}

function buildOptionFromUser(user: User) {
  return {
    id: user.id,
    fullName: User.buildFullName(user),
  }
}

function buildOptionFromAccess(access: CompanyAccess) {
  return {
    id: access.userId,
    fullName: User.buildFullName(access),
  }
}

const names = [
  'Jeremy Stephenson',
  'Blake Morris',
  'Michelle Miller',
  'Chelsea Rogers',
  'Curtis Summers',
  'Jaime Duncan',
  'Sabrina Mooney',
  'Joseph Gonzales',
  'Brian Mccormick',
  'Phillip Stevens',
  'Jacqueline Smith',
  'Richard Rivera',
  'Megan Lara',
  'Mrs. Amanda Mitchell MD',
  'Kevin Hampton',
  'Teresa Martin',
  'Kevin Horne',
  'Michael Li',
  'John Gross',
  'David Perez',
  'Taylor Young',
  'Brandon Torres',
  'Cynthia Porter',
  'Amanda Daniel',
  'Ashley Stephenson',
  'Pamela Hughes',
  'Joel Parker',
  'Robert Zamora',
  'Dr. Andrew Miller',
  'Kathleen Parrish',
  'John Caldwell',
  'Amy Anderson',
  'John Ware',
  'Michele Foley',
  'Jeffrey Harris',
  'Carmen Mcbride',
  'Jack Jones',
  'Jessica Moody',
  'Aaron Martin',
  'Rachel Cruz',
  'Whitney Reed',
]
