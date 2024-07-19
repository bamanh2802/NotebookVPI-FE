import axios from 'axios';

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

const response = await axios.post(`${API_URL}/notebooks/${notebookId}/files`, {}, {
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
export async function createNewNote(notebookId) {
      const response = await axios.post(`${API_URL}/notebooks/${notebookId}/notes/new?title=Untitled&content=New%20Content`, {
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
    const response = await axios.get(`${API_URL}/notebooks/${notebookId}/notes/${noteId}/delete`, 
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