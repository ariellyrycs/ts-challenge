import React, { useEffect, useState } from 'react';
import { getVideo, modifyVideoByAuthor } from '../services/videos';
import { getAuthors } from '../services/authors';
import { getCategories } from '../services/categories';
import { ProcessedVideo, Category, Author } from '../common/interfaces';
import { Grid, Select, Button, TextField, MenuItem, Input, InputLabel, Typography } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  }
};

const EditVideo: React.FC = (props: any) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [video, setVideo] = useState<ProcessedVideo>();
  const [videoName, setVideoName] = useState<string>('');
  const [currentSelectedAuthorId, setCurrentSelectedAuthorId] = useState<number>(0);
  const [currentSelectedCategories, setCurrentSelectedCategories] = useState<number[]>([]);
  const history = useHistory();
  const selectAuthor = (e: any) => {
    setCurrentSelectedAuthorId(e.target.value);
  };
  
  const selectCategory = function(a: any) {
    setCurrentSelectedCategories(Array.from(a.currentTarget.selectedOptions).map((i: any) => +i.value));
  };

  const save = () => {
    if(!video) return;
    modifyVideoByAuthor(currentSelectedAuthorId, {
      id: video.id,
      catIds: currentSelectedCategories,
      name: videoName,
      releaseDate: video.releaseDate.getTime(),
      highestQualityFormat: '1080p',
      size: 1000
  })
      .then(() => {
          history.push('/home');
      })
      .catch(() => {
          //TODO: show error
      })
  };

  useEffect(() => {
    Promise.all([
      getAuthors(),
      getVideo(props.match.params.authorId, props.match.params.videoId),
      getCategories()
    ]).then(([
      authors,
      video,
      categories
    ]) => {
      setAuthors(authors);
      setVideo(video);
      setCategories(categories);
      setCurrentSelectedAuthorId(video.authorId);
      setCurrentSelectedCategories(video.categoryIds);
      setVideoName(video.name);
      if(authors.length > 0) {
        setCurrentSelectedAuthorId(authors[0].id);
      }
    }).catch((err) => {
      //TODO: show error
    });
  }, [props.match.params]);

  if(!video) {
    return (<>Lading</>);
  }
  

  return (
    <>
      <Typography variant="h6" component="h1">Edit video </Typography>
      <form noValidate autoComplete="off">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3} >
            <InputLabel htmlFor="name">
              Video name
            </InputLabel>
          </Grid>
          <Grid item xs={12} sm={9}>
            <TextField id="name" fullWidth value={videoName} onChange={(e) => setVideoName(e.target.value)}/>
          </Grid>
          <Grid item xs={12} sm={3}>
            <InputLabel htmlFor="select-multiple-author">
              Video author
            </InputLabel>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Select
              fullWidth
              labelId="mutiple-author-label"
              id="mutiple-author-label"
              value={video.authorId}
              onChange={selectAuthor}
              input={<Input id="select-multiple-author" />}
              MenuProps={MenuProps}
            >
              {authors.map((author) => (
                <MenuItem key={author.id} value={author.id}>
                  {author.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={3}>
            <InputLabel htmlFor="category-select">
              Video category
            </InputLabel>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Select
              fullWidth
              multiple
              native
              value={currentSelectedCategories}
              onChange={selectCategory}
              inputProps={{
                id: 'category-select',
              }}
            >
              {categories.map((c, i) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12} >
            <div style={{ float: 'right'}}>
              <Button onClick={save} variant='contained' color='primary'>
                Submit
              </Button>
              <Button component={Link} to={'/home'} style={{ marginLeft: '10px'}}>Cancel</Button>
            </div>
          </Grid>
        </Grid>
      </form>
    </>
  );
};

export default EditVideo;
