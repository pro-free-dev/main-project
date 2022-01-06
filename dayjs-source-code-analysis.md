Everything is beginning at a function of `dayjs`. It accepted two arguments `date` and `c` and __c__ is an object.
```js
const dayjs = function (date, c) {
  if (isDayjs(date)) {
    return date.clone()
  }
  // eslint-disable-next-line no-nested-ternary
  const cfg = typeof c === 'object' ? c : {}
  cfg.date = date
  cfg.args = arguments// eslint-disable-line prefer-rest-params
  return new Dayjs(cfg) // eslint-disable-line no-use-before-define
}
```

Now let's deep into the class `Dayjs`, in the class it defined many functions and surely contravse by the `moment`, it was minor enought. 
