import { createGlobalStyle, css } from 'styled-components'

export const defaultTheme = {
  colors: {
    'background': 'rgb(30, 30, 30)',
    'text': 'rgb(255, 255, 255)',
  },
  fonts: {
    'family': `'Montserrat', sans-serif`,
    'familyCode' : `'Courier New', monospace`,
    'size': 16,
    'lineHeight': 24/16,
    'headersize': 20,
    'headerLineHeight': 24/20
  },
  ease: 'cubic-bezier(.25, .1, .25, 1)',
}

export const overwriteDefaultTheme = (theme: any) => {
  return {
    ...defaultTheme,
    ...theme,
    colors: {
      ...defaultTheme.colors,
      ...theme.colors
    },
    fonts: {
      ...defaultTheme.fonts,
      ...theme.fonts
    }
  }
}

export const withGlobalStyle = (theme = defaultTheme, extraCss = '') => createGlobalStyle`
  html {
    -moz-osx-font-smoothing     : grayscale;
    -webkit-font-smoothing      : antialiased;
    -webkit-tap-highlight-color : transparent;
    box-sizing                  : border-box;
    font-family                 : sans-serif;
    font-size: 100%;
    text-rendering              : optimizeLegibility;
    text-size-adjust            : 100%;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  html,
  body {
    min-height: 100%;
  }

  html, body,
  nav, header, main, footer,
  section, aside, article, div,
  img, caption, figure, figcaption, video, audio, progress,
  h1, h2, h3, h4, h5, h6,
  p, span, small, strong,
  ol, ul, li,
  dl, dt, dd,
  blockquote,
  form, fieldset, legend, label,
  table, tbody, tfoot, thead, tr, th, td,
  pre, abbr, address, cite, summary, code,
  del, dfn, em, ins, kbd, q, samp, sub, sup, var, time, mark {
    background: transparent;
    border: 0;
    direction: ltr;
    margin: 0;
    padding: 0;
  }

  button {
    appearance: none;
  }

  body {
    background-color : ${theme.colors.background};
    color            : ${theme.colors.text};
  }

  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  main,
  menu,
  nav,
  section,
  summary {
    display: block;
  }

  button {
    border: 0;
    cursor: pointer;
    font-family: inherit;

    &,
    &:focus,
    &:active {
      outline: 0;
    }
  }

  p,
  span,
  small,
  strong {
    text-align: left;
  }

  h1, h2, h3, h4, h5, h6 {
    text-align: center;
  }

  audio,
  canvas,
  progress,
  video {
    display: inline-block;
    vertical-align: baseline;
  }

  audio {
    &:not([controls]) {
      display: none;
      height: 0;
    }
  }

  [hidden] {
    display: none;
  }

  a {
    background-color: transparent;

    &:active,
    &:hover {
      outline: 0;
    }
  }

  li {
    list-style-type: none;
  }

  img {
    -ms-interpolation-mode: bicubic;
    transform: translate3d(0, 0, 0);
    vertical-align : middle;
  }

  figure {
    margin: 0;

    img {
      margin: 0;
    }

  	figcaption {
  		color       : lighten(${theme.colors.text}, 30%);
  		display     : block;
  		font-style  : italic;
  		font-weight : normal;
  	}
  }

  textarea {
    &,
    &:active,
    &:focus,
    &:hover {
      outline: 0;
    }
  }

  input {
    border: 0;
    cursor: pointer;

    &::-webkit-caps-lock-indicator,
    &::-webkit-credentials-auto-fill-button {
      visibility: hidden;
    }


    &::-ms-clear,
    &::-ms-reveal {
      display: none;
    }

    &,
    &:active,
    &:focus,
    &:hover {
      outline: 0;
    }

    &:-webkit-autofill {
      content: '\feff';
    }
  }


  h1, h2, h3, h4, h5, h6 {
    text-rendering : optimizelegibility;
  }

  p {
    color: inherit;
    margin-bottom: 0;
  }

  ol,
  ul,
  dl,
  dd,
  address {
    margin-bottom : 0;
  }

  dt {
    font-weight : bold;
  }



  blockquote  {
    border-left: 10px solid ${theme.colors.text};
    font-style: normal;
    margin: 0;
    padding: 0 15px;
  }


  q {
    font-style : italic;
    quotes     : none;
  }


  blockquote p::before,
  blockquote p::after,
  q:before,
  q:after {
    content : '';
  }

  cite {
    font-style : normal;
  }

  hr {
    border     : 0;
    border-top : 1px solid ${theme.colors.text};
    clear      : both;
    display    : block;
    height     : 1px;
    padding    : 0;
  }

  abbr[title] {
    cursor        : help;
    border-bottom : 1px dotted lighten(${theme.colors.text}, 15%);
  }

  b,
  strong {
    font-weight : bold;
  }

  dfn {
    font-style : italic;
  }

  ins {
    background-color : lighten(${theme.colors.text}, 75%);
    color            : darken(${theme.colors.text}, 20%);
    text-decoration  : none;
  }

  mark {
    background-color : ${theme.colors.text};
    color            : darken(${theme.colors.text}, 20%);
  }

  pre {
    white-space : pre-wrap;
    word-wrap   : break-word;
  }

  sub,
  sup {
    line-height    : 0;
    position       : relative;
    vertical-align : ${theme.fonts.lineHeight};
  }

  sup {
    right: .2em;
    top : .2em;
  }

  sub {
    bottom : -.25em;
  }


  // --------------- NEW ---------------


  html {
    overflow-x: hidden;
  }

  button {
    outline: 0;
    padding: 0;
    background-color: transparent;
    color: inherit;

    &:active,
    &:focus {
      outline: 0;
    }
  }

  dl {
    outline: 0;
  }

  a {
    cursor: pointer;
    color: unset;
    text-decoration: none;
  }

  .srt-only {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  input {
    background: transparent;
    border-radius: 0;
    margin-bottom: 0;
  }

  input::-webkit-search-cancel-button {
    display: none;
  }

  img {
    width: 100%;
  }

  ${ extraCss && css`${extraCss}` }
`
