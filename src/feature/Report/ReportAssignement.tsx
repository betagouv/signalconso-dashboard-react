import {Icon, MenuItem} from '@mui/material'
import {Link} from 'react-router-dom'
import {ScSelect} from 'shared/Select/Select'

export function ReportAssignement() {
  return (
    <div className="flex flex-col items-start sm:items-end gap-1">
      <ScSelect size="small" value={'Blake Morris'} variant="outlined" onChange={x => {}} label={'Assigné à'} fullWidth>
        {names.slice(0, 5).map(name => {
          return (
            <MenuItem value={name} key={name}>
              <div className="flex items-center gap-1">
                <Icon className="">account_circle</Icon>
                {name}
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
