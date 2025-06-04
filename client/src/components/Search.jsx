import React, { useState } from "react";
import search from '../assets/search.svg';
import './Search.css';

function Search({keyword, setKeyword}) {

  return (
    <div className="search-box">
      <img src={search} />
      <input type="text"
       placeholder="제목을 검색해 주세요."
       value={keyword}
       onChange={(e) => setKeyword(e.target.value)}
       />
    </div>

  )
}
export default Search;