import { useState } from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import axios from 'axios';


export default function MsdsCheck() {
    let [casNo, setCasNo] = useState('');

    function link() {
        axios.get(`http://localhost:8080/api/msdscheck?casNo=${casNo}`)
            .then(response => {
                // Handle the response data as needed
                console.log(response.data);
            })
            .catch(error => {
                // Handle errors
                console.error('Error:', error);
            });
    }

    return (
        <>
            <div>
                <input onChange={(e) => {
                    setCasNo(e.target.value);
                }}/>
                <button onClick={link}>연동하기</button>

            </div>
        </>
    );
}