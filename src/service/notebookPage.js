import axios from 'axios';
import qs from 'qs';

import API_URL from './apiPath';


export async function fetchNotebookById(notebookId) {

    const response = await axios.get(`${API_URL}/notebooks/${notebookId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });
  
    return response.data;
  }

export async function fetchSourceNotebook(notebookId) {

const response = await axios.get(`${API_URL}/notebooks/${notebookId}/files`, {
    headers: {
    'Content-Type': 'application/json',
    },
    withCredentials: true
});

return response.data;
}

export async function getNoteByNotebookId(notebookId) {

    const response = await axios.get(`${API_URL}/notebooks/${notebookId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });
  
    return response.data;
  }
export async function createNewNote(notebookId, title, content, ref) {
    console.log(content)
      const response = await axios.post(`${API_URL}/notebooks/${notebookId}/notes/new?title=${title}&content=${content}`, {
      },
      {
        headers: {
            'Content-Type': 'application/json',
          },
        withCredentials: true
      }
    );
      return response
  }
  
export async function deleteNoteByNotebookId(notebookId, noteId) {
    const response = await axios.post(`${API_URL}/notebooks/${notebookId}/notes/${noteId}/delete`, {},
    {
        headers: {
            'Content-Type': 'application/json',
          },
        withCredentials: true
    })
    return response

}
export async function noteRenameById(notebookId, noteId, newName){
    const response = await axios.post(`${API_URL}/notebooks/${notebookId}/notes/${noteId}/rename?new_title=${newName}`, {
    },
    {
      headers: {
          'Content-Type': 'application/json',
        },
      withCredentials: true
    }
  );
    return response
}

export async function updateContentNote(notebookId, noteId, newContent){
  const response = await axios.post(`${API_URL}/notebooks/${notebookId}/notes/${noteId}/update?new_content=${newContent}`, {
  },
  {
    headers: {
        'Content-Type': 'application/json',
      },
    withCredentials: true
  }
);
  return response
}


export async function sendMessage(notebookId, content, selected_files) {
  const data = qs.stringify({
    notebook_id: notebookId,
    content: content,
    selected_files: JSON.stringify(selected_files) // Chuyển đổi mảng thành chuỗi JSON
  });

  const response = await axios.post(`${API_URL}/messages/send`, data, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    withCredentials: true
  });

  return response;
}

export async function getContextById(notebookId, fileId) {
  const response = await axios.get(`${API_URL}/notebooks/${notebookId}/files/${fileId}/text`, 
  {
      headers: {
          'Content-Type': 'application/json',
        },
      withCredentials: true
  })
  return response

}

export async function deleteFileById(notebookId, fileId){
  const response = await axios.post(`${API_URL}/notebooks/${notebookId}/files/${fileId}/delete`, {}, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    },
    withCredentials: true
  })
  return response
}