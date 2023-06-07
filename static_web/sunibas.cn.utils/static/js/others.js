// 读取文件
function readFile(file) {
    return new Promise(function (s) {
        var reader = new FileReader();//new一个FileReader实例
        reader.onload = function () {
            s(this.result);
        };
        reader.readAsText(file);
    });
}
// <script src="https://cdn.bootcdn.net/ajax/libs/FileSaver.js/1.0.0/FileSaver.min.js"></script>
window.saveFile = function (str,filename,type) {
    const blob = new Blob([str], { type: type || "" });
    if (!filename) {
        filename = (new Date().getTime()) + ".txt";
    }
    saveAs(blob,filename);
};

const getDays = (function () {
    (() => {
        let zeros = [0,0,0,0,0,0,0,0];

        let changeZeroLength = function(deta) {
            if (zeros.length < deta) {
                for (;deta > zeros.length;deta--) {
                    zeros.push(0);
                }
            }
        };
        Number.prototype.toLength = function (len) {
            return (this + '').toLength(len);
        };
        String.prototype.toLength = function (len) {
            let n = this;
            if (n.length < len) {
                let deta = len - (n + '').length;
                changeZeroLength(deta);
                return zeros.slice(0,deta).join('') + n;
            } else {
                return n;
            }
        };
    })();
    const formatDate = function(date,format) {
        const dear = {
            'yyyyMMdd'(date) {
                return (date.getYear() + 1900) +
                    (date.getMonth() + 1).toLength(2) +
                    (date.getDate()).toLength(2);
            },
            'yyyy/MM/dd'(date) {
                return (date.getYear() + 1900) + '/' +
                    (date.getMonth() + 1).toLength(2) + '/' +
                    (date.getDate()).toLength(2);
            },
            'yMd'(date) {
                return (date.getYear() + 1900) + '' +
                    (date.getMonth() + 1) + '' +
                    (date.getDate());
            },
            'yyyy-MM-dd'(date) {
                return (date.getYear() + 1900) + '-' +
                    (date.getMonth() + 1).toLength(2) + '-' +
                    (date.getDate()).toLength(2);
            },
            'y-M-d'(date) {
                return (date.getYear() + 1900) + '-' +
                    (date.getMonth() + 1) + '-' +
                    (date.getDate());
            }
        };
        if (format in dear) {
            return dear[format](date);
        } else {
            return dear.yyyyMMdd(date);
        }
    };
    /**
     * format = "yyyyMMdd"  20200101    default
     * format = "yMd"       202011
     * format = "yyyy-MM-dd"2020-01-01
     * format = "y-M-d"     2020-1-1
     *
     * endInToday 是否循环到当日就结束输出
     * */
    const getFromDay = function(year,month,day,format,endInToday,endYear,endMonth,endDate,dayLen) {
        const d = new Date();
        const today = new Date();
        const oneDayMill = 1000 * 3600 * 24 * (dayLen ? dayLen : 1);
        endYear = parseInt(endYear);
        endMonth = parseInt(endMonth);
        endDate = parseInt(endDate);
        if (!Number.isNaN(endYear) && !Number.isNaN(endMonth) && !Number.isNaN(endDate)) {
            today.setYear(endYear);
            today.setMonth(endMonth - 1);
            today.setDate(endDate);
        }
        let ts = parseInt(formatDate(today,'yyyyMMdd'));
        format = format || "yyyyMMdd";
        d.setYear(year);
        d.setMonth(month - 1);
        d.setDate(day);
        return function () {
            let next = true;
            let ds = parseInt(formatDate(d,'yyyyMMdd'));
            if (ds > ts) {
                next = false;
            }
            if (next) {
                let str = formatDate(d,format);
                d.setTime(d.getTime() + oneDayMill);
                return str;
            } else {
                return false;
            }
        }
    };

    let d = null;
    /**
     * 从 days 天前开始 days 是一个整形数字
     * */
    const DaysAgoBegin = function (days) {
        days = parseInt(days);
        if (Number.isNaN(days)) {
            days = 0;
        }
        d = new Date();
        d.setTime(d.getTime() - 24 * 3600 * 1000 * days);
        return getFromDay(1900 + d.getYear(),
            d.getMonth() + 1,
            d.getDate(),false,true);
    };
    const TodayOnly = function() {
        return DaysAgoBegin(0);
    };

    // dstr = yyyyMMdd
    const getDayBetween = function(dstr1,dstr2) {
        function strToDate(dstr) {
            let d1 = new Date();
            d1.setYear(dstr.substring(0,4));
            d1.setMonth(parseInt(dstr.substring(4,6)) - 1);
            d1.setDate(dstr.substring(6));
            d1.setHours(12);
            return d1;
        }
        let d1 = strToDate(dstr1 + '');
        let d2 = strToDate(dstr2 + '');
        let ds = 1000 * 3600 * 24;
        return parseInt((d1.getTime() - d2.getTime()) / ds);
    };

    const getDayBetweenFromYearFirstDay = function(dstr) {
        return getDayBetween(dstr,(dstr + '').substring(0,4) + '0101');
    };

    return {
        formatDate,
        getFromDay,
        DaysAgoBegin,
        TodayOnly,
        getDayBetween,
        getDayBetweenFromYearFirstDay,
        getToday() {
            return formatDate(new Date(),false);
        }
    };
})();

function replaceString(s,form) {
    let fs = [s];
    form.forEach(f => {
        let fs_ = [];
        let reg = new RegExp(`{${f.name}}`,'g');
        f.vals.forEach(fv => {
            fs.forEach(fsCopy => {
                fs_.push(fsCopy.replace(reg,fv))
            });
        });
        fs = fs_;
    });
    return fs;
}