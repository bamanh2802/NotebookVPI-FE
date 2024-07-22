import { useState, useEffect } from "react";
import { Logout } from "../../service/homePageApi";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../css/notebook/user-detail.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen, faXmark } from '@fortawesome/free-solid-svg-icons'
import { getUserById } from "../../service/userDetail";



const UserDetail = ({isOpenUserDetail, closeUserDetail}) => {
    const [toggleChangeLogin, setToggleChangeLogin] = useState(false)
    const [toggleChangeName, setToggleChangeName] = useState(false)
    const [userInfo, setUserInfo] = useState()

    const userId = localStorage.getItem("userid")

    const handleCloseUserDetail = () => {
        closeUserDetail(false)
    }

    const handleEdittingLogin = ()=> {
        setToggleChangeLogin(!toggleChangeLogin)
    }
    const handleChangeName = ()=> {
        setToggleChangeName(!toggleChangeName)
    }


    const handleGetUserById = async () => {
        try {
          const data = await getUserById(userId)
          setUserInfo(data.data.user)
        } catch (error) {
            console.log('Error get user: ', error)
        }
      }
  
    useEffect(() => {
        handleGetUserById()
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
                            
                            
                            {toggleChangeName ? (
                                <>
                                <div className="user-change-name">
                                    <span>New User Name</span>
                                    <input className="user-change-email-input" type="email" name="" id="" />
                                </div>
                                <div className="user-change-name-btn">
                                    <button>Apply</button>
                                </div>
                                </>
                            ) : (
                                <>
                                <span className="user-detail-item">{userInfo.role}</span>
                                <span className="user-detail-item">{userInfo.user_id}</span>
                                </>
                            )}
                        </div>
                        <div className="user-detail-edit" onClick={handleChangeName}>
                            <FontAwesomeIcon icon={faPen} size="xs" /> Edit
                        </div>
                    </div>
                </div>
                <div className="user-detail-row">
                    <div className="user-detail-login">
                        <div className="user-detail-login-item">
                            <div className="user-change-email">
                                    <span>Email</span>
                                    <span>{userInfo.email}</span>
                                </div>
                                {toggleChangeLogin && (
                                    <>
                                        <div className="user-change-email">
                                            <span>New Email</span>
                                            <input className="user-change-email-input" type="email" name="" id="" />
                                        </div>
                                        <div className="user-change-email-btn">
                                            <button>Apply</button>
                                        </div>
                                    </>
                                )}
                            
                        </div>
                        <div className="user-detail-login-item">
                            
                            
                            <div className={`user-detail-password ${toggleChangeLogin ? 'hidden' : ''}`}>
                                <span>Password</span>
                                <span>*******</span>
                            </div>
                            <div className={`user-detail-password-change ${!toggleChangeLogin ? 'hidden' : ''}`}>
                                <div className="user-password">
                                <span>Old Password</span>
                                <input type="password" name="" id="" />
                                </div>
                                <div className="user-password">
                                    <span>New Password</span>
                                    <input type="password" name="" id="" />
                                </div>
                                <div className="user-password">
                                    <span>Confirm Password</span>
                                    <input type="password" name="" id="" />
                                </div>
                                <div className="user-change-email-btn">
                                    <button>Apply</button>
                                </div>
                            </div>

                        </div>
                        
                    </div>
                    <div className="user-detail-edit" onClick={handleEdittingLogin}>
                        <FontAwesomeIcon icon={faPen} size="xs" /> Edit
                        </div>
                </div>
                
                {!toggleChangeLogin && (
                    <div className="user-detail-row-container">
                        <div className="user-detail-row-static">
                            <span className="user-detail-static">Notebooks <span>: 5</span> </span>
                            <span className="user-detail-static">Notes   <span>: 10</span></span>
                        </div>
                        <div className="user-detail-row-static">
                            <span className="user-detail-static">Created at <span>: {userInfo.created_at}</span> </span>
                            <span className="user-detail-static">Time Used: <span>{userInfo.total_time_used} hour </span></span>
                        </div>
                        <div className="user-detail-row-static">
                            <span className="user-detail-static">Storage Used<span>: {userInfo.total_resource_used}/250Mb </span></span>
                            <span className="user-detail-static">Token Chat Used <span>: {userInfo.total_chat_token}</span></span>
                        </div>
                    </div>
                )}

            </div>
        </div>
    </div>
    )}
    </>
    )
}
export default UserDetail;