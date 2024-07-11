import { useState, useEffect } from "react";
import { Logout } from "../../service/homePageApi";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../css/notebook/user-detail.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faXmark } from '@fortawesome/free-solid-svg-icons'
import { getUserById } from "../../service/userDetail";



const UserDetail = ({isOpenUserDetail, closeUserDetail}) => {

    const [userInfo, setUserInfo] = useState()

    const userId = localStorage.getItem("userid")

    const handleCloseUserDetail = () => {
        closeUserDetail(false)
    }


    const handleGetUserById = async () => {
        try {
          const data = await getUserById(userId)
          setUserInfo(data.data.user)
          console.log(data)
        } catch (error) {
            console.log('Error get user: ', error)
        }
      }
  
    useEffect(() => {
        handleGetUserById()
        console.log(userInfo)
    },[userId])
  


    return (<>
    
    {userInfo && (
        <div className={`user-detail-block ${isOpenUserDetail}`} onClick={handleCloseUserDetail}> 
        <div className={`user-detail ${isOpenUserDetail}`} onClick={(event) => {event.stopPropagation()}}>
            <div className="user-detail-header">
                <span className="user-detail-title">USER DETAIL</span>
                <div className="user-detail-close" onClick={handleCloseUserDetail}><FontAwesomeIcon icon={faXmark} /></div>
            </div>
            <div className="user-detail-main">
                <div className="user-detail-row">
                    <div className="user-detail-avatar">
                        <img src="https://lh3.googleusercontent.com/proxy/gY33Utucd1AoOUkPsFhq_Z5pMENXfHwphKb68HXoJAGoV0oG8LeiIdmxnK5uQ5PhCtQzVAFXbIiED86ZEgNABYj87JaXWgsAdTGRvjblprRAmDGHfZA8v63dTQ" alt="" />
                    </div>
                    <div className="user-detail-info">
                        <div className="user-detail-info-main">
                            <span className="user-detail-item">{userInfo.username}</span>
                            <span className="user-detail-item">{userInfo.role}</span>
                            <span className="user-detail-item">{userInfo.user_id}</span>
                        </div>
                        <div className="user-detail-edit">
                            <FontAwesomeIcon icon={faPen} size="xs" /> Edit
                        </div>
                    </div>
                </div>
                <div className="user-detail-row">
                    <div className="user-detail-login">
                        <div className="user-detail-login-item">
                            <span>Email</span>
                            <span>{userInfo.email}</span>
                        </div>
                        <div className="user-detail-login-item">
                            <span>Password</span>
                            <span>{userInfo.password.split('').map(() => '*').join('')}</span>
                        </div>
                    </div>
                    <div className="user-detail-edit">
                        <FontAwesomeIcon icon={faPen} size="xs" /> Edit
                        </div>
                </div>
                <div className="user-detail-row-container">
                <div className="user-detail-row-static">
                    <span className="user-detail-static">Notebooks:5 </span>
                    <span className="user-detail-static">Notes: 10 </span>
                </div>
                <div className="user-detail-row-static">
                    <span className="user-detail-static">Created at: {userInfo.created_at}</span>
                    <span className="user-detail-static">Time Used: {userInfo.total_time_used} hour</span>
                </div>
                <div className="user-detail-row-static">
                    <span className="user-detail-static">Storage Used: {userInfo.total_resource_used}/250Mb</span>
                    <span className="user-detail-static">Token Chat Used: {userInfo.total_chat_token}</span>
                </div>
                </div>
            </div>
        </div>
    </div>
    )}
    </>
    )
}
export default UserDetail;