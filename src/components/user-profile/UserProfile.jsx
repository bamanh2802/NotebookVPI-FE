import { useState, useEffect } from "react";

const UserProfile = () => {
    
    
    return (
        <div className="user-profile">
            <div className='user-header'>
                <div className="user-img">
                    
                </div>
                <div className="user-info">
                    <div className="user-name">admin</div>
                    <div className="user-email">
                        admin@gmail.com
                    </div>
                </div>
            </div>
            <div className="user-line"></div>
            <div className="user-main">
                <div className="user-settings"> <i class="fa-solid fa-gear"></i> Account Settings</div>
                <div className="user-feedback"><i class="fa-solid fa-triangle-exclamation"></i>Feedback</div>
                <div className="user-logout"><i class="fa-solid fa-right-from-bracket"></i>Logout</div>
            </div>
        </div>
    )
}

export default UserProfile;