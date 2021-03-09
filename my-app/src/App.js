import './App.css';
import React from 'react'


//custom hook
const usePState = (key, initialstate) =>{
  const [value, setValue] = React.useState(
    localStorage.getItem(key)||initialstate
  );
   
  React.useEffect(() => {
    localStorage.setItem('search', value)
  }, [value]);

  return [value, setValue]
}


const App = () => {

  const stories = [
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
  ]

  const [searchTerm, setSearchTerm] = usePState(
   'search', 'React'
  );
  
  const handleSearch = event => {
    setSearchTerm(event.target.value)
  }
  const searchedStories = stories.filter((story)=>{
      return story.title.toLowerCase().includes(searchTerm.toLowerCase());
  })


  return (
    <div>
      <h1>My Hacker Stories </h1>
      <Search search={searchTerm} onSearch={handleSearch} />
      <List stories={searchedStories} />

    </div>
  );
}

const Search = ({search, onSearch}) => {

  return (
    <div>
      <label htmlFor="search"> Search: </label>
      <input id="search" type="text" value={search} onChange={onSearch} />
      <hr />

    </div>
  );

}

const List = ({ stories }) => {
  return stories.map(item =>  <Item key={item.objectID} item={item}/>
  );
}

const Item = ({item}) => {
  return (
    <div >
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>

    </div>
  );
}

export default App;
