import './App.css';
import React from 'react'
import axios from 'axios';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

//custom hook
const usePState = (key, initialstate) =>{
  const [value, setValue] = React.useState(
    localStorage.getItem(key)||initialstate
  );
   
  React.useEffect(() => {
    localStorage.setItem('search', value)
  }, [value]);

  return [value, setValue]
};

const storiesReducer = (state, action) =>{
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        ),
      };
    default:
      throw new Error();
  }
};


const App = () => {

  const [searchTerm, setSearchTerm] = usePState(
   'search', 'React'
  );

  const [stories, setStories] = React.useReducer(
    storiesReducer,
    {data: [], isLoading: false, isError: false}
    );

    const [url, setUrl] = React.useState(
      `${API_ENDPOINT}${searchTerm}`
    );

  // const [isLoading, setIsLoading] = React.useState(false);
  // const [isError, setIsError] = React.useState(false);

  React.useEffect(()=>{
    
    setStories({type: 'STORIES_FETCH_INIT'});
    
   axios.get(url).then(result =>{
      setStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.hits
      })
    }).catch(()=> setStories({type: 'STORIES_FETCH_FAILURE'}));
  }, [url]);
  
  const handleSearch = event => {
    setSearchTerm(event.target.value)
  };

  const handleSearchSubmit = () =>{
    setUrl(`${API_ENDPOINT}${searchTerm}`)
  };


  const handleStories = (item) => {
     setStories({
       type: 'REMOVE_STORY',
       payload: item,
     });
  };

  // const searchedStories = stories.data.filter(story =>
  //   story.title.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  return (
    <div>
      <h1>My Hacker Stories </h1>
      <Search 
          id = "search"
          value={searchTerm} 
          onSearch={handleSearch}
          isFocused
      >
          <strong>Search:</strong>
      </Search>
      

      <button type="button"
      disabled={!searchTerm}
      onClick = {handleSearchSubmit}
      >
        Submit
      </button>

      <hr/>
      {stories.isError && <p>Something went wrong...</p>}
      {
        stories.isLoading? (<p>Loading...</p>): (
          <List stories={stories.data} onRemoveItem={handleStories} />
        )
      }
      

    </div>
  );
}

const Search = ({id, value, type="text", onSearch, children, isFocused}) => (   //children added
    <>
      <label htmlFor="search"> {children}: </label>
      <input 
       id={id}
       type={type} 
       value={value} 
       autoFocus={isFocused}
       onChange={onSearch} 
       />
      
    </>
  );


const List = ({ stories, onRemoveItem }) => 
   stories.map(item =>  <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}/>
  );


const Item = ({item, onRemoveItem}) => (
    <div >
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={()=>onRemoveItem(item)}>
          Dismiss
        </button>
      </span>
    </div>
  );


export default App;
