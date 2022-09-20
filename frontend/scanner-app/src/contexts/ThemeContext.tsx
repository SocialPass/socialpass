import { createContext, useContext, useState, useEffect } from 'react'

import { EventContext } from './EventContext'

import defaultLogo from '@/deprecated_static/images/landingpage_logo.png'

export const ThemeContext = createContext({})

export const ThemeProvider = ({ children }: any) => {
  const { event } = useContext(EventContext)
  const [theme, setTheme] = useState({})

  const createLink = (href, type, rel, media) => {
    const el = document.createElement('link')
    el.href = href
    el.type = type
    el.rel = rel
    el.media = media

    return el
  }

  useEffect(() => {
    if (event) {
      const css_theme = event.team.theme?.css_theme

      if (css_theme) {
        const brand_name = event.team.theme?.brand_name
        const logo = event.team?.theme?.logo

        const link = createLink(css_theme, 'text/css', 'stylesheet', 'screen,print')
        const favIcon = createLink(logo, 'image/x-icon', 'icon', null)
        window.icon = logo

        document.getElementsByTagName('head')[0].appendChild(link)
        document.getElementsByTagName('head')[0].appendChild(favIcon)

        setTheme({
          brand_name: brand_name,
          logo: logo,
          css_theme: css_theme,
        })
      } else {
        window.icon = defaultLogo

        setTheme({
          logo: defaultLogo,
        })
      }

      setTheme({
        brand_name: event.team.theme?.brand_name,
      })
    }
  }, [event])

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
