// 数组的浅拷贝，可用concat、slice返回一个新数组的特性来实现拷贝
var arr = ['old', 1, true, null, undefined];
var new_arr = arr.concat(); // 或者var new_arr = arr.slice();
new_arr[0] = 'new';
console.log(arr); // ["old", 1, true, null, undefined]
console.log(new_arr); // ["new", 1, true, null, undefined]

// 但是如果数组嵌套了对象或者数组的话用concat、slice拷贝只要有修改会引起新旧数组都一起改变了，比如：

var arr = [{old: 'old'}, ['old']];
var new_arr = arr.concat();
arr[0].old = 'new';
new_arr[1][0] = 'new';
console.log(arr); // [{old: 'new'}, ['new']]
console.log(new_arr); // [{old: 'new'}, ['new']]

// 如果数组元素是基本类型，就会拷贝一份，互不影响，而如果是对象或者数组，就会只拷贝对象和数组的引用，这样我们无论在新旧数组进行了修改，两者都会发生变化。这种叫浅拷贝
// 深拷贝就是指完全的拷贝一个对象，即使嵌套了对象，两者也相互分离，修改一个对象的属性，也不会影响另一个。

// 数组的深拷贝
// 技巧一：不仅可拷贝数组还能拷贝对象（但不能拷贝函数）
var arr = ['old', 1, true, ['old1', 'old2'], {old: 1}]
var new_arr = JSON.parse(JSON.stringify(arr))
console.log(new_arr);

// 浅拷贝的实现思路：遍历对象，把属性和属性值都放在一个新的对象里
var shallowCopy = function (obj) {
  // 只拷贝对象
  if (typeof obj !== 'object') return;
  // 根据obj的类型判断是新建一个数组还是一个对象
  var newObj = obj instanceof Array ? [] : {};
  // 遍历obj,并且判断是obj的属性才拷贝
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key];
    }
  }
  return newObj;
}

// 深拷贝的实现思路：拷贝的时候判断属性值的类型，如果是对象，继续递归调用深拷贝函数
var deepCopy = function(obj) {
  // 只拷贝对象
  if (typeof obj !== 'object') return;
  // 根据obj的类型判断是新建一个数组还是一个对象
  var newObj = obj instanceof Array ? [] : {};
  for (var key in obj) {
    // 遍历obj,并且判断是obj的属性才拷贝
    if (obj.hasOwnProperty(key)) {
      // 判断属性值的类型，如果是对象递归调用深拷贝
      newObj[key] = typeof obj[key] === 'object' ? deepCopy(obj[key]) : obj[key];
    }
  }
  return newObj;
}