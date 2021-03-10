import './App.css';
import React from 'react'

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
]; 

const getAsyncStories = () => new Promise(
  resolve => setTimeout(() =>
  resolve({data:  { stories: initialStories}}), 2000 )
);

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


const App = () => {

  const [searchTerm, setSearchTerm] = usePState(
   'search', 'React'
  );

  const [stories, setStories] = React.useState(initialStories);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(()=>{
     setIsLoading(true);
    
    getAsyncStories().then(result => {
      setStories(result.data.stories);
      setIsLoading(false);

    }).catch(()=> setIsError(true));
  }, []);
  
  const handleSearch = event => {
    setSearchTerm(event.target.value)
  }



  const handleStories = (item) => {
    const newStories = stories.filter(
      story => item.objectID!==story.objectID
    );

  setStories(newStories);
  };

  const searchedStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <hr/>
      {isError && <p>Something went wrong...</p>}
      {
        isLoading? (<p>Loading...</p>): (
          <List stories={searchedStories} onRemoveItem={handleStories} />
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
