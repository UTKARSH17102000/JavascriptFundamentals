/**
 * Soni Frontend — Easy — Prototype inheritance (ServiceNow, AngelOne)
 * Parent constructor + child linking via Object.create(Person.prototype).
 */

function Person(name) {
  this.name = name;
}

Person.prototype.hello = function () {
  return `Hello ${this.name}`;
};

function Developer(name, title) {
  Person.call(this, name);
  this.title = title;
}

Developer.prototype = Object.create(Person.prototype);
Developer.prototype.constructor = Developer;

Developer.prototype.getTitle = function () {
  return this.title;
};

const obj = new Developer("Alice", "Software Engineer");
console.log(obj.hello());
console.log(obj.getTitle());
