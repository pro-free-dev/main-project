# material-ui

## Theme

### ThemeProvider

> ```jsx
> <ThemeContext.Provider value={theme}>
>     <App>
>         {children}
>     </App>
> </ThemeContext.Provider>;
> ```

##### useTheme

> ThemeContext
> 
> ```jsx
> const ThemeContext = React.createContext(null);
> ```
> 
> useTheme
> 
> ```jsx
> const theme = React.useContext(ThemeContext);
> ```

```jsx
const theme = createTheme({
  palette: {
    primary: {
      main: red[500],
    },
  },
});

function App() {
  return <ThemeProvider theme={theme}>...</ThemeProvider>;
}

ReactDOM.render(<App />, document.querySelector('#app'));
```

```jsx
/**
 * This component makes the `theme` available down the React tree.
 * It should preferably be used at **the root of your component tree**.
 */
function ThemeProvider(props) {
  const { children, theme: localTheme } = props;

  return (
    <MuiThemeProvider theme={localTheme}>
      <InnerThemeProvider>{children}</InnerThemeProvider>
    </MuiThemeProvider>
  );
}
```

```jsx
function DeepChild() {
  const classes = useStyles();

  return (
    <button type="button" className={classes.root}>
      Theme nesting
    </button>
  );
}
```
