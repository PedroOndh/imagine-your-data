'use strict';

// You can use ES6 code here: let, const, classes, arrow functions, etc.

let getRandomEmpathyBrokerColor = () => {
  const colors = ['#414649', '#81848B', '#E4A62F', '#B6C630', '#67A5B0', '#BD0B49'];
  return colors[Math.floor(Math.random() * colors.length)];
};

console.log('The most awesome color in EmpathyBroker\'s palette is ' + getRandomEmpathyBrokerColor());
