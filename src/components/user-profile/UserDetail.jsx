
import { useState, useEffect } from "react";
import { Logout, changeUserEmail, changeUserPassword, changeUserName } from "../../service/homePageApi";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../css/notebook/user-detail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faXmark } from '@fortawesome/free-solid-svg-icons';
import { getUserById } from "../../service/userDetail";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const UserDetail = ({ isOpenUserDetail, closeUserDetail }) => {
    const [toggleChangeLogin, setToggleChangeLogin] = useState(false);
    const [toggleChangeName, setToggleChangeName] = useState(false);
    const [userInfo, setUserInfo] = useState();
    const [newUserName, setNewUserName] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const userId = localStorage.getItem("userid");

    const handleCloseUserDetail = () => {
        closeUserDetail(false);
    };

    const handleEdittingLogin = () => {
        setToggleChangeLogin(!toggleChangeLogin);
    };

    const handleChangeName = () => {
        setToggleChangeName(!toggleChangeName);
    };

    const userNameChange = async () => {
        if (newUserName.trim() !== '') {
            try {
                await changeUserName(newUserName);
                setNewUserName('');
                handleChangeName()
            } catch (e) {
                console.log(e);
            }
        }
    };

    const userEmailChange = async () => {
        if (newUserEmail.trim() !== '') {
            try {
                await changeUserEmail(newUserEmail);
                setNewUserEmail('');
                setToggleChangeLogin(false)
            } catch (e) {
                console.log(e);
            }
        }
    };

    const validatePassword = (errorPassword) => {
        let error = '';
        if (oldPassword === newPassword) {
            error = 'Mật khẩu mới không được giống mật khẩu cũ.';
        } else if (newPassword !== confirmPassword) {
            error = 'Mật khẩu mới và xác nhận mật khẩu không khớp.';
        } else if (newPassword.length < 6) {
            error = "Password must be at least 6 characters long"
        } else if(errorPassword !== '') {
            error = errorPassword
        }
        setPasswordError(error);
        return !error;
    };


    const handleApplyChangePassword = async (event) => {
        event.preventDefault();
        if (validatePassword()) {
            try {
                const data = await changeUserPassword(oldPassword, newPassword)
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setPasswordError('');
                setToggleChangeLogin(false);
            } catch (error) {
                console.error('Error updating user password:', error);
                validatePassword('Mật khẩu không chính xác')
            }
        }
    };

    const handleUserNameChange = (e) => {
        setNewUserName(e.target.value);
    };

    const handleUserEmailChange = (e) => {
        setNewUserEmail(e.target.value);
    };

    const handleGetUserById = async () => {
        try {
            const data = await getUserById(userId);
            console.log(data)
            setUserInfo(data.data.user);
        } catch (error) {
            console.log('Error get user: ', error);
        }
    };

    useEffect(() => {
        handleGetUserById();
    }, []);

    return (
        <>
            {userInfo && (
                <div className={`user-detail-block ${isOpenUserDetail}`} onClick={handleCloseUserDetail}>
                    <div className={`user-detail ${isOpenUserDetail}`} onClick={(event) => { event.stopPropagation(); }}>
                        <div className="user-detail-header">
                            <span className="user-detail-title">USER DETAIL</span>
                            <div className="user-detail-close" onClick={handleCloseUserDetail}>
                                <FontAwesomeIcon icon={faXmark} />
                            </div>
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
                                                    <input
                                                        className="user-change-email-input"
                                                        type="text"
                                                        value={newUserName}
                                                        onChange={handleUserNameChange}
                                                    />
                                                </div>
                                                <div className="user-change-name-btn">
                                                    <button onClick={userNameChange}>Apply</button>
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
                                                    <input
                                                        className="user-change-email-input"
                                                        type="email"
                                                        value={newUserEmail}
                                                        onChange={handleUserEmailChange}
                                                    />
                                                </div>
                                                <div className="user-change-email-btn">
                                                    <button onClick={userEmailChange}>Apply</button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="user-detail-login-item">
                                        <div className={`user-detail-password ${toggleChangeLogin ? 'hidden' : ''}`}>
                                            <span>Password</span>
                                            <span>*******</span>
                                        </div>
                                        <form
                                            className={`user-detail-password-change ${!toggleChangeLogin ? 'hidden' : ''}`}
                                            onSubmit={handleApplyChangePassword}
                                        >
                                              <div className="user-password">
                                                <label htmlFor="old-password">Old Password</label>
                                                <div className="password-input-container">
                                                    <input
                                                        type={showOldPassword ? 'text' : 'password'}
                                                        id="old-password"
                                                        className={`${passwordError ? 'password-error' : ''}`}
                                                        name="oldPassword"
                                                        value={oldPassword}
                                                        onChange={(e) => {
                                                            setPasswordError('');
                                                            setOldPassword(e.target.value);
                                                        }}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={showOldPassword ? faEyeSlash : faEye}
                                                        onClick={() => setShowOldPassword(prev => !prev)}
                                                        className="password-toggle-icon"
                                                    />
                                                </div>
                                            </div>
                                            <div className="user-password">
                                                <label htmlFor="new-password">New Password</label>
                                                <div className="password-input-container">
                                                    <input
                                                        type={showNewPassword ? 'text' : 'password'}
                                                        id="new-password"
                                                        className={`${passwordError ? 'password-error' : ''}`}
                                                        name="newPassword"
                                                        value={newPassword}
                                                        onChange={(e) => {
                                                            setPasswordError('');
                                                            setNewPassword(e.target.value);
                                                        }}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={showNewPassword ? faEyeSlash : faEye}
                                                        onClick={() => setShowNewPassword(prev => !prev)}
                                                        className="password-toggle-icon"
                                                    />
                                                </div>
                                            </div>
                                            <div className="user-password">
                                                <label htmlFor="confirm-password">Confirm Password</label>
                                                <div className="password-input-container">
                                                    <input
                                                        type={showConfirmPassword ? 'text' : 'password'}
                                                        id="confirm-password"
                                                        className={`${passwordError ? 'password-error' : ''}`}
                                                        name="confirmPassword"
                                                        value={confirmPassword}
                                                        onChange={(e) => {
                                                            setPasswordError('');
                                                            setConfirmPassword(e.target.value);
                                                        }}
                                                    />
                                                    <FontAwesomeIcon
                                                        icon={showConfirmPassword ? faEyeSlash : faEye}
                                                        onClick={() => setShowConfirmPassword(prev => !prev)}
                                                        className="password-toggle-icon"
                                                    />
                                                </div>
                                            </div>
                                            {passwordError && <div className="password-error-message">{passwordError}</div>}
                                            <div className="user-change-email-btn">
                                                <button
                                                    type="submit"
                                                    disabled={!!passwordError}
                                                    className={`${passwordError ? 'input-disable' : ''}`}
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        </form>
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
                                        <span className="user-detail-static">Notes <span>: 10</span></span>
                                    </div>
                                    <div className="user-detail-row-static">
                                        <span className="user-detail-static">Created at <span>: {userInfo.created_at}</span> </span>
                                        <span className="user-detail-static">
                                        Time Used: <span>{(userInfo.total_time_used / (1000 * 60 * 60)).toFixed(2)} hours</span>
                                        </span>

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
    );
};

export default UserDetail;
