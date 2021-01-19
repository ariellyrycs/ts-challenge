import React, { useEffect, useState } from 'react';
import { getAuthors } from '../services/authors';
import { getCategories } from '../services/categories';
import { addVideoByAuthor } from '../services/videos';
import { Category, Author } from '../common/interfaces';
import { Typography, Button, TextField, MenuItem, Input, InputLabel, Grid, Select } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";


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

const AddVideo: React.FC = (props: any) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [currentSelectedAuthorId, setCurrentSelectedAuthorId] = useState<number>(0);
  const [videoName, setVideoName] = useState<string>('');
  const history = useHistory();
  const [currentSelectedCategories, setCurrentSelectedCategories] = useState<number[]>([]);
  const selectAuthor = (e: any) => {
    
    setCurrentSelectedAuthorId(e.target.value);
  };
  
  const selectCategory = function(a: any) {
    setCurrentSelectedCategories(Array.from(a.currentTarget.selectedOptions).map((i: any) => +i.value));
  };

  const save = () => {
    addVideoByAuthor(currentSelectedAuthorId, {
        id: new Date().getTime(),
        catIds: currentSelectedCategories,
        name: videoName,
        releaseDate: 1611024364057,
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
      getCategories()
    ]).then(([
      authors,
      categories
    ]) => {
      setAuthors(authors);
      setCategories(categories);
      if(authors.length > 0) {
        setCurrentSelectedAuthorId(authors[0].id);
      }
    }).catch((err) => {
      //TODO: show error
    });
  }, []);

  if(authors.length === 0) {
    return (<>Lading</>);
  }
  

  return (
      <>
        <Typography variant="h6" component="h1">Add video </Typography>
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
                    value={currentSelectedAuthorId}
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

export default AddVideo;
