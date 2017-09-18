/**
 * @author xiaomei
 * @version v1.1
 * @description 根据用户配置的文件使用指定排序算法排序指定字段
 */
function sort(config) {
    /**
     * 默认配置
     * @type {{data: Array, sortField: string, sortType: string, sortMethod: string}}
     */
    const defaultConfig = {
        data: [], // 排序数据
        sortField: '', // 排序字段
        sortType: 'asc', // 排序类型，只有两个值 asc-升序 desc-降序
        sortMethod: 'insert', // 排序方法，只有两个值 insert-插入 merge-归并
    }

    // 验证配置类型是否是对象
    if ('[object Object]' !== Object.prototype.toString.call(config)) {
        throw new Error('Unable to identify your configuration');
    }

    // 验证是否配置数据
    if (!config.hasOwnProperty('data')) {
        throw new Error('You must be configured to sort the data');
    }

    // 验证数据否为数组
    if ('[object Array]' !== Object.prototype.toString.call(config.data)) {
        throw new Error('The data format must be an array');
    }

    /**
     * 获取配置的排序类型，如未配置，则取默认值。
     * 注：值不考虑大小写且为'asc'和'desc'之一
     */
    let sortType = '';
    if (config.hasOwnProperty('sortType')) {
        sortType = config.sortType.toLowerCase();
        if ('asc' !== sortType && 'desc' !== sortType) {
            throw new Error('the sort type value must be one of asc or desc');
        }
    } else {
        sortType = defaultConfig.sortType;
    }

    /**
     * 获取配置的排序方法，如未配置，则取默认值。
     * 注：值不考虑大小写且为'insert'和'merge'之一
     */
    let sortMethod = '';
    if (config.hasOwnProperty('sortMethod')) {
        sortMethod = config.sortMethod.toLowerCase();
        if ('insert' !== sortMethod && 'merge' !== sortMethod) {
            throw new Error('the sort method value must be one of insert or merge');
        }
    } else {
        sortMethod = defaultConfig.sortMethod;
    }

    /**
     * 该函数只支持排序 数组(元素为数字和字符类型) + 数组对象(对象值为数字和字符类型) 两种格式数据。
     * 注：如果是数组形式，自动忽略配置的字段。
     * 如果是数组对象，根据配置字段进行排序，必须配置排序字段。
     */
    const data = config.data;
    if (!!data.length) {// 数组不为空

        // 数组对象且对象的排序字段值为数字和字符类型
       if ('[object Object]' === Object.prototype.toString.call(data[0])) {
            if (config.hasOwnProperty('sortField')) {

                let sortField = config.sortField.toLowerCase();
                if ('[object Number]' === Object.prototype.toString.call(data[0][sortField])
                    || '[object String]' === Object.prototype.toString.call(data[0][sortField])) {
                    // 插入排序
                    if ('insert' === sortMethod) {
                        let newData = sortByInsert(data, sortType, sortField);
                        if ('function' === typeof config.success) {
                            config.success(newData);
                        }
                    }
                    // 归并排序
                    else if ('merge' === sortMethod) {
                        let newData = sortByMerge(data, sortType, sortField);
                        if ('function' === typeof config.success) {
                            config.success(newData);
                        }
                    }
                } else {
                    throw new Error('Unable to sort data');
                }
            } else {
                throw new Error('the sort field can not be null');
            }
        }

        // 无法排序的数据格式
        else {
            throw new Error('Unable to sort data');
        }

    } else {// 数组为空
        return;
    }
}

// 插入排序
function sortByInsert(data, sort, sortField) {

        // 数组对象排序
        if (sortField && !!sortField.length) {

            // 排序对象字段值为数字
            let temp = {};
            for (let i = 1, len = data.length; i < len; i++) {
                temp = data[i];
                let j = i - 1;
                while (j >= 0 && data[j][sortField] > temp[sortField]) {
                    data[j + 1] = data[j];
                    j--;
                }
                data[j + 1] = temp;
            }
        }
         // 降序
        if ('desc' === sort) {
            data.reverse();
        }
    return data;
}

// 归并排序
function sortByMerge(data, sort, sortField) {
    if (data.length === 1)
        return data;

    let work = [];
    let len = data.length;
    for (let i = 0; i < len; i++) {
        work.push([data[i]]);
    }
    work.push([]); // 如果数组长度为奇数

    for (let lim = len; lim > 1; lim = ~~((lim + 1) / 2)) {
        let j = 0, k = 0;
        for (; k < lim; j++, k += 2) {
            work[j] = mergeByAsc(data, work[k], work[k + 1], sortField);
        }
        work[j] = []; // 如果数组长度为奇数
    }
    if ('desc' === sort) {
         work[0].reverse();
    }

    return work[0];
}

// 合并
function mergeByAsc(data, left, right, sortField) {
    let result = [];
        while (left.length && right.length) {
            if (left[0][sortField] < right[0][sortField]) {
                result.push(left.shift());
            }
            else {
                result.push(right.shift());
            }
        }
    return result.concat(left, right);
}
