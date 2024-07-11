import { useState, useEffect } from "react";
import { Logout } from "../../service/homePageApi";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const UserProfile = ({ setIsOpenUserDetail }) => {
    const selectUserInfo = useSelector((state) => state.userInfo)

    const userName = localStorage.getItem("username")
    const role = localStorage.getItem("role")
    const navigate = useNavigate();

    const handleOpenDetail = () => {
      setIsOpenUserDetail(true)
    }

    const handleLogout = async () => {
      try {
        const data = await Logout();
        localStorage.removeItem("session")
        navigate('/login')
      } catch (error) {
        console.error('Error update notebooks:', error);
      }
    }
    
    return (
        <div className="user-profile">
            <div className='user-header'>
                <div className="user-img">
                </div>
                <div className="user-info">
                    <div className="user-name">{userName}</div>
                    <div className="user-email">
                        {role}
                    </div>
                </div>
            </div>
            <div className="user-line"></div>
            <div className="user-main">
                <div className="user-settings" onClick={handleOpenDetail}> <i className="fa-solid fa-gear"></i> Account Settings</div>
                <div className="user-feedback"><i className="fa-solid fa-triangle-exclamation"></i>Feedback</div>
                <div className="user-logout" onClick={handleLogout}><i className="fa-solid fa-right-from-bracket"></i>Logout</div>
            </div>
        </div>
    )
}

export default UserProfile;