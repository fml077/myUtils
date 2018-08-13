// 举例：实现鼠标移动数值加一的功能
var count = 1;
var container = document.getElementById('container');
function getUserAction (e) {
  container.innerHTML = count++;
  console.log('e', e)
  console.log('this', this)
}
// 鼠标移动执行函数
// container.onmousemove = getUserAction;

// 以上代码存在问题：频繁触发事件

// 防抖的原理就是：你尽管触发事件，但是我一定在事件触发 n 秒后才执行，如果你在一个事件触发的 n 秒内又触发了这个事件，
// 那就以新的事件的时间为准，n 秒后才执行，总之，就是要等你触发完事件 n 秒内不再触发事件, 才执行

// 优化版一：防止频繁触发
/*function debounce (func, wait) {
  var timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  }
}*/

// 如果我们要使用它，以上面的例子为例
// container.onmousemove = debounce(getUserAction, 1000)

// 如果我们在 getUserAction 函数中 console.log(this)，在不使用 debounce 函数的时候，this 的值为 <div id="container"></div>
// 使用 debounce 函数，this 就会指向 Window 对象！所以我们需要将 this 指向正确的对象

// 优化版二：将 this 指向正确的对象

/*function debounce (func, wait) {
  var timeout;
  return function () {
    var context = this;
    clearTimeout(timeout)
    timeout = setTimeout(function () {
      func.apply(context)
    }, wait)
  }
}*/
// container.onmousemove = debounce(getUserAction, 1000)

// 如果不使用 debouce 函数，e打印 MouseEvent 对象,但是在debounce 函数中，却只会打印 undefined!

// 优化版三：指向正确的event对象
/*function debounce (func, wait) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timeout)
    timeout = setTimeout(function () {
      func.apply(context, args)
    }, wait)
  }
}*/

// container.onmousemove = debounce(getUserAction, 1000)

// 到此为止，我们修复了两个小问题：

// this 指向
// event 对象

// 增加新功能：不希望非要等到事件停止触发后才执行，希望立刻执行函数，然后等到停止触发 n 秒后，才可以重新触发执行。这时可加个 immediate 参数判断是否是立刻执行
// 优化版四：立即执行

/*function debounce (func, wait, immediate) {
  var timeout;
  return function () {
    var context = this;
    var args = arguments;
    if (timeout) {
      clearTimeout(timeout)
    }
    if (immediate) {
      // 如果已经执行过 不再执行
      var callNow = !timeout;
      timeout = setTimeout(function(){
        timeout = null
      }, wait)
      if (callNow) {
        func.apply(context, args)
      }
    } else {
      timeout = setTimeout(function(){
        func.apply(context, args)
      }, wait)
    }
  }
}*/

// container.onmousemove = debounce(getUserAction, 1000, true)
// container.onmousemove = debounce(getUserAction, 1000, false)

// 此时注意一点，就是 getUserAction 函数可能是有返回值的，所以我们也要返回函数的执行结果，但是当 immediate 为 false 的时候，因为使用了 setTimeout ，我们将 func.apply(context, args) 的返回值赋给变量，最后再 return 的时候，值将会一直是 undefined，所以我们只在 immediate 为 true 的时候返回函数的执行结果。
// 优化版五：返回值
/*function debounce (func, wait, immediate) {
  var timeout, result;
  return function () {
    var context = this;
    var args = arguments;
    if (timeout) {
      clearTimeout(timeout)
    };
    if (immediate) {
      // 如果已经执行过，不再执行
      var callNow = !timeout;
      timeout = setTimeout(function() {
        timeout = null;
      }, wait);
      if (callNow) {
        result = func.apply(context, args)
      }
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait)
    }
    return result;
  }
}*/
// container.onmousemove = debounce(getUserAction, 1000, true)
// container.onmousemove = debounce(getUserAction, 1000, false)

// 新需求：比如说debounce 的时间间隔是 10 秒钟，immediate 为 true，这样的话，只有等 10 秒后才能重新触发事件，现在我希望有一个按钮，点击后，取消防抖，这样我再去触发，就可以又立刻执行
// 优化版六：点击按钮可取消

function debounce (func, wait, immediate) {
  var timeout, result;
  var debounced = function () {
    var context = this;
    var args = arguments;
    if (timeout) {
      clearTimeout(timeout);
    }
    if (immediate) {
      // 如果已经执行过，不再执行
      var callNow = !timeout;
      timeout = setTimeout(function () {
        timeout = null;
      }, wait)
      if (callNow) {
        result = func.apply(context, args)
      }
    } else {
      timeout = setTimeout(function () {
        func.apply(context, args)
      }, wait)
    }
    return result;
  };

  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null;
  };

  return debounced;
};
// 以上带取消功能的函数使用方法
var setUseAction = debounce(getUserAction, 10000, true);
container.onmousemove = setUseAction;
document.getElementById('btn').addEventListener('click', function() {
  setUseAction.cancel()
})

