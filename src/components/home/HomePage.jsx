import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import '../../css/homepage/homepage.css';
import '../../css/color.css';



function HomePage(props) {
  const [notebooks, setNotebooks] = useState([])

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isChatOpen = useSelector((state) => state.isChatOpen);

  useEffect(() => {
    async function fetchNotebooks() {
      try {
        const response = await fetch('http://localhost:3000/get-all-notebook');
        const data = await response.json();
        setNotebooks(data);
      } catch (error) {
        console.error('Error fetching notebooks:', error);
      }
    }
    fetchNotebooks();
  }, []);



  const handleNotebookClick = (id) => {
    navigate(`/notebook/${id}`);
    if(!isChatOpen){
      dispatch({ type: 'TOGGLE_CHAT' });
    }
  };

  return (
    <div>
      <div id="home-page">
        <div className="header">
          <div className="logo">NotebookPVI</div>
          <div className="icons">
            <span className="icon">🌙</span>
            {/* <span className="profile">M</span> */}
          </div>
        </div>
        <div className="content-container">
          <div className="content">
            <h2 className="content-title">Sổ tay</h2>
            <div className="notebook-grid">
              <div className="notebook new">
                <div className="plus">+</div>
                <div className="label">Sổ tay mới</div>
              </div>
              {notebooks.map((notebook) => (
                <div
                  key={notebook.id}
                  id={notebook.id}
                  className="notebook"
                  onClick={() => handleNotebookClick(notebook.id)}
                >
                  <div className="notebook-header-homepage">
                    <div className="notebook-icon">
                      <img src="https://cdn-icons-png.flaticon.com/512/330/330705.png" alt="" />
                    </div>
                    <span className="notebook-option">
                      <i className="fa-solid fa-ellipsis-vertical" />
                    </span>
                  </div>
                  <span className="notebook-name-homepage">{notebook.name}</span>
                  <div className="notebook-detail">
                    <span className="notebook-date">{notebook.date}</span>
                    <span>.</span>
                    <span className="notebook-count-source">{notebook.sourceCount} nguồn</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;