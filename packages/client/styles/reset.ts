import { overwriteDefaultTheme, withGlobalStyle } from '.'

const themeProject = {
  colors: {
    'background': '#FBFBFB',
    'text': '#4D4D4D',
    'white': '#FFFFFF',
    'black': '#4D4D4D',
  },
  font: 'Arial'
}

export const theme = overwriteDefaultTheme(themeProject);

const extraGlobalCss = `
  body {
    color: ${themeProject.colors.text};
    font-family: ${themeProject.font};
  }
`

export const Reset = withGlobalStyle(theme, extraGlobalCss)
