import React from 'react'

interface CharacterCounterProps {
  currentLength: number | undefined
  maxLength: number
}

const CharacterCounter: React.FC<CharacterCounterProps> = ({currentLength = 0, maxLength}) => {
  return currentLength <= maxLength ? (
    <span>
      {currentLength} / {maxLength} <span>caractères saisis</span>
    </span>
  ) : (
    <span className="text-red-600">Le nombre de caractères saisis dépasse le maximum autorisé ({maxLength})</span>
  )
}

export default CharacterCounter
