function dl_all_card(ret) {
    let obj = [];
    // $($('.row')[2]).find('.card').each((ind,card) => {
    $($(ret).find('.row')[2]).find('.card').each((ind,card) => {
        obj.push({
            url: card.getElementsByTagName('a')[0].href,
            img: card.getElementsByTagName('img')[0].getAttribute('src'),
            name: card.getElementsByTagName('h4')[0].innerText,
            tag: new Array(...card.getElementsByClassName('label')).map(_=>_.innerText),
        });
    });
    // console.log(obj);
    return obj;
}
// dl_all_card();
/**
 * @param promise   要执行的 promise，可以自行封装一次
 * @param arr       数组，参数集合，记得和 promise 匹配
 * @param doPromiseReturn   如果需要对 promise 的结果进行处理，可以使用这个参数
 * @returns {Promise<unknown>}
 */
var runPromiseByArrReturnPromise = (promise,arr,doPromiseReturn) => {
    let doing = false;
    doPromiseReturn = doPromiseReturn || (_=>_);
    return new Promise(s => {
        let _id = setInterval(() => {
            if (!doing) {
                doing = true;
                if (arr.length) {
                    let id = arr.pop();
                    promise(id)
                        .then(o => {
                            doPromiseReturn(o,id);
                            doing = false;
                        });
                } else {
                    clearInterval(_id);
                    s();
                }
            }
        },500);
    });
}
function getAllGames() {
    let pages = [];
    for (var i = 0;i < 341;i++) pages.push(i);
    window.all_games = [];
    runPromiseByArrReturnPromise(p => {
        return fetch(`https://www.yikm.net/nes?page=${p}0&tag=0&e=0`).then(_=>_.text()).then(text => {
            let games = dl_all_card(text);
            window.all_games = window.all_games.concat(games);
            return true;
        });
    },pages,(_,p) => {
        console.log(`${p} over`);
        return true;
    }).then(() => console.log("all over"));
}

function get_nes_file(url) {
    return fetch(url).then(_=>_.text()).then(ret => {
        let start = ret.indexOf('gromname=');
        let end = ret.indexOf('.nes";',start);
        if (end === -1) {
            end = ret.indexOf('.NES";',start);
        }
        return 'https://file.1990i.com/' + ret.substring(start + 'gromname="'.length,end) + '.nes';
    });
}
function get_all_nes_file(games) {
    // let ind = 0;
    let copy = JSON.parse(JSON.stringify(games));
    games = games.map((_,ind) => {
        return {
            ..._,
            ind: ind,
        }
    });
    runPromiseByArrReturnPromise(g => {
        if (g.nes.length > 100) {
            return get_nes_file(g.url).then(link => {
                copy[g.ind++].nes = link;
                console.log(link);
                console.log(`${g.ind} / ${copy.length}`);
                return true;
            });
        } else {
            return new Promise(s => {
                console.log(`skip`);
                s();
            })
        }
    },games).then(()=>{
        console.log('all over');
        console.log(copy);
    });
}
