// MsdsDetailPage.js
import { useEffect, useState } from "react";
import axios from "axios";

function MsdsDetailPage({ chemId, detailNo }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        // API 호출
        axios
            .get("http://localhost:8080/api/msdsdetailcheck", {
                params: { chemId, detailNo },
            })
            .then((response) => {
                // API 응답에서 데이터 추출
                const resultData = response.data;

                // 데이터 로딩 완료 후 상태 업데이트
                setData(resultData);
            })
            .catch((error) => {
                console.error("Error:", error);
                // 에러 발생 시 상태 초기화
                setData([]);
            });
    }, [chemId, detailNo]);

    const renderData = () => {
        return data.map((item, index) => (
            <div key={index}>
                {/* 데이터를 토대로 렌더링 */}
                <h3>{item.msdsItemNameKor}</h3>
                <p>{item.itemDetail}</p>
                {/* 추가 필요한 렌더링 로직 작성 */}
            </div>
        ));
    };

    return (
        <div>
          <p/>
            {renderData()}
        </div>
    );
}

export default MsdsDetailPage;
