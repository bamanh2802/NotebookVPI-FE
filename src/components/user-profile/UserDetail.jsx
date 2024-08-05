// import { useState, useEffect } from "react";
// import { Logout } from "../../service/homePageApi";
// import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';
// import '../../css/notebook/user-detail.css'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faPen, faXmark } from '@fortawesome/free-solid-svg-icons'
// import { getUserById } from "../../service/userDetail";
// import { changeUserEmail, changeUserPassword, changeUserName } from "../../service/homePageApi";


// const UserDetail = ({isOpenUserDetail, closeUserDetail}) => {
//     const [toggleChangeLogin, setToggleChangeLogin] = useState(false)
//     const [toggleChangeName, setToggleChangeName] = useState(false)
//     const [userInfo, setUserInfo] = useState()
//     const [newUserName, setNewUserName] = useState('');
//     const [newUserPassword, setNewUserPassword] = useState('');
//     const [newUserEmail, setNewUserEmail] = useState('');
//     const [oldPassword, setOldPassword] = useState('');
//     const [newPassword, setNewPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//     const [isPasswordValid, setIsPasswordValid] = useState(true);


//     const userId = localStorage.getItem("userid")

//     const handleCloseUserDetail = () => {
//         closeUserDetail(false)
//     }

//     const handleEdittingLogin = ()=> {
//         setToggleChangeLogin(!toggleChangeLogin)
//     }
//     const handleChangeName = ()=> {
//         setToggleChangeName(!toggleChangeName)
//     }
//     const userNameChange = async () => {
//         if(newUserName.trim != '') {
//             try {
//                 const data = await changeUserName(newUserName)
//                 setNewUserName('')
//             } catch (e) {
//                 console.log(e)
//             }
//         }
//     }
//     const userEmailChange = async () => {
//         if(newUserName.trim != '') {
//             try {
//                 const data = await changeUserEmail(newUserEmail)
//                 setNewUserEmail('')
//             } catch (e) {
//                 console.log(e)
//             }
//         }
//     }
//     const validatePassword = () => {
//         console.log(isPasswordValid)
//         console.log(oldPassword, newPassword, confirmPassword)
//         if (oldPassword === newPassword) {
//           setIsPasswordValid(false);
//           return;
//         }
      
//         if (newPassword !== confirmPassword) {
//           setIsPasswordValid(false);
//           return;
//         }
      
//         setIsPasswordValid(true);
//     };
//     const handleApplyChangePassword = async () => {
//         console.log(isPasswordValid)
//     try {
//         const data = await changeUserPassword(oldPassword, newPassword)
//         setOldPassword('');
//         setNewPassword('');
//         setConfirmPassword('');
//         setToggleChangeLogin(false);
//     } catch (error) {
//         console.error('Error updating user password:', error);
//     }
//     };

//     const handleUserNameChange = (e) => {
//         setNewUserName(e.target.value);
//       };
//     const handleUserEmailChange = (e) => {
//         setNewUserEmail(e.target.value);
//       };

//     const handleGetUserById = async () => {
//         try {
//           const data = await getUserById(userId)
//           setUserInfo(data.data.user)
//         } catch (error) {
//             console.log('Error get user: ', error)
//         }
//       }
  
//     useEffect(() => {
//         handleGetUserById()
//     },[userId])
  


//     return (<>
    
//     {userInfo && (
//         <div className={`user-detail-block ${isOpenUserDetail}`} onClick={handleCloseUserDetail}> 
//         <div className={`user-detail ${isOpenUserDetail}`} onClick={(event) => {event.stopPropagation()}}>
//             <div className="user-detail-header">
//                 <span className="user-detail-title">USER DETAIL</span>
//                 <div className="user-detail-close" onClick={handleCloseUserDetail}><FontAwesomeIcon icon={faXmark} /></div>
//             </div>
//             <div className="user-detail-main">
//                 <div className="user-detail-row">
//                     <div className="user-detail-avatar">
//                         <img src="https://lh3.googleusercontent.com/proxy/gY33Utucd1AoOUkPsFhq_Z5pMENXfHwphKb68HXoJAGoV0oG8LeiIdmxnK5uQ5PhCtQzVAFXbIiED86ZEgNABYj87JaXWgsAdTGRvjblprRAmDGHfZA8v63dTQ" alt="" />
//                     </div>
//                     <div className="user-detail-info">
//                         <div className="user-detail-info-main">
//                             <span className="user-detail-item">{userInfo.username}</span>
                            
                            
//                             {toggleChangeName ? (
//                                 <>
//                                 <div className="user-change-name">
//                                     <span>New User Name</span>
//                                     <input 
//                                         className="user-change-email-input" 
//                                         type="email" 
//                                         name="" 
//                                         id="" 
//                                         value={newUserName}
//                                         onChange={handleUserNameChange}
//                                         />
//                                 </div>
//                                 <div className="user-change-name-btn">
//                                     <button onClick={userNameChange}>Apply</button>
//                                 </div>
//                                 </>
//                             ) : (
//                                 <>
//                                 <span className="user-detail-item">{userInfo.role}</span>
//                                 <span className="user-detail-item">{userInfo.user_id}</span>
//                                 </>
//                             )}
//                         </div>
//                         <div className="user-detail-edit" onClick={handleChangeName}>
//                             <FontAwesomeIcon icon={faPen} size="xs" /> Edit
//                         </div>
//                     </div>
//                 </div>
//                 <div className="user-detail-row">
//                     <div className="user-detail-login">
//                         <div className="user-detail-login-item">
//                             <div className="user-change-email">
//                                     <span>Email</span>
//                                     <span>{userInfo.email}</span>
//                                 </div>
//                                 {toggleChangeLogin && (
//                                     <>
//                                         <div className="user-change-email">
//                                             <span>New Email</span>
//                                             <input 
//                                                 className="user-change-email-input" 
//                                                 type="email" 
//                                                 name="" 
//                                                 id=""
//                                                 value={newUserEmail}
//                                                 onChange={handleUserEmailChange}
//                                                 />
//                                         </div>
//                                         <div className="user-change-email-btn">
//                                             <button onClick={userEmailChange}>Apply</button>
//                                         </div>
//                                     </>
//                                 )}
                            
//                         </div>
//                         <div className="user-detail-login-item">
                            
                            
//                             <div className={`user-detail-password ${toggleChangeLogin ? 'hidden' : ''}`}>
//                                 <span>Password</span>
//                                 <span>*******</span>
//                             </div>
//                             <form
//                                 className={`user-detail-password-change ${!toggleChangeLogin ? 'hidden' : ''}`}
//                                 onSubmit={handleApplyChangePassword}
//                                 >
//                                 <div className="user-password">
//                                     <label htmlFor="old-password">Old Password</label>
//                                     <input
//                                     type="password"
//                                     id="old-password"
//                                     className={`${isPasswordValid ? '' : 'password-error'}`}
//                                     name="oldPassword"
//                                     value={oldPassword}
//                                     onChange={(e) => setOldPassword(e.target.value)}
//                                     />
//                                 </div>
//                                 <div className="user-password">
//                                     <label htmlFor="new-password">New Password</label>
//                                     <input
//                                     type="password"
//                                     id="new-password"
//                                     className={`${isPasswordValid ? '' : 'password-error'}`}
//                                     name="newPassword"
//                                     value={newPassword}
//                                     onChange={(e) => {
//                                         setNewPassword(e.target.value);
//                                         validatePassword();
//                                     }}
//                                     />
//                                 </div>
//                                 <div className="user-password">
//                                     <label htmlFor="confirm-password">Confirm Password</label>
//                                     <input
//                                     type="password"
//                                     id="confirm-password"
//                                     className={`${isPasswordValid ? '' : 'password-error'}`}
//                                     name="confirmPassword"
//                                     value={confirmPassword}
//                                     onChange={(e) => {
//                                         setConfirmPassword(e.target.value);
//                                         validatePassword();
//                                     }}
//                                     />
//                                 </div>
//                                 <div className="user-change-email-btn">
//                                     <button
//                                     type="submit"
//                                     disabled={!isPasswordValid}
//                                     className={`${isPasswordValid ? '' : 'input-disable'}`}
//                                     >
//                                     Apply
//                                     </button>
//                                 </div>
//                                 </form>

//                         </div>
                        
//                     </div>
//                     <div className="user-detail-edit" onClick={handleEdittingLogin}>
//                         <FontAwesomeIcon icon={faPen} size="xs" /> Edit
//                         </div>
//                 </div>
                
//                 {!toggleChangeLogin && (
//                     <div className="user-detail-row-container">
//                         <div className="user-detail-row-static">
//                             <span className="user-detail-static">Notebooks <span>: 5</span> </span>
//                             <span className="user-detail-static">Notes   <span>: 10</span></span>
//                         </div>
//                         <div className="user-detail-row-static">
//                             <span className="user-detail-static">Created at <span>: {userInfo.created_at}</span> </span>
//                             <span className="user-detail-static">Time Used: <span>{userInfo.total_time_used} hour </span></span>
//                         </div>
//                         <div className="user-detail-row-static">
//                             <span className="user-detail-static">Storage Used<span>: {userInfo.total_resource_used}/250Mb </span></span>
//                             <span className="user-detail-static">Token Chat Used <span>: {userInfo.total_chat_token}</span></span>
//                         </div>
//                     </div>
//                 )}

//             </div>
//         </div>
//     </div>
//     )}
//     </>
//     )
// }
// export default UserDetail;
import { useState, useEffect } from "react";
import { Logout, changeUserEmail, changeUserPassword, changeUserName } from "../../service/homePageApi";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../../css/notebook/user-detail.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faXmark } from '@fortawesome/free-solid-svg-icons';
import { getUserById } from "../../service/userDetail";

const UserDetail = ({ isOpenUserDetail, closeUserDetail }) => {
    const [toggleChangeLogin, setToggleChangeLogin] = useState(false);
    const [toggleChangeName, setToggleChangeName] = useState(false);
    const [userInfo, setUserInfo] = useState();
    const [newUserName, setNewUserName] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserEmail, setNewUserEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');

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
            } catch (e) {
                console.log(e);
            }
        }
    };

    const validatePassword = () => {
        let error = '';
        if (oldPassword === newPassword) {
            error = 'Mật khẩu mới không được giống mật khẩu cũ.';
        } else if (newPassword !== confirmPassword) {
            error = 'Mật khẩu mới và xác nhận mật khẩu không khớp.';
        } else if (newPassword.length < 6) {
            error = "Password must be at least 6 characters long"
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
            setUserInfo(data.data.user);
        } catch (error) {
            console.log('Error get user: ', error);
        }
    };

    useEffect(() => {
        handleGetUserById();
    }, [userId]);

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
                                                <input
                                                    type="password"
                                                    id="old-password"
                                                    className={`${passwordError ? 'password-error' : ''}`}
                                                    name="oldPassword"
                                                    value={oldPassword}
                                                    onChange={(e) => {
                                                        setPasswordError('')
                                                        setOldPassword(e.target.value)
                                                    }}
                                                />
                                            </div>
                                            <div className="user-password">
                                                <label htmlFor="new-password">New Password</label>
                                                <input
                                                    type="password"
                                                    id="new-password"
                                                    className={`${passwordError ? 'password-error' : ''}`}
                                                    name="newPassword"
                                                    value={newPassword}
                                                    onChange={(e) => {
                                                        setPasswordError('')
                                                        setNewPassword(e.target.value);
                                                    }}
                                                />
                                            </div>
                                            <div className="user-password">
                                                <label htmlFor="confirm-password">Confirm Password</label>
                                                <input
                                                    type="password"
                                                    id="confirm-password"
                                                    className={`${passwordError ? 'password-error' : ''}`}
                                                    name="confirmPassword"
                                                    value={confirmPassword}
                                                    onChange={(e) => {
                                                        setPasswordError('')
                                                        setConfirmPassword(e.target.value);
                                                    }}
                                                />
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
    );
};

export default UserDetail;
