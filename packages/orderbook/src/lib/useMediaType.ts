import { useEffect, useState } from 'react'

interface Breakpoints {
  mobile: number,
  tablet: number,
  desktopXs: number,
  desktop: number,
  getMediaType: (width: number) => string
}

interface MediaInfo {
  width: number | undefined,
  height: number | undefined,
  mediaType: string
}

const BREAKPOINTS: Breakpoints = {
  mobile: 375,
  tablet: 768,
  desktopXs: 992,
  desktop: 1440,
  getMediaType(width) {
    return width < this.tablet ? 'mobile' :
      width < this.desktopXs ? 'tablet' :
        'desktop'
  }
}

const getInfo = (isClient: boolean): MediaInfo => {
  return {
    width: isClient ? window.innerWidth : undefined,
    height: isClient ? window.innerHeight : undefined,
    mediaType: isClient ? BREAKPOINTS.getMediaType(window.innerWidth + 1) : 'desktop',
  }
}

export const useMediaType = () => {
  const isClient = typeof window === 'object'
  const [mediaType, setMediaType] = useState(getInfo(isClient).mediaType)

  const handleResize = () => {
    const info = getInfo(isClient)
    if (info.mediaType !== mediaType) setMediaType(info.mediaType)
  }

  useEffect(() => {
    if (!isClient) return () => { }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  })

  return mediaType
}