import React,{ useEffect, useState } from "react";
import '../../css/notebook/references.css'

const NoteReferences = ({ data }) => {
    const [countReferences, setCountReferences] = useState()
    const [isOpenReferences, setIsOpenReferences] = useState(false)

    useEffect(() => {
        console.log(data)
        if(data) {
            setCountReferences(data.length + ' câu trích dẫn')
        }
    },[])
    const handleOpenReferences = (e) => {
        e.stopPropagation()
        setIsOpenReferences(!isOpenReferences)
    }
    return (
        <div>
            {data.length > 0 && (
                <div className={`references-container ${isOpenReferences ? 'open': ''}`} onClick={handleOpenReferences}>
                <div className="references-count">
                {countReferences} &nbsp;&nbsp;
                </div>
                <div className="references-num">
                {[...Array(data.length).keys()].map((index) => (
                <span key={index}>
                    {index + 1}
                    <div className="ref-information">
                        {data[index]}
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