import React,{ useEffect, useState } from "react";
import '../../css/notebook/references.css'

const NoteReferences = ({ data }) => {
    const [countReferences, setCountReferences] = useState()
    const [isOpenReferences, setIsOpenReferences] = useState(false)
    const [arrayData, setArrayData] = useState([])

    useEffect(() => {
        if(data) {
            setCountReferences(JSON.parse(data).length + ' câu trích dẫn')
            setArrayData(JSON.parse(data))
        }
    },[])
    const handleOpenReferences = (e) => {
        e.stopPropagation()
        setIsOpenReferences(!isOpenReferences)
    }
    return (
        <div>
            {arrayData.length > 0 && (
                <div className={`references-container ${isOpenReferences ? 'open': ''}`} onClick={handleOpenReferences}>
                <div className="references-count">
                {countReferences} &nbsp;&nbsp;
                </div>
                <div className="references-num">
                {[...Array(arrayData.length).keys()].map((index) => (
                <span key={index}>
                    {index + 1}
                    <div className="ref-information">
                        {arrayData[index].content}
                    </div>
                </span>
                ))}
                </div>
            </div>
            )}
        </div>
    )
}

export default NoteReferences;