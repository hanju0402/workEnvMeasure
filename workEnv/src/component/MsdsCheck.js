import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import CloseButton from "react-bootstrap/CloseButton";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import MsdsTotalMain from "./DetailBoard/MsdsTotalMain";

export default function MsdsCheck() {
    const [casNo, setCasNo] = useState([""]);
    const [inputCount, setInputCount] = useState(1);
    const [msdsInfo, setMsdsInfo] = useState([{}]);
    const [filterMsdsInfo, setFilterMsdsInfo] = useState([{}]);
    const [measurementY, setMeasurementY] = useState([]);
    const [specialY, setSpecialY] = useState([]);
    const [view, setView] = useState(false);
    const [loading, setLoading] = useState(false);
    const [ficNo, setFicNo] = useState(0);
    const baseURL = process.env.REACT_APP_API_BASE_URL || "https://port-0-workenvmeasure-5r422alqp5tjlj.sel4.cloudtype.app";

    useEffect(() => {
        // 필터링 로직
        const findFiltered = msdsInfo.filter((item) => item.findYn == "Y");
        setFilterMsdsInfo(findFiltered);
    }, [msdsInfo]);

    useEffect(() => {
        // 필터링 로직
        const measurementFiltered = filterMsdsInfo
            .filter((item) => item.measurementYn == "Y" && item.specialYn == "N")
            .map((item) => item.chemName);
        const specialFiltered = filterMsdsInfo
            .filter((item) => item.measurementYn == "Y" && item.specialYn == "Y")
            .map((item) => item.chemName);

        const uniqueMeasurement = [...new Set(measurementFiltered)];
        const uniqueSpecial = [...new Set(specialFiltered)];

        setMeasurementY(uniqueMeasurement);
        setSpecialY(uniqueSpecial);
    }, [filterMsdsInfo]);

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
        setMsdsInfo([...msdsInfo, {}]); // 각 인풋 박스에 대한 데이터를 빈 문자열로 초기화
    };

    const removeInput = (index) => {
        const newCasNos = [...casNo];
        const newMsdsInfo = [...msdsInfo];
        newCasNos.splice(index, 1);
        newMsdsInfo.splice(index, 1);
        setFicNo(0);
        setCasNo(newCasNos);
        setMsdsInfo(newMsdsInfo);
        setInputCount(inputCount - 1);
    };

    const link = () => {
        if (casNo.length > 0) {
            setLoading(true);
            axios
                .get(`${baseURL}/api/msdscheck`, {
                    params: { casNo },
                })
                .then((response) => {
                    setMsdsInfo(response.data);
                    setView(true);
                })
                .catch((error) => {
                    // Handle errors
                    console.error("Error:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    };
    const [showModal, setShowModal] = useState(false);

    const handleShow = (index) => {
        setFicNo(index);
        setShowModal(true);
    };
    const handleClose = () => setShowModal(false);

    return (
        <>
            <div id="addCasNo">
                <button className="button" style={{ marginLeft: "auto" }} onClick={addInput}>
                    CasNo 추가
                </button>
                <span>&nbsp;&nbsp;</span>
                <button className="button" onClick={link}>
                    물질확인하기
                </button>
            </div>
            {filterMsdsInfo.length > 0 && (
                <MsdsTotalMain show={showModal} handleClose={handleClose} info={filterMsdsInfo[ficNo]} />
            )}

            <div>
                {Array.from({ length: inputCount }).map((_, index) => (
                    <div key={index} className="mb-3">
                        <div>
                            <Container>
                                <Row>
                                    <Col md={2} xs={12}>
                                        <input
                                            value={casNo[index]}
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                            placeholder="CasNo를 입력해주세요"
                                            style={{ width: "100%" }}
                                        />
                                    </Col>
                                    <Col md={1} xs={12} className="mb-3" style={{ marginLeft: "-50px" }}>
                                        <CloseButton onClick={() => removeInput(index)} id="remove" />
                                    </Col>
                                    <Col md={7}>
                                        <span style={{ marginLeft: "-600px" }}>
                                            {loading
                                                ? "MSDS 확인중..."
                                                : msdsInfo[index] &&
                                                  msdsInfo[index].findYn === "N" &&
                                                  "존재하지 않는 CasNo 입니다."}
                                        </span>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </div>
                ))}
            </div>
            <div></div>
            <div></div>
            <div>
                {msdsInfo.some((info) => info.findYn === "Y") && (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>CAS No</th>
                                <th>물질명</th>
                                <th>측정여부(주기)</th>
                                <th>특별관리물질여부</th>
                                <th>특수건강검진여주(주기)</th>
                                <th>상세정보보기</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filterMsdsInfo.map((info, index) => (
                                <tr key={index}>
                                    <td>{info.chemCas}</td>
                                    <td>{info.chemName}</td>
                                    <td>
                                        {info.measurementYn == "Y" ? `대상(${info.measurementCycle}개월)` : "비대상"}
                                    </td>
                                    <td>{info.specialYn == "Y" ? "대상" : "비대상"}</td>
                                    <td>
                                        {info.healthCheckYn == "Y" ? `대상(${info.healthCheckCycle}개월)` : "비대상"}
                                    </td>
                                    <td>
                                        <Button variant="primary" onClick={() => handleShow(index)}>
                                            상세정보
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            <tr>
                                <td colSpan={1}>측정대상물질 모음</td>
                                <td colSpan={5}>
                                    {measurementY.join(",")}
                                    {measurementY.length > 0 && specialY.length > 0 && <span>,</span>}
                                    {specialY.length > 0 && (
                                        <span
                                            style={{
                                                color: "red",
                                            }}
                                        >
                                            {specialY.join(",")}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                )}
            </div>
        </>
    );
}
