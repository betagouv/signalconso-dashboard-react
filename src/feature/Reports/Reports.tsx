import {useState} from 'react'
import {Datepicker} from 'shared/Datepicker/Datepicker'

export const Reports = () => {
  const [myDate, setMyDate] = useState<Date | undefined>()
  return (
    <div>
      <p>Value : {JSON.stringify(myDate)}</p>

      <button onClick={() => setMyDate(undefined)}>CLEAR</button>

      <Datepicker
        label={'datepicker'}
        fullWidth
        value={myDate}
        onChange={date => {
          setMyDate(date)
        }}
        timeOfDay="startOfDay"
      />
    </div>
  )
}
