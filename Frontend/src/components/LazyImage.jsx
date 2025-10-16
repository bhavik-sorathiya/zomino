import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import { useTheme, alpha } from '@mui/material/styles'

export default function LazyImage({ src, alt = '', width = '100%', height = '100%', sx = {}, ...rest }) {
  const [loaded, setLoaded] = useState(false)
  const theme = useTheme()
  const skeletonBg = theme.palette.mode === 'dark' ? alpha(theme.palette.background.paper, 0.12) : theme.palette.grey[200]

  return (
    <Box sx={{ position: 'relative', display: 'block', width, height, ...sx }}>
      {!loaded && (
        <Skeleton
          variant="rectangular"
          width={width}
          height={height}
          sx={{ borderRadius: 1, bgcolor: skeletonBg }}
        />
      )}
      <Box
        component="img"
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
        style={{
          width: '100%',
          height: height,
          objectFit: 'cover',
          display: loaded ? 'block' : 'none',
          borderRadius: 8,
          opacity: loaded ? 1 : 0,
          transform: loaded ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.995)',
          transition: 'opacity 280ms cubic-bezier(.22,.9,.32,1), transform 360ms cubic-bezier(.22,.9,.32,1)'
        }}
        {...rest}
      />
    </Box>
  )
}
