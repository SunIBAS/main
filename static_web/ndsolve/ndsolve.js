function getCalc() {
    const getAvg = list => {
        let sum = 0;
        list.forEach(l => sum += l);
        return sum / list.length;
    };
    const calc = new (class {
        constructor() {
            this.n = {};
            this.otherExp = {
            }
            this.copyN = [];
            this.exps = [];
            this.deta = 1;
        }

        addParams(name,value) {
            this.n[name] = value;
            return this;
        }

        addOtherExp(name,fn) {
            this.otherExp[name] = fn;
            return this;
        }

        addExps(syms,fn) {
            this.exps.push({
                syms,
                fn: fn.bind(this)
            });
            return this;
        }

        calc(numTimes) {
            let times = parseInt(numTimes / this.deta);
            this.copyN = [this.n];
            for (let i = 0;i < times;i++) {
                let tmpN = JSON.parse(JSON.stringify(this.copyN[this.copyN.length - 1]));
                this.exps.forEach(exp => {
                    let deta = exp.fn(tmpN,i * this.deta,this.otherExp);
                    if (isNaN(deta)) {
                        throw new Error("nan");
                    }
                    tmpN[exp.syms] += deta * this.deta;
                    tmpN[exp.syms + '_d'] = deta;
                });
                this.copyN.push(tmpN);
            }
            return this;
        }

        getList(syms,deta) {
            deta = deta || 1;
            let list = [];
            let i = 0;
            if (syms.endsWith('_d')) {
                i = 1;
            }
            if (this.copyN.length && syms in this.copyN[i]) {
                for (;i < this.copyN.length;i += parseInt(deta / this.deta)) {
                    list.push(this.copyN[i][syms]);
                }
                return list;
            } else {
                return list;
            }
        }

        Correlation(list1,list2,len) {
            let cov = 0;
            let var1 = 0;
            let var2 = 0;
            list1 = list1.slice(0,len);
            list2 = list2.slice(0,len);
            let list1Avg = getAvg(list1);
            let list2Avg = getAvg(list2);
            for (let i = 0;i < len;i++) {
                cov += (list1[i] - list1Avg) * (list2[i] - list2Avg);
                var1 += (list1[i] - list2Avg) ** 2;
                var2 += (list2[i] - list2Avg) ** 2;
            }
            return cov / Math.sqrt(var1 * var2);
        }

        // 向量相减
        VectorCut(list1,list2,len) {
            let cuts = [];
            for (let i = 0;i < len;i++) {
                cuts.push(list1[i] - list2[i]);
            }
            return cuts;
        }
        // 向量相除
        VectorDevice(list1,list2,len) {
            let device = [];
            for (let i = 0;i < len;i++) {
                device.push(list1[i] / list2[i]);
            }
            return device;
        }
    });
    return calc;
}