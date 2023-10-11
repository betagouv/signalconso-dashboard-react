import {Box, Icon} from '@mui/material'
import React from 'react'

export interface ReportCategoriesProps {
  categories: any[]
}

export const ReportCategories = ({categories}: ReportCategoriesProps) => {
  return (
    <div>
      <Box className="flex flex-wrap gap-1">
        {categories.map((category, i) => (
          <Box key={i} className="inline-flex items-center">
            {i !== 0 && (
              <Icon
                sx={{
                  fontSize: 20,
                  mr: 0.5,
                }}
              >
                chevron_right
              </Icon>
            )}
            <span className={`py-1 px-2 rounded-lg italic border border-solid border-gray-500`}>{category}</span>
          </Box>
        ))}
      </Box>
    </div>
  )
}
