import React, { useEffect, useState, useRef, useCallback  } from "react";
import _ from 'lodash'; 
import { useSelector, useDispatch } from "react-redux";
import { getContextById, getChunkIdByFileId } from "../../service/notebookPage";
import { List } from 'react-content-loader'
import '../../css/notebook/sidebar.css'
import Fuse from 'fuse.js';

const NotebookSource = ({ source, notebookId }) => {
    const dispatch = useDispatch();
    const isOpenSource = useSelector((state) => state.isOpenSource);
    const [contentSource, setContentSource] = useState('');
    const [nameSource, setNameSource] = useState('') 
    const [loadingContent, setLoadingContent] = useState(true)
    const findReferences = useSelector((state) => state.references)
    const [searchTerm, setSearchTerm] = useState('');
    const contentRef = useRef(null);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const [highlightedContent, setHighlightedContent] = useState('')
    const [fileSelectedId, setFileselectedId] = useState();
    const closeSource = () => {
        setSearchTerm('')
        dispatch({
            type: 'TOGGLE_SOURCE'
        });
    };

    const getContentFile = async (fileId) => {
        setLoadingContent(true)
        setFileselectedId(fileId)
        try {
            const data = await getContextById(notebookId, fileId);
            setNameSource(data.data.file.file_name)
            let formattedText = data.data.file.text_content
                .replace(/(?:\r\n|\r|\n|\\n)/g, '<br />') // Chuyển đổi dòng mới thành thẻ <br />
                .replace(/\s+/g, ' ') // Chuẩn hóa khoảng trắng liên tiếp thành một khoảng trắng
                .replace(/ n /g, ' ') // Sửa lỗi chính tả
                .replace(/ đ /g, ' ') // Sửa lỗi chính tả
                .replace(/ s /g, ' ') // Sửa lỗi chính tả
                .replace(/\s*,\s*/g, ', ') // Chuẩn hóa dấu phẩy
                .replace(/\s*\.\s*/g, '. ') // Chuẩn hóa dấu chấm
                .replace(/\s*\(\s*/g, ' (') // Chuẩn hóa dấu ngoặc mở
                .replace(/\s*\)\s*/g, ') ') // Chuẩn hóa dấu ngoặc đóng
                .replace(/ {2,}/g, ' '); // Chuẩn hóa khoảng trắng liên tiếp
            setContentSource(formattedText);
            setLoadingContent(false)
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        if(findReferences) {
            if(findReferences.fileId !== null && fileSelectedId !== findReferences.fileId) {
                getContentFile(findReferences.fileId);
                setTimeout(() => {
                    setSearchTerm(findReferences.content)
                    debouncedScrollToMatch(findReferences.content)
                }, 300)
            } else if (findReferences.fileId === null && source) {
                getContentFile(source.file_id);
            } else {
                setSearchTerm(findReferences.content)
                debouncedScrollToMatch(findReferences.content)
            }
        }
        

    },[findReferences, source])
    const createSuffixArray = (s) => {
        const n = s.length;
        const suffixArray = Array.from({ length: n }, (_, i) => i);
        let rank = Array.from(s, c => c.charCodeAt(0));
        const tempRank = Array(n);
        let k = 1;
    
        const sortByRank = (a, b) => {
            if (rank[a] !== rank[b]) return rank[a] - rank[b];
            const rankA = rank[a + k] || -1;
            const rankB = rank[b + k] || -1;
            return rankA - rankB;
        };
    
        while (k < n) {
            suffixArray.sort(sortByRank);
            tempRank[suffixArray[0]] = 0;
            for (let i = 1; i < n; i++) {
                tempRank[suffixArray[i]] = tempRank[suffixArray[i - 1]];
                if (sortByRank(suffixArray[i - 1], suffixArray[i]) !== 0) {
                    tempRank[suffixArray[i]]++;
                }
            }
            // Gán lại rank sau khi tính toán xong
            rank = [...tempRank];
            k *= 2;
        }
        return suffixArray;
    };
    
    const createLCPArray = (s, suffixArray) => {
        const n = s.length;
        const rank = Array(n).fill(0);
        const lcp = Array(n - 1).fill(0);
    
        for (let i = 0; i < n; i++) {
            rank[suffixArray[i]] = i;
        }
    
        let h = 0;
        for (let i = 0; i < n; i++) {
            if (rank[i] > 0) {
                const j = suffixArray[rank[i] - 1];
                while (i + h < n && j + h < n && s[i + h] === s[j + h]) {
                    h++;
                }
                lcp[rank[i] - 1] = h;
                if (h > 0) {
                    h--;
                }
            }
        }
        return lcp;
    };
    
    const findLongestCommonSubstring = (text1, text2) => {
        const delimiter = '$'; // Ký tự phân cách
        const combinedText = text1 + delimiter + text2;
        const suffixArray = createSuffixArray(combinedText);
        const lcpArray = createLCPArray(combinedText, suffixArray);
    
        let longestSubstring = '';
        let maxLength = 0;
        for (let i = 0; i < lcpArray.length; i++) {
            const lcp = lcpArray[i];
            const pos1 = suffixArray[i];
            const pos2 = suffixArray[i + 1];
            // Check if one suffix is from text1 and the other is from text2
            if ((pos1 < text1.length && pos2 > text1.length) || (pos2 < text1.length && pos1 > text1.length)) {
                if (lcp > maxLength) {
                    maxLength = lcp;
                    longestSubstring = combinedText.slice(pos1, pos1 + lcp);
                }
            }
        }
        return longestSubstring;
    };
    


      const highlightText = (text, term) => {
        if (!term || !term.trim()) return text;
        
        const longestSubstring = findLongestCommonSubstring(text, term);
        
        if (!longestSubstring) return text;
      
        const escapedSubstring = longestSubstring.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        const regex = new RegExp(escapedSubstring, 'gi');
        
        return text.replace(regex, (match) => {
          return `<span class="ref-highlight">${match}</span>`;
        });
      };
      
    
      const scrollToMatch = (index) => {
        if (contentRef.current) {
          const matches = contentRef.current.querySelectorAll('.ref-highlight');
          if (matches.length > 0) {
            const match = matches[index];
            if (match) {
              match.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        }
      };
    
      const handleNextMatch = () => {
        const matches = contentRef.current.querySelectorAll('.ref-highlight');
        if (matches.length > 0) {
          const nextIndex = (currentMatchIndex + 1) % matches.length;
          setCurrentMatchIndex(nextIndex);
          scrollToMatch(nextIndex);
        }
      };
    
      const debouncedScrollToMatch = useCallback(
        _.debounce((term) => {
          const highlightedContent = highlightText(contentSource, term);
          const firstMatchIndex = 0;
          scrollToMatch(firstMatchIndex);
        }, 500), // Thời gian debounce 500ms
        [contentSource]
      );
    
      const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
        setCurrentMatchIndex(0); // Reset chỉ số khi tìm kiếm mới
        debouncedScrollToMatch(term); // Gọi hàm debounce
      };
    
      useEffect(() => {
        setHighlightedContent(highlightText(contentSource, searchTerm))
      }, [contentSource, searchTerm])

    const handleCloseSource = () => {
        dispatch({
            type: 'FIND_REFERENCES',
            payload: {
                fileId: null,
                content: null
            }
        })
        closeSource();
    };

    return (
        <>
      {source && (
        <>
          <div className="notebook-source">
            <div className="notebook-source-close" onClick={handleCloseSource}>
              <i className="fa-solid fa-xmark"></i>
            </div>
            <div className="notebook-source-header">
              <span>{nameSource}</span>
            </div>
            <div className="notebook-source-main">
              <div className="search-bar">
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                    e.preventDefault();
                    handleNextMatch();
                    }
                }}
                />
              </div>
              {loadingContent ? (
                <>
                  <List backgroundColor={'#333'} foregroundColor={'#999'} />
                  <List backgroundColor={'#333'} foregroundColor={'#999'} />
                </>
              ) : (
                <div className="notebook-source-content" ref={contentRef}>
                  <div dangerouslySetInnerHTML={{ __html: highlightedContent }} />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
    );
};

export default NotebookSource;