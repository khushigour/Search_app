import './App.css';
import React from 'react'


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
    
   fetch(url).then(response =>response.json()).then(result =>{
      setStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.hits
      })
    }).catch(()=> setStories({type: 'STORIES_FETCH_FAILURE'}));
  }, [url]);
  
  const handleSearch = event => {
    setSearchTerm(event.target.value)
  };

  const handleSearchSubmit = event =>{
    setUrl(`${API_ENDPOINT}${searchTerm}`)
    event.preventDefault();
  };


  const handleStories = (item) => {
     setStories({
       type: 'REMOVE_STORY',
       payload: item,
     });
  };


  return (
    <div className="container">
      <h1 className="headline-primary">My Hacker Stories </h1>
      
          <SearchForm 
            searchTerm = {searchTerm}
            onSearchInput = {handleSearch}
            onSearchSubmit = {handleSearchSubmit}
            />


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


const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit,
}) => (
  <form onSubmit = {onSearchSubmit} className="search-form">
    <Search
      id="search"
      value={searchTerm}
      isFocused
      onSearch={onSearchInput}
    >
      <strong>Search</strong>
    </Search>

    <button type="submit" disabled={!searchTerm} className="button button_large">
      Submit
    </button>
  </form>
 
);

const Search = ({id, value, type="text", onSearch, children, isFocused}) => (   //children added
    <>
      <label htmlFor="search" className="label"> {children}: </label>
      <input 
       id={id}
       type={type} 
       value={value} 
       autoFocus={isFocused}
       onChange={onSearch} 
       className="input"
       />
      
    </>
  );


const List = ({ stories, onRemoveItem }) => 
   stories.map(item =>  <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem}/>
  );


const Item = ({item, onRemoveItem}) => (
    <div className="item" >
      <span style={{width: '40%'}}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={{width: '30%'}}>{item.author}</span>
      <span style={{width: '30%'}}>{item.num_comments}</span>
      <span style={{width: '30%'}}>{item.points}</span>
      <span style={{width: '30%'}}>
        <button 
        type="button" 
        onClick={()=>onRemoveItem(item)}
        className="button button_small">
          Dismiss
        </button>
      </span>
    </div>
  );


export default App;
