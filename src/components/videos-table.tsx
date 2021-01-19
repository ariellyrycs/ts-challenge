import React, { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, FormControl, InputLabel, TextField} from '@material-ui/core';
import { ProcessedVideo, Category } from '../common/interfaces';
import { Link } from 'react-router-dom';
import { getVideos, deleteVideoByAutor } from '../services/videos';
import { getCategories } from '../services/categories';
import { generateCategoryMap, getCategoryNameList } from '../utils/categoryUtil';
import { euroFormatByDotSeperation } from '../utils/formatUtil';

export const VideosTable: React.FC = () => {
  const [videos, setVideos] = useState<ProcessedVideo[]>([]);
  const [filterVideos, setFilterVideos] = useState<ProcessedVideo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const categoriesMap: Map<number, string> = generateCategoryMap(categories);

  useEffect(() => {
    Promise.all([
      getVideos(),
      getCategories()
    ])
      .then(([videos, categories]) => {
        setVideos(videos);
        setCategories(categories)
      })
      .catch(() => {
        //TODO: show error
      });
  }, []);

  useEffect(() => {
    const lowerCaseSearch = searchText.toLowerCase();
    if(lowerCaseSearch === '') {
      setFilterVideos(videos);
    } else {
      setFilterVideos(
        videos.filter(video => {
          if(video.name.toLowerCase().indexOf(lowerCaseSearch) > -1) return true;
          if(video.author.toLowerCase().indexOf(lowerCaseSearch) > -1) return true;
          return video.categoryIds.some((id: number): boolean  => {
            return (categoriesMap.get(id) || '').toLowerCase().indexOf(lowerCaseSearch) > -1;
          });
        })
      )
    }
  }, [searchText, videos]);

  const deleteVideo = (authorId: number, id: number): void => {
    deleteVideoByAutor(authorId, id)
      .then(() => {
        return getVideos()
      })
      .then((videos) => {
        setVideos(videos);
      })
      .catch(() => {
        //TODO: show error
      });
  };

  return (
    <>
      <FormControl>
        <TextField id="search" placeholder="Search..." value={searchText} onChange={e => {setSearchText(e.target.value)}}/>
      </FormControl>
      <TableContainer component={Paper} style={{ marginTop: '40px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Video Name</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Categories</TableCell>
              <TableCell>Highest quality format</TableCell>
              <TableCell>Release Date</TableCell>
              <TableCell>Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filterVideos.map((video) => (
              <TableRow key={video.id}>
                <TableCell component='th' scope='row'>
                  {video.name}
                </TableCell>
                <TableCell>{video.author}</TableCell>
                <TableCell>{getCategoryNameList(categoriesMap, video.categoryIds).join(', ')}</TableCell>
                <TableCell>{video.highestQualityFormat}</TableCell>
                <TableCell>{euroFormatByDotSeperation(video.releaseDate)}</TableCell>
                <TableCell>
                <Button component={Link} to={`/edit/author/${video.authorId}/video/${video.id}`} variant='contained' color='primary'>Edit</Button>
                <Button onClick={() => deleteVideo(video.authorId, video.id)} variant='contained' color='secondary' style={{ marginLeft: '10px'}}>
                  Delete
                </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
