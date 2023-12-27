import React, { useState } from "react";
import axios from "axios";
import "../App.css";
import CloseButton from "react-bootstrap/CloseButton";

export default function MsdsCheck() {
    const [casNo, setCasNo] = useState([""]);
    const [inputCount, setInputCount] = useState(1);
    const [msdsInfo, setMsdsInfo] = useState([{}]);

    const handleInputChange = (index, value) => {
        if (/^[0-9-]*$/.test(value)) {
            const newCasNos = [...casNo];
            newCasNos[index] = value;
            setCasNo(newCasNos);
        } else {
            window.alert("숫자와 '-'만 입력할 수 있습니다.");
        }
    };

    const addInput = () => {
        setInputCount(inputCount + 1);
        setCasNo([...casNo, ""]);
        setMsdsInfo([...msdsInfo, ""]); // 각 인풋 박스에 대한 데이터를 빈 문자열로 초기화
    };

    const removeInput = (index) => {
        const newCasNos = [...casNo];
        const newMsdsInfo = [...msdsInfo];
        newCasNos.splice(index, 1);
        newMsdsInfo.splice(index, 1);
        setCasNo(newCasNos);
        setMsdsInfo(newMsdsInfo);
        setInputCount(inputCount - 1);
    };

    const link = () => {
        if (casNo.length > 0) {
            axios
                .get("http://localhost:8080/api/msdscheck", {
                    params: { casNo },
                })
                .then((response) => {
                    setMsdsInfo(response.data);
                })
                .catch((error) => {
                    // Handle errors
                    console.error("Error:", error);
                });
        }
    };

    return (
        <>
            <div id="addCasNo">
                <button style={{ marginLeft: "auto" }} onClick={addInput}>
                    CasNo 추가
                </button>
            </div>
            <div>
                {Array.from({ length: inputCount }).map((_, index) => (
                    <div key={index} style={{ marginBottom: "10px" }}>
                        <input
                            value={casNo[index]}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            placeholder="CasNo를 입력해주세요"
                        />
                        <CloseButton onClick={() => removeInput(index)} id="remove" />
                        {msdsInfo[index] && msdsInfo[index].findYn == "N" ? (
                            "존재하지 않는 CasNo 입니다."
                        ) : (
                            <>
                                <span>물질명:</span>{" "}
                                <span style={{ color: msdsInfo[index].specialYn === "Y" ? "red" : "black" }}>
                                    {" "}
                                    {msdsInfo[index].chemName}
                                </span>
                            </>
                        )}
                    </div>
                ))}
            </div>
            <div></div>
            <div>
                <button onClick={link}>물질확인하기</button>
            </div>
            <div>{msdsInfo.some((info) => info.findYn === 'Y') && <div>유효한 msdsInfo 정보가 있습니다.</div>}</div>
        </>
    );
}
