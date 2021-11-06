const { exit } = require('process');
const writeJson = require('./write');
const _types = {
  "getVaccinationGiven": {          //
    "simple": {
      "path": "vaccination/simple",
      "list": "all",
      "tpcd": {
        'A': { 'today': "" },               //Today         TZ=>KST
        'B': { 'yesterday_c': '' },   //Yesterday's Cumulative
        'C': { 'today_c': '' },       //Today's Cumulative
      }, "_tags": {
        "dataTime": "",
        "firstCnt": "",
        "secondCnt": "",
        "thirdCnt": "",
      },
    }, "city": {
      "path": "vaccination/city",
      "list": "sido",
      "_tags": {
        "firstCnt": "",
        "firstTot": "",
        "secondCnt": "",
        "secondTot": "",
        "thirdCnt": "",
        "thirdTot": "",
      },
    },
  },
};
async function scrap(fnNm, type) {
  const dataDir = `/${type.path}`;
  var jsonPath = undefined;

  (async function () {
    var _function = await require('./GET')[fnNm]();
    return _function;
  })()
    .then((_function) => (_function(type)))
    .catch((error) => {
      console.error(error);
      exit(-1);
    })
    .then((data) => {
      if(dataDir.indexOf('simple') > 0){
        writeJson(data, dataDir.replace('/simple',''));
      }
      writeJson(data, dataDir);
      writeJson(data, dataDir, data['dataTime']);
    });
}

Object.entries(_types).forEach(([fnNm, v]) => {
  Object.values(v).forEach((v) => {
    scrap(fnNm, v);
  });
})