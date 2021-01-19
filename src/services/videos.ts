import { getAuthors, getAuthor, updateAuthor } from './authors';
import { ProcessedVideo, Author, Video } from '../common/interfaces';

const generateProcessedVideo = (currentAuthor: Author, currentVideo: Video) => {
  return {
    id: currentVideo.id,
    name: currentVideo.name,
    author: currentAuthor.name,
    authorId: currentAuthor.id,
    categoryIds: currentVideo.catIds,
    releaseDate: new Date(currentVideo.releaseDate),
    highestQualityFormat: currentVideo.highestQualityFormat
  };
};


export const getVideos = async (): Promise<ProcessedVideo[]> => {
  const authors =  await getAuthors();
  const processedVideos: Array<ProcessedVideo> = [];
  authors.forEach(author => {
    author.videos.forEach(video => {
      processedVideos.push(generateProcessedVideo(author, video));
    });
  });
  return processedVideos;
};

export const getVideo = async (authorId: number, videoId: number): Promise<ProcessedVideo> => {
  const author = await getAuthor(authorId)
  const currentVideo = author.videos.find(video => video.id === +videoId)
  if(!currentVideo) {
    return Promise.reject();
  }
  return generateProcessedVideo(
    author,
    currentVideo
  );
}

export const deleteVideoByAutor = async (authorId: number, videoId: number): Promise<any> => {
  const author: Author = await getAuthor(authorId); //check the lastest version of the current author
  if(author) {
    //this method lacks of consistency but it is not posible to apply a change to nested objects in json-server
    //filter so we can delete the current video
    const currentVideos = author.videos.filter((video: Video) => video.id !== videoId);
    return updateAuthor(authorId, {
      videos: currentVideos,
    });
  }

  throw new Error('Cannot indentify current author');
}


export const addVideoByAuthor = async(authorId: number, video: Video): Promise<any> => {
  const author: Author = await getAuthor(authorId); //check the lastest version of the current author
  if(author) {
    //this method lacks of consistency but it is not posible to apply a change to nested objects in json-server
    //filter so we can delete the current video
    author.videos.push(video);
    author.videos.sort((a, b) => a.id - b.id);
    return updateAuthor(authorId, {
      videos: author.videos,
    });
  }

  throw new Error('Cannot indentify current author');
};

export const modifyVideoByAuthor = async(authorId: number, video: Video): Promise<any> => {
  const author: Author = await getAuthor(authorId); //check the lastest version of the current author
  if(author) {
    //this method lacks of consistency but it is not posible to apply a change to nested objects in json-server
    //filter so we can delete the current video
    const currentvideoIndex = author.videos.findIndex((video: Video) => video.id === video.id);
    if(currentvideoIndex > -1) {
      author.videos[currentvideoIndex] = video;
      return updateAuthor(authorId, {
        videos: author.videos,
      });
    }
    throw new Error('Cannot indentify current video');
  }
  throw new Error('Cannot indentify current author');
};