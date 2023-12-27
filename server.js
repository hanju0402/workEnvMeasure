const express = require("express");
const path = require("path");
const app = express();
const axios = require("axios");
const key = require("./config/key");
const { parseString } = require("xml2js");

const serviceKey = key.serviceKey;

const endPoint = "http://msds.kosha.or.kr/openapi/service/msdschem/";

app.listen(8080, function () {
    console.log("listening on 8080");
});

app.use(express.json());
var cors = require("cors");
app.use(cors());

app.use(express.static(path.join(__dirname, "workEnv/build")));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/workEnv/build/index.html"));
});

const parseStringPromise = (xmlString) => {
    return new Promise((resolve, reject) => {
        parseString(xmlString, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

app.get("/api/msdscheck", async function (req, res) {
    const casNos = req.query.casNo;
    const promiseArray = [];

    for (const casNo of casNos) {
        let chemName = "";
        let chemCas = "";
        let measurementYn = "N";
        let measurementCycle = "";
        let healthCheckYn = "N";
        let healthCheckCycle = "";
        let specialYn = "N";
        let findYn = "N";
        let chemId = "";

        try {
            const response = await axios.get(`${endPoint}chemlist?searchCnd=1&searchWrd=${casNo}&ServiceKey=${serviceKey}`);
            const xmlString = response.data;

            const result = await parseStringPromise(xmlString);


            console.log("뭔데?", 'item' in result.response.body[0]);
            // 'item' 속성이 존재하는 경우의 처리
            if (result.response.body && result.response.body[0].items && result.response.body[0].items[0] && 'item' in result.response.body[0].items[0]) {
              chemCas = result.response.body[0].items[0].item[0].casNo[0];
              chemName = result.response.body[0].items[0].item[0].chemNameKor[0];
              chemId = result.response.body[0].items[0].item[0].chemId[0];
            } else {
              chemCas = null; // 또는 다른 기본값으로 설정
              chemName = ""; // 또는 다른 기본값으로 설정
              chemName = ""; // 또는 다른 기본값으로 설정
            }



            if (chemCas == casNo) {
                const secondResponse = await axios.get(`${endPoint}chemdetail15?chemId=${chemId}&ServiceKey=${serviceKey}`);
                const secondXmlString = secondResponse.data;

                const secondResult = await parseStringPromise(secondXmlString);

                const itemD = secondResult.response.body[0].items[0].item[0].itemDetail[0];
                console.log("법", itemD);

                // 측정여부 추출
                const measureYnMatch = itemD.match(/작업환경측정대상물질/);
                measurementYn = measureYnMatch ? "Y" : "N";

                // 검진여부 추출
                const helthCheckYnMatch = itemD.match(/특수건강진단대상물질/);
                healthCheckYn = helthCheckYnMatch ? "Y" : "N";

                // 측정주기 추출
                const measurePeriodMatch = itemD.match(/측정주기 : .*?(\d+)개월/);
                measurementCycle = measurePeriodMatch ? parseInt(measurePeriodMatch[1], 10) : 0;

                // 진단주기 추출
                const diagnosePeriodMatch = itemD.match(/진단주기 : .*?(\d+)개월/);
                healthCheckCycle = diagnosePeriodMatch ? parseInt(diagnosePeriodMatch[1], 10) : 0;

                // 특별관리물질 여부 추출
                const specialYnMatch = itemD.match(/특별관리물질/);
                specialYn = specialYnMatch ? "Y" : "N";

                findYn = "Y"

                promiseArray.push({
                    "chemName": chemName,
                    "chemCas": chemCas,
                    "measurementYn": measurementYn,
                    "measurementCycle": measurementCycle,
                    "healthCheckYn": healthCheckYn,
                    "healthCheckCycle": healthCheckCycle,
                    "specialYn": specialYn,
                    "findYn": findYn
                });
            } else {
                promiseArray.push({
                  "chemName": chemName,
                  "chemCas": chemCas,
                  "measurementYn": measurementYn,
                  "measurementCycle": measurementCycle,
                  "healthCheckYn": healthCheckYn,
                  "healthCheckCycle": healthCheckCycle,
                  "specialYn": specialYn,
                  "findYn": findYn
              });
            }
        } catch (error) {
            // Handle errors
            promiseArray.push({
              "chemName": chemName,
              "chemCas": chemCas,
              "measurementYn": measurementYn,
              "measurementCycle": measurementCycle,
              "healthCheckYn": healthCheckYn,
              "healthCheckCycle": healthCheckCycle,
              "specialYn": specialYn,
              "findYn": findYn
          });
            console.error("Error:", error);
        }
    }

    console.log("최종데이터리스트 => ", promiseArray);
    res.json(promiseArray);
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/workEnv/build/index.html"));
});
