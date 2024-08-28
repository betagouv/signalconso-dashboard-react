import { useI18n } from 'core/i18n'

export function PasswordRequirementsDesc() {
  const { m } = useI18n()
  return (
    <div className="text-gray-500 mb-4">
      {m.passwordShouldBeLongAnd}
      <ul className="list-disc list-inside pl-2">
        <li>{m.anUppercaseLetter}</li>
        <li>{m.aLowercaseLetter}</li>
        <li>{m.aNumber}</li>
        <li>{m.aSpecialChar}</li>
      </ul>
    </div>
  )
}
