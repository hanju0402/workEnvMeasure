import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import titleInfo from "./titleInfo";
import MsdsDetailPage from "./MsdsDetailPage";

export default function MsdsTotalMain({ show, handleClose, info }) {
    const [selectedTab, setSelectedTab] = useState(1);
    const titleInfoData = titleInfo;
    const chemName = info.chemName;
    const chemId = info.chemId;
    useEffect(() => {
        // 모달이 닫힐 때 selectedTab 초기화
        return () => {
            setSelectedTab(1);
        };
    }, [show]); // show가 변경될 때마다 useEffect 실행

    const handleSelectChange = (event) => {
        setSelectedTab(event.target.value);
    };

    const renderContent = () => {
        return <MsdsDetailPage chemId={chemId} detailNo={Number(selectedTab)} />;
        // 필요한 만큼 다른 탭에 대한 case를 추가하세요.
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{chemName}에 관한 정보</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <Form.Select value={selectedTab} onChange={handleSelectChange}>
                        {titleInfoData.map((title) => (
                            <option key={title.id} value={title.id}>
                                {title.id}. {title.pageName}
                            </option>
                        ))}
                    </Form.Select>
                    {renderContent()}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    닫기
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
