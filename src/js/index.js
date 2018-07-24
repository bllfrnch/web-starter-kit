import _map from 'lodash/map';
import '../scss/index.scss';

console.log(
  _map([234, 234, 23, 324], i => {
    console.log(i);
  })
);

document.querySelector('body').innerHTML = 'hello world oh mine!';
