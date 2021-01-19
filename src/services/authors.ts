import { Author, Video } from '../common/interfaces';

export const getAuthors = (): Promise<Author[]> => {
  return fetch(`${process.env.REACT_APP_API}/authors`).then((response) => (response.json() as unknown) as Author[]);
};

export const getAuthor = (authorId: number): Promise<Author> => {
  return fetch(`${process.env.REACT_APP_API}/authors/${authorId}`).then((response) => (response.json() as unknown) as Author);
}

export const updateAuthor = (authorId: number, update: any): Promise<any> => {
  return fetch(`${process.env.REACT_APP_API}/authors/${authorId}/`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'PATCH',
    body: JSON.stringify(update)
  });
}

